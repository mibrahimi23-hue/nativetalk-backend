"""
Health-check endpoint — no auth required.

React Native can poll GET /api/v1/health at startup to check connectivity.
"""
from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health", summary="Health check")
def health():
    """
    Returns HTTP 200 when the API is up.

    React Native usage:
        const res = await fetch(`${API_BASE_URL}/api/v1/health`);
        if (!res.ok) showOfflineBanner();
    """
    return {"status": "ok", "version": "1.0.0"}
