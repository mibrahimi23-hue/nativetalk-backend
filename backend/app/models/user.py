"""
User model — the single canonical user record for all roles.

Roles: "student" | "teacher" | "admin"
Google users have google_id set and an empty password_hash.
"""
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class User(Base):
    __tablename__ = "users"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email         = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(Text, nullable=False, default="")
    full_name     = Column(String(200), nullable=False)
    # "student" | "teacher" | "admin"
    role          = Column(String(50), nullable=False, default="student")
    timezone      = Column(String(60), default="UTC")
    profile_photo = Column(Text)
    phone         = Column(String(20))
    google_id     = Column(String(100), unique=True, nullable=True, index=True)
    is_active     = Column(Boolean, default=True)
    is_suspended  = Column(Boolean, default=False)
    created_at    = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at    = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    # relationships
    teacher     = relationship("Teacher", back_populates="user", uselist=False)
    student     = relationship("Student", back_populates="user", uselist=False)
    suspensions = relationship("Suspension", back_populates="user")


class RefreshToken(Base):
    """Opaque refresh tokens stored as SHA-256 hash."""
    __tablename__ = "refresh_tokens"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id    = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_hash = Column(String(64), unique=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class BlacklistedToken(Base):
    """JTIs of access tokens that have been explicitly revoked (logout)."""
    __tablename__ = "blacklisted_tokens"

    jti        = Column(String(36), primary_key=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
