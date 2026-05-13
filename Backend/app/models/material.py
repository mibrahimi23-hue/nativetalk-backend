import uuid
from sqlalchemy import Column, ForeignKey, Integer, String, Text, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class LessonMaterial(Base):
    """Teaching resources uploaded by a teacher for a given level/language."""
    __tablename__ = "lesson_materials"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    teacher_id  = Column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=False)
    language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    level       = Column(String(3), nullable=False)
    title       = Column(String(100), nullable=False)
    type        = Column(String(30), nullable=False)    # "pdf" | "video" | "audio" | etc.
    file_path   = Column(String(255))
    description = Column(Text)
    created_at  = Column(TIMESTAMP(timezone=True), server_default=func.now())

    teacher  = relationship("Teacher", back_populates="materials")
    language = relationship("Language", back_populates="materials")
