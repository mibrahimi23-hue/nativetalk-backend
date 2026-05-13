"""
Smoke tests – authentication endpoints.

Tests cover:
  - Protected endpoint returns 401 without a token
  - Protected endpoint returns 401 with a malformed token
  - POST /auth/google returns 422 when body is missing
  - POST /auth/login returns 422 when body is missing
  - POST /auth/refresh returns 401 for an invalid refresh token

No real Google credentials or database are needed; invalid inputs are used
to verify that validation and auth middleware are wired correctly.
"""
import os

import pytest
from fastapi.testclient import TestClient

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_auth.db")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-auth-tests")
os.environ.setdefault("GOOGLE_CLIENT_ID", "test-client-id.apps.googleusercontent.com")

from app.main import app  # noqa: E402


@pytest.fixture(scope="module")
def client():
    with TestClient(app, raise_server_exceptions=False) as c:
        yield c


# ── /auth/me (protected) ──────────────────────────────────────────────────────

def test_protected_no_token_returns_401(client):
    r = client.get("/api/v1/auth/me")
    assert r.status_code == 401


def test_protected_bad_token_returns_401(client):
    r = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer totally.fake.token"})
    assert r.status_code == 401


def test_protected_missing_bearer_scheme_returns_401(client):
    r = client.get("/api/v1/auth/me", headers={"Authorization": "notabearer token"})
    assert r.status_code == 401


# ── POST /auth/google ─────────────────────────────────────────────────────────

def test_google_login_empty_body_returns_422(client):
    r = client.post("/api/v1/auth/google", json={})
    assert r.status_code == 422


def test_google_login_missing_body_returns_422(client):
    r = client.post("/api/v1/auth/google")
    assert r.status_code == 422


def test_google_login_invalid_token_returns_401(client):
    """An obviously fake ID token should fail Google verification → 401."""
    r = client.post("/api/v1/auth/google", json={"id_token": "fake.google.id_token"})
    # The backend verifies with google-auth; a fake token must yield 401
    assert r.status_code == 401


# ── POST /auth/login ──────────────────────────────────────────────────────────

def test_login_empty_body_returns_422(client):
    r = client.post("/api/v1/auth/login", json={})
    assert r.status_code == 422


# ── POST /auth/refresh ────────────────────────────────────────────────────────

def test_refresh_invalid_token_returns_401(client):
    r = client.post("/api/v1/auth/refresh", json={"refresh_token": "not-a-real-refresh-token"})
    assert r.status_code == 401


# ── POST /auth/logout ─────────────────────────────────────────────────────────

def test_logout_without_auth_returns_200(client):
    r = client.post("/api/v1/auth/logout")
    assert r.status_code == 200
