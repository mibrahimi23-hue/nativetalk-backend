"""
User management endpoints.

All endpoints require authentication.
Role-restricted operations (admin) use require_role("admin").
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserOut, summary="Get own profile")
def get_me(current_user: User = Depends(get_current_user)):
    """Returns full profile of the authenticated user."""
    return current_user


@router.patch("/me", response_model=UserOut, summary="Update own profile")
def update_me(
    body: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    React Native sends only the fields to update:
        { "full_name": "Maria", "timezone": "Europe/Madrid" }
    """
    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get(
    "/{user_id}",
    response_model=UserOut,
    summary="Get user by ID (admin only)",
)
def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_role("admin")),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user
