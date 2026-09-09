import sqlalchemy
from database import SessionLocal
import models
import auth

def check_user():
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.email == "maintenance@procurement.com").first()
        if user:
            print(f"User found: {user.email}")
            print(f"Hashed password: {user.hashed_password}")
            is_valid = auth.verify_password("Maintenance@123", user.hashed_password)
            print(f"Password 'Maintenance@123' valid: {is_valid}")
        else:
            print("User not found!")
    finally:
        db.close()

if __name__ == "__main__":
    check_user()
