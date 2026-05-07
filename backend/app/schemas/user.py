from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


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

    model_config = {"from_attributes": True}
