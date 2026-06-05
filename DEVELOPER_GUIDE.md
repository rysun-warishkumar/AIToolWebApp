# Developer Quick Reference Guide

Quick commands and code snippets for the AI Tools & Prompts Library.

## 🚀 Start Development

### Terminal 1 - Backend
```bash
cd backend
php -S localhost:3001 -t src
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### Terminal 3 - Database (if needed)
```bash
mysql -u root -p
USE ai_tools_db;
# Run queries here
```

---

## 🔗 URLs & Access

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | http://localhost:5173 | React Vite dev server |
| Backend API | http://localhost:3001/backend/src/api | PHP API base |
| Database | localhost:3306 | MySQL server |
| Admin Login | http://localhost:5173/admin/login | Demo: admin@aitoolslib.com / password |

---

## 🗂️ Key File Locations

### Frontend
```
frontend/src/
├── pages/                      # Page components
│   ├── HomePage.jsx           # Landing page
│   ├── ToolsPage.jsx          # Tools listing
│   ├── ToolDetailPage.jsx     # Tool details
│   ├── PromptsPage.jsx        # Prompts listing
│   ├── PromptDetailPage.jsx   # Prompt details
│   └── admin/
│       ├── AdminLoginPage.jsx # Admin login
│       ├── AdminDashboard.jsx # Main dashboard
│       ├── AdminToolsPage.jsx # Tool management
│       └── AdminPromptsPage.jsx # Prompt management
├── components/
│   ├── common/
│   │   ├── Navbar.jsx         # Top navigation
│   │   ├── Footer.jsx         # Bottom footer
│   │   ├── Pagination.jsx     # Pagination controls
│   │   └── Skeleton.jsx       # Loading skeletons
│   └── tools/
│       └── ToolCard.jsx       # Tool & Prompt cards
├── services/
│   └── api.js                 # Axios client & endpoints
├── hooks/
│   └── useQueries.js          # React Query hooks
├── context/
│   ├── AuthContext.jsx        # Auth state
│   └── ThemeContext.jsx       # Dark mode state
├── utils/
│   ├── helpers.js             # 30+ utility functions
│   └── ProtectedRoute.jsx     # Route protection
└── styles/
    └── globals.css            # Global styles & utilities
```

### Backend
```
backend/src/
├── controllers/
│   ├── ToolController.php     # Tools API
│   ├── PromptController.php   # Prompts API
│   ├── CategoryController.php # Categories API
│   ├── TagController.php      # Tags API
│   ├── FeaturedController.php # Featured API
│   └── AdminController.php    # Admin auth
├── models/
│   ├── Tool.php              # Tool model
│   ├── Prompt.php            # Prompt model
│   ├── Category.php          # Category model
│   ├── Tag.php               # Tag model
│   ├── Admin.php             # Admin model
│   └── Featured.php          # Featured model
├── middleware/
│   └── AuthMiddleware.php    # JWT validation
├── utils/
│   ├── Database.php          # DB singleton
│   ├── Response.php          # Response formatter
│   └── JwtHelper.php         # JWT encode/decode
├── config/
│   └── Database.php          # DB connection
└── index.php                 # Main router
```

---

## 📡 API Quick Reference

### Public Endpoints

**Get Tools**
```bash
curl http://localhost:3001/backend/src/api/tools?page=1&perPage=12
```

**Search Tools**
```bash
curl "http://localhost:3001/backend/src/api/tools?search=ChatGPT&page=1"
```

**Get Tool Details**
```bash
curl http://localhost:3001/backend/src/api/tools/1
```

**Get Prompts**
```bash
curl http://localhost:3001/backend/src/api/prompts?page=1
```

**Copy Prompt (increment count)**
```bash
curl -X POST http://localhost:3001/backend/src/api/prompts/1/copy
```

### Admin Endpoints

**Login**
```bash
curl -X POST http://localhost:3001/backend/src/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aitoolslib.com","password":"password"}'
```

**Get Current Admin**
```bash
curl http://localhost:3001/backend/src/api/admin/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Create Tool**
```bash
curl -X POST http://localhost:3001/backend/src/api/admin/tools \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"ChatGPT",
    "slug":"chatgpt",
    "short_description":"AI Assistant",
    "description":"Full description...",
    "website_url":"https://chat.openai.com",
    "category_id":1,
    "pricing_model":"freemium",
    "status":"published"
  }'
```

---

## 🎨 CSS Classes Reference

### Buttons
```jsx
// Primary button
<button className="btn-primary">Click me</button>

// Secondary button
<button className="btn-secondary">Click me</button>

// Ghost button (transparent)
<button className="btn-ghost">Click me</button>
```

### Cards & Panels
```jsx
// Standard card
<div className="card p-6">Content</div>

// Glass effect
<div className="card-glass">Glass panel</div>

// With hover animation
<div className="card hover-lift">Lifts on hover</div>
```

### Inputs
```jsx
// Text input
<input type="text" className="input" />

// Select dropdown
<select className="input">
  <option>Option</option>
</select>

// Badge/Label
<span className="badge">Badge</span>
```

### Utilities
```jsx
// Dark mode aware
<div className="dark:bg-dark-800">Content</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Items */}
</div>

// Animations
<div className="animate-float">Floats</div>
<div className="animate-shimmer">Shimmer loading</div>
```

---

## 🔐 Authentication Flow

### Frontend
```javascript
// Login
const { token, admin } = await adminAPI.login({ email, password })
login(token, admin)  // Stored in localStorage

// Logout
logout()  // Clears token

// Protected route
<ProtectedRoute>
  <AdminDashboard />
</ProtectedRoute>
```

### Backend
```php
// Check token
$token = JwtHelper::verifyToken();  // Returns token or Response::unauthorized()

// Encode new token
$token = JwtHelper::encode(['admin_id' => $id, 'email' => $email]);

// Verify password
Admin::verifyPassword('email@example.com', 'password');
```

---

## 🔄 React Query Patterns

### Fetch Data
```javascript
const { data, isLoading, error } = useTools(1, 12, { 
  search: 'ChatGPT',
  category_id: 1,
  sortBy: 'created_at'
})
```

### Handle Loading & Error
```jsx
{isLoading && <SkeletonList />}
{error && <EmptyState title="Error loading" />}
{data?.data?.length === 0 && <EmptyState />}
{data?.data?.map(item => <Card key={item.id} {...item} />)}
```

### Query Parameters
```javascript
// Sync with URL
const [searchParams, setSearchParams] = useSearchParams()
const page = searchParams.get('page') || '1'

// Update URL
const newParams = new URLSearchParams(searchParams)
newParams.set('page', 2)
setSearchParams(newParams)
```

---

## 🛠️ Database Queries

### Most Useful Queries

**List all tools**
```sql
SELECT * FROM tools WHERE deleted_at IS NULL;
```

**Search full-text**
```sql
SELECT * FROM tools 
WHERE MATCH(name, description) AGAINST('chatgpt' IN BOOLEAN MODE)
AND deleted_at IS NULL;
```

**Get tool with tags**
```sql
SELECT t.*, GROUP_CONCAT(tg.name) as tags
FROM tools t
LEFT JOIN tool_tags tt ON t.id = tt.tool_id
LEFT JOIN tags tg ON tt.tag_id = tg.id
WHERE t.id = 1;
```

**Count by category**
```sql
SELECT category_id, COUNT(*) as count
FROM tools
WHERE deleted_at IS NULL
GROUP BY category_id;
```

**Top viewed tools**
```sql
SELECT * FROM tools 
WHERE deleted_at IS NULL
ORDER BY view_count DESC
LIMIT 10;
```

**Trending prompts**
```sql
SELECT * FROM prompts
WHERE deleted_at IS NULL
ORDER BY copy_count DESC
LIMIT 10;
```

---

## 🐛 Common Issues & Fixes

### Frontend Issues

**"Cannot read property 'map' of undefined"**
- Check if data exists: `{data?.data?.map(...)}`
- Add loading state: `{isLoading ? <Loader /> : ...}`

**"401 Unauthorized"**
- Token expired or invalid
- Clear localStorage and re-login
- Check Authorization header in API calls

**Styles not applying**
- Check className exists in globals.css
- Verify Tailwind config includes the path
- Clear build cache: `npm run build`

### Backend Issues

**"Connection refused"**
- Ensure MySQL is running
- Check DB credentials in .env
- Test connection: `php -S localhost:3001`

**"Table doesn't exist"**
- Import schema: `mysql -u root -p ai_tools_db < database/schema.sql`
- Verify database name matches .env

**CORS errors**
- Check CORS_ORIGIN in backend .env
- Should match frontend URL (http://localhost:5173)

---

## 📝 Common Code Patterns

### Add New API Endpoint

**Frontend (services/api.js)**
```javascript
toolsAPI: {
  getAll: (page, perPage, filters) => 
    api.get('/tools', { params: { page, perPage, ...filters } }),
  
  create: (data) => 
    api.post('/admin/tools', data),
}
```

**Backend (index.php)**
```php
'POST /admin/tools' => function() {
  $data = json_decode(file_get_contents('php://input'), true);
  AuthMiddleware::authenticate();
  return ToolController::create($data);
}
```

### Add New React Query Hook

```javascript
// hooks/useQueries.js
export const useToolCreate = () => {
  return useMutation({
    mutationFn: (data) => toolsAPI.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['tools'])
    }
  })
}
```

### Add New Page

```javascript
// pages/NewPage.jsx
import { useNewHook } from '../hooks/useQueries'

export default function NewPage() {
  const { data, isLoading } = useNewHook()
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Content */}
    </div>
  )
}
```

---

## 📚 Documentation Links

- [Complete Setup Guide](./SETUP_INSTRUCTIONS.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Project Status](./COMPLETION_STATUS.md)
- [React Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Router Docs](https://reactrouter.com)

---

## 🚀 Deployment

### Frontend Build
```bash
cd frontend
npm run build
# Output in dist/
# Deploy to Vercel, Netlify, or static hosting
```

### Backend Deployment
- Upload to PHP hosting
- Update .env with production DB
- Set APP_ENV=production
- Change JWT_SECRET
- Configure CORS_ORIGIN

---

## 💡 Pro Tips

1. **Use React DevTools** - Browser extension for debugging state
2. **Use Redux DevTools** - Useful for React Query debugging
3. **Test API with Postman** - Before integrating into frontend
4. **Use VS Code REST Client** - For quick API testing (`.rest` files)
5. **Enable query logging** - `queryClient.setDefaultOptions({ logger: console })`
6. **Check Network tab** - Inspect all API requests/responses
7. **Use dark mode** - Test both light and dark themes

---

**Last Updated**: 2024  
**Created for**: AI Tools & Prompts Library Project
