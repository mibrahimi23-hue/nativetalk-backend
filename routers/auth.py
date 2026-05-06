from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as DBSession
from database import get_db
from models.users import User
from models.teacher import Teacher
from models.student import Student, StudentLanguage
from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone
import bcrypt
import uuid

router = APIRouter()


class RegisterTeacher(BaseModel):
    full_name:      str
    email:          EmailStr
    password:       str
    timezone:       str
    language_id:    int
    is_native:      bool = False
    is_certified:   bool = False
    has_experience: bool = False
    bio:            str = ""


class RegisterStudent(BaseModel):
    full_name:    str
    email:        EmailStr
    password:     str
    timezone:     str
    language_id:  int


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


# ── Register Teacher ───────────────────────────────────────────────────────

@router.post("/register/teacher")
def register_teacher(
    data: RegisterTeacher,
    db: DBSession = Depends(get_db)
):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered!")

    hashed = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()

    user = User(
        id=uuid.uuid4(),
        full_name=data.full_name,
        email=data.email,
        password_hash=hashed,
        role="teacher",
        timezone=data.timezone,
        is_active=True,
        is_suspended=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Determine max_level based on certification and experience
    if data.is_certified and data.has_experience:
        max_level = "C2"
    elif data.is_certified:
        max_level = "B2"
    else:
        max_level = "A2"

    teacher = Teacher(
        id=uuid.uuid4(),
        user_id=user.id,
        language_id=data.language_id,
        is_native=data.is_native,
        is_certified=data.is_certified,
        has_experience=data.has_experience,
        max_level=max_level,
        is_verified=False,
        passed_exam=False,
        bio=data.bio
    )
    db.add(teacher)
    db.commit()
    db.refresh(teacher)

    return {
        "message":    "Teacher registered successfully!",
        "user_id":    str(user.id),
        "teacher_id": str(teacher.id),
        "email":      user.email,
        "role":       "teacher",
        "max_level":  teacher.max_level,
        "is_verified": teacher.is_verified,
        "next_step":  (
            "Pass the universal exam to get verified for A1/A2."
            if not data.is_certified else
            "Ask a certified teacher to verify you."
        )
    }


# ── Register Student ───────────────────────────────────────────────────────

@router.post("/register/student")
def register_student(
    data: RegisterStudent,
    db: DBSession = Depends(get_db)
):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered!")

    hashed = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()

    user = User(
        id=uuid.uuid4(),
        full_name=data.full_name,
        email=data.email,
        password_hash=hashed,
        role="student",
        timezone=data.timezone,
        is_active=True,
        is_suspended=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    student = Student(
        id=uuid.uuid4(),
        user_id=user.id,
        current_level="A1",
        reschedule_count=0
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    # Add student language
    student_language = StudentLanguage(
        id=uuid.uuid4(),
        student_id=student.id,
        language_id=data.language_id,
        level="A1"
    )
    db.add(student_language)
    db.commit()

    return {
        "message":    "Student registered successfully!",
        "user_id":    str(user.id),
        "student_id": str(student.id),
        "email":      user.email,
        "role":       "student",
        "level":      "A1",
        "next_step":  "Search for a teacher and book your first session!"
    }


# ── Login ──────────────────────────────────────────────────────────────────

@router.post("/login")
def login(
    data: LoginRequest,
    db: DBSession = Depends(get_db)
):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password!")

    if not bcrypt.checkpw(data.password.encode(), user.password_hash.encode()):
        raise HTTPException(status_code=401, detail="Invalid email or password!")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated!")

    if user.is_suspended:
        raise HTTPException(status_code=403, detail="Account is suspended!")

    # Get role-specific info
    profile = {}
    if user.role == "teacher":
        teacher = db.query(Teacher).filter(Teacher.user_id == user.id).first()
        if teacher:
            profile = {
                "teacher_id":   str(teacher.id),
                "is_verified":  teacher.is_verified,
                "max_level":    teacher.max_level,
                "language_id":  teacher.language_id
            }
    elif user.role == "student":
        student = db.query(Student).filter(Student.user_id == user.id).first()
        if student:
            profile = {
                "student_id":    str(student.id),
                "current_level": student.current_level
            }

    return {
        "message":   "Login successful!",
        "user_id":   str(user.id),
        "full_name": user.full_name,
        "email":     user.email,
        "role":      user.role,
        "timezone":  user.timezone,
        "profile":   profile
    }


# ── Get user info ──────────────────────────────────────────────────────────

@router.get("/me/{user_id}")
def get_me(
    user_id: str,
    db: DBSession = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found!")

    profile = {}
    if user.role == "teacher":
        teacher = db.query(Teacher).filter(Teacher.user_id == user.id).first()
        if teacher:
            profile = {
                "teacher_id":   str(teacher.id),
                "is_verified":  teacher.is_verified,
                "max_level":    teacher.max_level,
                "language_id":  teacher.language_id,
                "is_certified": teacher.is_certified,
                "has_experience": teacher.has_experience
            }
    elif user.role == "student":
        student = db.query(Student).filter(Student.user_id == user.id).first()
        if student:
            profile = {
                "student_id":      str(student.id),
                "current_level":   student.current_level,
                "reschedule_count": student.reschedule_count
            }

    return {
        "user_id":      str(user.id),
        "full_name":    user.full_name,
        "email":        user.email,
        "role":         user.role,
        "timezone":     user.timezone,
        "is_active":    user.is_active,
        "is_suspended": user.is_suspended,
        "profile":      profile
    }