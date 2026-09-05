from dotenv import load_dotenv
load_dotenv()

from database import SessionLocal, init_db
import models
import auth

db = SessionLocal()

init_db()

users = [
    {
        "email": "admin@procurement.com",
        "username": "admin",
        "password": "Admin@123",
        "full_name": "Admin User",
        "role": models.UserRole.ADMIN,
        "organization": "Platform Administration"
    },
    {
        "email": "government@procurement.com",
        "username": "government_user",
        "password": "Government@123",
        "full_name": "Government Officer",
        "role": models.UserRole.DEPARTMENT,
        "organization": "Government Procurement Department"
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
    },
    {
        "email": "maintenance@procurement.com",
        "username": "maintenance_user",
        "password": "Maintenance@123",
        "full_name": "Maintenance Manager",
        "role": models.UserRole.MAINTENANCE,
        "organization": "Platform Operations"
    }
]

for u in users:
    existing = db.query(models.User).filter(models.User.email == u["email"]).first()
    if existing:
        existing.username = u["username"]
        existing.full_name = u["full_name"]
        existing.hashed_password = auth.get_password_hash(u["password"])
        existing.role = u["role"]
        existing.organization = u["organization"]
        existing.is_verified = True
        db.commit()
        print("Updated: " + u["email"] + " | role: " + u["role"].value)
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
