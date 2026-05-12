"""
SQLAlchemy engine and session factory.

Uses a synchronous engine backed by psycopg2 (no async driver needed for this
use-case; adding asyncpg/greenlet complexity would be over-engineering here).

DATABASE_URL format: postgresql://user:password@host:port/dbname
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger("NativeTalk.db")
settings = get_settings()

engine = create_engine(
    settings.DATABASE_URL,
    echo=False,          # set True locally for SQL debug output
    pool_pre_ping=True,  # verify connections before checkout
    pool_size=5,
    max_overflow=10,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


def get_db():
    """
    FastAPI dependency that provides a DB session per request.

    Usage in an endpoint:
        from app.db.session import get_db
        def my_endpoint(db: Session = Depends(get_db)): ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
