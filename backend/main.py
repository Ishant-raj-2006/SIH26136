from fastapi import FastAPI, Depends, HTTPException, status, Query, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer
from sqlalchemy import func
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import models, schemas, auth, email_service
from database import database_target, get_db, init_db, SessionLocal
from typing import List, Optional
import math
import os
import shutil
import uuid
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Startup Procurement Platform", version="1.0.0")

def seed_default_data():
    """Auto-seed demo users and sample sandbox challenges if not already present"""
    db = SessionLocal()
    try:
        demo_users = [
            {
                "email": "government@procurement.com",
                "username": "government_user",
                "password": "Government@123",
                "full_name": "Government Procurement Officer",
                "role": models.UserRole.DEPARTMENT,
                "organization": "Ministry of Electronics & IT (MeitY)",
            },
            {
                "email": "startup@procurement.com",
                "username": "startup_user",
                "password": "Startup@123",
                "full_name": "Startup Founder",
                "role": models.UserRole.STARTUP,
                "organization": "AeroShield Robotics Pvt Ltd",
            },
            {
                "email": "admin@procurement.com",
                "username": "admin",
                "password": "Admin@123",
                "full_name": "Platform Administrator",
                "role": models.UserRole.ADMIN,
                "organization": "National Procurement Governance",
            },
            {
                "email": "evaluator@procurement.com",
                "username": "evaluator",
                "password": "Eval@123",
                "full_name": "Dr. R. K. Verma",
                "role": models.UserRole.EVALUATOR,
                "organization": "Expert Evaluation Committee",
            },
            {
                "email": "dept@example.com",
                "username": "dept_demo",
                "password": "password123",
                "full_name": "Dept Officer",
                "role": models.UserRole.DEPARTMENT,
                "organization": "Department of Agriculture & Farmers Welfare",
            },
            {
                "email": "startup@example.com",
                "username": "startup_demo",
                "password": "password123",
                "full_name": "Innovator Founder",
                "role": models.UserRole.STARTUP,
                "organization": "KrishiAI Tech Labs Pvt Ltd",
            },
            {
                "email": "eval@example.com",
                "username": "eval_demo",
                "password": "password123",
                "full_name": "Expert Evaluator",
                "role": models.UserRole.EVALUATOR,
                "organization": "ICAR Evaluation Panel",
            },
            {
                "email": "admin@example.com",
                "username": "admin_demo",
                "password": "password123",
                "full_name": "System Admin",
                "role": models.UserRole.ADMIN,
                "organization": "GoPilot-X Operations",
            },
        ]

        for u in demo_users:
            existing = db.query(models.User).filter(models.User.email == u["email"]).first()
            if not existing:
                user = models.User(
                    email=u["email"],
                    username=u["username"],
                    hashed_password=auth.get_password_hash(u["password"]),
                    full_name=u["full_name"],
                    role=u["role"],
                    organization=u["organization"],
                    is_verified=True,
                )
                db.add(user)
                db.commit()
                db.refresh(user)
                target_user = user
                print(f"[SEED] Created demo user: {u['email']}")
            else:
                existing.hashed_password = auth.get_password_hash(u["password"])
                existing.is_verified = True
                db.commit()
                target_user = existing

            if u["role"] == models.UserRole.STARTUP:
                startup = db.query(models.Startup).filter(models.Startup.user_id == target_user.id).first()
                if not startup:
                    new_startup = models.Startup(
                        name=u["organization"],
                        description="DPIIT recognized innovative startup specializing in edge diagnostics and autonomous tech.",
                        user_id=target_user.id,
                        industry="AI & DeepTech",
                        founded_year=2021,
                        team_size=12,
                        funding_stage="seed",
                        technologies=["Computer Vision", "Edge AI", "PyTorch", "Rust"],
                        verification_score=9.2,
                        is_verified=True,
                    )
                    db.add(new_startup)
                    db.commit()

        # Seed sample challenge if challenges table is empty
        challenge_count = db.query(models.Challenge).count()
        if challenge_count == 0:
            dept_user = db.query(models.User).filter(models.User.role == models.UserRole.DEPARTMENT).first()
            if dept_user:
                challenge1 = models.Challenge(
                    title="AI-Powered Crop Disease Diagnostic & Precision Yield Prediction",
                    description="A national public procurement sandbox challenge under GFR Rule 194 to deploy real-time edge diagnostic systems in 12 farm clusters.",
                    problem_statement="Field-level extension officers lack automated diagnostic devices for bacterial leaf blight and rust. Startups are invited to deploy hyperspectral edge models across designated district testbeds.",
                    budget=2500000,
                    status="open",
                    category="AgriTech & AI",
                    tags=["AI/ML", "Computer Vision", "Edge Computing", "AgriStack", "GFR 194"],
                    deadline=datetime.utcnow() + timedelta(days=30),
                    expected_outcome="Autonomous edge app with >92% diagnostic accuracy validated across 5,000 test hectares.",
                    creator_id=dept_user.id,
                )
                challenge2 = models.Challenge(
                    title="Decentralized Water Purity & Heavy Metal IoT Telemetry",
                    description="Real-time multi-parameter water telemetry network for rural drinking supply piped clusters under Jal Jeevan Mission.",
                    problem_statement="District laboratories suffer 5-7 day turnarounds for arsenic, nitrate, and heavy metal testing. Real-time optical or spectroscopic sensing nodes required.",
                    budget=3500000,
                    status="open",
                    category="CleanTech & IoT",
                    tags=["IoT", "Spectroscopy", "Water Quality", "Edge Sensors"],
                    deadline=datetime.utcnow() + timedelta(days=45),
                    expected_outcome="Sub-ppb detection limit with continuous 4G/NB-IoT telemetry to state dashboard.",
                    creator_id=dept_user.id,
                )
                db.add(challenge1)
                db.add(challenge2)
                db.commit()
                print("[SEED] Created initial sample sandbox challenges")
    except Exception as e:
        print(f"[SEED] Notice: {e}")
        db.rollback()
    finally:
        db.close()

@app.on_event("startup")
async def startup_event():
    """Runs on server start — initializes DB and prints status banner"""
    try:
        init_db()
        seed_default_data()
    except RuntimeError as error:
        print(f"[DB] ERROR: {error}")
        raise

    secret_loaded = "YES" if os.getenv("SECRET_KEY") else "NO (using default!)"

    print("")
    print("=" * 60)
    print("  Startup Procurement Platform — Backend Server")
    print("=" * 60)
    print(f"  [DB]     Connected Database: {database_target()}")
    print(f"  [AUTH]   SECRET_KEY loaded from .env: {secret_loaded}")
    print(f"  [DOCS]   API Docs available at: http://localhost:8000/docs")
    print(f"  [HEALTH] Health check at:       http://localhost:8000/api/health")
    print("=" * 60)
    print("  Server is READY to accept requests!")
    print("=" * 60)
    print("")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Upload directory & Static Files
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.get("/")
@app.head("/")
def root():
    """Root endpoint for platform health and metadata"""
    return {
        "status": "ok",
        "platform": "GoPilot-X BHARAT Procurement Engine (SIH26136)",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }

# ==================== AUTHENTICATION ROUTES ====================

@app.post("/api/auth/register", response_model=schemas.UserResponse)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Convert role string to enum value
        role_value = user_data.role
        if isinstance(role_value, str):
            role_value = models.UserRole(role_value)
        
        db_user = models.User(
            email=user_data.email,
            username=user_data.username,
            hashed_password=auth.get_password_hash(user_data.password),
            full_name=user_data.full_name,
            role=role_value,
            organization=user_data.organization,
            is_verified=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        # Auto-create initial startup entity so new startups immediately have an active record
        if role_value == models.UserRole.STARTUP or str(user_data.role).lower() == "startup":
            org_name = user_data.organization or f"{user_data.full_name}'s Startup"
            existing_s = db.query(models.Startup).filter(models.Startup.name == org_name).first()
            if existing_s:
                org_name = f"{org_name} ({db_user.id})"
            new_startup = models.Startup(
                name=org_name,
                description=f"DPIIT-recognized innovative enterprise registered by {user_data.full_name}.",
                user_id=db_user.id,
                industry="AI & DeepTech",
                founded_year=2024,
                team_size=5,
                funding_stage="seed",
                technologies=["AI", "Python", "Cloud"],
                verification_score=8.5,
                is_verified=True
            )
            db.add(new_startup)
            db.commit()

        return db_user
    except Exception as e:
        db.rollback()
        print(f"Registration error: {str(e)}")
        import traceback
@app.post("/api/auth/clerk-sync", response_model=schemas.Token)
def clerk_sync(payload: dict, db: Session = Depends(get_db)):
    """Sync and authenticate user authenticated via Clerk or Google OAuth"""
    email = str(payload.get("email", "")).strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required from Clerk auth payload")
    
    full_name = payload.get("full_name") or email.split("@")[0]
    role_str = str(payload.get("role") or "startup").lower()
    dept = payload.get("department") or "Ministry of Electronics & Information Technology (MeitY)"
    
    user = db.query(models.User).filter(func.lower(models.User.email) == email).first()
    if not user:
        role_enum = models.UserRole.STARTUP
        if "dept" in role_str or "gov" in role_str:
            role_enum = models.UserRole.DEPARTMENT
        elif "eval" in role_str:
            role_enum = models.UserRole.EVALUATOR
        elif "admin" in role_str:
            role_enum = models.UserRole.ADMIN
            
        user = models.User(
            email=email,
            username=email.split("@")[0] + "_" + str(uuid.uuid4())[:4],
            hashed_password=auth.get_password_hash("ClerkAuth@123"),
            full_name=full_name,
            role=role_enum,
            organization=dept,
            is_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Create Startup record if startup
        if role_enum == models.UserRole.STARTUP:
            new_startup = models.Startup(
                name=f"{full_name}'s Enterprise",
                description=f"DPIIT-recognized enterprise connected to {dept}.",
                user_id=user.id,
                industry="AI & DeepTech",
                official_email=email,
                is_verified=True
            )
            db.add(new_startup)
            db.commit()
            
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "id": user.id, "role": user.role},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """Login user and return access token"""
    clean_email = credentials.email.strip().lower()
    user = db.query(models.User).filter(
        func.lower(models.User.email) == clean_email
    ).first()
    
    password_valid = False
    if user:
        password_valid = auth.verify_password(credentials.password, user.hashed_password)
        # Forgiving demo login: handle uppercase/lowercase and password123 aliases
        if not password_valid and clean_email in [
            "government@procurement.com", "startup@procurement.com", "admin@procurement.com",
            "evaluator@procurement.com", "dept@example.com", "startup@example.com",
            "eval@example.com", "admin@example.com"
        ]:
            known_passwords = [
                "Government@123", "government@123", "Startup@123", "startup@123",
                "Admin@123", "admin@123", "Eval@123", "eval@123", "password123", "Password123"
            ]
            if credentials.password.strip() in known_passwords:
                password_valid = True
                user.hashed_password = auth.get_password_hash(credentials.password.strip())
                db.commit()

    if not user or not password_valid:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "id": user.id, "role": user.role},
        expires_delta=access_token_expires
    )
    
    # Create welcome notification
    notification = models.Notification(
        user_id=user.id,
        title="Welcome back!",
        message=f"Welcome to Startup Procurement Platform, {user.full_name}!",
        type="welcome"
    )
    db.add(notification)
    db.commit()
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_current_user(email: str = Depends(auth.verify_token), db: Session = Depends(get_db)):
    """Get current authenticated user"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ==================== OTP & PASSWORD RESET ROUTES ====================

@app.post("/api/auth/send-otp", response_model=dict)
def send_otp(req: schemas.SendOTPRequest, db: Session = Depends(get_db)):
    """Generate and send email OTP code for Registration or Password Reset"""
    clean_email = req.email.strip().lower()
    
    if req.purpose == "password_reset":
        user = db.query(models.User).filter(func.lower(models.User.email) == clean_email).first()
        if not user:
            raise HTTPException(status_code=404, detail="Account with this email does not exist")
    elif req.purpose == "registration":
        existing = db.query(models.User).filter(func.lower(models.User.email) == clean_email).first()
        if existing:
            raise HTTPException(status_code=400, detail="This email is already registered. Please Sign In or use a new email address.")
            
    code = email_service.generate_otp_code()
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    otp_record = models.OTPRecord(
        email=clean_email,
        otp_code=code,
        purpose=req.purpose,
        expires_at=expires_at,
        is_used=False
    )
    db.add(otp_record)
    db.commit()
    
    sent = email_service.send_otp_email(clean_email, code, req.purpose)
    
    return {
        "message": f"OTP sent to {clean_email} successfully",
        "email": clean_email,
        "purpose": req.purpose,
        "dev_otp": code
    }

@app.post("/api/auth/verify-otp", response_model=dict)
def verify_otp(req: schemas.VerifyOTPRequest, db: Session = Depends(get_db)):
    """Verify an OTP code"""
    clean_email = req.email.strip().lower()
    clean_code = req.otp_code.strip()
    
    record = db.query(models.OTPRecord).filter(
        func.lower(models.OTPRecord.email) == clean_email,
        models.OTPRecord.otp_code == clean_code,
        models.OTPRecord.purpose == req.purpose,
        models.OTPRecord.is_used == False,
        models.OTPRecord.expires_at > datetime.utcnow()
    ).order_by(models.OTPRecord.id.desc()).first()
    
    if not record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP code. Please request a new OTP.")
        
    record.is_used = True
    db.commit()
    
    return {"message": "OTP verified successfully", "email": clean_email, "valid": True}

@app.post("/api/auth/reset-password", response_model=dict)
def reset_password(req: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset user password using verified OTP"""
    clean_email = req.email.strip().lower()
    clean_code = req.otp_code.strip()
    
    record = db.query(models.OTPRecord).filter(
        func.lower(models.OTPRecord.email) == clean_email,
        models.OTPRecord.otp_code == clean_code,
        models.OTPRecord.purpose == "password_reset",
        models.OTPRecord.expires_at > datetime.utcnow()
    ).order_by(models.OTPRecord.id.desc()).first()
    
    if not record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP code for password reset")
        
    user = db.query(models.User).filter(func.lower(models.User.email) == clean_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found")
        
    user.hashed_password = auth.get_password_hash(req.new_password)
    record.is_used = True
    db.commit()
    
    print(f"[AUTH] Password updated for user: {clean_email}")
    return {"message": "Password updated successfully in database! You may now sign in."}

# ==================== STARTUP ROUTES ====================

@app.post("/api/startups", response_model=schemas.StartupResponse)
def create_startup(startup_data: schemas.StartupCreate, 
                   email: str = Depends(auth.verify_token), 
                   db: Session = Depends(get_db)):
    """Create or update a startup profile"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or user.role != "startup":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check if this user already has a startup profile (update mode)
    existing_user_startup = db.query(models.Startup).filter(models.Startup.user_id == user.id).first()
    if existing_user_startup:
        for field, value in startup_data.model_dump(exclude_unset=True).items():
            setattr(existing_user_startup, field, value)
        db.commit()
        db.refresh(existing_user_startup)
        return existing_user_startup

    existing = db.query(models.Startup).filter(models.Startup.name == startup_data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Startup name already exists")
    
    db_startup = models.Startup(**startup_data.model_dump(), user_id=user.id)
    db.add(db_startup)
    db.commit()
    db.refresh(db_startup)
    return db_startup

@app.get("/api/startups/me", response_model=schemas.StartupResponse)
def get_my_startup(email: str = Depends(auth.verify_token), db: Session = Depends(get_db)):
    """Get the authenticated user's startup profile"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    startup = db.query(models.Startup).filter(models.Startup.user_id == user.id).first()
    if not startup:
        org_name = user.organization or f"{user.full_name}'s Startup"
        startup = models.Startup(
            name=org_name,
            description=f"DPIIT-recognized innovative enterprise registered by {user.full_name}.",
            user_id=user.id,
            industry="AI & DeepTech",
            founded_year=2024,
            team_size=5,
            funding_stage="seed",
            technologies=["AI", "Python", "Cloud"],
            verification_score=8.5,
            is_verified=True
        )
        db.add(startup)
        db.commit()
        db.refresh(startup)
    return startup

@app.get("/api/startups/{startup_id}", response_model=schemas.StartupResponse)
def get_startup(startup_id: int, db: Session = Depends(get_db)):
    """Get startup details"""
    startup = db.query(models.Startup).filter(models.Startup.id == startup_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    return startup

@app.get("/api/startups", response_model=dict)
def list_startups(skip: int = Query(0), limit: int = Query(10), 
                  search: Optional[str] = None, db: Session = Depends(get_db)):
    """List all startups with pagination and search"""
    query = db.query(models.Startup)
    
    if search:
        query = query.filter(
            (models.Startup.name.ilike(f"%{search}%")) |
            (models.Startup.description.ilike(f"%{search}%")) |
            (models.Startup.industry.ilike(f"%{search}%"))
        )
    
    total = query.count()
    startups = query.offset(skip).limit(limit).all()
    serialized = [schemas.StartupResponse.model_validate(s).model_dump() for s in startups]
    
    return {
        "data": serialized,
        "total": total,
        "skip": skip,
        "limit": limit,
        "pages": math.ceil(total / limit) if limit > 0 else 1
    }

@app.put("/api/startups/{startup_id}", response_model=schemas.StartupResponse)
def update_startup(startup_id: int, startup_data: schemas.StartupUpdate,
                   email: str = Depends(auth.verify_token),
                   db: Session = Depends(get_db)):
    """Update startup profile"""
    user = db.query(models.User).filter(models.User.email == email).first()
    startup = db.query(models.Startup).filter(models.Startup.id == startup_id).first()
    
    if not startup or startup.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = startup_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(startup, field, value)
    
    db.commit()
    db.refresh(startup)
    return startup

# ==================== COMPANY REGISTRATION & UPLOAD ROUTES ====================

@app.post("/api/upload/file")
async def upload_file(
    file: UploadFile = File(...),
    file_type: str = Form("certificate")  # "logo", "certificate", or "document"
):
    """
    Upload image or certificate file (PNG, max 2MB for logo, max 10MB for certificate).
    Saves to local database/uploads folder and returns file URL.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected for upload")
    
    filename_lower = file.filename.lower()
    ext = os.path.splitext(filename_lower)[1]
    
    # Format check: PNG enforced for logo and incorporation certificate
    if file_type in ["logo", "certificate"] and ext != ".png":
        raise HTTPException(status_code=400, detail=f"File must be in PNG format. Received: {ext}")
    
    # Read file content to check size
    contents = await file.read()
    file_size = len(contents)
    
    max_logo_bytes = 2 * 1024 * 1024       # 2 MB max for logo
    max_cert_bytes = 10 * 1024 * 1024      # 10 MB max for incorporation certificate
    
    if file_type == "logo" and file_size > max_logo_bytes:
        raise HTTPException(status_code=400, detail="Logo file size exceeds 2 MB limit.")
    elif file_size > max_cert_bytes:
        raise HTTPException(status_code=400, detail="Certificate file size exceeds 10 MB limit.")
    
    # Save file with unique name
    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as f:
        f.write(contents)
        
    url = f"/uploads/{unique_filename}"
    return {
        "url": url,
        "filename": unique_filename,
        "size_mb": round(file_size / (1024 * 1024), 2),
        "message": "File uploaded successfully"
    }

@app.post("/api/company/register", response_model=schemas.StartupResponse)
def register_company(
    reg_data: schemas.CompanyRegistrationCreate,
    email: str = Depends(auth.verify_token),
    db: Session = Depends(get_db)
):
    """
    3-Step Company Registration Endpoint.
    Saves registration details with status='pending' requiring Government approval.
    """
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found")
        
    startup = db.query(models.Startup).filter(models.Startup.user_id == user.id).first()
    
    if not startup:
        startup = models.Startup(
            name=reg_data.name,
            user_id=user.id,
            description=reg_data.work_description or f"Registered company entity: {reg_data.name}",
            industry="AI & DeepTech",
            founded_year=reg_data.founded_year,
            team_size=5,
            funding_stage="seed",
            technologies=["AI", "GovTech"],
            status="pending"
        )
        db.add(startup)
        db.commit()
        db.refresh(startup)
        
    # Update startup with full 3-step registration fields
    startup.name = reg_data.name
    startup.logo_url = reg_data.logo_url
    startup.company_type = reg_data.company_type
    startup.company_type_other = reg_data.company_type_other
    startup.founded_year = reg_data.founded_year
    startup.headquarters_city = reg_data.headquarters_city
    startup.state = reg_data.state
    startup.website = reg_data.website
    startup.official_email = reg_data.official_email
    startup.contact_number = reg_data.contact_number
    
    startup.founder_ceo_name = reg_data.founder_ceo_name
    startup.auth_rep_name = reg_data.auth_rep_name
    startup.auth_rep_designation = reg_data.auth_rep_designation
    startup.pan_number = reg_data.pan_number
    startup.aadhaar_number = reg_data.aadhaar_number
    startup.work_description = reg_data.work_description
    startup.linkedin_url = reg_data.linkedin_url
    
    startup.cin_number = reg_data.cin_number
    startup.dpiit_number = reg_data.dpiit_number
    startup.gst_number = reg_data.gst_number
    startup.udyam_number = reg_data.udyam_number
    startup.incorporation_cert_url = reg_data.incorporation_cert_url
    startup.relevant_doc_url = reg_data.relevant_doc_url
    startup.status = "pending"  # Always set status to pending upon submission
    startup.is_verified = False
    
    user.organization = reg_data.name
    db.commit()
    db.refresh(startup)
    
    # Send notification
    notification = models.Notification(
        user_id=user.id,
        title="Company Registration Submitted",
        message=f"Registration application for '{reg_data.name}' has been submitted and is currently pending government approval.",
        type="company_registration"
    )
    db.add(notification)
    db.commit()
    
    return startup

@app.put("/api/startups/{startup_id}/status", response_model=schemas.StartupResponse)
def update_startup_status(
    startup_id: int,
    status_str: str = Query(..., description="Target status: pending, approved, rejected"),
    email: str = Depends(auth.verify_token),
    db: Session = Depends(get_db)
):
    """
    Government/Admin API to approve or reject pending company registration applications.
    """
    user = db.query(models.User).filter(models.User.email == email).first()
    startup = db.query(models.Startup).filter(models.Startup.id == startup_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup profile not found")
        
    valid_statuses = ["pending", "approved", "rejected"]
    if status_str not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")
        
    startup.status = status_str
    if status_str == "approved":
        startup.is_verified = True
        
    db.commit()
    db.refresh(startup)
    
    # Notify startup user
    notification = models.Notification(
        user_id=startup.user_id,
        title=f"Company Registration {status_str.capitalize()}",
        message=f"Your company registration status for '{startup.name}' is now {status_str.upper()}.",
        type="registration_status"
    )
    db.add(notification)
    db.commit()
    
    return startup

# ==================== CHALLENGE ROUTES ====================

@app.post("/api/challenges", response_model=schemas.ChallengeResponse)
def create_challenge(challenge_data: schemas.ChallengeCreate,
                     email: str = Depends(auth.verify_token),
                     db: Session = Depends(get_db)):
    """Create a new challenge for Department / Ministry"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or user.role not in [models.UserRole.DEPARTMENT, models.UserRole.ADMIN, "department", "admin"]:
        raise HTTPException(status_code=403, detail="Only department officers or admins can post challenges")
    
    # Unique Problem ID check
    p_code = challenge_data.problem_code
    if p_code and p_code.strip():
        p_code = p_code.strip().upper()
        existing = db.query(models.Challenge).filter(models.Challenge.problem_code == p_code).first()
        if existing:
            raise HTTPException(status_code=400, detail=f"Problem ID '{p_code}' already exists! Problem ID must be unique.")
    else:
        # Auto-generate unique Problem ID
        import random
        p_code = f"PRB-SIH26136-{random.randint(100, 999)}"
        while db.query(models.Challenge).filter(models.Challenge.problem_code == p_code).first():
            p_code = f"PRB-SIH26136-{random.randint(100, 999)}"

    c_dict = challenge_data.model_dump()
    c_dict["problem_code"] = p_code
    if not c_dict.get("department_or_ministry"):
        c_dict["department_or_ministry"] = user.organization or "Ministry of Electronics & IT"
    if not c_dict.get("contact_person_name"):
        c_dict["contact_person_name"] = user.full_name or "Department Officer"
    if not c_dict.get("contact_email"):
        c_dict["contact_email"] = user.email

    db_challenge = models.Challenge(**c_dict, creator_id=user.id)
    db.add(db_challenge)
    db.commit()
    db.refresh(db_challenge)
    return db_challenge

@app.get("/api/challenges/my", response_model=dict)
def get_my_challenges(email: str = Depends(auth.verify_token), db: Session = Depends(get_db)):
    """Get all challenges created by the logged-in officer/department"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    challenges = db.query(models.Challenge).filter(models.Challenge.creator_id == user.id).order_by(models.Challenge.id.desc()).all()
    serialized = [schemas.ChallengeResponse.model_validate(c).model_dump() for c in challenges]
    return {"data": serialized, "total": len(serialized)}

@app.get("/api/challenges/{challenge_id}", response_model=schemas.ChallengeResponse)
def get_challenge(challenge_id: int, db: Session = Depends(get_db)):
    """Get challenge details"""
    challenge = db.query(models.Challenge).filter(models.Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return challenge

@app.get("/api/challenges", response_model=dict)
def list_challenges(skip: int = Query(0), limit: int = Query(10),
                   status: Optional[str] = None,
                   category: Optional[str] = None,
                   creator_id: Optional[int] = None,
                   db: Session = Depends(get_db)):
    """List challenges with filters"""
    query = db.query(models.Challenge)
    
    if status and status.strip():
        query = query.filter(models.Challenge.status.ilike(f"%{status.strip()}%"))
    if category and category.strip():
        query = query.filter(models.Challenge.category.ilike(f"%{category.strip()}%"))
    if creator_id is not None:
        query = query.filter(models.Challenge.creator_id == creator_id)
    
    total = query.count()
    challenges = query.order_by(models.Challenge.id.desc()).offset(skip).limit(limit).all()
    serialized = [schemas.ChallengeResponse.model_validate(c).model_dump() for c in challenges]
    
    return {
        "data": serialized,
        "total": total,
        "skip": skip,
        "limit": limit,
        "pages": math.ceil(total / limit) if limit > 0 else 1
    }

@app.put("/api/challenges/{challenge_id}", response_model=schemas.ChallengeResponse)
def update_challenge(challenge_id: int, challenge_data: schemas.ChallengeUpdate,
                     email: str = Depends(auth.verify_token),
                     db: Session = Depends(get_db)):
    """Update challenge specifications"""
    user = db.query(models.User).filter(models.User.email == email).first()
    challenge = db.query(models.Challenge).filter(models.Challenge.id == challenge_id).first()
    
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
        
    is_admin = user and (user.role == models.UserRole.ADMIN or user.role == "admin")
    is_dept = user and (user.role == models.UserRole.DEPARTMENT or user.role == "department")
    is_creator = user and challenge.creator_id == user.id

    if not (is_creator or is_dept or is_admin):
        raise HTTPException(status_code=403, detail="Not authorized to edit this challenge")
    
    update_data = challenge_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(challenge, field, value)
    
    db.commit()
    db.refresh(challenge)
    return challenge

@app.delete("/api/challenges/{challenge_id}", response_model=dict)
def delete_challenge(challenge_id: int,
                     email: str = Depends(auth.verify_token),
                     db: Session = Depends(get_db)):
    """Delete a challenge (department/admin or creator)"""
    user = db.query(models.User).filter(models.User.email == email).first()
    challenge = db.query(models.Challenge).filter(models.Challenge.id == challenge_id).first()
    
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
        
    is_admin = user and (user.role == models.UserRole.ADMIN or user.role == "admin")
    is_creator = user and challenge.creator_id == user.id

    if not (is_creator or is_admin):
        raise HTTPException(status_code=403, detail="Not authorized to delete this challenge")
        
    db.delete(challenge)
    db.commit()
    return {"message": f"Challenge {challenge_id} deleted successfully", "id": challenge_id}

# ==================== PROPOSAL ROUTES ====================

@app.post("/api/proposals", response_model=schemas.ProposalResponse)
def create_proposal(proposal_data: schemas.ProposalCreate,
                    email: str = Depends(auth.verify_token),
                    db: Session = Depends(get_db)):
    """Submit proposal for a challenge"""
    user = db.query(models.User).filter(models.User.email == email).first()
    startup = db.query(models.Startup).filter(models.Startup.user_id == user.id).first()
    
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    
    if not (startup.cin_number and startup.incorporation_cert_url) and startup.status == "pending":
        raise HTTPException(
            status_code=403,
            detail="Your company registration is incomplete. Please complete company registration first."
        )
    
    challenge = db.query(models.Challenge).filter(
        models.Challenge.id == proposal_data.challenge_id
    ).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    db_proposal = models.Proposal(**proposal_data.model_dump(), startup_id=startup.id)
    db.add(db_proposal)
    db.commit()
    db.refresh(db_proposal)
    
    # Create notification for challenge creator
    notification = models.Notification(
        user_id=challenge.creator_id,
        title="New Proposal Received",
        message=f"{startup.name} submitted a proposal for '{challenge.title}'",
        type="proposal",
        related_id=db_proposal.id
    )
    db.add(notification)
    db.commit()
    
    return db_proposal

@app.get("/api/proposals/{proposal_id}", response_model=schemas.ProposalResponse)
def get_proposal(proposal_id: int, db: Session = Depends(get_db)):
    """Get proposal details"""
    proposal = db.query(models.Proposal).filter(models.Proposal.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return proposal

@app.get("/api/challenges/{challenge_id}/proposals", response_model=dict)
def get_challenge_proposals(challenge_id: int, skip: int = Query(0), 
                           limit: int = Query(10), db: Session = Depends(get_db)):
    """Get all proposals for a challenge"""
    query = db.query(models.Proposal).filter(models.Proposal.challenge_id == challenge_id)
    total = query.count()
    proposals = query.offset(skip).limit(limit).all()
    
    return {
        "data": proposals,
        "total": total,
        "skip": skip,
        "limit": limit,
        "pages": math.ceil(total / limit) if limit > 0 else 1
    }

@app.get("/api/proposals/{proposal_id}/messages", response_model=List[schemas.MessageResponse])
def get_proposal_messages(proposal_id: int, email: str = Depends(auth.verify_token), db: Session = Depends(get_db)):
    """Get all messages for a specific proposal"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
        
    proposal = db.query(models.Proposal).filter(models.Proposal.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
        
    messages = db.query(models.Message).filter(models.Message.proposal_id == proposal_id).order_by(models.Message.created_at.asc()).all()
    return messages

@app.post("/api/proposals/{proposal_id}/messages", response_model=schemas.MessageResponse)
def create_proposal_message(proposal_id: int, message_data: schemas.MessageCreate, email: str = Depends(auth.verify_token), db: Session = Depends(get_db)):
    """Send a message for a specific proposal"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
        
    proposal = db.query(models.Proposal).filter(models.Proposal.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
        
    message = models.Message(
        proposal_id=proposal_id,
        sender_id=user.id,
        content=message_data.content
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    
    # Notify the other party (if sender is startup, notify creator, else notify startup)
    target_user_id = None
    if user.role == "startup":
        challenge = db.query(models.Challenge).filter(models.Challenge.id == proposal.challenge_id).first()
        if challenge:
            target_user_id = challenge.creator_id
    else:
        startup = db.query(models.Startup).filter(models.Startup.id == proposal.startup_id).first()
        if startup:
            target_user_id = startup.user_id
            
    if target_user_id and target_user_id != user.id:
        notification = models.Notification(
            user_id=target_user_id,
            title="New Message",
            message=f"New message received on proposal '{proposal.title}'",
            type="message",
            related_id=proposal.id
        )
        db.add(notification)
        db.commit()
        
    return message

# ==================== EVALUATION ROUTES ====================

@app.post("/api/evaluations", response_model=schemas.EvaluationResponse)
def create_evaluation(evaluation_data: schemas.EvaluationCreate,
                      email: str = Depends(auth.verify_token),
                      db: Session = Depends(get_db)):
    """Submit evaluation for a proposal"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or user.role != "evaluator":
        raise HTTPException(status_code=403, detail="Only evaluators can submit evaluations")
    
    proposal = db.query(models.Proposal).filter(
        models.Proposal.id == evaluation_data.proposal_id
    ).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    overall_score = (
        evaluation_data.technical_score +
        evaluation_data.feasibility_score +
        evaluation_data.innovation_score +
        evaluation_data.cost_score
    ) / 4
    
    db_evaluation = models.Evaluation(
        **evaluation_data.model_dump(),
        evaluator_id=user.id,
        overall_score=overall_score
    )
    
    # Update proposal evaluation score
    proposal.evaluation_score = overall_score
    
    db.add(db_evaluation)
    db.commit()
    db.refresh(db_evaluation)
    
    return db_evaluation

@app.get("/api/proposals/{proposal_id}/evaluations", response_model=List[schemas.EvaluationResponse])
def get_proposal_evaluations(proposal_id: int, db: Session = Depends(get_db)):
    """Get all evaluations for a proposal"""
    evaluations = db.query(models.Evaluation).filter(
        models.Evaluation.proposal_id == proposal_id
    ).all()
    return evaluations

# ==================== PILOT ROUTES ====================

@app.post("/api/pilots", response_model=schemas.PilotResponse)
def create_pilot(pilot_data: schemas.PilotCreate,
                 email: str = Depends(auth.verify_token),
                 db: Session = Depends(get_db)):
    """Create a pilot for selected proposal"""
    user = db.query(models.User).filter(models.User.email == email).first()
    challenge = db.query(models.Challenge).filter(
        models.Challenge.id == pilot_data.challenge_id
    ).first()
    
    if not challenge or challenge.creator_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_pilot = models.Pilot(**pilot_data.model_dump())
    db.add(db_pilot)
    db.commit()
    db.refresh(db_pilot)
    
    # Create notification for startup
    startup = db.query(models.Startup).filter(models.Startup.id == pilot_data.startup_id).first()
    notification = models.Notification(
        user_id=startup.user_id,
        title="Pilot Selected",
        message=f"Your startup was selected for pilot on '{challenge.title}'",
        type="pilot",
        related_id=db_pilot.id
    )
    db.add(notification)
    db.commit()
    
    return db_pilot

@app.get("/api/pilots/{pilot_id}", response_model=schemas.PilotResponse)
def get_pilot(pilot_id: int, db: Session = Depends(get_db)):
    """Get pilot details"""
    pilot = db.query(models.Pilot).filter(models.Pilot.id == pilot_id).first()
    if not pilot:
        raise HTTPException(status_code=404, detail="Pilot not found")
    return pilot

@app.get("/api/pilots", response_model=dict)
def list_pilots(email: str = Depends(auth.verify_token), 
                skip: int = Query(0), limit: int = Query(10),
                db: Session = Depends(get_db)):
    """Get pilots for authenticated user"""
    user = db.query(models.User).filter(models.User.email == email).first()
    
    if user.role == "startup":
        startup = db.query(models.Startup).filter(models.Startup.user_id == user.id).first()
        if not startup:
            return {
                "data": [],
                "total": 0,
                "skip": skip,
                "limit": limit,
                "pages": 0
            }
        query = db.query(models.Pilot).filter(models.Pilot.startup_id == startup.id)
    else:
        query = db.query(models.Pilot).filter(models.Pilot.assigned_to_id == user.id)
    
    total = query.count()
    pilots = query.offset(skip).limit(limit).all()
    
    return {
        "data": pilots,
        "total": total,
        "skip": skip,
        "limit": limit,
        "pages": math.ceil(total / limit) if limit > 0 else 1
    }

# ==================== MILESTONE ROUTES ====================

@app.post("/api/milestones", response_model=schemas.MilestoneResponse)
def create_milestone(milestone_data: schemas.MilestoneCreate,
                     email: str = Depends(auth.verify_token),
                     db: Session = Depends(get_db)):
    """Create milestone for a pilot"""
    db_milestone = models.Milestone(**milestone_data.model_dump())
    db.add(db_milestone)
    db.commit()
    db.refresh(db_milestone)
    return db_milestone

@app.get("/api/pilots/{pilot_id}/milestones", response_model=List[schemas.MilestoneResponse])
def get_pilot_milestones(pilot_id: int, db: Session = Depends(get_db)):
    """Get milestones for a pilot"""
    milestones = db.query(models.Milestone).filter(
        models.Milestone.pilot_id == pilot_id
    ).all()
    return milestones

# ==================== NOTIFICATION ROUTES ====================

@app.get("/api/notifications", response_model=schemas.NotificationListResponse)
def get_notifications(email: str = Depends(auth.verify_token),
                      skip: int = Query(0), limit: int = Query(10),
                      db: Session = Depends(get_db)):
    """Get notifications for current user"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    query = db.query(models.Notification).filter(
        models.Notification.user_id == user.id
    ).order_by(models.Notification.created_at.desc())
    
    total = query.count()
    notifications = query.offset(skip).limit(limit).all()
    
    return {
        "data": notifications,
        "total": total,
        "skip": skip,
        "limit": limit,
        "unread": db.query(models.Notification).filter(
            models.Notification.user_id == user.id,
            models.Notification.is_read == False
        ).count()
    }

@app.put("/api/notifications/{notification_id}")
def mark_notification_read(notification_id: int,
                           email: str = Depends(auth.verify_token),
                           db: Session = Depends(get_db)):
    """Mark notification as read"""
    notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == db.query(models.User.id).filter(
            models.User.email == email
        ).scalar_subquery()
    ).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    db.commit()
    return {"message": "Notification marked as read"}

# ==================== ANALYTICS & STATS ====================

@app.get("/api/stats/dashboard")
def get_dashboard_stats(email: str = Depends(auth.verify_token), 
                       db: Session = Depends(get_db)):
    """Get dashboard statistics for current user"""
    user = db.query(models.User).filter(models.User.email == email).first()
    
    if user.role == "department":
        challenges_count = db.query(models.Challenge).filter(
            models.Challenge.creator_id == user.id
        ).count()
        proposals_count = db.query(models.Proposal).join(
            models.Challenge
        ).filter(models.Challenge.creator_id == user.id).count()
        pilots_count = db.query(models.Pilot).join(
            models.Challenge
        ).filter(models.Challenge.creator_id == user.id).count()
        
        return {
            "challenges": challenges_count,
            "proposals": proposals_count,
            "pilots": pilots_count,
            "total_budget": db.query(models.Challenge).filter(
                models.Challenge.creator_id == user.id
            ).count() * 0  # Calculate actual
        }
    
    elif user.role == "startup":
        startup = db.query(models.Startup).filter(models.Startup.user_id == user.id).first()
        if not startup:
            return {
                "proposals": 0,
                "pilots": 0,
                "verification_score": 0.0,
                "is_verified": False
            }
        proposals_count = db.query(models.Proposal).filter(
            models.Proposal.startup_id == startup.id
        ).count()
        pilots_count = db.query(models.Pilot).filter(
            models.Pilot.startup_id == startup.id
        ).count()
        
        return {
            "proposals": proposals_count,
            "pilots": pilots_count,
            "verification_score": startup.verification_score or 0.0,
            "is_verified": startup.is_verified or False
        }
    
    return {"message": "No data available"}

# ==================== HEALTH CHECK ====================

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "Startup Procurement Platform API is running"}

if __name__ == "__main__":
    import os
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
