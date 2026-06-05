# Quick Reference Card

**Print this page or bookmark it!** Essential commands and snippets for AI Tools project.

---

## 🚀 START HERE - 3 Minute Setup

```bash
# Terminal 1: Backend
cd backend
php -S localhost:3001 -t src

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Then open: http://localhost:5173
```

---

## 🌐 URLs

| Service | URL | User | Password |
|---------|-----|------|----------|
| Frontend | http://localhost:5173 | - | - |
| Admin | http://localhost:5173/admin/login | admin@aitoolslib.com | password |
| Backend API | http://localhost:3001/backend/src/api | - | - |
| Database | localhost:3306 | root | - |

---

## 📁 Key Files

```
frontend/src/pages/
├── HomePage.jsx
├── ToolsPage.jsx
├── ToolDetailPage.jsx
├── PromptsPage.jsx
├── PromptDetailPage.jsx
└── admin/
    ├── AdminLoginPage.jsx
    ├── AdminDashboard.jsx
    ├── AdminToolsPage.jsx
    └── AdminPromptsPage.jsx

backend/src/
├── controllers/ (6 files)
├── models/ (6 files)
├── utils/ (3 files)
└── index.php (router)
```

---

## 🔗 Key API Endpoints

```bash
# Public (no auth needed)
GET    /api/tools?page=1&perPage=12
GET    /api/tools/:id
GET    /api/prompts
POST   /api/prompts/:id/copy
GET    /api/categories
GET    /api/tags

# Admin (JWT required)
POST   /api/admin/login
GET    /api/admin/me
POST   /api/admin/tools
PUT    /api/admin/tools/:id
DELETE /api/admin/tools/:id
```

---

## 💻 Common Commands

```bash
# Frontend
npm run dev              # Start dev server
npm run build          # Build for production
npm run preview        # Preview build
npm run lint           # Check code

# Backend
php -S localhost:3001 -t src    # Start server
composer install               # Install deps

# Database
mysql -u root -p               # Connect
mysql -u root -p ai_tools_db < database/schema.sql  # Import schema
```

---

## 🎨 CSS Utilities

```jsx
// Buttons
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-ghost">Ghost</button>

// Cards
<div className="card">Content</div>
<div className="card hover-lift">Lifts on hover</div>
<div className="card-glass">Glass effect</div>

// Inputs
<input className="input" />
<select className="input"><option>...</option></select>

// Responsive
<div className="hidden md:block">Desktop only</div>
<div className="md:grid-cols-2 lg:grid-cols-3">Grid</div>

// Dark mode
<div className="dark:bg-dark-800">Content</div>
```

---

## 🔐 Authentication

```javascript
// Login
const { token, admin } = await adminAPI.login({ email, password })
login(token, admin)

// Check if authenticated
const { isAuthenticated } = useAuth()

// Protected route
<ProtectedRoute>
  <AdminDashboard />
</ProtectedRoute>

// Logout
logout()
```

---

## 📊 React Query Patterns

```javascript
// Fetch data
const { data, isLoading, error } = useTools(page, perPage, filters)

// Handle states
{isLoading && <Skeleton />}
{error && <Error />}
{data?.data?.map(item => <Card key={item.id} {...item} />)}

// Update URL params
const [searchParams, setSearchParams] = useSearchParams()
const newParams = new URLSearchParams(searchParams)
newParams.set('page', 2)
setSearchParams(newParams)
```

---

## 🗄️ Database Queries

```sql
-- List tools
SELECT * FROM tools WHERE deleted_at IS NULL;

-- Search
SELECT * FROM tools 
WHERE MATCH(name, description) AGAINST('chatgpt' IN BOOLEAN MODE)
AND deleted_at IS NULL;

-- Tools with tags
SELECT t.*, GROUP_CONCAT(tg.name) as tags
FROM tools t
LEFT JOIN tool_tags tt ON t.id = tt.tool_id
LEFT JOIN tags tg ON tt.tag_id = tg.id
WHERE t.id = 1;

-- Count by category
SELECT category_id, COUNT(*) as count
FROM tools WHERE deleted_at IS NULL
GROUP BY category_id;
```

---

## 🧪 Test API with cURL

```bash
# Get tools
curl http://localhost:3001/backend/src/api/tools

# Search
curl "http://localhost:3001/backend/src/api/tools?search=ChatGPT"

# Login
curl -X POST http://localhost:3001/backend/src/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aitoolslib.com","password":"password"}'

# With token
curl http://localhost:3001/backend/src/api/admin/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 Common Issues

| Issue | Fix |
|-------|-----|
| "Connection refused" | Check if MySQL running: `mysql -u root -p` |
| Backend port in use | Kill process: `lsof -i :3001 \| grep LISTEN \| awk '{print $2}' \| xargs kill -9` |
| Frontend port in use | Kill process: `lsof -i :5173 \| grep LISTEN \| awk '{print $2}' \| xargs kill -9` |
| Module not found | Clear cache: `rm -rf node_modules && npm install` |
| Database error | Import schema: `mysql -u root -p ai_tools_db < database/schema.sql` |
| 401 Unauthorized | Token expired, re-login |
| CORS error | Check CORS_ORIGIN in .env |

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Project overview |
| SETUP_INSTRUCTIONS.md | ⭐ How to set up (START HERE) |
| DEVELOPER_GUIDE.md | Quick reference |
| API_DOCUMENTATION.md | All endpoints |
| ARCHITECTURE.md | System design |
| COMPLETION_STATUS.md | What's done/pending |
| TESTING_DEPLOYMENT_CHECKLIST.md | QA & launch |
| DOCUMENTATION_INDEX.md | Guide to docs |

---

## 🎯 Project Status

```
Public Features:    ✅ 100% Complete
Admin UI:          ✅ 70% Complete  
Admin CRUD:        ⏳ 0% (Pending)
Documentation:     ✅ 100% Complete
Overall:           ✅ 80% Complete
```

---

## ⚡ Performance Tips

```javascript
// Debounce search
const handleSearch = debounce((value) => {
  // Search logic
}, 300)

// React Query caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 10 * 60 * 1000,        // 10 minutes
    },
  },
})

// Image lazy loading
<img loading="lazy" src="..." />

// Pagination
GET /api/tools?page=1&perPage=12
```

---

## 🔧 Configuration Files

**frontend/.env**
```
VITE_API_URL=http://localhost:3001/backend/src/api
VITE_APP_NAME=AI Tools Library
```

**backend/.env**
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ai_tools_db
DB_USER=root
DB_PASSWORD=
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
```

---

## 📱 Responsive Breakpoints

```
Mobile:    < 640px
Tablet:    640px - 1024px
Desktop:   > 1024px

Usage:
- Default mobile styles
- md:class for tablet+
- lg:class for desktop+
- hidden md:block (show on tablet+)
```

---

## 🎓 Tech Stack Cheat Sheet

**Frontend:**
- React 18 + Vite (dev server)
- Tailwind CSS (styling)
- React Router (routing)
- React Query (server state)
- Axios (HTTP client)
- Lucide Icons

**Backend:**
- PHP 8.0+ (language)
- Slim Framework (routing)
- PDO (database)
- JWT (authentication)
- MySQL 8.0+ (database)

---

## 📞 Need Help?

1. Check [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) troubleshooting
2. Read [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) common issues
3. Search [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
4. Review [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## ✅ Pre-Deployment Checklist

```
[ ] npm run build succeeds
[ ] No console errors
[ ] All pages load
[ ] Login works
[ ] API responds
[ ] Database connected
[ ] .env updated for production
[ ] Git changes committed
```

---

## 🚀 Next Steps

1. Read SETUP_INSTRUCTIONS.md (5 min)
2. Run Quick Start (20 min)
3. Explore the app (10 min)
4. Review ARCHITECTURE.md (20 min)
5. Check COMPLETION_STATUS.md for next dev tasks

---

**Bookmark this page for quick reference!** 🔖

Last Updated: 2024 | Version: 1.0 | Status: Ready for Development
