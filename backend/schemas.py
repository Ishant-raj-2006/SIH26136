from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

class UserRole(str, Enum):
    DEPARTMENT = "department"
    STARTUP = "startup"
    EVALUATOR = "evaluator"
    ADMIN = "admin"
    MAINTENANCE = "maintenance"

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

class CompanyRegistrationCreate(BaseModel):
    # Step 1
    name: str
    logo_url: Optional[str] = None
    company_type: str = "startup"
    company_type_other: Optional[str] = None
    founded_year: int
    headquarters_city: str
    state: str
    website: Optional[str] = None
    official_email: EmailStr
    contact_number: str
    
    # Step 2
    founder_ceo_name: str
    auth_rep_name: str
    auth_rep_designation: str
    pan_number: str
    aadhaar_number: str
    work_description: str
    linkedin_url: Optional[str] = None
    
    # Step 3
    cin_number: str
    dpiit_number: Optional[str] = None
    gst_number: Optional[str] = None
    udyam_number: Optional[str] = None
    incorporation_cert_url: Optional[str] = None
    relevant_doc_url: Optional[str] = None

class StartupUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None
    founded_year: Optional[int] = None
    team_size: Optional[int] = None
    funding_stage: Optional[str] = None
    technologies: Optional[List[str]] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    company_type: Optional[str] = None
    company_type_other: Optional[str] = None
    headquarters_city: Optional[str] = None
    state: Optional[str] = None
    official_email: Optional[EmailStr] = None
    contact_number: Optional[str] = None
    founder_ceo_name: Optional[str] = None
    auth_rep_name: Optional[str] = None
    auth_rep_designation: Optional[str] = None
    work_description: Optional[str] = None
    linkedin_url: Optional[str] = None
    status: Optional[str] = None

class StartupResponse(BaseModel):
    id: int
    name: str
    description: str
    logo_url: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = "AI & DeepTech"
    founded_year: Optional[int] = 2024
    team_size: Optional[int] = 5
    funding_stage: Optional[str] = "seed"
    technologies: Optional[List[str]] = []
    verification_score: Optional[float] = 0.0
    is_verified: Optional[bool] = False
    company_type: Optional[str] = "startup"
    company_type_other: Optional[str] = None
    headquarters_city: Optional[str] = None
    state: Optional[str] = None
    official_email: Optional[str] = None
    contact_number: Optional[str] = None
    founder_ceo_name: Optional[str] = None
    auth_rep_name: Optional[str] = None
    auth_rep_designation: Optional[str] = None
    pan_number: Optional[str] = None
    aadhaar_number: Optional[str] = None
    work_description: Optional[str] = None
    linkedin_url: Optional[str] = None
    cin_number: Optional[str] = None
    dpiit_number: Optional[str] = None
    gst_number: Optional[str] = None
    udyam_number: Optional[str] = None
    incorporation_cert_url: Optional[str] = None
    relevant_doc_url: Optional[str] = None
    status: Optional[str] = "pending"
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
    problem_code: Optional[str] = None
    department_or_ministry: Optional[str] = None
    contact_person_name: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    target_beneficiaries: Optional[List[str]] = []
    target_beneficiaries_other: Optional[str] = None
    technical_requirements: Optional[List[str]] = []
    technical_requirements_other: Optional[str] = None

class ChallengeUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None
    problem_statement: Optional[str] = None
    budget: Optional[float] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    expected_outcome: Optional[str] = None
    problem_code: Optional[str] = None
    department_or_ministry: Optional[str] = None
    contact_person_name: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    target_beneficiaries: Optional[List[str]] = None
    target_beneficiaries_other: Optional[str] = None
    technical_requirements: Optional[List[str]] = None
    technical_requirements_other: Optional[str] = None

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
    problem_code: Optional[str] = None
    department_or_ministry: Optional[str] = None
    contact_person_name: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    target_beneficiaries: Optional[List[str]] = []
    target_beneficiaries_other: Optional[str] = None
    technical_requirements: Optional[List[str]] = []
    technical_requirements_other: Optional[str] = None
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
    risk_mitigation: Optional[str] = "Standard GFR 194 compliance risk mitigation and sandbox isolation."

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

class NotificationListResponse(BaseModel):
    data: List[NotificationResponse]
    total: int
    skip: int
    limit: int
    unread: int

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# OTP Schemas
class SendOTPRequest(BaseModel):
    email: str
    purpose: str = "registration"

class VerifyOTPRequest(BaseModel):
    email: str
    otp_code: str
    purpose: str = "registration"

class ResetPasswordRequest(BaseModel):
    email: str
    otp_code: str
    new_password: str
