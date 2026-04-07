from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as DBSession
from sqlalchemy import and_
from database import get_db
from models.teacher import Teacher, AvailabilitySlot
from models.student import Student
from models.session import Session as BookingSession, RescheduleRequest
from models.payment import CoursePayment
from models.language import LevelPricing, LevelHours
from models.suspension import Suspension
from utils.timezone import to_utc, is_valid_timezone
from pydantic import BaseModel
from datetime import datetime
import uuid

router = APIRouter()


class BookingCreate(BaseModel):
    teacher_id:       str
    student_id:       str
    language_id:      int
    level:            str
    scheduled_at:     datetime
    student_timezone: str
    total_hours:      int
    price_per_hour:   float


def check_suspended(user_id: str, db: DBSession):
    suspension = db.query(Suspension).filter(
        and_(
            Suspension.user_id == user_id,
            Suspension.is_active == True
        )
    ).first()
    if suspension:
        raise HTTPException(
            status_code=403,
            detail=f"Account is suspended!Reason: {suspension.reason}"
        )


def get_duration(level: str) -> int:
    if level in ["C1", "C2"]:
        return 90
    return 60


@router.post("/")
def create_booking(
    data: BookingCreate,
    db: DBSession = Depends(get_db)
):
    if not is_valid_timezone(data.student_timezone):
        raise HTTPException(status_code=400, detail="Timezone is not correct!")

    valid_levels = ["A1", "A2", "B1", "B2", "C1", "C2"]
    if data.level not in valid_levels:
        raise HTTPException(status_code=400, detail="Invalid Level!")

    teacher = db.query(Teacher).filter(Teacher.id == data.teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found!")

    student = db.query(Student).filter(Student.id == data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found!")

    check_suspended(str(teacher.user_id), db)
    check_suspended(str(student.user_id), db)

    if data.level > teacher.max_level:
        raise HTTPException(
            status_code=400,
            detail=f"Teacher maximum level is {teacher.max_level}!"
        )

    if teacher.language_id != data.language_id:
        raise HTTPException(
            status_code=400,
            detail="Teacher does not teach this language!"
        )

    scheduled_utc = to_utc(data.scheduled_at, data.student_timezone)

    conflict = db.query(BookingSession).filter(
        and_(
            BookingSession.teacher_id == data.teacher_id,
            BookingSession.status.in_(["pending", "confirmed"]),
            BookingSession.scheduled_at == scheduled_utc
        )
    ).first()

    if conflict:
        raise HTTPException(
            status_code=400,
            detail="Teacher already has a session at this time!"
        )

    pricing = db.query(LevelPricing).filter_by(level=data.level).first()
    if not pricing:
        raise HTTPException(status_code=400, detail="Price not found!")

    if not (float(pricing.price_min) <= data.price_per_hour <= float(pricing.price_max)):
        raise HTTPException(
            status_code=400,
            detail=f"Price must be between {pricing.price_min}-{pricing.price_max} EUR/hour!"
        )

    hours_limit = db.query(LevelHours).filter_by(level=data.level).first()
    if not hours_limit:
        raise HTTPException(status_code=400, detail="Hours not found!")

    if not (hours_limit.hours_min <= data.total_hours <= hours_limit.hours_max):
        raise HTTPException(
            status_code=400,
            detail=f"Hours must be between {hours_limit.hours_min}-{hours_limit.hours_max}!"
        )

    total_amount   = round(data.total_hours * data.price_per_hour, 2)
    platform_fee   = round(total_amount * 0.10, 2)
    teacher_payout = round(total_amount - platform_fee, 2)

    course_payment = CoursePayment(
        id=uuid.uuid4(),
        student_id=data.student_id,
        teacher_id=data.teacher_id,
        language_id=data.language_id,
        level=data.level,
        total_hours=data.total_hours,
        price_per_hour=data.price_per_hour,
        total_amount=total_amount,
        amount_paid=0,
        amount_left=total_amount,
        no_refund=False,
        status="active"
    )
    db.add(course_payment)
    db.commit()
    db.refresh(course_payment)

    duration = get_duration(data.level)

    session = BookingSession(
        id=uuid.uuid4(),
        teacher_id=data.teacher_id,
        student_id=data.student_id,
        course_payment_id=course_payment.id,
        language_id=data.language_id,
        level=data.level,
        scheduled_at=scheduled_utc,
        duration_minutes=duration,
        status="pending",
        videocall_url=f"https://meet.nativetalk.com/{uuid.uuid4()}",
        rescheduled=False,
        teacher_review_done=False,
        student_review_done=False,
        payment_released=False
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "message": "Resevation created successfully!",
        "booking": {
            "session_id":        str(session.id),
            "course_payment_id": str(course_payment.id),
            "teacher_id":        data.teacher_id,
            "student_id":        data.student_id,
            "level":             data.level,
            "scheduled_at_utc":  str(scheduled_utc),
            "duration_minutes":  duration,
            "total_hours":       data.total_hours,
            "price_per_hour":    data.price_per_hour,
            "total_amount":      total_amount,
            "platform_fee":      platform_fee,
            "teacher_payout":    teacher_payout,
            "videocall_url":     session.videocall_url,
            "status":            "pending"
        }
    }


@router.get("/student/{student_id}")
def get_student_bookings(
    student_id: str,
    db: DBSession = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found!")

    sessions = db.query(BookingSession).filter(
        BookingSession.student_id == student_id
    ).all()

    return {
        "student_id":     student_id,
        "total_sessions": len(sessions),
        "sessions": [
            {
                "session_id":    str(s.id),
                "level":         s.level,
                "scheduled_at":  str(s.scheduled_at),
                "duration":      s.duration_minutes,
                "status":        s.status,
                "rescheduled":   s.rescheduled,
                "videocall_url": s.videocall_url
            }
            for s in sessions
        ]
    }


@router.get("/teacher/{teacher_id}")
def get_teacher_bookings(
    teacher_id: str,
    db: DBSession = Depends(get_db)
):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found !")

    sessions = db.query(BookingSession).filter(
        BookingSession.teacher_id == teacher_id
    ).all()

    return {
        "teacher_id":     teacher_id,
        "total_sessions": len(sessions),
        "sessions": [
            {
                "session_id":    str(s.id),
                "level":         s.level,
                "scheduled_at":  str(s.scheduled_at),
                "duration":      s.duration_minutes,
                "status":        s.status,
                "rescheduled":   s.rescheduled,
                "videocall_url": s.videocall_url
            }
            for s in sessions
        ]
    }