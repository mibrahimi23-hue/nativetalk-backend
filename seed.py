from database import SessionLocal
from models.users import User
from models.teacher import Teacher, AvailabilitySlot
from models.student import Student, StudentLanguage
from models.session import Session as BookingSession, SessionAttendance
from models.payment import CoursePayment, Payment
from models.review import Review
from models.language import Language, LevelPricing, LevelHours
from models.suspension import Suspension
from models.certificate import TeacherCertificate  # ← ADD
from models.material import LessonMaterial          # ← ADD
from models.exam import Exam, ExamQuestion, ExamAttempt, ExamAnswer  # ← ADD if missing
from datetime import time, datetime, timezone, timedelta
import uuid
import bcrypt

db = SessionLocal()


def hash_pw(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def seed():
    languages = [
        Language(id=1,  name="English",    code="en"),
        Language(id=2,  name="Italian",    code="it"),
        Language(id=3,  name="German",     code="de"),
        Language(id=4,  name="French",     code="fr"),
        Language(id=5,  name="Spanish",    code="es"),
        Language(id=6,  name="Bulgarian",  code="bg"),
        Language(id=7,  name="Greek",      code="el"),
        Language(id=8,  name="Turkish",    code="tr"),
        Language(id=9,  name="Korean",     code="ko"),
        Language(id=10, name="Russian",    code="ru"),
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
    print("Languages, pricing, hours seeded!")
    teachers_data = [
        ("Ali Yilmaz",      "ali@nativetalk.com",      "Europe/Istanbul",   8,  True,  True,  True,  "C2", "Native Turkish speaker, 5 years teaching experience."),
        ("Emma Johnson",    "emma@nativetalk.com",     "Europe/London",     1,  True,  True,  True,  "C2", "Native English speaker, Cambridge CELTA certified."),
        ("Marco Rossi",     "marco@nativetalk.com",    "Europe/Rome",       2,  True,  True,  True,  "C2", "Native Italian speaker, university professor."),
        ("Anna Müller",     "anna@nativetalk.com",     "Europe/Berlin",     3,  True,  True,  True,  "C2", "Native German speaker, Goethe Institut examiner."),
        ("Claire Dubois",   "claire@nativetalk.com",   "Europe/Paris",      4,  True,  True,  True,  "C2", "Native French speaker, Alliance Française teacher."),
        ("Carlos García",   "carlos@nativetalk.com",   "Europe/Madrid",     5,  True,  True,  True,  "C2", "Native Spanish speaker, DELE exam preparation specialist."),
        ("Ivan Petrov",     "ivan@nativetalk.com",     "Europe/Sofia",      6,  True,  False, True,  "B2", "Native Bulgarian speaker, experienced online tutor."),
        ("Sofia Papadaki",  "sofia@nativetalk.com",    "Europe/Athens",     7,  True,  True,  False, "B2", "Native Greek speaker, certified but no formal experience."),
        ("Ji-Yeon Park",    "jiyeon@nativetalk.com",   "Asia/Seoul",        9,  True,  True,  True,  "C2", "Native Korean speaker, TOPIK examiner."),
        ("Olga Ivanova",    "olga@nativetalk.com",     "Europe/Moscow",     10, True,  True,  True,  "C2", "Native Russian speaker, Pushkin Institute certified."),
    ]

    teacher_objects = []
    for full_name, email, tz, lang_id, is_native, is_certified, has_exp, max_lvl, bio in teachers_data:
        user = db.query(User).filter_by(email=email).first()
        if not user:
            user = User(
                id=uuid.uuid4(),
                full_name=full_name,
                email=email,
                password_hash=hash_pw("password123"),
                role="teacher",
                timezone=tz,
                is_active=True,
                is_suspended=False
            )
            db.add(user)
            db.commit()

        teacher = db.query(Teacher).filter_by(user_id=user.id).first()
        if not teacher:
            teacher = Teacher(
                id=uuid.uuid4(),
                user_id=user.id,
                language_id=lang_id,
                is_native=is_native,
                is_certified=is_certified,
                has_experience=has_exp,
                max_level=max_lvl,
                is_verified=True,
                passed_exam=True,
                bio=bio
            )
            db.add(teacher)
            db.commit()
        db.query(AvailabilitySlot).filter_by(teacher_id=teacher.id).delete()
        db.commit()
        for day, start, end in [(0, time(9,0),  time(10,0)),
                                 (2, time(14,0), time(15,0)),
                                 (4, time(17,0), time(18,0))]:
            db.add(AvailabilitySlot(
                id=uuid.uuid4(),
                teacher_id=teacher.id,
                day_of_week=day,
                start_time=start,
                end_time=end,
                timezone=tz,
                is_active=True
            ))
        db.commit()
        teacher_objects.append(teacher)

    print(f"{len(teacher_objects)} teachers seeded!")

    students_data = [
        ("Maria Rossi",    "maria@nativetalk.com",   "Europe/Tirane",    "A1"),
        ("Luca Bianchi",   "luca@nativetalk.com",    "Europe/Rome",      "B1"),
        ("Sara Ahmed",     "sara@nativetalk.com",    "Asia/Dubai",       "A2"),
        ("James Wilson",   "james@nativetalk.com",   "America/New_York", "B2"),
        ("Yuki Tanaka",    "yuki@nativetalk.com",    "Asia/Tokyo",       "A1"),
    ]

    student_objects = []
    for full_name, email, tz, level in students_data:
        user = db.query(User).filter_by(email=email).first()
        if not user:
            user = User(
                id=uuid.uuid4(),
                full_name=full_name,
                email=email,
                password_hash=hash_pw("password123"),
                role="student",
                timezone=tz,
                is_active=True,
                is_suspended=False
            )
            db.add(user)
            db.commit()

        student = db.query(Student).filter_by(user_id=user.id).first()
        if not student:
            student = Student(
                id=uuid.uuid4(),
                user_id=user.id,
                current_level=level,
                reschedule_count=0
            )
            db.add(student)
            db.commit()

        student_objects.append((student, user))

    print(f" {len(student_objects)} students seeded!")
    sessions_data = [
        # (student_idx, teacher_idx, level, price_per_hour, total_hours, days_ago)
        (0, 0, "A1", 4.00, 30, 30),   # Maria  → Ali     (Turkish A1)
        (0, 1, "A1", 4.00, 30, 25),   # Maria  → Emma    (English A1)
        (0, 2, "A1", 4.00, 30, 20),   # Maria  → Marco   (Italian A1)
        (0, 3, "A1", 4.00, 30, 15),   # Maria  → Anna    (German A1)

        (1, 1, "B1", 6.00, 35, 28),   # Luca   → Emma    (English B1)
        (1, 4, "B1", 6.00, 35, 22),   # Luca   → Claire  (French B1)
        (1, 5, "B1", 6.00, 35, 18),   # Luca   → Carlos  (Spanish B1)
        (1, 8, "B1", 6.00, 35, 10),   # Luca   → Ji-Yeon (Korean B1)

        (2, 0, "A2", 5.00, 32, 27),   # Sara   → Ali     (Turkish A2)
        (2, 1, "A2", 5.00, 32, 21),   # Sara   → Emma    (English A2)
        (2, 6, "A2", 5.00, 32, 14),   # Sara   → Ivan    (Bulgarian A2)
        (2, 7, "A2", 5.00, 32, 7),    # Sara   → Sofia   (Greek A2)

        (3, 1, "B2", 7.00, 40, 35),   # James  → Emma    (English B2)
        (3, 3, "B2", 7.00, 40, 29),   # James  → Anna    (German B2)
        (3, 4, "B2", 7.00, 40, 23),   # James  → Claire  (French B2)
        (3, 9, "B2", 7.00, 40, 12),   # James  → Olga    (Russian B2)

        (4, 0, "A1", 4.00, 30, 20),   # Yuki   → Ali     (Turkish A1)
        (4, 1, "A1", 4.00, 30, 16),   # Yuki   → Emma    (English A1)
        (4, 8, "A1", 4.00, 30, 10),   # Yuki   → Ji-Yeon (Korean A1)
        (4, 9, "A1", 4.00, 30, 5),    # Yuki   → Olga    (Russian A1)
    ]
    student_comments = [
        "Amazing teacher! Very patient and clear explanations.",
        "Great session, learned a lot of new vocabulary.",
        "Very professional, always on time. Highly recommend!",
        "Excellent pronunciation coaching, really helpful.",
        "Good teacher but sometimes speaks too fast.",
        "Wonderful experience, the conversation practice was great.",
        "Very engaging and fun lessons. I look forward to every session!",
        "Good explanations but could use more exercises.",
        "Fantastic teacher, very encouraging and supportive.",
        "Really enjoyed the cultural insights shared during the lesson.",
    ]

    teacher_comments = [
        "Student is very motivated and learns quickly.",
        "Good progress, needs to work more on pronunciation.",
        "Excellent student, always prepared and engaged.",
        "Student is improving steadily, keep up the good work!",
        "Very attentive, asks great questions.",
        "Student needs to practice more outside of sessions.",
        "Great attitude, makes the teaching enjoyable.",
        "Student shows strong potential, very dedicated.",
        "Good participation, vocabulary is growing well.",
        "Student is consistent and hardworking.",
    ]

    review_count = 0
    session_count = 0

    for i, (s_idx, t_idx, level, price, total_hours, days_ago) in enumerate(sessions_data):
        student, student_user = student_objects[s_idx]
        teacher = teacher_objects[t_idx]

        total_amount   = round(total_hours * price, 2)
        platform_fee   = round(total_amount * 0.10, 2)
        teacher_payout = round(total_amount - platform_fee, 2)
        duration       = 90 if level in ["C1", "C2"] else 60
        scheduled_at   = datetime.now(timezone.utc) - timedelta(days=days_ago)

        cp = CoursePayment(
            id=uuid.uuid4(),
            student_id=student.id,
            teacher_id=teacher.id,
            language_id=teacher.language_id,
            level=level,
            total_hours=total_hours,
            price_per_hour=price,
            total_amount=total_amount,
            amount_paid=total_amount,
            amount_left=0,
            no_refund=False,
            status="completed",
            payment_plan="hour_by_hour",
            installment_1_paid=True,
            installment_2_paid=True
        )
        db.add(cp)
        db.commit()
        db.refresh(cp)

        session = BookingSession(
            id=uuid.uuid4(),
            teacher_id=teacher.id,
            student_id=student.id,
            course_payment_id=cp.id,
            language_id=teacher.language_id,
            level=level,
            scheduled_at=scheduled_at,
            duration_minutes=duration,
            status="completed",
            videocall_url=f"https://meet.nativetalk.com/{uuid.uuid4()}",
            rescheduled=False,
            teacher_review_done=True,
            student_review_done=True,
            payment_released=True
        )
        db.add(session)
        db.commit()
        db.refresh(session)

        payment = Payment(
            id=uuid.uuid4(),
            session_id=session.id,
            course_payment_id=cp.id,
            amount=round(price * (duration / 60), 2),
            platform_fee=round(price * (duration / 60) * 0.10, 2),
            teacher_payout=round(price * (duration / 60) * 0.90, 2),
            both_reviewed=True,
            status="paid",
            paid_at=scheduled_at + timedelta(hours=2)
        )
        db.add(payment)
        db.commit()

        student_rating = [5, 5, 4, 5, 3, 5, 4, 4, 5, 5][i % 10]
        db.add(Review(
            id=uuid.uuid4(),
            session_id=session.id,
            teacher_id=teacher.id,
            student_id=student.id,
            written_by=student_user.id,
            role="student",
            rating=student_rating,
            comment=student_comments[i % 10]
        ))

        teacher_user = db.query(User).filter_by(id=teacher.user_id).first()
        teacher_rating = [5, 4, 5, 4, 5, 3, 5, 4, 5, 4][i % 10]
        db.add(Review(
            id=uuid.uuid4(),
            session_id=session.id,
            teacher_id=teacher.id,
            student_id=student.id,
            written_by=teacher.user_id,
            role="teacher",
            rating=teacher_rating,
            comment=teacher_comments[i % 10]
        ))

        db.commit()
        session_count += 1
        review_count += 2

    print(f" {session_count} sessions seeded!")
    print(f" {review_count} reviews seeded!")

    print("\n" + "="*50)
    print("NativeTalk Seed Summary")
    print("="*50)
    for t in teacher_objects:
        u = db.query(User).filter_by(id=t.user_id).first()
        print(f" Teacher: {u.full_name} | Lang ID: {t.language_id} | Max: {t.max_level} | ID: {t.id}")
    print()
    for s, u in student_objects:
        print(f" Student: {u.full_name} | Level: {s.current_level} | ID: {s.id}")
    print("="*50)
    print(" All seed data added successfully!")

    db.close()


if __name__ == "__main__":
    seed()