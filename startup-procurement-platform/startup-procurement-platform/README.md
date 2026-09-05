# Startup Procurement Platform

A comprehensive end-to-end platform connecting government departments with innovative startups for solving public sector challenges. Built with modern technologies for scalability, security, and user experience.

![Platform Demo](https://via.placeholder.com/1200x600?text=Startup+Procurement+Platform)

## 🌟 Features

### For Departments
- ✅ Post government challenges with detailed requirements
- ✅ Browse and filter verified startups by expertise
- ✅ Review proposals from interested startups
- ✅ Evaluate and score submissions with expert panels
- ✅ Manage pilot projects with milestone tracking
- ✅ Monitor compliance and performance metrics
- ✅ Approve payments based on milestones

### For Startups
- ✅ Discover government procurement opportunities
- ✅ Submit proposals directly to departments
- ✅ Track proposal evaluation status
- ✅ Manage pilot implementations
- ✅ Receive milestone-based payments
- ✅ Build verification score
- ✅ Access resources and guidelines

### For Evaluators
- ✅ Score proposals on multiple criteria
- ✅ Provide detailed feedback
- ✅ Participate in evaluation panels
- ✅ Track evaluation progress

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- npm or yarn
- Docker & Docker Compose (optional)

### Installation

#### Option 1: Local Setup

**Backend Setup:**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
python main.py
```

Backend runs on: `http://localhost:8000`

**Frontend Setup:**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs on: `http://localhost:3000`

#### Option 2: Docker Setup

```bash
docker-compose up -d
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

## 📚 Project Structure

```
startup-procurement-platform/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # SQLAlchemy database models
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── auth.py              # Authentication utilities
│   ├── database.py          # Database configuration
│   ├── requirements.txt      # Python dependencies
│   └── README.md            # Backend documentation
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Next.js pages
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and API client
│   │   ├── styles/          # Global CSS
│   │   └── types/           # TypeScript types
│   ├── package.json         # NPM dependencies
│   ├── tsconfig.json        # TypeScript config
│   └── README.md            # Frontend documentation
│
├── docker-compose.yml       # Docker composition
└── README.md               # This file
```

## 🔌 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user profile

### Challenge Endpoints
- `GET /challenges` - List all challenges
- `POST /challenges` - Create new challenge
- `GET /challenges/{id}` - Get challenge details
- `PUT /challenges/{id}` - Update challenge

### Startup Endpoints
- `GET /startups` - List startups
- `POST /startups` - Create startup profile
- `GET /startups/{id}` - Get startup details
- `PUT /startups/{id}` - Update startup

### Proposal Endpoints
- `POST /proposals` - Submit proposal
- `GET /proposals/{id}` - Get proposal details
- `GET /challenges/{id}/proposals` - Get challenge proposals

### Pilot Endpoints
- `POST /pilots` - Create pilot
- `GET /pilots/{id}` - Get pilot details
- `GET /pilots` - List user pilots

### Full API Documentation
Visit `http://localhost:8000/docs` for interactive Swagger documentation.

## 🛠 Technology Stack

### Backend
- **Framework**: FastAPI 0.104
- **Database**: SQLAlchemy ORM with SQLite
- **Authentication**: JWT with python-jose
- **Validation**: Pydantic v2
- **Server**: Uvicorn

### Frontend
- **Framework**: Next.js 14
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animation**: Framer Motion
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Version Control**: Git

## 📋 Demo Credentials

Use these credentials to test the platform:

| Role | Email | Password |
|------|-------|----------|
| Department | dept@example.com | password123 |
| Startup | startup@example.com | password123 |
| Evaluator | evaluator@example.com | password123 |

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ SQL injection prevention via ORM
- ✅ XSS protection with React
- ✅ Rate limiting ready
- ✅ Secure session management

## 📊 Dashboard & Analytics

- Real-time statistics
- Challenge trends
- Proposal pipeline
- Pilot performance metrics
- Interactive charts and graphs

## 🎨 UI/UX Features

- 🌓 Dark mode support
- 📱 Fully responsive design
- ⚡ Skeleton loading states
- 🎯 Smooth animations
- ♿ Accessibility-first approach
- 🔄 Real-time notifications
- 📈 Interactive charts

## 🔄 Workflow

```
1. Department posts Challenge
   ↓
2. Startups discover and Submit Proposals
   ↓
3. Evaluators score Proposals
   ↓
4. Department selects Winner and initiates Pilot
   ↓
5. Startup implements with Milestone-based payments
   ↓
6. Performance validation and Scale-up decision
```

## 🚀 Advanced Features

### Innovation Features
- Dual-track evaluation system (technical + feasibility)
- Risk assessment module
- Compliance tracking
- Performance dashboards
- Milestone-based payment automation
- Startup verification scoring
- Smart matching algorithm

### Business Features
- Multi-role access control
- Organization management
- Budget tracking
- Audit trails
- Notification system
- Analytics reporting
- Export capabilities

## 📈 Scalability

- Stateless API design
- Database indexing
- Caching with Redis-ready
- Lazy loading on frontend
- Image optimization
- Code splitting

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run test

# Backend
cd backend
pytest
```

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=sqlite:///./procurement.db
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
lsof -ti:8000 | xargs kill -9
```

**Database errors:**
```bash
rm procurement.db  # Reset database
python main.py     # Recreate tables
```

### Frontend Issues

**Dependencies not installing:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
```bash
npm run build
npm start
```

## 📚 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [API Documentation](http://localhost:8000/docs)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🎯 Roadmap

- [ ] Advanced search and filtering
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Mobile app
- [ ] Real-time chat
- [ ] Document management
- [ ] Analytics export
- [ ] Multi-language support
- [ ] AI-powered matching
- [ ] Blockchain for verification

## 💬 Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact: support@startuphub.com
- Documentation: https://docs.startuphub.com

## 🙏 Acknowledgments

Built with ❤️ for the startup ecosystem.

---

**Last Updated**: January 2025
**Version**: 1.0.0
