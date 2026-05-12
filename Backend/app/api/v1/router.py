"""
API v1 central router — aggregates all endpoint routers under /api/v1.
"""
from fastapi import APIRouter

from app.api.v1.endpoints import (
    admin,
    auth,
    chat,
    health,
    payments,
    reviews,
    sessions,
    tutors,
    users,
)

# Single top-level router for the entire v1 API
api_router = APIRouter(prefix="/api/v1")

api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(tutors.router)
api_router.include_router(sessions.router)
api_router.include_router(reviews.router)
api_router.include_router(payments.router)
api_router.include_router(chat.router)
api_router.include_router(admin.router)
