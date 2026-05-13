"""
Root conftest – sets environment variables BEFORE any test module is collected.

pytest loads conftest.py files before it imports test modules, so placing
env-var setup here ensures that every test file (including test_auth.py and
test_health.py, which call os.environ.setdefault()) sees the values we declare
here first — and their setdefault() calls become no-ops.

All tests share a single real PostgreSQL database; each test that needs clean
state is responsible for seeding and tearing down its own data.
"""
import os

# Must be set BEFORE app.main (and therefore app.db.session) is imported.
os.environ.setdefault(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/myproject",
)
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-testing-only")
os.environ.setdefault("GOOGLE_CLIENT_ID", "test-client-id.apps.googleusercontent.com")
