from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class TeacherProfileOut(BaseModel):
    id:            UUID
    user_id:       UUID
    language_id:   int
    is_native:     bool
    is_certified:  bool
    has_experience: bool
    max_level:     str
    is_verified:   bool
    passed_exam:   bool
    bio:           Optional[str] = None
    hourly_rate:   Optional[float] = None

    model_config = {"from_attributes": True}


class TeacherUpdate(BaseModel):
    bio:        Optional[str] = None
    hourly_rate: Optional[int] = None


class AvailabilityCreate(BaseModel):
    """
    React Native sends this when a teacher sets their weekly availability.
    day_of_week: 0=Monday … 6=Sunday
    start_time / end_time: "HH:MM:SS" strings (Python time format)
    timezone: IANA timezone, e.g. "Europe/Madrid"
    """
    day_of_week: int
    start_time:  str
    end_time:    str
    timezone:    str


class AvailabilityOut(BaseModel):
    id:          UUID
    day_of_week: int
    start_time:  str
    end_time:    str
    timezone:    str
    is_active:   Optional[bool] = None

    model_config = {"from_attributes": True}


class PaginatedTutorResponse(BaseModel):
    items:  List[TeacherProfileOut]
    total:  int
    limit:  int
    offset: int
