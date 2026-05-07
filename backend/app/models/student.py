import uuid
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Student(Base):
    __tablename__ = "students"

    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id          = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    current_level    = Column(String(3), nullable=False, default="A1")
    reschedule_count = Column(Integer, default=0)
    created_at       = Column(TIMESTAMP(timezone=True), server_default=func.now())

    user                = relationship("User", back_populates="student")
    sessions            = relationship("Session", back_populates="student")
    attendance          = relationship("SessionAttendance", back_populates="student")
    reviews             = relationship("Review", back_populates="student")
    suspensions         = relationship("Suspension", back_populates="student")
    course_payments     = relationship("CoursePayment", back_populates="student")
    languages           = relationship("StudentLanguage", back_populates="student")
    paypal_transactions = relationship("PayPalTransaction", back_populates="student")


class StudentLanguage(Base):
    """Tracks a student's progress in a specific language."""
    __tablename__ = "student_languages"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id  = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    level       = Column(String(3), nullable=False, default="A1")
    started_at  = Column(TIMESTAMP(timezone=True), server_default=func.now())

    student  = relationship("Student", back_populates="languages")
    language = relationship("Language", back_populates="students")
