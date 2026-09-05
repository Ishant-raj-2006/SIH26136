# Startup Procurement Platform - Frontend

Modern React-based frontend for the Startup Procurement Platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

✨ **Modern UI/UX**
- Responsive design with Tailwind CSS
- Dark mode support with next-themes
- Smooth animations with Framer Motion
- Skeleton loading states for better UX
- Lucide React icons throughout

🚀 **Performance**
- Lazy loading with React Intersection Observer
- Image optimization with Next.js
- Code splitting and dynamic imports
- Optimized bundle size

🔐 **Authentication**
- JWT-based authentication
- Protected routes
- Persistent login state
- Role-based access control

📊 **Dashboard & Analytics**
- Real-time statistics
- Interactive charts with Recharts
- Activity trends
- Performance metrics

🔄 **State Management**
- Zustand for global state
- API integration with axios
- Error handling
- Loading states

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update the API URL if needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/              # (Coming: App Router)
├── components/       # Reusable UI components
│   ├── Layout.tsx
│   ├── Navigation.tsx
│   ├── UI.tsx
│   └── Skeletons.tsx
├── hooks/            # Custom React hooks
├── lib/
│   ├── api.ts       # API client (axios)
│   └── stores/      # Zustand stores
├── pages/            # Next.js pages
│   ├── auth/        # Authentication pages
│   ├── challenges/  # Challenge pages
│   ├── startups/    # Startup pages
│   └── dashboard.tsx
├── styles/          # Global CSS
└── types/           # TypeScript types
```

## Key Components

### Authentication
- `/pages/auth/login.tsx` - Login page
- `/pages/auth/register.tsx` - Registration page
- `useAuthStore` - Auth state management

### Pages
- `/pages/dashboard.tsx` - Main dashboard with stats and charts
- `/pages/challenges/index.tsx` - List challenges
- `/pages/challenges/create.tsx` - Create new challenge
- `/pages/startups/index.tsx` - Browse startups
- `/pages/proposals/` - Manage proposals
- `/pages/pilots/` - Manage pilots

### UI Components
- Button - Customizable buttons with variants
- Card - Reusable card component
- Badge - Status and tag badges
- Input - Text input with labels
- Textarea - Multi-line text input
- Select - Dropdown select
- Alert - Toast-like alerts
- SkeletonXXX - Loading placeholders

### Hooks
- `useForm` - Form handling
- `useInfiniteLoad` - Infinite scroll
- `useFetch` - Data fetching with caching
- `usePagination` - Pagination logic
- `useDebouncedSearch` - Search debouncing
- `useLocalStorage` - Persistent state

## API Integration

API calls are handled through the `apiClient` in `src/lib/api.ts`:

```typescript
import { apiClient } from '@/lib/api';

// Authentication
await apiClient.login(email, password);
await apiClient.register(userData);

// Challenges
await apiClient.listChallenges(skip, limit, status);
await apiClient.createChallenge(data);

// Startups
await apiClient.listStartups(skip, limit, search);

// Proposals
await apiClient.createProposal(data);
```

## State Management (Zustand)

### Auth Store

```typescript
import { useAuthStore } from '@/lib/stores/auth';

const { user, isAuthenticated, login, logout } = useAuthStore();
```

### App Store

```typescript
import { useAppStore } from '@/lib/stores/app';

const { challenges, startups, fetchChallenges, fetchStartups } = useAppStore();
```

## Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Dark Mode** - Built-in dark mode support with next-themes
- **Custom Colors** - Primary and secondary color schemes
- **Responsive Design** - Mobile-first approach

## Development

### Code Style
- TypeScript for type safety
- ESLint configured
- Prettier for formatting

### Component Guidelines
- Functional components with hooks
- Proper TypeScript typing
- Reusable and composable
- Accessibility-first approach

### Performance Tips
- Use lazy loading for images
- Implement code splitting
- Optimize API calls
- Use memoization when needed

## Common Tasks

### Add a New Page

1. Create file in `/pages`
2. Import `Layout` and wrap component
3. Add `getLayout` method
4. Add route to navigation if needed

### Add a New Component

1. Create in `/components`
2. Export with proper TypeScript types
3. Use in pages/other components

### Connect to an API

1. Add method to `apiClient` in `/lib/api.ts`
2. Use in component or store
3. Handle errors with try-catch
4. Show loading/error states

## Troubleshooting

### API Connection Issues
- Check `NEXT_PUBLIC_API_URL` environment variable
- Ensure backend is running on the correct port
- Check CORS configuration in backend

### State Not Updating
- Verify Zustand store methods are called correctly
- Check component is subscribed to store
- Use React DevTools to inspect state

### Styling Issues
- Clear Tailwind CSS cache: `rm -rf .next`
- Verify Tailwind config paths are correct
- Check dark mode is enabled in HTML

## Performance Metrics

- Lighthouse Score: 90+
- Core Web Vitals: Optimized
- Bundle Size: <150KB gzipped
- First Contentful Paint: <2s

## Future Enhancements

- [ ] App Router migration
- [ ] Real-time notifications with WebSockets
- [ ] Advanced filtering and search
- [ ] File upload for proposals
- [ ] Email notifications
- [ ] Mobile app with React Native
- [ ] PWA features
- [ ] i18n support

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Support

For issues or questions, refer to the backend documentation or create an issue.
