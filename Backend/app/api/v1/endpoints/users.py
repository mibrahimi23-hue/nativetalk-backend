"""
User management endpoints.

All endpoints require authentication.
Role-restricted operations (admin) use require_role("admin").
"""
import io
import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from PIL import Image as PilImage
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.db.session import get_db
from app.models.users import User
from app.schemas.user import UserOut, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])

AVATAR_DIR = "uploads/avatars"
os.makedirs(AVATAR_DIR, exist_ok=True)


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


@router.post("/me/photo", response_model=UserOut, summary="Upload profile photo")
async def upload_my_photo(
    photo: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Accepts JPEG / PNG / WebP.
    Image is resized to max 300×300 and re-encoded as JPEG at 80 % quality
    before being written to disk, keeping file sizes small (~20-50 KB).
    The relative path is stored in users.profile_photo.
    The frontend builds the full URL as  <BASE_URL>/<profile_photo>.
    """
    allowed = {"image/jpeg", "image/png", "image/webp"}
    if photo.content_type not in allowed:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG or WebP images are allowed.",
        )

    data = await photo.read()
    try:
        img = PilImage.open(io.BytesIO(data)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read image file.")

    img.thumbnail((300, 300), PilImage.LANCZOS)

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=80, optimize=True)
    buf.seek(0)

    filename = f"{uuid.uuid4()}.jpg"
    file_path = os.path.join(AVATAR_DIR, filename)
    with open(file_path, "wb") as f:
        f.write(buf.read())

    # Remove old avatar file if it was locally stored
    old = current_user.profile_photo
    if old and old.startswith("uploads/avatars/"):
        try:
            os.remove(old)
        except OSError:
            pass

    current_user.profile_photo = f"uploads/avatars/{filename}"
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
