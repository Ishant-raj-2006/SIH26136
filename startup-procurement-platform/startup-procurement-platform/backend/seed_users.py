from dotenv import load_dotenv
load_dotenv()

from database import SessionLocal
import models
import auth

db = SessionLocal()

users = [
    {
        "email": "admin@procurement.com",
        "username": "admin",
        "password": "Admin@123",
        "full_name": "Admin User",
        "role": models.UserRole.DEPARTMENT,
        "organization": "Procurement Dept"
    },
    {
        "email": "startup@procurement.com",
        "username": "startup_user",
        "password": "Startup@123",
        "full_name": "Startup Owner",
        "role": models.UserRole.STARTUP,
        "organization": "TechStart Inc"
    },
    {
        "email": "evaluator@procurement.com",
        "username": "evaluator",
        "password": "Eval@123",
        "full_name": "Evaluator User",
        "role": models.UserRole.EVALUATOR,
        "organization": "Evaluation Board"
    }
]

for u in users:
    existing = db.query(models.User).filter(models.User.email == u["email"]).first()
    if existing:
        print("Already exists: " + u["email"])
        continue

    user = models.User(
        email=u["email"],
        username=u["username"],
        hashed_password=auth.get_password_hash(u["password"]),
        full_name=u["full_name"],
        role=u["role"],
        organization=u["organization"],
        is_verified=True
    )
    db.add(user)
    db.commit()
    print("Created: " + u["email"] + " | role: " + u["role"].value)

db.close()
print("All done! Users are ready.")
