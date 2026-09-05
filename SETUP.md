# 🚀 Quick Setup Guide

Follow these steps to get the Startup Procurement Platform running on your machine.

## ⚡ 5-Minute Setup (Using Docker)

```bash
# 1. Extract the project
unzip startup-procurement-platform.zip
cd startup-procurement-platform

# 2. Start all services
docker-compose up

# 3. Open in browser
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## 🛠️ Manual Setup

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Paste the pooled Neon connection string into DATABASE_URL.
# It should look like: postgresql+psycopg://USER:PASSWORD@HOST/DBNAME?sslmode=require

# 5. Run server (ignore the virtualenv during auto-reload)
uvicorn main:app --reload --reload-dir . --reload-exclude 'venv/*' --host 0.0.0.0 --port 8000

# ✅ Backend running at http://localhost:8000
```

### Frontend Setup

```bash
# 1. Navigate to frontend (in new terminal)
cd frontend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Run development server
npm run dev

# ✅ Frontend running at http://localhost:3000
```

## 📱 Testing the Platform

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 👥 Department | dept@example.com | password123 |
| 🚀 Startup | startup@example.com | password123 |
| ⭐ Evaluator | evaluator@example.com | password123 |

### Quick Test Flow

1. **Login as Department**
   - Go to http://localhost:3000/auth/login
   - Use: `dept@example.com` / `password123`
   - Click "New Challenge" and create a challenge

2. **Login as Startup**
   - Logout and login with `startup@example.com` / `password123`
   - Go to "Challenges" page
   - Find and view the challenge you created
   - Submit a proposal

3. **View as Department**
   - Login back as department
   - Go to challenge details
   - View proposals and evaluations

## 🔌 API Testing

### Using Swagger UI (Easiest)
```
http://localhost:8000/docs
```

### Using cURL

```bash
# Register
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "username":"testuser",
    "password":"password123",
    "full_name":"Test User",
    "role":"startup"
  }'

# Login
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123"
  }'

# List challenges
curl -X GET "http://localhost:8000/api/challenges" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📦 Project Files

```
startup-procurement-platform/
├── backend/                  # FastAPI backend
│   ├── main.py             # Main application
│   ├── models.py           # Database models
│   ├── requirements.txt     # Python packages
│   └── Dockerfile          # Docker image
│
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # UI components
│   │   └── lib/           # Utilities
│   ├── package.json       # NPM packages
│   └── Dockerfile         # Docker image
│
├── docker-compose.yml      # Docker setup
└── README.md              # Full documentation
```

## 🔧 Troubleshooting

### Backend Won't Start
```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill process using port 8000
kill -9 <PID>

# Or use different port
python main.py --port 8001
```

### Frontend Won't Start
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run dev
```

### Database Issues
- Confirm `DATABASE_URL` contains your real Neon pooled connection string.
- Confirm the Neon branch is awake and the database role has schema permissions.
- The API creates missing tables automatically on startup; production migrations should be added before changing the schema.

### CORS Errors
- Ensure backend is running
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Verify backend CORS settings

## 🚢 Production Deployment

### Using Docker

```bash
# Build images
docker-compose build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f
```

### Manual Deployment

**Backend:**
```bash
cd backend
pip install -r requirements.txt
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
npm start
```

## 📊 Key Features to Try

1. **Dashboard** - View real-time statistics
2. **Challenges** - Create and browse challenges
3. **Startups** - Explore startup profiles
4. **Proposals** - Submit and review proposals
5. **Evaluations** - Score and evaluate submissions
6. **Pilots** - Manage pilot projects
7. **Notifications** - Real-time updates
8. **Dark Mode** - Toggle in header

## 🎓 Learning Resources

- [Backend API Docs](http://localhost:8000/docs)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Full Documentation](./README.md)

## 💡 Tips

- Use browser DevTools to inspect network requests
- Check console for any errors
- Clear browser cache if UI doesn't update
- Reset database if you get data issues
- Check `.env` files are properly configured

## 🆘 Getting Help

1. Check troubleshooting section above
2. Review README files in backend/frontend
3. Check API docs at `/docs`
4. Review browser console for errors
5. Check terminal/console output for API errors

## ✅ Verification Checklist

- [ ] Backend running on 8000
- [ ] Frontend running on 3000
- [ ] Can login with demo credentials
- [ ] Dashboard shows statistics
- [ ] Can view challenges
- [ ] Can submit proposals
- [ ] Can evaluate (as evaluator)
- [ ] Notifications working
- [ ] Dark mode toggles
- [ ] Mobile responsive

## 🎉 You're All Set!

The platform is now ready to use. Start by exploring the dashboard and trying different features.

### Next Steps

1. Create your first challenge (as Department)
2. Submit a proposal (as Startup)
3. Evaluate submissions (as Evaluator)
4. Launch a pilot project
5. Track performance metrics

Happy coding! 🚀
