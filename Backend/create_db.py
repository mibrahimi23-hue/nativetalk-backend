import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5432/postgres")
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cur = conn.cursor()
cur.execute("SELECT 1 FROM pg_database WHERE datname='myproject'")
if not cur.fetchone():
    cur.execute("CREATE DATABASE myproject")
    print("Database 'myproject' created.")
else:
    print("Database 'myproject' already exists.")
cur.close()
conn.close()
