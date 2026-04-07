from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as DBSession
from sqlalchemy import and_
from database import get_db
from models.session import Session as BookingSession
from models.teacher import Teacher
from models.student import Student
from models.users import User
from utils.timezone import from_utc, is_valid_timezone
from datetime import timezone, datetime
import uuid

router = APIRouter()


@router.get("/{session_id}")
def get_session(
    session_id: str,
    user_timezone: str = "UTC",
    db: DBSession = Depends(get_db)
):
    if not is_valid_timezone(user_timezone):
        raise HTTPException(status_code=400, detail="Invalid timezone!")

    session = db.query(BookingSession).filter(
        BookingSession.id == session_id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found!")

    teacher = db.query(Teacher).filter(
        Teacher.id == session.teacher_id
    ).first()
    teacher_user = db.query(User).filter(
        User.id == teacher.user_id
    ).first()

    student = db.query(Student).filter(
        Student.id == session.student_id
    ).first()
    student_user = db.query(User).filter(
        User.id == student.user_id
    ).first()

    teacher_local = from_utc(session.scheduled_at, teacher_user.timezone)
    student_local = from_utc(session.scheduled_at, student_user.timezone)

    return {
        "session_id":          str(session.id),
        "level":               session.level,
        "duration_minutes":    session.duration_minutes,
        "status":              session.status,
        "videocall_url":       session.videocall_url,
        "rescheduled":         session.rescheduled,
        "teacher_review_done": session.teacher_review_done,
        "student_review_done": session.student_review_done,
        "payment_released":    session.payment_released,
        "scheduled_at_utc":    str(session.scheduled_at),
        "teacher_time": {
            "time":     teacher_local.strftime("%Y-%m-%d %H:%M"),
            "timezone": teacher_user.timezone,
        },
        "student_time": {
            "time":     student_local.strftime("%Y-%m-%d %H:%M"),
            "timezone": student_user.timezone,
        },
    }


@router.put("/{session_id}/confirm")
def confirm_session(
    session_id: str,
    teacher_id: str,
    db: DBSession = Depends(get_db)
):
    session = db.query(BookingSession).filter(
        and_(
            BookingSession.id == session_id,
            BookingSession.teacher_id == teacher_id
        )
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found!")

    if session.status != "pending":
        raise HTTPException(status_code=400, detail="This session cannot be confirmed!")

    session.status = "confirmed"
    db.commit()

    return {
        "message":    "Session confirmed!",
        "session_id": session_id,
        "status":     "confirmed"
    }


@router.put("/{session_id}/complete")
def complete_session(
    session_id: str,
    db: DBSession = Depends(get_db)
):
    session = db.query(BookingSession).filter(
        BookingSession.id == session_id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found!")

    if session.status != "confirmed":
        raise HTTPException(status_code=400, detail="Only confirmed sessions can be completed!")

    session.status = "completed"
    db.commit()

    return {
        "message":    "Session completed!",
        "session_id": session_id,
        "next_step":  "Both teacher and student can now write a review for this session."
    }


@router.put("/{session_id}/cancel")
def cancel_session(
    session_id: str,
    db: DBSession = Depends(get_db)
):
    session = db.query(BookingSession).filter(
        BookingSession.id == session_id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found!")

    if session.status in ["completed", "cancelled"]:
        raise HTTPException(status_code=400, detail="This session cannot be cancelled!")

    session.status = "cancelled"
    db.commit()

    return {"message": "Sesioni cancelled!", "session_id": session_id}