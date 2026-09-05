# Startup Procurement Platform - Backend

FastAPI-based backend for the Startup Procurement Platform.

## Features

- User authentication (Department, Startup, Evaluator, Admin)
- Challenge creation and management
- Startup discovery and verification
- Proposal submission and evaluation
- Pilot management with milestones
- Real-time notifications
- Analytics and reporting
- RESTful API with Swagger documentation

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Set `DATABASE_URL` to the pooled connection string from Neon Console -> Connect:

```env
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@YOUR-NEON-HOST/DBNAME?sslmode=require
```

The backend uses SQLAlchemy with the `psycopg` v3 driver, enables connection health checks, and reuses a small pool suitable for Neon.

### 3. Run Server

```bash
uvicorn main:app --reload --reload-dir . --reload-exclude 'venv/*' --host 0.0.0.0 --port 8000
```

Server will start on `http://localhost:8000`

### 4. API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get access token
- `GET /api/auth/me` - Get current user

### Startups
- `POST /api/startups` - Create startup profile
- `GET /api/startups` - List startups (paginated)
- `GET /api/startups/{id}` - Get startup details
- `PUT /api/startups/{id}` - Update startup profile

### Challenges
- `POST /api/challenges` - Create challenge
- `GET /api/challenges` - List challenges
- `GET /api/challenges/{id}` - Get challenge details
- `PUT /api/challenges/{id}` - Update challenge

### Proposals
- `POST /api/proposals` - Submit proposal
- `GET /api/proposals/{id}` - Get proposal details
- `GET /api/challenges/{id}/proposals` - Get challenge proposals

### Evaluations
- `POST /api/evaluations` - Submit evaluation
- `GET /api/proposals/{id}/evaluations` - Get proposal evaluations

### Pilots
- `POST /api/pilots` - Create pilot
- `GET /api/pilots` - List pilots
- `GET /api/pilots/{id}` - Get pilot details

### Milestones
- `POST /api/milestones` - Create milestone
- `GET /api/pilots/{id}/milestones` - Get pilot milestones

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}` - Mark notification as read

### Analytics
- `GET /api/stats/dashboard` - Get dashboard statistics

## Database Schema

- Users (with roles: department, startup, evaluator, admin)
- Startups (startup information and verification)
- Challenges (government department challenges)
- Proposals (startup proposals for challenges)
- Evaluations (evaluation scores and feedback)
- Pilots (pilot program management)
- Milestones (payment milestones)
- Notifications (user notifications)

## Technologies

- **Framework**: FastAPI
- **Database**: SQLAlchemy ORM
- **Authentication**: JWT (jose)
- **Validation**: Pydantic
- **Password Hashing**: bcrypt

## Development

### Database Schema

Database tables are auto-created on first run. For a development reset:

```python
from database import engine, Base
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
```

### Adding New Routes

1. Update models in `models.py`
2. Create schemas in `schemas.py`
3. Add routes in `main.py`
4. Test via Swagger UI at `/docs`
