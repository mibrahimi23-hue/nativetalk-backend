"""
JWT creation/validation and password hashing utilities.

React Native integration:
  - After login/google-auth, store access_token and refresh_token in SecureStore.
  - Attach to every authenticated request:
      Authorization: Bearer <access_token>
  - When the access token expires (401), call POST /api/v1/auth/refresh with the
    refresh_token to get new tokens.
"""
from __future__ import annotations

import hashlib
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Dict

import bcrypt
from jose import JWTError, jwt

from app.core.config import get_settings

settings = get_settings()


# ── Password helpers ──────────────────────────────────────────────────────────

def hash_password(plain: str) -> str:
    """Return bcrypt hash of *plain* password."""
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    """Return True if *plain* matches *hashed*. Returns False if hash is empty."""
    if not hashed:
        return False
    return bcrypt.checkpw(plain.encode(), hashed.encode())


# ── Token helpers ─────────────────────────────────────────────────────────────

def create_access_token(user_id: str, role: str) -> str:
    """
    Create a short-lived JWT access token.

    Payload:
      sub  — user UUID (string)
      role — "student" | "teacher" | "admin"
      jti  — unique token ID (used for blacklist check on logout)
      iat  — issued-at
      exp  — expiry
    """
    jti = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "role": role,
        "jti": jti,
        "iat": now,
        "exp": now + timedelta(minutes=settings.JWT_ACCESS_TTL_MINUTES),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token_value() -> str:
    """Return a random opaque refresh token string (stored hashed in DB)."""
    return "rt_" + uuid.uuid4().hex + uuid.uuid4().hex


def decode_access_token(token: str) -> Dict[str, Any]:
    """
    Decode and validate a JWT access token.
    Raises jose.JWTError on invalid / expired tokens — callers should catch it.
    """
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])


def sha256_hex(value: str) -> str:
    """SHA-256 hex digest — used to store refresh tokens hashed in DB."""
    return hashlib.sha256(value.encode()).hexdigest()
