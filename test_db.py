from database import engine, SessionLocal
from sqlalchemy import text 

def test_connection():
    try:
        db = SessionLocal()
        result = db.execute(text("SELECT 1"))
        print("Database connected successfully!")
        tables = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """))
        print("\n Tables:")
        for table in tables:
            print(f"   - {table[0]}")
            
        db.close()
    except Exception as e:
        print(f"Connection failed: {e}")

test_connection()