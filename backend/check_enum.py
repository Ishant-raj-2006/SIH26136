import sqlalchemy
from database import engine

def check_enum():
    with engine.connect() as conn:
        try:
            result = conn.execute(sqlalchemy.text("SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE typname = 'userrole';"))
            labels = [row[0] for row in result]
            print("Current userrole enum values:", labels)
        except Exception as e:
            print("Error checking enum:", e)

if __name__ == "__main__":
    check_enum()
