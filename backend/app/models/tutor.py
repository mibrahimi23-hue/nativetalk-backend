"""Teacher (tutor) profile, availability slots, and verification records."""
import uuid
from sqlalchemy import (Boolean, Column, ForeignKey, Integer, SmallInteger,
                        String, Text, Time)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import TIMESTAMP

from app.db.base_class import Base


class Teacher(Base):
    __tablename__ = "teachers"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id        = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    language_id    = Column(Integer, ForeignKey("languages.id"), nullable=False)
    is_native      = Column(Boolean, default=False)
    is_certified   = Column(Boolean, default=False)
    has_experience = Column(Boolean, default=False)
    # Highest CEFR level this teacher can teach (A1-C2)
    max_level      = Column(String(3), nullable=False, default="A2")
    is_verified    = Column(Boolean, default=False)
    passed_exam    = Column(Boolean, default=False)
    bio            = Column(Text)
    hourly_rate    = Column(Integer, nullable=True)  # in EUR cents, optional
    created_at     = Column(TIMESTAMP(timezone=True), server_default=func.now())

    user                = relationship("User", back_populates="teacher")
    language            = relationship("Language", back_populates="teachers")
    availability        = relationship("AvailabilitySlot", back_populates="teacher")
    verifications       = relationship("TeacherVerification", back_populates="teacher",
                                       foreign_keys="TeacherVerification.teacher_id")
    exams_created       = relationship("TeacherVerification", back_populates="verified_by_teacher",
                                       foreign_keys="TeacherVerification.verified_by")
    sessions            = relationship("Session", back_populates="teacher")
    reviews             = relationship("Review", back_populates="teacher")
    noshows             = relationship("TeacherNoshow", back_populates="teacher")
    suspensions         = relationship("Suspension", back_populates="teacher")
    course_payments     = relationship("CoursePayment", back_populates="teacher")
    exams_created_by_me = relationship("Exam", back_populates="creator",
                                       foreign_keys="Exam.created_by")
    exam_attempts       = relationship("ExamAttempt", back_populates="teacher")
    certificates        = relationship("TeacherCertificate", back_populates="teacher")
    materials           = relationship("LessonMaterial", back_populates="teacher")


class TeacherVerification(Base):
    __tablename__ = "teacher_verifications"

    id                = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    teacher_id        = Column(UUID(as_uuid=True), ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    verified_by       = Column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=True)
    verification_type = Column(String(30), nullable=False)
    level_tested      = Column(String(3), nullable=False)
    result            = Column(String(20), nullable=False, default="pending")
    notes             = Column(Text)
    tested_at         = Column(TIMESTAMP(timezone=True), server_default=func.now())

    teacher             = relationship("Teacher", back_populates="verifications",
                                       foreign_keys=[teacher_id])
    verified_by_teacher = relationship("Teacher", back_populates="exams_created",
                                       foreign_keys=[verified_by])


class AvailabilitySlot(Base):
    """Weekly recurring availability for a teacher (0=Mon … 6=Sun)."""
    __tablename__ = "availability_slots"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    teacher_id  = Column(UUID(as_uuid=True), ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    day_of_week = Column(SmallInteger, nullable=False)   # 0=Monday, 6=Sunday
    start_time  = Column(Time, nullable=False)
    end_time    = Column(Time, nullable=False)
    timezone    = Column(String(60), nullable=False)
    is_active   = Column(Boolean, default=True)

    teacher = relationship("Teacher", back_populates="availability")
