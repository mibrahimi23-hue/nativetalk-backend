"""
Google ID token verification service.

Flow (React Native → Backend):
  1. React Native calls GoogleSignin.signIn() → gets idToken (a JWT signed by Google).
  2. React Native POSTs { "id_token": idToken } to POST /api/v1/auth/google.
  3. Backend verifies the token with google-auth-library (no client secret needed).
  4. Backend upserts user and returns our own access + refresh tokens.

Why this flow?
  - It works with only GOOGLE_CLIENT_ID — no client secret required.
  - The ID token self-contains email/name/picture and is verifiable via Google's
    public keys (fetched automatically by google-auth).
  - Suitable for mobile apps; the authorization-code flow is NOT used.
"""
from __future__ import annotations

from typing import Any, Dict

from fastapi import HTTPException
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger("nativetalk.google_auth")
settings = get_settings()


def verify_google_id_token(token: str) -> Dict[str, Any]:
    """
    Verify a Google ID token and return the claims dict.

    Returns dict with keys: sub, email, name, picture, email_verified, ...

    Raises HTTPException(401) on invalid / expired token.
    """
    try:
        claims = google_id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            audience=settings.GOOGLE_CLIENT_ID,
        )
    except ValueError as exc:
        logger.warning("Google token verification failed: %s", exc)
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired Google ID token. Ensure you are passing the idToken "
                   "(not the accessToken) from @react-native-google-signin/google-signin.",
        ) from exc

    # Extra safety: validate issuer
    if claims.get("iss") not in {"accounts.google.com", "https://accounts.google.com"}:
        raise HTTPException(status_code=401, detail="Invalid Google token issuer.")

    email = claims.get("email")
    if not email:
        raise HTTPException(status_code=401, detail="Google token missing email claim.")

    if not claims.get("email_verified", False):
        raise HTTPException(status_code=401, detail="Google email address is not verified.")

    logger.info("Google token verified for %s (sub=%s)", email, claims.get("sub"))
    return claims
