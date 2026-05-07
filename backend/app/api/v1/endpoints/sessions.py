"""
Session booking, management, and Daily.co video-call endpoints.

─────────────────────────────────────────────────────────────────────────────
React Native integration quick-reference
─────────────────────────────────────────────────────────────────────────────

Booking a session:
  POST /api/v1/sessions/
  Headers: { Authorization: Bearer <access_token> }
  Body: BookingCreate schema

Getting the video call URL (opens 15 min before session):
  1. POST /api/v1/sessions/{id}/daily/room   → creates/gets Daily room
  2. POST /api/v1/sessions/{id}/daily/token  → gets your meeting token

  React Native call setup:
    import DailyIframe from '@daily-co/react-native-daily-js';
    const call = DailyIframe.createCallObject();
    await call.join({ url: room_url, token: meeting_token });
─────────────────────────────────────────────────────────────────────────────
"""
from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone
from typing import List

import pytz
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.payment import CoursePayment
from app.models.session import Session as BookingSession
from app.models.student import Student
from app.models.suspension import Suspension
from app.models.tutor import Teacher
from app.models.user import User
from app.models.language import LevelPricing, LevelHours
from app.schemas.session import BookingCreate, DailyRoomOut, DailyTokenOut, SessionOut
from app.services.daily import get_daily_client

router = APIRouter(prefix="/sessions", tags=["Sessions"])

LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]


# ── Session CRUD ──────────────────────────────────────────────────────────────

@router.post("/", response_model=SessionOut, status_code=201, summary="Book a new session")
def book_session(
    body: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Creates a CoursePayment (if new) and a Session record.

    Request:
        {
          "teacher_id": "uuid",
          "student_id": "uuid",
          "language_id": 1,
          "level": "B1",
          "scheduled_at": "2026-06-01T10:00:00Z",
          "student_timezone": "Europe/Madrid",
          "total_hours": 30,
          "price_per_hour": 15.0,
          "payment_plan": "hour_by_hour"
        }
    """
    if body.level not in LEVELS:
        raise HTTPException(status_code=400, detail=f"Invalid level. Must be one of {LEVELS}")

    # Validate teacher and student exist
    teacher = db.query(Teacher).filter(Teacher.id == body.teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found.")
    student = db.query(Student).filter(Student.id == body.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    # Suspension checks
    for uid in [str(teacher.user_id), str(student.user_id)]:
        active_suspension = db.query(Suspension).filter(
            Suspension.user_id == uid, Suspension.is_active == True
        ).first()
        if active_suspension:
            raise HTTPException(
                status_code=403,
                detail=f"Account is suspended. Reason: {active_suspension.reason}",
            )

    # Teacher level check
    if LEVELS.index(body.level) > LEVELS.index(teacher.max_level):
        raise HTTPException(
            status_code=400,
            detail=f"Teacher max level is {teacher.max_level}.",
        )

    # Price validation
    pricing = db.query(LevelPricing).filter_by(level=body.level).first()
    if pricing and not (float(pricing.price_min) <= body.price_per_hour <= float(pricing.price_max)):
        raise HTTPException(
            status_code=400,
            detail=f"Price must be {pricing.price_min}–{pricing.price_max} EUR/h for level {body.level}.",
        )

    # Hours validation
    hours_limit = db.query(LevelHours).filter_by(level=body.level).first()
    if hours_limit and not (hours_limit.hours_min <= body.total_hours <= hours_limit.hours_max):
        raise HTTPException(
            status_code=400,
            detail=f"Total hours must be {hours_limit.hours_min}–{hours_limit.hours_max} for level {body.level}.",
        )

    # Timezone conversion for conflict check
    if body.student_timezone not in pytz.all_timezones_set:
        raise HTTPException(status_code=400, detail="Invalid student_timezone.")

    tz   = pytz.timezone(body.student_timezone)
    if body.scheduled_at.tzinfo is None:
        scheduled_utc = tz.localize(body.scheduled_at).astimezone(pytz.utc).replace(tzinfo=None)
    else:
        scheduled_utc = body.scheduled_at.astimezone(pytz.utc).replace(tzinfo=None)

    # Conflict check — same teacher, same time
    conflict = db.query(BookingSession).filter(
        and_(
            BookingSession.teacher_id   == body.teacher_id,
            BookingSession.status.in_(["pending", "confirmed"]),
            BookingSession.scheduled_at == scheduled_utc,
        )
    ).first()
    if conflict:
        raise HTTPException(status_code=400, detail="Teacher already has a session at that time.")

    # Pending review check — prevent booking if student has unreviewed sessions
    pending_review = db.query(BookingSession).filter(
        and_(
            BookingSession.student_id         == body.student_id,
            BookingSession.status             == "completed",
            BookingSession.student_review_done == False,
        )
    ).first()
    if pending_review:
        raise HTTPException(
            status_code=400,
            detail=f"Please review session {pending_review.id} before booking a new one.",
        )

    # CoursePayment
    total_amount = round(body.price_per_hour * body.total_hours, 2)
    course_payment = CoursePayment(
        id             = uuid.uuid4(),
        student_id     = body.student_id,
        teacher_id     = body.teacher_id,
        language_id    = body.language_id,
        level          = body.level,
        total_hours    = body.total_hours,
        price_per_hour = body.price_per_hour,
        total_amount   = total_amount,
        amount_paid    = 0,
        amount_left    = total_amount,
        payment_plan   = body.payment_plan,
    )
    db.add(course_payment)
    db.commit()
    db.refresh(course_payment)

    # Session
    session = BookingSession(
        id               = uuid.uuid4(),
        teacher_id       = body.teacher_id,
        student_id       = body.student_id,
        course_payment_id = course_payment.id,
        language_id      = body.language_id,
        level            = body.level,
        scheduled_at     = scheduled_utc,
        duration_minutes = 60,
        status           = "pending",
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return SessionOut(
        id=str(session.id),
        teacher_id=str(session.teacher_id),
        student_id=str(session.student_id),
        level=session.level,
        scheduled_at=session.scheduled_at,
        duration_minutes=session.duration_minutes,
        status=session.status,
        daily_room_url=session.daily_room_url,
        teacher_review_done=session.teacher_review_done,
        student_review_done=session.student_review_done,
        payment_released=session.payment_released,
    )


@router.get("/{session_id}", response_model=SessionOut, summary="Get session details")
def get_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(BookingSession).filter(BookingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    return SessionOut(
        id=str(session.id),
        teacher_id=str(session.teacher_id),
        student_id=str(session.student_id),
        level=session.level,
        scheduled_at=session.scheduled_at,
        duration_minutes=session.duration_minutes,
        status=session.status,
        daily_room_url=session.daily_room_url,
        teacher_review_done=session.teacher_review_done,
        student_review_done=session.student_review_done,
        payment_released=session.payment_released,
    )


@router.patch("/{session_id}/confirm", summary="Confirm a pending session (teacher only)")
def confirm_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(BookingSession).filter(BookingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    if session.status != "pending":
        raise HTTPException(
            status_code=409,
            detail=f"Cannot confirm a session with status '{session.status}'.",
        )

    teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
    if not teacher or str(teacher.id) != str(session.teacher_id):
        raise HTTPException(status_code=403, detail="Not authorised.")

    session.status = "confirmed"
    db.commit()
    return {"message": "Session confirmed.", "session_id": session_id}


@router.patch("/{session_id}/complete", summary="Mark session as completed")
def complete_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(BookingSession).filter(BookingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    if session.status != "confirmed":
        raise HTTPException(
            status_code=409,
            detail=f"Cannot complete a session with status '{session.status}'.",
        )

    session.status = "completed"
    db.commit()
    return {"message": "Session marked as completed.", "session_id": session_id}


@router.patch("/{session_id}/cancel", summary="Cancel a session")
def cancel_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Either party (teacher or student) may cancel a session while it is
    `pending` or `confirmed`.  Completed or already-cancelled sessions
    return **409 Conflict**.
    """
    session = db.query(BookingSession).filter(BookingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    if session.status not in ("pending", "confirmed"):
        raise HTTPException(
            status_code=409,
            detail=f"Cannot cancel a session with status '{session.status}'.",
        )

    # Verify caller is a participant
    teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    is_teacher = teacher and str(teacher.id) == str(session.teacher_id)
    is_student = student and str(student.id) == str(session.student_id)
    if not (is_teacher or is_student):
        raise HTTPException(status_code=403, detail="Not a participant in this session.")

    session.status = "cancelled"
    db.commit()
    return {"message": "Session cancelled.", "session_id": session_id}


# ── Daily.co video call ────────────────────────────────────────────────────────

@router.post(
    "/{session_id}/daily/room",
    response_model=DailyRoomOut,
    summary="Create or get Daily.co room for a session",
    description=(
        "Creates a Daily.co room for the session if it doesn't exist yet. "
        "Available starting 15 minutes before scheduled_at."
    ),
)
def get_or_create_daily_room(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    React Native calls this to get the video call URL before joining.

    Response:
        { "room_name": "session-abc123", "url": "https://nativetalk.daily.co/session-abc123",
          "session_id": "abc123" }
    """
    session = _get_accessible_session(session_id, current_user, db)
    _check_session_window(session)

    daily = get_daily_client()
    room_name = f"session-{str(session.id)[:8]}"

    # Calculate expiry: session end + 15 min buffer
    now      = datetime.now(timezone.utc)
    sch_at   = session.scheduled_at
    if sch_at.tzinfo is None:
        sch_at = sch_at.replace(tzinfo=timezone.utc)
    exp_secs = max(
        7200,
        int((sch_at + timedelta(minutes=session.duration_minutes + 30) - now).total_seconds()),
    )

    room = daily.get_or_create_room(room_name, exp_seconds=exp_secs)
    room_url = room.get("url", "")

    # Persist the room URL on the session
    if not session.daily_room_name:
        session.daily_room_name = room_name
        session.daily_room_url  = room_url
        session.videocall_url   = room_url   # legacy field
        db.commit()

    return DailyRoomOut(room_name=room_name, url=room_url, session_id=session_id)


@router.post(
    "/{session_id}/daily/token",
    response_model=DailyTokenOut,
    summary="Get a Daily.co meeting token for the current user",
)
def get_daily_token(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns a short-lived Daily meeting token for this participant.

    React Native joins with both the room URL and this token:
        await call.join({ url: roomUrl, token: meetingToken });
    """
    session = _get_accessible_session(session_id, current_user, db)
    _check_session_window(session)

    if not session.daily_room_name:
        raise HTTPException(
            status_code=400,
            detail="Daily room not created yet. Call POST /daily/room first.",
        )

    # Determine if this user is the room owner (teacher)
    teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
    is_owner = teacher is not None and str(teacher.id) == str(session.teacher_id)

    daily  = get_daily_client()
    token  = daily.create_meeting_token(
        room_name  = session.daily_room_name,
        user_id    = str(current_user.id),
        user_name  = current_user.full_name,
        is_owner   = is_owner,
        exp_seconds = 7200,
    )
    return DailyTokenOut(
        token=token,
        room_url=session.daily_room_url or "",
        session_id=session_id,
    )


# ── Helpers ───────────────────────────────────────────────────────────────────

def _get_accessible_session(
    session_id: str, current_user: User, db: Session
) -> BookingSession:
    """Load session and verify current_user is teacher or student of it."""
    session = db.query(BookingSession).filter(BookingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    if session.status not in ("confirmed", "completed"):
        raise HTTPException(status_code=400, detail="Session is not yet confirmed.")

    teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
    student = db.query(Student).filter(Student.user_id == current_user.id).first()

    user_is_teacher = teacher and str(teacher.id) == str(session.teacher_id)
    user_is_student = student and str(student.id) == str(session.student_id)

    if not (user_is_teacher or user_is_student):
        raise HTTPException(
            status_code=403,
            detail="You are not a participant in this session.",
        )
    return session


def _check_session_window(session: BookingSession) -> None:
    """Raise 400 if the call window is not open (±15 min around session)."""
    now    = datetime.now(timezone.utc)
    sch_at = session.scheduled_at
    if sch_at.tzinfo is None:
        sch_at = sch_at.replace(tzinfo=timezone.utc)

    opens_at  = sch_at - timedelta(minutes=15)
    closes_at = sch_at + timedelta(minutes=session.duration_minutes + 15)

    if now < opens_at:
        minutes_left = int((opens_at - now).total_seconds() / 60)
        raise HTTPException(
            status_code=400,
            detail=f"Video call opens 15 min before the session. Available in {minutes_left} min.",
        )
    if now > closes_at:
        raise HTTPException(status_code=400, detail="This session has already ended.")
