from database import SessionLocal
from models.users import User
from models.teacher import AvailabilitySlot
from datetime import time
import models.teacher
import models.student
from models.language import Language, LevelPricing, LevelHours
import uuid
import bcrypt

db = SessionLocal()

def seed():
    languages = [
        Language(id=1, name="English", code="en"),
        Language(id=2, name="Italian", code="it"),
        Language(id=3, name="German", code="de"),
        Language(id=4, name="French", code="fr"),
        Language(id=5, name="Spanish", code="es"),
        Language(id=6, name="Bulgarian", code="bg"),
        Language(id=7, name="Greek", code="el"),
        Language(id=8, name="Turkish", code="tr"),
        Language(id=9, name="Korean", code="ko"),
        Language(id=10, name="Russian", code="ru"),
    ]
    for lang in languages:
        if not db.query(Language).filter_by(id=lang.id).first():
            db.add(lang)

    pricing = [
        LevelPricing(level="A1", price_min=3.00, price_max=5.00),
        LevelPricing(level="A2", price_min=4.00, price_max=6.00),
        LevelPricing(level="B1", price_min=5.00, price_max=7.00),
        LevelPricing(level="B2", price_min=6.00, price_max=8.00),
        LevelPricing(level="C1", price_min=7.00, price_max=9.00),
        LevelPricing(level="C2", price_min=7.00, price_max=9.00),
    ]
    for p in pricing:
        if not db.query(LevelPricing).filter_by(level=p.level).first():
            db.add(p)

    hours = [
        LevelHours(level="A1", hours_min=30, hours_max=50),
        LevelHours(level="A2", hours_min=30, hours_max=50),
        LevelHours(level="B1", hours_min=30, hours_max=50),
        LevelHours(level="B2", hours_min=30, hours_max=50),
        LevelHours(level="C1", hours_min=30, hours_max=50),
        LevelHours(level="C2", hours_min=30, hours_max=50),
    ]
    for h in hours:
        if not db.query(LevelHours).filter_by(level=h.level).first():
            db.add(h)

    db.commit()

    teacher_user = db.query(User).filter_by(email="ali@nativetalk.com").first()

    if not teacher_user:
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

    teacher = db.query(models.teacher.Teacher).filter_by(user_id=teacher_user.id).first()

    if not teacher:
        teacher = models.teacher.Teacher(
            id=uuid.uuid4(),
            user_id=teacher_user.id,
            language_id=8,
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

    db.query(AvailabilitySlot).filter(
        AvailabilitySlot.teacher_id == teacher.id
    ).delete()
    db.commit()

    slots = [
        AvailabilitySlot(
            id=uuid.uuid4(),
            teacher_id=teacher.id,
            day_of_week=0,
            start_time=time(10, 0),
            end_time=time(11, 0),
            timezone="Europe/Istanbul",
            is_active=True
        ),
        AvailabilitySlot(
            id=uuid.uuid4(),
            teacher_id=teacher.id,
            day_of_week=2,
            start_time=time(14, 0),
            end_time=time(15, 0),
            timezone="Europe/Istanbul",
            is_active=True
        ),
        AvailabilitySlot(
            id=uuid.uuid4(),
            teacher_id=teacher.id,
            day_of_week=4,
            start_time=time(16, 0),
            end_time=time(17, 0),
            timezone="Europe/Istanbul",
            is_active=True
        ),
    ]

    for slot in slots:
        db.add(slot)

    db.commit()
    print("Availability slots: 3 slots u shtuan!")

    student_user = db.query(User).filter_by(email="maria@nativetalk.com").first()

    if not student_user:
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

    student = db.query(models.student.Student).filter_by(user_id=student_user.id).first()

    if not student:
        student = models.student.Student(
            id=uuid.uuid4(),
            user_id=student_user.id,
            current_level="A1",
            reschedule_count=0
        )
        db.add(student)
        db.commit()

    print("Seed data u shtua me sukses!")
    print(f"Teacher ID: {teacher.id}")
    print(f"Student ID: {student.id}")

    db.close()


if __name__ == "__main__":
    seed()