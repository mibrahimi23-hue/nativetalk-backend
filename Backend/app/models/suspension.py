import uuid
from sqlalchemy import Boolean, Column, ForeignKey, String, Text, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Suspension(Base):
    __tablename__ = "suspensions"

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id      = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    teacher_id   = Column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=True)
    student_id   = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=True)
    role         = Column(String(20), nullable=False)
    reason       = Column(String(50), nullable=False)
    no_refund    = Column(Boolean, default=False)
    is_active    = Column(Boolean, default=True)
    notes        = Column(Text)
    suspended_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    lifted_at    = Column(TIMESTAMP(timezone=True))

    user    = relationship("User", back_populates="suspensions")
    teacher = relationship("Teacher", back_populates="suspensions")
    student = relationship("Student", back_populates="suspensions")


class TeacherNoshow(Base):
    """Records when a teacher failed to appear for a confirmed session."""
    __tablename__ = "teacher_noshow"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=False)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id"), nullable=False)
    notified   = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    teacher = relationship("Teacher", back_populates="noshows")
    session = relationship("Session", back_populates="noshow")
