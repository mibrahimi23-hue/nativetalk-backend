"""
Smoke tests – health endpoint.

Run with:
    pytest tests/test_health.py -v

No database or external services required; the app is tested with
an in-memory SQLite engine via the override in conftest.py (see below).
"""
import os

import pytest
from fastapi.testclient import TestClient

# Point at SQLite so tests run without Postgres
os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-testing-only")
os.environ.setdefault("GOOGLE_CLIENT_ID", "test-client-id.apps.googleusercontent.com")

from app.main import app  # noqa: E402  (env must be set before import)


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def test_health_returns_200(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200


def test_health_body(client):
    data = client.get("/api/v1/health").json()
    assert data["status"] == "ok"
    assert "version" in data


def test_health_is_fast(client):
    """Health endpoint must respond in under 500 ms (no DB call)."""
    import time
    start = time.monotonic()
    client.get("/api/v1/health")
    elapsed_ms = (time.monotonic() - start) * 1000
    assert elapsed_ms < 500, f"Health endpoint took {elapsed_ms:.0f} ms"
