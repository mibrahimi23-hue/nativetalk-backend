"""
Centralised logging configuration.
Call configure_logging() once at application startup (from main.py lifespan).
"""
import logging
import sys


def configure_logging(level: str = "INFO") -> None:
    fmt = "%(asctime)s  %(levelname)-8s  %(name)s: %(message)s"
    logging.basicConfig(
        stream=sys.stdout,
        level=getattr(logging, level.upper(), logging.INFO),
        format=fmt,
    )
    # Quieten noisy third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
