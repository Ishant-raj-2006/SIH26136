import sqlalchemy
from database import engine

def alter_enum():
    with engine.connect() as conn:
        try:
            # Postgres requires commit out of a transaction block for ALTER TYPE
            conn.execute(sqlalchemy.text("COMMIT"))
            conn.execute(sqlalchemy.text("ALTER TYPE userrole ADD VALUE 'MINISTRY'"))
            print("Added 'MINISTRY' to userrole enum!")
        except Exception as e:
            print("Error altering enum:", e)

if __name__ == "__main__":
    alter_enum()
