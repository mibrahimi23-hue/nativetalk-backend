"""
Review endpoints.

Both teacher and student can leave one review per session after it completes.
Payment is released once both reviews are submitted (or auto-released after 48h).
"""
from __future__ import annotations

import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.payment import CoursePayment, Payment
from app.models.review import Review
from app.models.session import Session as BookingSession
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.users import User
from app.schemas.review import ReviewCreate, ReviewOut

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.post("/", response_model=ReviewOut, status_code=201, summary="Submit a session review")
def create_review(
    body: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    React Native calls this after a session completes.

    Request:
        {
          "session_id": "uuid",
          "role": "student",      ← who is writing (student or teacher)
          "rating": 5,
          "comment": "Great lesson!"
        }

    Releasing payment:
      After both parties submit, the payment record is automatically
      created and the session's payment_released flag is set to true.
    """
    session = db.query(BookingSession).filter(BookingSession.id == body.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    if session.status != "completed":
        raise HTTPException(status_code=400, detail="Session must be completed before reviewing.")

    if not (1 <= body.rating <= 5):
        raise HTTPException(status_code=400, detail="Rating must be 1–5.")

    # Determine reviewer identity
    if body.role == "student":
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if not student or str(student.id) != str(session.student_id):
            raise HTTPException(status_code=403, detail="You are not the student of this session.")
        if session.student_review_done:
            raise HTTPException(status_code=400, detail="You have already reviewed this session.")
        session.student_review_done = True
    elif body.role == "teacher":
        teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
        if not teacher or str(teacher.id) != str(session.teacher_id):
            raise HTTPException(status_code=403, detail="You are not the teacher of this session.")
        if session.teacher_review_done:
            raise HTTPException(status_code=400, detail="You have already reviewed this session.")
        session.teacher_review_done = True
    else:
        raise HTTPException(status_code=400, detail="role must be 'student' or 'teacher'.")

    review = Review(
        id         = uuid.uuid4(),
        session_id = body.session_id,
        teacher_id = session.teacher_id,
        student_id = session.student_id,
        written_by = current_user.id,
        role       = body.role,
        rating     = body.rating,
        comment    = body.comment,
    )
    db.add(review)

    # Release payment if both parties reviewed
    if session.teacher_review_done and session.student_review_done and not session.payment_released:
        _release_payment(db, session)

    db.commit()
    db.refresh(review)
    return review


@router.get(
    "/session/{session_id}",
    response_model=List[ReviewOut],
    summary="Get reviews for a session",
)
def get_session_reviews(session_id: str, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.session_id == session_id).all()
    return reviews


@router.get(
    "/teacher/{teacher_id}",
    response_model=List[ReviewOut],
    summary="Get all reviews for a teacher",
)
def get_teacher_reviews(teacher_id: str, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.teacher_id == teacher_id).all()


# ── Helper ────────────────────────────────────────────────────────────────────

def _release_payment(db: Session, session: BookingSession) -> None:
    course_payment = db.query(CoursePayment).filter(
        CoursePayment.id == session.course_payment_id
    ).first()
    if not course_payment:
        return

    existing = db.query(Payment).filter(Payment.session_id == session.id).first()
    if existing:
        session.payment_released = True
        return

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
        both_reviewed     = True,
        status            = "paid",
    ))
    session.payment_released = True
