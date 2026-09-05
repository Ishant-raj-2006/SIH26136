from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum

class UserRole(str, enum.Enum):
    DEPARTMENT = "department"
    STARTUP = "startup"
    EVALUATOR = "evaluator"
    ADMIN = "admin"

class ChallengeStatus(str, enum.Enum):
    OPEN = "open"
    EVALUATING = "evaluating"
    PILOT_RUNNING = "pilot_running"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class PilotStatus(str, enum.Enum):
    NEGOTIATION = "negotiation"
    ACTIVE = "active"
    MONITORING = "monitoring"
    COMPLETED = "completed"
    FAILED = "failed"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    role = Column(SQLEnum(UserRole))
    organization = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    challenges = relationship("Challenge", back_populates="creator")
    startups = relationship("Startup", back_populates="user")
    evaluations = relationship("Evaluation", back_populates="evaluator")
    pilots = relationship("Pilot", back_populates="assigned_to")

class Startup(Base):
    __tablename__ = "startups"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    logo_url = Column(String, nullable=True)
    website = Column(String, nullable=True)
    industry = Column(String)
    founded_year = Column(Integer)
    team_size = Column(Integer)
    funding_stage = Column(String)
    technologies = Column(JSON)
    certifications = Column(JSON)
    prior_experience = Column(Text, nullable=True)
    verification_score = Column(Float, default=0.0)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="startups")
    proposals = relationship("Proposal", back_populates="startup")
    pilots = relationship("Pilot", back_populates="startup")

class Challenge(Base):
    __tablename__ = "challenges"
    
    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, index=True)
    description = Column(Text)
    problem_statement = Column(Text)
    budget = Column(Float)
    status = Column(SQLEnum(ChallengeStatus), default=ChallengeStatus.OPEN)
    category = Column(String)
    tags = Column(JSON)
    deadline = Column(DateTime)
    expected_outcome = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    creator = relationship("User", back_populates="challenges")
    proposals = relationship("Proposal", back_populates="challenge")
    pilots = relationship("Pilot", back_populates="challenge")

class Proposal(Base):
    __tablename__ = "proposals"
    
    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"))
    challenge_id = Column(Integer, ForeignKey("challenges.id"))
    title = Column(String)
    description = Column(Text)
    technical_approach = Column(Text)
    timeline = Column(String)
    cost = Column(Float)
    risk_mitigation = Column(Text)
    evaluation_score = Column(Float, default=0.0)
    status = Column(String, default="submitted")
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    startup = relationship("Startup", back_populates="proposals")
    challenge = relationship("Challenge", back_populates="proposals")
    evaluations = relationship("Evaluation", back_populates="proposal")

class Evaluation(Base):
    __tablename__ = "evaluations"
    
    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"))
    evaluator_id = Column(Integer, ForeignKey("users.id"))
    technical_score = Column(Float)
    feasibility_score = Column(Float)
    innovation_score = Column(Float)
    cost_score = Column(Float)
    overall_score = Column(Float)
    feedback = Column(Text)
    recommendation = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    proposal = relationship("Proposal", back_populates="evaluations")
    evaluator = relationship("User", back_populates="evaluations")

class Pilot(Base):
    __tablename__ = "pilots"
    
    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"))
    startup_id = Column(Integer, ForeignKey("startups.id"))
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(SQLEnum(PilotStatus), default=PilotStatus.NEGOTIATION)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    budget_approved = Column(Float)
    performance_data = Column(JSON)
    risk_assessment = Column(Text)
    compliance_status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    challenge = relationship("Challenge", back_populates="pilots")
    startup = relationship("Startup", back_populates="pilots")
    assigned_to = relationship("User", back_populates="pilots")
    milestones = relationship("Milestone", back_populates="pilot")

class Milestone(Base):
    __tablename__ = "milestones"
    
    id = Column(Integer, primary_key=True, index=True)
    pilot_id = Column(Integer, ForeignKey("pilots.id"))
    title = Column(String)
    description = Column(Text)
    due_date = Column(DateTime)
    payment_amount = Column(Float)
    status = Column(String, default="pending")
    completed_at = Column(DateTime, nullable=True)
    
    pilot = relationship("Pilot", back_populates="milestones")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String)
    message = Column(Text)
    type = Column(String)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    related_id = Column(Integer, nullable=True)
