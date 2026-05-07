"""
Tutor (teacher) profile and availability endpoints.

React Native integration:
  GET /api/v1/tutors/                  → browse all verified tutors
  GET /api/v1/tutors/{teacher_id}      → single tutor profile
  GET /api/v1/tutors/{teacher_id}/availability  → their weekly schedule
  POST /api/v1/tutors/availability     → teacher adds a time slot (auth required)
  DELETE /api/v1/tutors/availability/{slot_id}  → remove slot (auth required)
"""
from __future__ import annotations

import uuid
from datetime import time
from typing import List

import pytz
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.db.session import get_db
from app.models.tutor import AvailabilitySlot, Teacher
from app.models.user import User
from app.schemas.tutor import AvailabilityCreate, AvailabilityOut, PaginatedTutorResponse, TeacherProfileOut, TeacherUpdate

router = APIRouter(prefix="/tutors", tags=["Tutors"])

DAYS = {0: "Monday", 1: "Tuesday", 2: "Wednesday",
        3: "Thursday", 4: "Friday", 5: "Saturday", 6: "Sunday"}


# ── Browse tutors ──────────────────────────────────────────────────────────────

@router.get("/", response_model=PaginatedTutorResponse, summary="List verified tutors")
def list_tutors(
    language_id: int | None = None,
    level: str | None = None,
    max_price: int | None = Query(default=None, ge=1, description="Maximum hourly rate (EUR)"),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    """
    React Native search screen calls this with optional filters:
        GET /api/v1/tutors/?language_id=1&level=B1&max_price=25&limit=20&offset=0

    Returns a paginated result:
        { "items": [...], "total": 42, "limit": 20, "offset": 0 }
    """
    q = db.query(Teacher).filter(Teacher.is_verified == True)
    if language_id:
        q = q.filter(Teacher.language_id == language_id)
    if level:
        q = q.filter(Teacher.max_level >= level)
    if max_price is not None:
        q = q.filter(Teacher.hourly_rate <= max_price)
    total = q.count()
    items = q.offset(offset).limit(limit).all()
    return PaginatedTutorResponse(items=items, total=total, limit=limit, offset=offset)


@router.get("/{teacher_id}", response_model=TeacherProfileOut, summary="Get tutor profile")
def get_tutor(teacher_id: str, db: Session = Depends(get_db)):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found.")
    return teacher


# ── Availability ───────────────────────────────────────────────────────────────

@router.get(
    "/{teacher_id}/availability",
    response_model=List[AvailabilityOut],
    summary="Get teacher's weekly availability",
)
def get_availability(teacher_id: str, db: Session = Depends(get_db)):
    """
    Returns active availability slots. React Native booking screen uses
    these to show open time slots.
    """
    slots = db.query(AvailabilitySlot).filter(
        AvailabilitySlot.teacher_id == teacher_id,
        AvailabilitySlot.is_active  == True,
    ).all()
    return [
        AvailabilityOut(
            id=str(s.id),
            day_of_week=s.day_of_week,
            start_time=str(s.start_time),
            end_time=str(s.end_time),
            timezone=s.timezone,
            is_active=s.is_active,
        )
        for s in slots
    ]


@router.post(
    "/availability",
    status_code=201,
    summary="Add availability slot (teacher only)",
)
def add_availability(
    body: AvailabilityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("teacher")),
):
    """
    Teacher sets weekly availability.
    Request:
        { "day_of_week": 1, "start_time": "09:00:00",
          "end_time": "11:00:00", "timezone": "Europe/Madrid" }
    """
    if body.timezone not in pytz.all_timezones_set:
        raise HTTPException(status_code=400, detail=f"Invalid timezone: {body.timezone}")

    teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher profile not found.")

    try:
        start_t = time.fromisoformat(body.start_time)
        end_t   = time.fromisoformat(body.end_time)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid time format. Use HH:MM:SS")

    if start_t >= end_t:
        raise HTTPException(status_code=400, detail="start_time must be before end_time.")

    # Check for overlap
    conflict = db.query(AvailabilitySlot).filter(
        AvailabilitySlot.teacher_id  == teacher.id,
        AvailabilitySlot.day_of_week == body.day_of_week,
        AvailabilitySlot.is_active   == True,
        AvailabilitySlot.start_time  < end_t,
        AvailabilitySlot.end_time    > start_t,
    ).first()
    if conflict:
        raise HTTPException(
            status_code=400,
            detail=f"Overlaps with existing slot on {DAYS[body.day_of_week]} "
                   f"{conflict.start_time}–{conflict.end_time}.",
        )

    slot = AvailabilitySlot(
        id          = uuid.uuid4(),
        teacher_id  = teacher.id,
        day_of_week = body.day_of_week,
        start_time  = start_t,
        end_time    = end_t,
        timezone    = body.timezone,
    )
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return {"message": "Availability slot added.", "slot_id": str(slot.id)}


@router.delete(
    "/availability/{slot_id}",
    summary="Remove availability slot (teacher only)",
)
def delete_availability(
    slot_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("teacher")),
):
    teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher profile not found.")

    slot = db.query(AvailabilitySlot).filter(
        AvailabilitySlot.id        == slot_id,
        AvailabilitySlot.teacher_id == teacher.id,
    ).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found.")

    slot.is_active = False
    db.commit()
    return {"message": "Slot removed."}


@router.patch(
    "/me",
    response_model=TeacherProfileOut,
    summary="Update own teacher profile (teacher only)",
)
def update_profile(
    body: TeacherUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("teacher")),
):
    teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher profile not found.")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(teacher, field, value)
    db.commit()
    db.refresh(teacher)
    return teacher
