from sqlalchemy import Column, String, Boolean, Text, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import uuid


class User(Base):
    __tablename__ = "users"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name     = Column(String(200), nullable=False)
    email         = Column(String(255), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    role          = Column(String(50), nullable=False)
    timezone      = Column(String(60), default='UTC')
    profile_photo = Column(Text)
    phone         = Column(String(20), nullable=True)   # ← ADDED
    is_active     = Column(Boolean, default=True)
    is_suspended  = Column(Boolean, default=False)
    created_at    = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at    = Column(TIMESTAMP(timezone=True), server_default=func.now())

    teacher     = relationship("Teacher", back_populates="user", uselist=False)
    student     = relationship("Student", back_populates="user", uselist=False)
    suspensions = relationship("Suspension", back_populates="user")