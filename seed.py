from database import SessionLocal
from models.users import User
import models.teacher
import models.student
from models.language import Language, LevelPricing, LevelHours
import uuid
import bcrypt

db = SessionLocal()

def seed():
    # 1. Shto gjuhët
    languages = [
        Language(id=1, name="Anglisht", code="en"),
        Language(id=2, name="Italisht", code="it"),
        Language(id=3, name="Gjermanisht", code="de"),
        Language(id=4, name="Frengjisht", code="fr"),
        Language(id=5, name="Spanjisht", code="es"),
        Language(id=6, name="Bullgarisht", code="bg"),
        Language(id=7, name="Greqisht", code="el"),
        Language(id=8, name="Turqisht", code="tr"),
        Language(id=9, name="Koreane", code="ko"),
        Language(id=10, name="Rusisht", code="ru"),
    ]
    for lang in languages:
        existing = db.query(Language).filter_by(id=lang.id).first()
        if not existing:
            db.add(lang)

    # 2. Shto çmimet
    pricing = [
        LevelPricing(level="A1", price_min=3.00, price_max=5.00),
        LevelPricing(level="A2", price_min=4.00, price_max=6.00),
        LevelPricing(level="B1", price_min=5.00, price_max=7.00),
        LevelPricing(level="B2", price_min=6.00, price_max=8.00),
        LevelPricing(level="C1", price_min=7.00, price_max=9.00),
        LevelPricing(level="C2", price_min=7.00, price_max=9.00),
    ]
    for p in pricing:
        existing = db.query(LevelPricing).filter_by(level=p.level).first()
        if not existing:
            db.add(p)

    # 3. Shto orët
    hours = [
        LevelHours(level="A1", hours_min=30, hours_max=50),
        LevelHours(level="A2", hours_min=30, hours_max=50),
        LevelHours(level="B1", hours_min=30, hours_max=50),
        LevelHours(level="B2", hours_min=30, hours_max=50),
        LevelHours(level="C1", hours_min=30, hours_max=50),
        LevelHours(level="C2", hours_min=30, hours_max=50),
    ]
    for h in hours:
        existing = db.query(LevelHours).filter_by(level=h.level).first()
        if not existing:
            db.add(h)

    db.commit()

    # 4. Shto mësues demo
    teacher_user = User(
        id=uuid.uuid4(),
        full_name="Ali Yilmaz",
        email="ali@nativetalk.com",
        password_hash=bcrypt.hashpw("password123".encode(), bcrypt.gensalt()).decode(),
        role="teacher",
        timezone="Europe/Istanbul",
        is_active=True,
        is_suspended=False
    )
    db.add(teacher_user)
    db.commit()

    teacher = models.teacher.Teacher(
        id=uuid.uuid4(),
        user_id=teacher_user.id,
        language_id=8,  # Turqisht
        is_native=True,
        is_certified=True,
        has_experience=False,
        max_level="B2",
        is_verified=True,
        passed_exam=True,
        bio="Native Turkish speaker with certificate"
    )
    db.add(teacher)
    db.commit()

    # 5. Shto student demo
    student_user = User(
        id=uuid.uuid4(),
        full_name="Maria Rossi",
        email="maria@nativetalk.com",
        password_hash=bcrypt.hashpw("password123".encode(), bcrypt.gensalt()).decode(),
        role="student",
        timezone="Europe/Tirane",
        is_active=True,
        is_suspended=False
    )
    db.add(student_user)
    db.commit()

    student = models.student.Student(
        id=uuid.uuid4(),
        user_id=student_user.id,
        current_level="A1",
        reschedule_count=0
    )
    db.add(student)
    db.commit()

    print("✅ Seed data u shtua me sukses!")
    print(f"   Teacher ID: {teacher.id}")
    print(f"   Student ID: {student.id}")

    db.close()

if __name__ == "__main__":
    seed()