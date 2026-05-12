"""
Declarative base class — imported by all ORM models.

Kept in its own file so models can import Base without triggering
the full model-import chain in db/base.py (which is Alembic-only).
"""
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass
