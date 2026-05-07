from sqlalchemy import Column, String, Text, TIMESTAMP, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import uuid


class LessonMaterial(Base):
    __tablename__ = "lesson_materials"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    teacher_id  = Column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=False)
    language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    level       = Column(String(3), nullable=False)
    title       = Column(String(100), nullable=False)
    type        = Column(String(30), nullable=False)
    file_path   = Column(String(255))
    description = Column(Text)
    created_at  = Column(TIMESTAMP(timezone=True), server_default=func.now())

    teacher  = relationship("Teacher", back_populates="materials")
    language = relationship("Language", back_populates="materials")