"""
Admin-only endpoints.
All routes require role="admin".
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import and_
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.db.session import get_db
from app.models.session import Session as BookingSession
from app.models.suspension import Suspension
from app.models.user import User
from app.services.auto_release import auto_release_overdue_payments

router = APIRouter(prefix="/admin", tags=["Admin"])


class SuspendRequest(BaseModel):
    user_id:  str
    reason:   str
    notes:    str = ""
    no_refund: bool = False


@router.post("/suspend", summary="Suspend a user account")
def suspend_user(
    body: SuspendRequest,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_role("admin")),
):
    user = db.query(User).filter(User.id == body.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.is_suspended = True
    db.add(Suspension(
        user_id=body.user_id,
        role=user.role,
        reason=body.reason,
        no_refund=body.no_refund,
        notes=body.notes,
        is_active=True,
    ))
    db.commit()
    return {"message": f"User {user.email} suspended."}


@router.post("/unsuspend/{user_id}", summary="Lift a user suspension")
def unsuspend_user(
    user_id: str,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_role("admin")),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    from datetime import datetime, timezone
    suspensions = db.query(Suspension).filter(
        and_(Suspension.user_id == user_id, Suspension.is_active == True)
    ).all()
    for s in suspensions:
        s.is_active = False
        s.lifted_at = datetime.now(timezone.utc)
    user.is_suspended = False
    db.commit()
    return {"message": f"User {user.email} suspension lifted."}


@router.post("/sessions/auto-release", summary="Trigger manual auto-release")
def manual_auto_release(
    db: Session = Depends(get_db),
    _admin: User = Depends(require_role("admin")),
):
    released = auto_release_overdue_payments(db)
    return {"message": "Auto-release completed.", "sessions_released": released}


@router.get("/sessions/overdue", summary="List overdue sessions awaiting payment release")
def list_overdue(
    db: Session = Depends(get_db),
    _admin: User = Depends(require_role("admin")),
):
    from datetime import datetime, timezone, timedelta
    deadline = datetime.now(timezone.utc) - timedelta(hours=48)
    overdue = db.query(BookingSession).filter(
        and_(
            BookingSession.status           == "completed",
            BookingSession.payment_released == False,
            BookingSession.scheduled_at     <= deadline,
        )
    ).all()
    return {
        "total_overdue": len(overdue),
        "sessions": [
            {"session_id": str(s.id), "scheduled_at": str(s.scheduled_at),
             "teacher_id": str(s.teacher_id), "student_id": str(s.student_id)}
            for s in overdue
        ],
    }
