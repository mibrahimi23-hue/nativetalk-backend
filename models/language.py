from sqlalchemy import Column, String, Integer, DECIMAL
from sqlalchemy.orm import relationship
from database import Base


class Language(Base):
    __tablename__ = "languages"

    id   = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(60), unique=True, nullable=False)
    code = Column(String(10), unique=True, nullable=False)

    teachers        = relationship("Teacher", back_populates="language")
    course_payments = relationship("CoursePayment", back_populates="language")
    students = relationship("StudentLanguage", back_populates="language")
    sessions        = relationship("Session", back_populates="language")


class LevelPricing(Base):
    __tablename__ = "level_pricing"

    level     = Column(String(3), primary_key=True)
    price_min = Column(DECIMAL(5, 2), nullable=False)
    price_max = Column(DECIMAL(5, 2), nullable=False)


class LevelHours(Base):
    __tablename__ = "level_hours"

    level     = Column(String(3), primary_key=True)
    hours_min = Column(Integer, nullable=False, default=30)
    hours_max = Column(Integer, nullable=False, default=50)
    