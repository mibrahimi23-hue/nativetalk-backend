"""
Declarative base shared by all ORM models.

Import order here controls Alembic's autogenerate — all models MUST be imported
so their metadata is registered before `Base.metadata` is accessed.
"""
from app.db.base_class import Base  # noqa: F401 — re-exported for Alembic


# ── Model imports (required for Alembic autogenerate) ─────────────────────────
# Keep this list in sync when adding new model files.
from app.models.user import User, RefreshToken, BlacklistedToken  # noqa: F401, E402
from app.models.language import Language, LevelPricing, LevelHours  # noqa: F401, E402
from app.models.tutor import Teacher, TeacherVerification, AvailabilitySlot  # noqa: F401, E402
from app.models.student import Student, StudentLanguage  # noqa: F401, E402
from app.models.session import Session, RescheduleRequest, SessionAttendance  # noqa: F401, E402
from app.models.payment import CoursePayment, Payment, PayPalTransaction  # noqa: F401, E402
from app.models.review import Review, ReviewFlag  # noqa: F401, E402
from app.models.suspension import Suspension, TeacherNoshow  # noqa: F401, E402
from app.models.exam import Exam, ExamQuestion, ExamAttempt, ExamAnswer  # noqa: F401, E402
from app.models.certificate import TeacherCertificate  # noqa: F401, E402
from app.models.material import LessonMaterial  # noqa: F401, E402
from app.models.message import Message  # noqa: F401, E402
