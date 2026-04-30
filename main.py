from fastapi import FastAPI
from database import engine, Base, SessionLocal
from fastapi.middleware.cors import CORSMiddleware
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
    search,
    exams,
    verifications,
    admin,        
    profile,      
    progress, 
    videocall    
)
from utils.auto_release import auto_release_overdue_payments
from contextlib import asynccontextmanager
import asyncio


async def auto_release_scheduler():
    while True:
        await asyncio.sleep(3600)
        db = SessionLocal()
        try:
            released = auto_release_overdue_payments(db)
            if released > 0:
                print(f"Auto-release: {released} session(s) released automatically!")
        except Exception as e:
            print(f"Auto-release error: {e}")
        finally:
            db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(auto_release_scheduler())
    yield
    task.cancel()


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NativeTalk API",
    description="Platform for learning languages with native speakers",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,          prefix="/auth",          tags=["Authentication"])
app.include_router(availability.router,  prefix="/availability",  tags=["Availability"])
app.include_router(booking.router,       prefix="/booking",       tags=["Booking"])
app.include_router(reschedule.router,    prefix="/reschedule",    tags=["Reschedule"])
app.include_router(sessions.router,      prefix="/sessions",      tags=["Sessions"])
app.include_router(suspension.router,    prefix="/suspension",    tags=["Suspension"])
app.include_router(reviews.router,       prefix="/reviews",       tags=["Reviews"])
app.include_router(payments.router,      prefix="/payments",      tags=["Payments"])
app.include_router(search.router,        prefix="/search",        tags=["Search"])
app.include_router(exams.router,         prefix="/exams",         tags=["Exams"])
app.include_router(verifications.router, prefix="/verifications", tags=["Verifications"])
app.include_router(admin.router,         prefix="/admin",         tags=["Admin"])       
app.include_router(profile.router,       prefix="/profile",       tags=["Profile"])     
app.include_router(progress.router,      prefix="/progress",      tags=["Progress"])  
app.include_router(videocall.router,    prefix="/videocall",    tags=["Video Call"])


@app.get("/")
def root():
    return {
        "message": "NativeTalk API is running!",
        "version": "1.0.0",
        "docs":    "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}