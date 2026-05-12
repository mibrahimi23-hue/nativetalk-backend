"""
Session model — a single 60-minute tutoring meeting booked between a student
and a teacher.

daily_room_name: set when a Daily.co room is created for this session.
daily_room_url:  the Daily.co room URL sent to both participants.
"""
import uuid
from sqlalchemy import (Boolean, Column, ForeignKey, Integer, String, Text,
                        TIMESTAMP, DECIMAL)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Session(Base):
    __tablename__ = "sessions"

    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    teacher_id          = Column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=False)
    student_id          = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    course_payment_id   = Column(UUID(as_uuid=True), ForeignKey("course_payments.id"), nullable=False)
    language_id         = Column(Integer, ForeignKey("languages.id"), nullable=False)
    level               = Column(String(3), nullable=False)
    scheduled_at        = Column(TIMESTAMP(timezone=True), nullable=False)
    duration_minutes    = Column(Integer, nullable=False, default=60)
    status              = Column(String(20), nullable=False, default="pending")
    # Legacy placeholder URL (kept for backward compat); use daily_room_url instead
    videocall_url       = Column(Text)
    # Daily.co room identifier
    daily_room_name     = Column(String(100))
    daily_room_url      = Column(Text)
    rescheduled         = Column(Boolean, default=False)
    teacher_review_done = Column(Boolean, default=False)
    student_review_done = Column(Boolean, default=False)
    payment_released    = Column(Boolean, default=False)
    created_at          = Column(TIMESTAMP(timezone=True), server_default=func.now())

    teacher        = relationship("Teacher", back_populates="sessions")
    student        = relationship("Student", back_populates="sessions")
    course_payment = relationship("CoursePayment", back_populates="sessions")
    language       = relationship("Language", back_populates="sessions")
    reschedules    = relationship("RescheduleRequest", back_populates="session")
    payment        = relationship("Payment", back_populates="session", uselist=False)
    reviews        = relationship("Review", back_populates="session")
    attendance     = relationship("SessionAttendance", back_populates="session", uselist=False)
    noshow         = relationship("TeacherNoshow", back_populates="session", uselist=False)


class RescheduleRequest(Base):
    __tablename__ = "reschedule_requests"

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id   = Column(UUID(as_uuid=True), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    requested_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    new_time     = Column(TIMESTAMP(timezone=True), nullable=False)
    status       = Column(String(20), nullable=False, default="pending")
    reason       = Column(Text)
    created_at   = Column(TIMESTAMP(timezone=True), server_default=func.now())
    resolved_at  = Column(TIMESTAMP(timezone=True))

    session = relationship("Session", back_populates="reschedules")


class SessionAttendance(Base):
    __tablename__ = "session_attendance"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id  = Column(UUID(as_uuid=True), ForeignKey("sessions.id"), nullable=False)
    student_id  = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    was_present = Column(Boolean, default=False)
    marked_at   = Column(TIMESTAMP(timezone=True), server_default=func.now())

    session = relationship("Session", back_populates="attendance")
    student = relationship("Student", back_populates="attendance")
