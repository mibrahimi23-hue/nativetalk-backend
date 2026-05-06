from database import SessionLocal
from sqlalchemy import text


def test_connection():
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        print("Database connected!")

        tables = db.execute(text("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        """))

        print("\n Tables in database:")
        for table in tables:
            print(f"  {table[0]}")

        counts = {
            "users":            "SELECT COUNT(*) FROM users",
            "teachers":         "SELECT COUNT(*) FROM teachers",
            "students":         "SELECT COUNT(*) FROM students",
            "languages":        "SELECT COUNT(*) FROM languages",
            "level_pricing":    "SELECT COUNT(*) FROM level_pricing",
            "level_hours":      "SELECT COUNT(*) FROM level_hours",
            "availability_slots": "SELECT COUNT(*) FROM availability_slots",
        }

        print("\n Data counts:")
        for name, query in counts.items():
            count = db.execute(text(query)).scalar()
            status = "" if count > 0 else " empty"
            print(f"   {status} {name}: {count}")

        db.close()
        print("\n All tests passed!")

    except Exception as e:
        print(f"Error: {e}")
        db.close()


if __name__ == "__main__":
    test_connection()