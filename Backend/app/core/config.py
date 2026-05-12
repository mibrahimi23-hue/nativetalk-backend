"""
Application settings loaded from environment variables.

Copy .env.example -> .env and fill in real values before starting.
NEVER commit .env to git.
"""
from __future__ import annotations

import os
from functools import lru_cache
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ── Runtime ──────────────────────────────────────────────────────────────
    ENV: str = "local"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000

    # ── Database ─────────────────────────────────────────────────────────────
    # Format: postgresql://user:pass@host:port/dbname
    # Used by SQLAlchemy synchronous engine.
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/nativetalk"

    # ── JWT ───────────────────────────────────────────────────────────────────
    # JWT_SECRET must be a long, random string in production.
    # React Native stores access_token in SecureStore and sends it as:
    #   Authorization: Bearer <access_token>
    JWT_SECRET: str = "change_me_in_production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TTL_MINUTES: int = 15
    JWT_REFRESH_TTL_DAYS: int = 30

    # ── Google OAuth ─────────────────────────────────────────────────────────
    # React Native obtains a Google ID token via @react-native-google-signin/google-signin.
    # The mobile app sends { "id_token": "<google_id_token>" } to POST /api/v1/auth/google.
    # The backend verifies it against this client ID — NO client secret needed.
    GOOGLE_CLIENT_ID: str = "325878187070-dnnuldrknhhjffnr01jqb99s8d0bof2l.apps.googleusercontent.com"

    # ── Daily.co ─────────────────────────────────────────────────────────────
    # Get your key from https://dashboard.daily.co/developers
    # If blank, video-call endpoints return a 503 with a clear message.
    DAILY_API_KEY: str = ""
    DAILY_API_URL: str = "https://api.daily.co/v1"

    # ── CORS ─────────────────────────────────────────────────────────────────
    # Comma-separated list of allowed origins.
    # Examples:
    #   local web dev:  http://localhost:3000
    #   Expo Go:        exp://192.168.1.x:8081
    #   production:     https://app.nativetalk.com
    # React Native bare apps don't enforce CORS but keep this set correctly for
    # any web/admin frontends.
    CORS_ORIGINS_STR: str = "*"

    # ── File uploads ──────────────────────────────────────────────────────────
    UPLOADS_DIR: str = "uploads"

    @field_validator("CORS_ORIGINS_STR")
    @classmethod
    def _validate_cors(cls, v: str) -> str:
        return v.strip()

    @property
    def cors_origins(self) -> List[str]:
        if self.CORS_ORIGINS_STR == "*":
            return ["*"]
        return [o.strip() for o in self.CORS_ORIGINS_STR.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.ENV == "production"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """Cached singleton — safe to call anywhere without re-reading disk."""
    return Settings()
