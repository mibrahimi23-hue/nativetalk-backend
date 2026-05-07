"""
Authentication endpoints.

─────────────────────────────────────────────────────────────────────────────
React Native integration quick-reference
─────────────────────────────────────────────────────────────────────────────

1. Google Sign-In  (recommended for mobile)
   ─────────────────
   Install: @react-native-google-signin/google-signin
   Configure with WEB_CLIENT_ID = GOOGLE_CLIENT_ID from .env

   const { idToken } = await GoogleSignin.signIn();
   const res = await fetch(`${BASE}/api/v1/auth/google`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ id_token: idToken }),
   });
   const { access_token, refresh_token, user } = await res.json();
   // Save both tokens in SecureStore

2. Email / Password register + login  (optional fallback)
   ─────────────────────────────────────
   POST /api/v1/auth/register  { email, password, full_name, role }
   POST /api/v1/auth/login     { email, password }

3. Authenticated requests
   ─────────────────────────
   headers: { Authorization: `Bearer ${accessToken}` }

4. Token refresh  (call when any request returns 401)
   ──────────────────────────────────────────────────
   POST /api/v1/auth/refresh  { refresh_token }

5. Logout
   ──────────────────────────────────────────────────
   POST /api/v1/auth/logout
   headers: { Authorization: `Bearer ${accessToken}` }
─────────────────────────────────────────────────────────────────────────────
"""
from __future__ import annotations

from datetime import datetime, timezone

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from jose import JWTError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import (
    decode_access_token,
    hash_password,
    sha256_hex,
    verify_password,
)
from app.db.session import get_db
from app.models.user import RefreshToken, User
from app.schemas.auth import (
    GoogleLoginRequest,
    LoginRequest,
    LogoutRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
)
from app.schemas.user import UserOut
from app.services.google_auth import verify_google_id_token
from app.services.users import (
    blacklist_jti,
    issue_tokens,
    rotate_refresh_token,
    upsert_google_user,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ── Google Sign-In ────────────────────────────────────────────────────────────

@router.post(
    "/google",
    response_model=TokenResponse,
    summary="Sign in with Google ID token",
    description=(
        "React Native obtains the Google **idToken** via GoogleSignin.signIn() "
        "and sends it here. The backend verifies it and returns our own JWT tokens."
    ),
)
def google_login(body: GoogleLoginRequest, db: Session = Depends(get_db)):
    """
    Request body:
        { "id_token": "<google_id_token>" }

    Response:
        {
          "access_token":  "eyJ...",
          "refresh_token": "rt_abc123...",
          "token_type":    "bearer",
          "user": { "id": "...", "email": "...", "full_name": "...", "role": "student" }
        }
    """
    claims = verify_google_id_token(body.id_token)

    user = upsert_google_user(
        db,
        google_sub=claims["sub"],
        email=claims["email"],
        full_name=claims.get("name", claims["email"].split("@")[0]),
        picture=claims.get("picture"),
    )

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account has been deactivated.")

    access_token, refresh_token = issue_tokens(db, user)
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserOut.model_validate(user),
    )


# ── Email / Password ──────────────────────────────────────────────────────────

@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=201,
    summary="Register with email and password",
)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already registered.")

    user = User(
        email         = body.email,
        password_hash = hash_password(body.password),
        full_name     = body.full_name,
        role          = body.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token, refresh_token = issue_tokens(db, user)
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserOut.model_validate(user),
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Sign in with email and password",
)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated.")
    if user.is_suspended:
        raise HTTPException(status_code=403, detail="Account is suspended.")

    access_token, refresh_token = issue_tokens(db, user)
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserOut.model_validate(user),
    )


# ── Token refresh ─────────────────────────────────────────────────────────────

@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Exchange refresh token for new token pair",
)
def refresh(body: RefreshRequest, db: Session = Depends(get_db)):
    """
    React Native calls this when a 401 is received on any request.

    Request body:
        { "refresh_token": "<stored_refresh_token>" }
    """
    try:
        user, new_access, new_refresh = rotate_refresh_token(db, body.refresh_token)
    except ValueError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc

    return TokenResponse(
        access_token=new_access,
        refresh_token=new_refresh,
        user=UserOut.model_validate(user),
    )


# ── Current user (deprecated alias) ─────────────────────────────────────────

@router.get(
    "/me",
    response_model=UserOut,
    deprecated=True,
    summary="[Deprecated] Get current user profile",
    description=(
        "**Deprecated** — use `GET /api/v1/users/me` instead. "
        "This alias will be removed in a future version."
    ),
)
def me(current_user: User = Depends(get_current_user)):
    return current_user


# ── Logout ────────────────────────────────────────────────────────────────────

@router.post(
    "/logout",
    summary="Logout: blacklist access-token JTI + revoke refresh token",
    description=(
        "Immediately invalidates the session in two ways:\n\n"
        "1. **Access token** — the JWT `jti` claim is added to a server-side "
        "denylist so it is rejected on all future requests (even before expiry).\n\n"
        "2. **Refresh token** — if `refresh_token` is included in the request body, "
        "the stored token is deleted, preventing any further token rotation.\n\n"
        "React Native should call this with both tokens, then clear SecureStore."
    ),
)
def logout(
    request: Request,
    body: Optional[LogoutRequest] = None,
    db: Session = Depends(get_db),
):
    """
    Blacklists the access token JTI so it cannot be reused, and — if
    `refresh_token` is included in the body — also deletes the stored
    refresh token so rotation is no longer possible.

    React Native should:
      1. Call this endpoint with the refresh_token in the body.
      2. Delete both stored tokens from SecureStore.
    """
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        try:
            payload = decode_access_token(auth_header[7:])
            jti     = payload.get("jti")
            exp_ts  = payload.get("exp")
            if jti and exp_ts:
                blacklist_jti(
                    db, jti,
                    datetime.fromtimestamp(exp_ts, tz=timezone.utc),
                )
        except JWTError:
            pass   # Token already invalid — logout is still a success

    # Revoke the refresh token if provided
    if body and body.refresh_token:
        token_hash = sha256_hex(body.refresh_token)
        stored = db.query(RefreshToken).filter(
            RefreshToken.token_hash == token_hash
        ).first()
        if stored:
            db.delete(stored)
            db.commit()

    return {"message": "Logged out successfully."}
