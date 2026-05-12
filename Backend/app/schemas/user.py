from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, model_validator


class UserUpdate(BaseModel):
    full_name:     Optional[str] = None
    timezone:      Optional[str] = None
    phone:         Optional[str] = None
    profile_photo: Optional[str] = None


class UserOut(BaseModel):
    id:            UUID
    email:         str
    full_name:     str
    role:          str
    timezone:      str = "UTC"
    phone:         Optional[str] = None
    profile_photo: Optional[str] = None
    is_active:     bool
    is_suspended:  bool = False
    teacher_id:    Optional[UUID] = None
    student_id:    Optional[UUID] = None

    model_config = {"from_attributes": True}

    @model_validator(mode="before")
    @classmethod
    def _extract_profile_ids(cls, v):
        """
        When validating from a SQLAlchemy User ORM object, also include the
        linked teacher/student profile ID so the frontend can directly reference
        it without a second API call.
        """
        if isinstance(v, dict):
            return v
        teacher_id = None
        student_id = None
        try:
            if v.teacher:
                teacher_id = v.teacher.id
        except Exception:
            pass
        try:
            if v.student:
                student_id = v.student.id
        except Exception:
            pass
        return {
            "id": v.id,
            "email": v.email,
            "full_name": v.full_name,
            "role": v.role,
            "timezone": v.timezone or "UTC",
            "phone": v.phone,
            "profile_photo": v.profile_photo,
            "is_active": v.is_active,
            "is_suspended": v.is_suspended,
            "teacher_id": teacher_id,
            "student_id": student_id,
        }
