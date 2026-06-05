# Architecture Overview

Complete technical architecture and system design for the AI Tools & Prompts Library.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Client Browser                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              React Vite Application                     │    │
│  │  - React Router (Client-side routing)                  │    │
│  │  - React Query (Server state management)               │    │
│  │  - Tailwind CSS (Styling)                              │    │
│  │  - Zustand (Optional local state)                      │    │
│  └────────────────┬────────────────────────────────────────┘    │
└─────────────────┼──────────────────────────────────────────────┘
                  │
              HTTP/HTTPS
            (CORS enabled)
                  │
┌─────────────────┼──────────────────────────────────────────────┐
│                 ▼                                                 │
│          API Gateway / Proxy                                      │
│  (Optional - for production)                                     │
└─────────────────┼──────────────────────────────────────────────┘
                  │
                  │
┌─────────────────┼──────────────────────────────────────────────┐
│                 ▼                                                 │
│         PHP Backend Application                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Slim Framework Router (index.php)                      │   │
│  │  - REST endpoints                                       │   │
│  │  - JWT authentication                                  │   │
│  │  - Request/response middleware                         │   │
│  └────────┬────────────────────────────┬────────────────────┘   │
│           │                            │                         │
│  ┌────────▼──────────────┐  ┌─────────▼─────────────────┐      │
│  │ Controllers (6)       │  │ Models (6)                │      │
│  ├──────────────────────┤  ├──────────────────────────┤      │
│  │ - ToolController     │  │ - Tool                   │      │
│  │ - PromptController   │  │ - Prompt                 │      │
│  │ - CategoryController │  │ - Category               │      │
│  │ - TagController      │  │ - Tag                    │      │
│  │ - FeaturedController │  │ - Admin                  │      │
│  │ - AdminController    │  │ - Featured               │      │
│  └──────────────────────┘  └─────────────────────────┘      │
│                    │                │                         │
│                    └────────┬────────┘                         │
│                             │                                  │
│  ┌──────────────────────────▼─────────────────────────────┐  │
│  │        Utilities & Middleware                           │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ - Database (PDO singleton)                            │  │
│  │ - Response (JSON formatter)                           │  │
│  │ - JwtHelper (Token encode/decode)                     │  │
│  │ - AuthMiddleware (Token validation)                   │  │
│  │ - Validator (Input validation)                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────┬──────────────────────────────────────────┘
                  │
                  │
        ┌─────────┴──────────┐
        │                    │
┌───────▼──────┐    ┌────────▼────────┐
│   MySQL 8.0  │    │  File Storage   │
│   Database   │    │  (/uploads/)    │
│              │    │                 │
│  - 11 Tables │    │ - Tool logos    │
│  - Full-text │    │ - Prompt images │
│  - Indexes   │    │ - User uploads  │
│  - FK + CK   │    └─────────────────┘
│  - Soft del. │
└──────────────┘
```

---

## 🔄 Request/Response Flow

### Public Endpoint Example: Get Tools

```
1. Browser
   └─> GET /api/tools?page=1&perPage=12&search=ChatGPT
   
2. Frontend (React)
   ├─> Axios interceptor adds Authorization header
   └─> useTools hook (React Query) manages cache
   
3. Backend Router (index.php)
   ├─> Match route: GET /tools
   ├─> Extract params: page=1, perPage=12, search=ChatGPT
   └─> Call ToolController::getAll()
   
4. Controller (ToolController.php)
   ├─> Validate params (page ≥ 1, perPage ≤ 100)
   ├─> Call model: Tool::getAll(1, 12, filters)
   └─> Format response
   
5. Model (Tool.php)
   ├─> Build SQL query with MATCH/AGAINST
   ├─> Prepare statement (prevent SQL injection)
   ├─> Execute: Database::execute($query, $params)
   └─> Fetch results
   
6. Database (PDO)
   ├─> SELECT * FROM tools MATCH(name, description) AGAINST('ChatGPT')
   ├─> Join tool_categories, tags
   └─> Return array
   
7. Response (Response.php)
   ├─> Format: { success: true, data: [...], pagination: {...} }
   └─> Set headers: Content-Type: application/json
   
8. Browser receives JSON
   ├─> React Query caches for 5 minutes
   ├─> Render results in Grid
   └─> Show pagination controls
```

### Admin Endpoint Example: Create Tool

```
1. Admin submits form
   └─> POST /admin/tools with { name, description, ... }
   
2. Frontend
   ├─> Extract token from localStorage
   ├─> Axios interceptor adds: Authorization: Bearer {token}
   └─> Send FormData with file upload
   
3. Backend Router
   ├─> Match: POST /admin/tools
   ├─> Instantiate AdminController
   └─> Call: AdminController::createTool()
   
4. Controller
   ├─> AuthMiddleware::authenticate() validates JWT
   ├─> Get admin_id from token
   ├─> Validate request body
   ├─> Call model: Tool::create($data)
   └─> Return created tool with ID
   
5. Model
   ├─> Validate all required fields
   ├─> Create slug from name
   ├─> Insert into tools table
   ├─> Insert into tool_tags (junction table)
   ├─> Return lastInsertId
   └─> Soft delete works with deleted_at IS NULL check
   
6. Response
   └─> { success: true, data: { id, name, ... } }
   
7. Frontend
   ├─> useMutation triggers onSuccess
   ├─> Invalidate React Query cache
   ├─> Show success toast
   └─> Navigate or refresh list
```

---

## 📊 Data Models & Relationships

### Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│   admins        │
├─────────────────┤
│ id (PK)         │
│ email (UNIQUE)  │
│ password_hash   │
│ name            │
│ role            │
└─────────────────┘
        │
        │ manages
        │
        └──────────┬──────────────┬──────────────┐
                   │              │              │
        ┌──────────▼───┐  ┌──────▼──────┐  ┌───▼──────────┐
        │    tools     │  │  prompts    │  │ categories   │
        ├──────────────┤  ├─────────────┤  ├──────────────┤
        │ id (PK)      │  │ id (PK)     │  │ id (PK)      │
        │ name         │  │ title       │  │ name         │
        │ slug (UNIQUE)│  │ slug        │  │ slug         │
        │ description  │  │ content     │  │ type (tool/) │
        │ logo_url     │  │ preview_text│  │ icon_emoji   │
        │ website_url  │  │ complexity  │  │ color_hex    │
        │ category_id  │  │ category_id │  └──────────────┘
        │ pricing      │  │ industry    │
        │ view_count   │  │ copy_count  │
        │ is_featured  │  │ is_featured │
        │ deleted_at   │  │ deleted_at  │
        └──────────────┘  └─────────────┘
             │ has              │ has
             │                  │
        ┌────▼────────┐  ┌──────▼───────┐
        │ tool_tags   │  │ prompt_tags  │
        ├─────────────┤  ├──────────────┤
        │ tool_id(FK) │  │ prompt_id(FK)│
        │ tag_id(FK)  │  │ tag_id(FK)   │
        └────┬────────┘  └──────┬───────┘
             │ has              │
             └────────┬─────────┘
                      │
              ┌───────▼────────┐
              │     tags       │
              ├────────────────┤
              │ id (PK)        │
              │ name           │
              │ slug (UNIQUE)  │
              │ usage_count    │
              └────────────────┘

┌──────────────────────┐    ┌──────────────────┐
│   featured_items     │    │     media        │
├──────────────────────┤    ├──────────────────┤
│ id (PK)              │    │ id (PK)          │
│ entity_type (enum)   │    │ filename         │
│ entity_id            │    │ file_url         │
│ collection_slug      │    │ entity_type      │
│ display_order        │    │ entity_id        │
└──────────────────────┘    └──────────────────┘
```

---

## 🔐 Authentication & Authorization

### JWT Token Structure

```javascript
// Encoded JWT Format: header.payload.signature

// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "admin_id": 1,
  "email": "admin@example.com",
  "iat": 1704067200,      // Issued at
  "exp": 1704153600       // Expires in 24 hours
}

// Signature
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  "JWT_SECRET_KEY"
)
```

### Authentication Flow

```
1. Admin Login
   ├─> POST /api/admin/login { email, password }
   ├─> Verify email exists in admins table
   ├─> Hash incoming password with bcrypt
   ├─> Compare with stored hash
   ├─> If match: Generate JWT token
   └─> Return { token, admin: { id, email, name } }

2. Store Token
   ├─> Save to localStorage['authToken']
   ├─> Save admin data to AuthContext
   └─> Persist across page reloads

3. Use Token in Requests
   ├─> Axios interceptor reads localStorage['authToken']
   ├─> Add header: Authorization: Bearer <token>
   └─> Send request

4. Verify Token
   ├─> Backend receives request
   ├─> AuthMiddleware extracts token from header
   ├─> JwtHelper::decode($token, JWT_SECRET)
   ├─> Check expiration (exp > current_time)
   ├─> If valid: Set $_SESSION['admin_id']
   └─> If invalid: Return 401 Unauthorized

5. On Logout
   ├─> Clear localStorage['authToken']
   ├─> Clear AuthContext
   └─> Redirect to /admin/login
```

### Authorization

**Role-Based Access Control (RBAC)**

```php
// In AuthMiddleware or AdminController

$adminRole = Admin::getRole($admin_id);

if ($adminRole !== 'super_admin' && $adminRole !== 'admin') {
    Response::forbidden('Insufficient permissions');
}

// In database: role = enum('super_admin', 'admin', 'editor', 'viewer')
```

---

## 🗄️ Database Schema

### Tables Overview

| Table | Rows | Purpose | Indexes |
|-------|------|---------|---------|
| tools | ~50 | Core tools catalog | FULLTEXT(name, description), INDEX(slug), INDEX(category_id) |
| prompts | ~50 | Prompt templates | FULLTEXT(title, content), INDEX(slug), INDEX(category_id) |
| tool_categories | ~8 | Tool categories | INDEX(slug) |
| prompt_categories | ~6 | Prompt categories | INDEX(slug) |
| tags | ~30 | Searchable tags | INDEX(slug), INDEX(usage_count) |
| tool_tags | ~100 | Tool-tag relationships | INDEX(tool_id), INDEX(tag_id) |
| prompt_tags | ~80 | Prompt-tag relationships | INDEX(prompt_id), INDEX(tag_id) |
| admins | 1-5 | Admin users | INDEX(email) |
| featured_items | ~20 | Featured content | INDEX(entity_type, collection_slug) |
| media | ~50 | User uploads | INDEX(entity_type, entity_id) |
| activity_logs | ~100+ | Audit trail | INDEX(admin_id), INDEX(created_at) |

### Key Constraints

- **Primary Keys**: All tables have `id` auto-increment
- **Foreign Keys**: `ON DELETE CASCADE` for junction tables
- **Unique Constraints**: `slug` fields, `email` in admins
- **Soft Deletes**: `deleted_at` timestamp (NULL = active)
- **Timestamps**: `created_at`, `updated_at` with DEFAULT CURRENT_TIMESTAMP

---

## 🎯 Frontend Architecture

### State Management

```
┌─────────────────────────────────────┐
│      React Component Tree           │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Providers (App.jsx)        │   │
│  ├─────────────────────────────┤   │
│  │ - QueryClientProvider       │   │
│  │ - ThemeProvider             │   │
│  │ - AuthProvider              │   │
│  └────────┬────────────────────┘   │
│           │                         │
│  ┌────────▼────────────────────┐   │
│  │  Page Components            │   │
│  ├─────────────────────────────┤   │
│  │ - HomePage                  │   │
│  │ - ToolsPage                 │   │
│  │ - PromptDetailPage          │   │
│  │ - AdminDashboard            │   │
│  └────────┬────────────────────┘   │
│           │                         │
│  ┌────────▼────────────────────┐   │
│  │  Custom Hooks               │   │
│  ├─────────────────────────────┤   │
│  │ - useTools (React Query)    │   │
│  │ - useAuth (Context)         │   │
│  │ - useTheme (Context)        │   │
│  └────────┬────────────────────┘   │
│           │                         │
│  ┌────────▼────────────────────┐   │
│  │  Data Sources               │   │
│  ├─────────────────────────────┤   │
│  │ - React Query Cache         │   │
│  │ - localStorage              │   │
│  │ - sessionStorage            │   │
│  │ - URL searchParams          │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Caching Strategy

```
┌────────────────────────────────────┐
│   React Query Cache                │
├────────────────────────────────────┤
│                                    │
│  staleTime: 5 minutes              │
│  gcTime: 10 minutes                │
│                                    │
│  Query Keys (invalidation targets):│
│  ├─ ['tools', page, filters]      │
│  ├─ ['tool', id]                  │
│  ├─ ['prompts', page, filters]    │
│  ├─ ['prompt', id]                │
│  ├─ ['categories', type]          │
│  ├─ ['tags', page]                │
│  └─ ['featured']                  │
│                                    │
│  Manual Invalidation:              │
│  └─ queryClient.invalidateQueries()│
│     (on create/update/delete)      │
└────────────────────────────────────┘
```

---

## 🔗 API Endpoints Summary

### Public (13 endpoints)

| Method | Path | Purpose |
|--------|------|---------|
| GET | /tools | List all tools with pagination |
| GET | /tools/:id | Get single tool details |
| POST | /tools/:id/view | Increment view count |
| GET | /prompts | List all prompts |
| GET | /prompts/:id | Get single prompt |
| POST | /prompts/:id/copy | Increment copy count |
| GET | /categories | List categories (with type param) |
| GET | /tags | List all tags |
| GET | /tags/popular | Get popular tags |
| GET | /featured | Get featured items |
| GET | /featured/collections | Get featured collections |
| GET | /search | Global search |
| POST | /admin/login | Admin authentication |

### Protected (20+ endpoints - to be implemented)

| Method | Path | Purpose |
|--------|------|---------|
| GET | /admin/me | Get current admin |
| POST | /admin/logout | Admin logout |
| GET | /admin/dashboard | Dashboard statistics |
| POST | /admin/tools | Create tool |
| PUT | /admin/tools/:id | Update tool |
| DELETE | /admin/tools/:id | Delete (soft) tool |
| POST | /admin/tools/:id/restore | Restore tool |
| POST | /admin/prompts | Create prompt |
| PUT | /admin/prompts/:id | Update prompt |
| DELETE | /admin/prompts/:id | Delete (soft) prompt |
| POST | /admin/upload | Upload media |
| GET | /admin/categories | List categories (admin) |
| POST | /admin/categories | Create category |
| And more... | | |

---

## 🚀 Deployment Architecture

### Development
```
localhost:5173 (Frontend)  ──┐
                             ├──> localhost:3001 (Backend)
localhost:3306 (MySQL)   ───┘
```

### Production
```
CDN / Vercel (Frontend)  ──┐
                           ├──> api.example.com (Backend)
                           ├──> db.example.com (MySQL)
                           └──> storage.example.com (Files)

SSL/TLS everywhere
CORS configured
Rate limiting enabled
Monitoring active
```

---

## 📈 Performance Considerations

### Frontend Optimization
- Lazy loading routes with React Router
- Image lazy loading with `loading="lazy"`
- CSS-in-JS minimization
- Bundle splitting with Vite
- Caching with React Query (5-min stale time)
- Debounced search (300ms)

### Backend Optimization
- Prepared statements (prevent SQL injection + faster execution)
- FULLTEXT indexes on search columns
- Composite indexes on foreign keys
- Query result caching (consider Redis)
- Pagination limits (max 100 per page)
- Connection pooling

### Database Optimization
- Soft deletes with IS NULL filtering
- Indexes on commonly queried columns
- Normalized schema to 3NF
- Query monitoring and slow query logs
- Regular ANALYZE table maintenance

---

**Architecture Version**: 1.0  
**Last Updated**: 2024  
**Designed for**: Production-grade SaaS application
