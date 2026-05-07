from typing import Optional
from pydantic import BaseModel


class ReviewCreate(BaseModel):
    """
    React Native sends this after a session completes.
    role: "student" (student reviewing teacher) | "teacher" (teacher reviewing student)
    rating: 1-5
    """
    session_id: str
    role:        str
    rating:      int
    comment:     Optional[str] = None


class ReviewOut(BaseModel):
    id:         str
    session_id: str
    teacher_id: str
    student_id: str
    role:       str
    rating:     int
    comment:    Optional[str] = None

    model_config = {"from_attributes": True}
