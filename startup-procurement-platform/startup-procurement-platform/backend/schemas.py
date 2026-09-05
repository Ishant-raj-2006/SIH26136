from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

class UserRole(str, Enum):
    DEPARTMENT = "department"
    STARTUP = "startup"
    EVALUATOR = "evaluator"
    ADMIN = "admin"

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: str
    role: UserRole
    organization: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    role: str
    organization: Optional[str]
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Startup Schemas
class StartupCreate(BaseModel):
    name: str
    description: str
    industry: str
    founded_year: int
    team_size: int
    funding_stage: str
    technologies: List[str]
    website: Optional[str] = None
    logo_url: Optional[str] = None

class StartupUpdate(BaseModel):
    description: Optional[str] = None
    team_size: Optional[int] = None
    technologies: Optional[List[str]] = None

class StartupResponse(BaseModel):
    id: int
    name: str
    description: str
    logo_url: Optional[str]
    website: Optional[str]
    industry: str
    founded_year: int
    team_size: int
    funding_stage: str
    technologies: List[str]
    verification_score: float
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Challenge Schemas
class ChallengeCreate(BaseModel):
    title: str
    description: str
    problem_statement: str
    budget: float
    category: str
    tags: List[str]
    deadline: datetime
    expected_outcome: str

class ChallengeUpdate(BaseModel):
    status: Optional[str] = None
    description: Optional[str] = None

class ChallengeResponse(BaseModel):
    id: int
    title: str
    description: str
    problem_statement: str
    budget: float
    status: str
    category: str
    tags: List[str]
    deadline: datetime
    expected_outcome: str
    creator_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Proposal Schemas
class ProposalCreate(BaseModel):
    challenge_id: int
    title: str
    description: str
    technical_approach: str
    timeline: str
    cost: float
    risk_mitigation: str

class ProposalResponse(BaseModel):
    id: int
    startup_id: int
    challenge_id: int
    title: str
    description: str
    technical_approach: str
    timeline: str
    cost: float
    evaluation_score: float
    status: str
    submitted_at: datetime
    
    class Config:
        from_attributes = True

# Evaluation Schemas
class EvaluationCreate(BaseModel):
    proposal_id: int
    technical_score: float = Field(ge=0, le=10)
    feasibility_score: float = Field(ge=0, le=10)
    innovation_score: float = Field(ge=0, le=10)
    cost_score: float = Field(ge=0, le=10)
    feedback: str
    recommendation: str

class EvaluationResponse(BaseModel):
    id: int
    proposal_id: int
    evaluator_id: int
    technical_score: float
    feasibility_score: float
    innovation_score: float
    cost_score: float
    overall_score: float
    feedback: str
    recommendation: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Pilot Schemas
class PilotCreate(BaseModel):
    challenge_id: int
    startup_id: int
    budget_approved: float
    risk_assessment: str

class PilotResponse(BaseModel):
    id: int
    challenge_id: int
    startup_id: int
    status: str
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    budget_approved: float
    compliance_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Milestone Schemas
class MilestoneCreate(BaseModel):
    pilot_id: int
    title: str
    description: str
    due_date: datetime
    payment_amount: float

class MilestoneResponse(BaseModel):
    id: int
    pilot_id: int
    title: str
    description: str
    due_date: datetime
    payment_amount: float
    status: str
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Notification Schemas
class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
