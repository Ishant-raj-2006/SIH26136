from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from datetime import timedelta
import models, schemas, auth
from database import database_target, get_db, init_db
from typing import List, Optional
import math
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Startup Procurement Platform", version="1.0.0")

@app.on_event("startup")
async def startup_event():
    """Runs on server start — initializes DB and prints status banner"""
    try:
        init_db()
    except RuntimeError as error:
        print(f"[DB] ERROR: {error}")
        raise

    secret_loaded = "YES" if os.getenv("SECRET_KEY") else "NO (using default!)"

    print("")
    print("=" * 60)
    print("  Startup Procurement Platform — Backend Server")
    print("=" * 60)
    print(f"  [DB]     Connected to Neon PostgreSQL: {database_target()}")
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
        return db_user
    except Exception as e:
        db.rollback()
        print(f"Registration error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/api/auth/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """Login user and return access token"""
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not auth.verify_password(credentials.password, user.hashed_password):
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

# ==================== STARTUP ROUTES ====================

@app.post("/api/startups", response_model=schemas.StartupResponse)
def create_startup(startup_data: schemas.StartupCreate, 
                   email: str = Depends(auth.verify_token), 
                   db: Session = Depends(get_db)):
    """Create a new startup profile"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or user.role != "startup":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    existing = db.query(models.Startup).filter(models.Startup.name == startup_data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Startup name already exists")
    
    db_startup = models.Startup(**startup_data.model_dump(), user_id=user.id)
    db.add(db_startup)
    db.commit()
    db.refresh(db_startup)
    return db_startup

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
    
    return {
        "data": startups,
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

# ==================== CHALLENGE ROUTES ====================

@app.post("/api/challenges", response_model=schemas.ChallengeResponse)
def create_challenge(challenge_data: schemas.ChallengeCreate,
                     email: str = Depends(auth.verify_token),
                     db: Session = Depends(get_db)):
    """Create a new challenge"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or user.role != "department":
        raise HTTPException(status_code=403, detail="Only departments can create challenges")
    
    db_challenge = models.Challenge(**challenge_data.model_dump(), creator_id=user.id)
    db.add(db_challenge)
    db.commit()
    db.refresh(db_challenge)
    return db_challenge

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
                   db: Session = Depends(get_db)):
    """List challenges with filters"""
    query = db.query(models.Challenge)
    
    if status:
        query = query.filter(models.Challenge.status == status)
    if category:
        query = query.filter(models.Challenge.category == category)
    
    total = query.count()
    challenges = query.offset(skip).limit(limit).all()
    
    return {
        "data": challenges,
        "total": total,
        "skip": skip,
        "limit": limit,
        "pages": math.ceil(total / limit) if limit > 0 else 1
    }

@app.put("/api/challenges/{challenge_id}", response_model=schemas.ChallengeResponse)
def update_challenge(challenge_id: int, challenge_data: schemas.ChallengeUpdate,
                     email: str = Depends(auth.verify_token),
                     db: Session = Depends(get_db)):
    """Update challenge status"""
    user = db.query(models.User).filter(models.User.email == email).first()
    challenge = db.query(models.Challenge).filter(models.Challenge.id == challenge_id).first()
    
    if not challenge or challenge.creator_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = challenge_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(challenge, field, value)
    
    db.commit()
    db.refresh(challenge)
    return challenge

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
        proposals_count = db.query(models.Proposal).filter(
            models.Proposal.startup_id == startup.id
        ).count()
        pilots_count = db.query(models.Pilot).filter(
            models.Pilot.startup_id == startup.id
        ).count()
        
        return {
            "proposals": proposals_count,
            "pilots": pilots_count,
            "verification_score": startup.verification_score,
            "is_verified": startup.is_verified
        }
    
    return {"message": "No data available"}

# ==================== HEALTH CHECK ====================

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "Startup Procurement Platform API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
