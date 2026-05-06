from sqlalchemy import Column, String, Integer, Boolean, DECIMAL, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import uuid


class CoursePayment(Base):
    __tablename__ = "course_payments"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id     = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    teacher_id     = Column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=False)
    language_id    = Column(Integer, ForeignKey("languages.id"), nullable=False)
    level          = Column(String(3), nullable=False)
    total_hours    = Column(Integer, nullable=False)
    price_per_hour = Column(DECIMAL(6, 2), nullable=False)
    total_amount   = Column(DECIMAL(8, 2), nullable=False)
    amount_paid    = Column(DECIMAL(8, 2), default=0)
    amount_left    = Column(DECIMAL(8, 2), nullable=False)
    no_refund      = Column(Boolean, default=False)
    status         = Column(String(20), default="active")
    created_at     = Column(TIMESTAMP(timezone=True), server_default=func.now())

    payment_plan       = Column(String(20), default="hour_by_hour")
    installment_1_paid = Column(Boolean, default=False)
    installment_2_paid = Column(Boolean, default=False)
    
    student  = relationship("Student", back_populates="course_payments")
    teacher  = relationship("Teacher", back_populates="course_payments")
    language = relationship("Language", back_populates="course_payments")
    sessions = relationship("Session", back_populates="course_payment")
    payments = relationship("Payment", back_populates="course_payment")


class Payment(Base):
    __tablename__ = "payments"

    id                = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id        = Column(UUID(as_uuid=True), ForeignKey("sessions.id"), nullable=False)
    course_payment_id = Column(UUID(as_uuid=True), ForeignKey("course_payments.id"), nullable=False)
    amount            = Column(DECIMAL(8, 2), nullable=False)
    platform_fee      = Column(DECIMAL(8, 2), nullable=False)
    teacher_payout    = Column(DECIMAL(8, 2), nullable=False)
    both_reviewed     = Column(Boolean, default=False)
    status            = Column(String(20), default="pending")
    paid_at           = Column(TIMESTAMP(timezone=True))
    created_at        = Column(TIMESTAMP(timezone=True), server_default=func.now())

    session        = relationship("Session", back_populates="payment")
    course_payment = relationship("CoursePayment", back_populates="payments")