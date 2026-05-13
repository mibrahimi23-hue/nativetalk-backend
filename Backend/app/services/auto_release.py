"""
Auto-release service — releases teacher payment for sessions where both
parties have not reviewed within 48 hours of completion.

Called by the background scheduler in main.py lifespan.
Platform fee: 10% of session amount.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import and_
from sqlalchemy.orm import Session

from app.models.session import Session as BookingSession
from app.models.payment import CoursePayment, Payment
from app.core.logging import get_logger

logger = get_logger("nativetalk.auto_release")


def auto_release_overdue_payments(db: Session) -> int:
    """
    Find all completed, unreleased sessions older than 48 hours and release
    payment to the teacher. Returns count of sessions released.
    """
    deadline = datetime.now(timezone.utc) - timedelta(hours=48)

    overdue = db.query(BookingSession).filter(
        and_(
            BookingSession.status            == "completed",
            BookingSession.payment_released  == False,
            BookingSession.scheduled_at      <= deadline,
        )
    ).all()

    released = 0
    for session in overdue:
        course_payment = db.query(CoursePayment).filter(
            CoursePayment.id == session.course_payment_id
        ).first()
        if not course_payment:
            continue

        # Idempotency: don't create duplicate payment records
        existing = db.query(Payment).filter(Payment.session_id == session.id).first()
        if not existing:
            amount         = round(float(course_payment.price_per_hour) * (session.duration_minutes / 60), 2)
            platform_fee   = round(amount * 0.10, 2)
            teacher_payout = round(amount - platform_fee, 2)

            db.add(Payment(
                id                = uuid.uuid4(),
                session_id        = session.id,
                course_payment_id = course_payment.id,
                amount            = amount,
                platform_fee      = platform_fee,
                teacher_payout    = teacher_payout,
                both_reviewed     = (session.teacher_review_done and session.student_review_done),
                status            = "paid",
                paid_at           = datetime.now(timezone.utc),
            ))

        session.payment_released    = True
        session.teacher_review_done = True
        session.student_review_done = True
        released += 1

    if released:
        db.commit()
        logger.info("Auto-released %d session(s).", released)

    return released
