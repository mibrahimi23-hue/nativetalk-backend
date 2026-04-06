from fastapi import FastAPI
from database import engine, Base
import models

from routers import (
    auth,
    availability,
    booking,
    reschedule,
    sessions,
    suspension,
    reviews,
    payments,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NativeTalk API",
    description="Platform for learning languages with native speakers",
    version="1.0.0"
)

app.include_router(auth.router,         prefix="/auth",         tags=["Authentication"])
app.include_router(availability.router, prefix="/availability", tags=["Availability"])
app.include_router(booking.router,      prefix="/booking",      tags=["Booking"])
app.include_router(reschedule.router,   prefix="/reschedule",   tags=["Reschedule"])
app.include_router(sessions.router,     prefix="/sessions",     tags=["Sessions"])
app.include_router(suspension.router,   prefix="/suspension",   tags=["Suspension"])
app.include_router(reviews.router,      prefix="/reviews",      tags=["Reviews"])
app.include_router(payments.router,     prefix="/payments",     tags=["Payments"])


@app.get("/")
def root():
    return {
        "message": "NativeTalk API is running!",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}