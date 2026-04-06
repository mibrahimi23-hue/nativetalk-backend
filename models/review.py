from sqlalchemy import Column, String, Text, TIMESTAMP, ForeignKey, SmallInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import uuid


class Review(Base):
    __tablename__ = "reviews"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id"), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    written_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role       = Column(String(20), nullable=False)
    rating     = Column(SmallInteger, nullable=False)
    comment    = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    session = relationship("Session", back_populates="reviews")
    teacher = relationship("Teacher", back_populates="reviews")
    student = relationship("Student", back_populates="reviews")


class ReviewFlag(Base):
    __tablename__ = "review_flags"

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    flagged_user = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    flagged_by   = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    reason       = Column(Text, nullable=False)
    status       = Column(String(20), default="pending")
    created_at   = Column(TIMESTAMP(timezone=True), server_default=func.now())
    reviewed_at  = Column(TIMESTAMP(timezone=True))