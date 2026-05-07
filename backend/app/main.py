"""
NativeTalk FastAPI application factory.

Start locally:
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Or via Docker Compose:
    docker compose up

API docs:
    http://localhost:8000/docs        (Swagger UI)
    http://localhost:8000/redoc       (ReDoc)
    http://localhost:8000/api/v1/health
"""
from __future__ import annotations

import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.logging import configure_logging, get_logger
from app.db.session import SessionLocal
from app.services.auto_release import auto_release_overdue_payments

configure_logging()
logger      = get_logger("nativetalk")
settings    = get_settings()


# ── Background tasks ──────────────────────────────────────────────────────────

async def _auto_release_scheduler() -> None:
    """Run payment auto-release every hour."""
    while True:
        await asyncio.sleep(3600)
        db = SessionLocal()
        try:
            released = auto_release_overdue_payments(db)
            if released:
                logger.info("Auto-release: %d session(s) released.", released)
        except Exception as exc:
            logger.error("Auto-release error: %s", exc, exc_info=True)
        finally:
            db.close()


# ── Lifespan ──────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup / shutdown.

    NOTE: Tables are NOT created here — use Alembic migrations:
        alembic upgrade head
    """
    logger.info("NativeTalk API starting (ENV=%s)...", settings.ENV)
    task = asyncio.create_task(_auto_release_scheduler())
    yield
    task.cancel()
    logger.info("NativeTalk API shutting down.")


# ── App factory ───────────────────────────────────────────────────────────────

app = FastAPI(
    title       = "NativeTalk API",
    description = (
        "Backend for the NativeTalk language-tutoring platform.\n\n"
        "**React Native clients** authenticate via Google Sign-In or email/password "
        "and receive JWT tokens. All authenticated endpoints require:\n\n"
        "```\nAuthorization: Bearer <access_token>\n```"
    ),
    version  = "1.0.0",
    lifespan = lifespan,
    docs_url = "/docs",
    redoc_url = "/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# React Native bare apps don't enforce CORS, but web/admin dashboards do.
# Set CORS_ORIGINS in .env to a comma-separated list of allowed origins.
# Use "*" only during local development.
app.add_middleware(
    CORSMiddleware,
    allow_origins     = settings.cors_origins,
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
    expose_headers    = ["X-Request-ID"],
)


# ── Request logging middleware ────────────────────────────────────────────────
class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        logger.info("→ %s %s", request.method, request.url.path)
        response = await call_next(request)
        logger.info("← %s %s %s", response.status_code, request.method, request.url.path)
        return response


app.add_middleware(RequestLoggingMiddleware)

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(api_router)


# ── Root redirect ─────────────────────────────────────────────────────────────
@app.get("/", include_in_schema=False)
def root():
    return {
        "message": "NativeTalk API",
        "docs": "/docs",
        "health": "/api/v1/health",
    }
