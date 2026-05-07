import psycopg2
conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5432/myproject")
cur = conn.cursor()
cur.execute("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename")
tables = [r[0] for r in cur.fetchall()]
print(f"Tables ({len(tables)}): {', '.join(tables)}")
cur.close(); conn.close()
