# 🚀 Developer's Quick Reference Guide

## ⚡ Command Cheat Sheet

### Starting the Application

#### Docker (Recommended)
```bash
docker-compose up
```

#### Manual - Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

#### Manual - Frontend
```bash
cd frontend
npm install
npm run dev
```

### API Testing

```bash
# Using Swagger UI
http://localhost:8000/docs

# Using cURL - Login
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"dept@example.com",
    "password":"password123"
  }'

# Using cURL - Create Challenge
curl -X POST "http://localhost:8000/api/challenges" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title":"Mobile Payment Solution",
    "description":"...",
    "problem_statement":"...",
    "budget":5000000,
    "category":"technology",
    "tags":["mobile","payment"],
    "deadline":"2025-12-31T23:59:59",
    "expected_outcome":"..."
  }'
```

---

## 📁 Key Files to Modify

### Backend

| File | Purpose | Modify For |
|------|---------|-----------|
| `main.py` | All API endpoints | Add new routes |
| `models.py` | Database schemas | Add new models |
| `schemas.py` | Request/response validation | Add new schemas |
| `auth.py` | Authentication logic | Modify auth |
| `database.py` | DB configuration | Change DB URL |

### Frontend

| File | Purpose | Modify For |
|------|---------|-----------|
| `src/pages/` | Page routes | Add new pages |
| `src/components/` | UI components | Create components |
| `src/lib/api.ts` | API client | Add API methods |
| `src/lib/stores/` | Global state | Add state |
| `src/hooks/` | Custom hooks | Add hooks |
| `tailwind.config.js` | Styling | Customize colors |

---

## 🔧 Development Workflow

### Adding a New Feature

#### Backend:
1. Add model in `models.py`
2. Add schema in `schemas.py`
3. Add route in `main.py`
4. Test via Swagger UI at `/docs`

#### Frontend:
1. Create page in `src/pages/`
2. Add component in `src/components/`
3. Use hooks for data fetching
4. Update `src/lib/api.ts` if new endpoints needed
5. Update Zustand store if needed

### Git Workflow
```bash
git add .
git commit -m "feat: add new feature"
git push origin feature-branch
```

---

## 📊 Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 8000 | http://localhost:8000 |
| API Docs | 8000/docs | http://localhost:8000/docs |
| Database | Neon | PostgreSQL via pooled `DATABASE_URL` |

---

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@YOUR-NEON-HOST/DBNAME?sslmode=require
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📦 Installing New Packages

### Backend (Python)
```bash
pip install package-name
pip freeze > requirements.txt
```

### Frontend (npm)
```bash
npm install package-name
npm install -D dev-package-name  # For dev dependencies
```

---

## 🐛 Debugging Tips

### Backend
```python
# Add debug prints
print(f"Debug: {variable}")

# Use FastAPI logger
import logging
logger = logging.getLogger(__name__)
logger.debug("Debug message")

# Database query debugging
query = db.query(Model).all()
print(f"Query result: {query}")
```

### Frontend
```javascript
// Console debugging
console.log("Debug:", variable);

// React DevTools
// Install React DevTools browser extension

// Network tab in DevTools
// Check API calls and responses

// Zustand DevTools
// npm install zustand-devtools
```

---

## 🎨 Styling Guide

### Adding Custom Styles

#### Using Tailwind Classes
```tsx
<div className="flex gap-4 p-4 bg-blue-50 dark:bg-blue-900/20">
  <p className="text-lg font-semibold">Title</p>
</div>
```

#### Using CSS Modules (if needed)
```css
/* styles/custom.module.css */
.container {
  @apply flex gap-4 p-4;
}
```

#### Dark Mode
```tsx
<div className="bg-white dark:bg-slate-900">
  Content
</div>
```

---

## 🔐 Authentication Flow

```
1. User submits login form
   ↓
2. Frontend calls POST /api/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Backend creates JWT token
   ↓
5. Frontend stores token in localStorage
   ↓
6. Frontend adds token to Authorization header
   ↓
7. Backend validates token on protected routes
```

---

## 📋 Common Code Snippets

### Create New Page
```tsx
// src/pages/newpage.tsx
import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';

const NewPage: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1>New Page</h1>
    </motion.div>
  );
};

NewPage.getLayout = (page) => <Layout>{page}</Layout>;
export default NewPage;
```

### Create New Component
```tsx
// src/components/MyComponent.tsx
import { FC } from 'react';
import { Button } from './UI';

interface Props {
  title: string;
  onClick: () => void;
}

export const MyComponent: FC<Props> = ({ title, onClick }) => {
  return (
    <div>
      <h2>{title}</h2>
      <Button onClick={onClick}>Click me</Button>
    </div>
  );
};
```

### Add API Method
```typescript
// Add to src/lib/api.ts
async myNewMethod(data: any) {
  const response = await this.client.post('/api/endpoint', data);
  return response.data;
}
```

### Add Zustand Store
```typescript
// src/lib/stores/mystore.ts
import { create } from 'zustand';

interface MyStore {
  data: any[];
  loading: boolean;
  fetchData: () => Promise<void>;
}

export const useMyStore = create<MyStore>((set) => ({
  data: [],
  loading: false,
  fetchData: async () => {
    set({ loading: true });
    try {
      const response = await apiClient.myNewMethod();
      set({ data: response });
    } finally {
      set({ loading: false });
    }
  },
}));
```

### Use Custom Hook
```tsx
import { useForm } from '@/hooks';

const MyComponent = () => {
  const { data, handleChange, handleSubmit, loading } = useForm(
    { email: '' },
    async (data) => {
      // Handle submission
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <input value={data.email} onChange={handleChange} name="email" />
      <button type="submit" disabled={loading}>Submit</button>
    </form>
  );
};
```

---

## 🚀 Performance Optimization

### Frontend
```tsx
// Use React.memo for expensive components
export const MyComponent = React.memo(({ prop }: Props) => {
  return <div>{prop}</div>;
});

// Use useMemo for expensive calculations
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b);
}, [a, b]);

// Use useCallback for function dependencies
const memoizedCallback = useCallback(() => {
  handleSubmit(a);
}, [a]);
```

### Backend
```python
# Index frequently queried columns
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)

# Use pagination
query = db.query(Model).offset(skip).limit(limit).all()

# Eager load relationships
query = db.query(Model).options(
    joinedload(Model.relationship)
).all()
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Login works
- [ ] Create challenge works
- [ ] Submit proposal works
- [ ] Evaluate proposal works
- [ ] Create pilot works
- [ ] Dashboard loads
- [ ] Pagination works
- [ ] Search works
- [ ] Dark mode toggles
- [ ] Mobile responsive
- [ ] Notifications appear
- [ ] Logout works

---

## 📱 Responsive Design

### Breakpoints (Tailwind)
```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### Mobile-First Grid
```tsx
{/* Stacks on mobile, 2 cols on tablet, 3 cols on desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items */}
</div>
```

---

## 🔍 Useful Links

### Documentation
- FastAPI: https://fastapi.tiangolo.com/
- Next.js: https://nextjs.org/docs
- React: https://react.dev/
- Tailwind: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs/
- Zustand: https://github.com/pmndrs/zustand
- SQLAlchemy: https://docs.sqlalchemy.org/

### Tools
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- VS Code: https://code.visualstudio.com/
- Postman: https://www.postman.com/
- Git: https://git-scm.com/

---

## 🎯 Next Steps

1. Extract the project
2. Follow SETUP.md to run locally
3. Login with demo credentials
4. Explore the application
5. Read backend/frontend READMEs
6. Make your first modification
7. Deploy to production

---

## 🆘 Emergency Fixes

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
python -m uvicorn main:app --port 8001
```

### Database Issues
```bash
# Reset database
rm backend/procurement.db
python backend/main.py
```

### npm Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Not Connecting
- Check backend is running: `http://localhost:8000/api/health`
- Check .env.local has correct API_URL
- Check CORS in backend (should be configured)
- Check for errors in console/terminal

---

## 💡 Pro Tips

1. **Use Swagger UI** - Better than cURL for API testing
2. **React DevTools** - Essential for debugging React
3. **Network Tab** - Check API responses
4. **Git commits** - Make small, meaningful commits
5. **Environment variables** - Never commit secrets
6. **Comments** - Document complex logic
7. **Type safety** - Use TypeScript everywhere
8. **Error handling** - Always handle errors
9. **Loading states** - Show users loading is happening
10. **Responsive design** - Test on mobile devices

---

**Keep this guide handy while developing!** 📚
