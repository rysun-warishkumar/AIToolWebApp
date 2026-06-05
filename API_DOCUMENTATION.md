# API Documentation

Complete REST API documentation for the AI Tools & Prompt Library.

## Base URL

```
http://localhost:3001/backend/src/api
```

## Response Format

All endpoints return JSON with this structure:

```json
{
  "success": true,
  "message": "Description",
  "data": {},
  "pagination": {
    "total": 100,
    "page": 1,
    "perPage": 12,
    "totalPages": 9
  }
}
```

## Authentication

Protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

---

## Public Endpoints

### Tools

#### List Tools
```
GET /tools
```

Query Parameters:
- `page`: Page number (default: 1)
- `perPage`: Items per page (default: 12, max: 100)
- `search`: Search query
- `category`: Category ID
- `pricing`: free, freemium, paid
- `sortBy`: popularity_score, name, created_at, view_count
- `sortOrder`: asc, desc

**Example:**
```bash
GET /tools?page=1&perPage=12&category=1&pricing=free&sortBy=popularity_score&sortOrder=desc
```

**Response:**
```json
{
  "success": true,
  "message": "Tools retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "ChatGPT",
      "slug": "chatgpt",
      "short_description": "Advanced AI chatbot",
      "description": "Full description...",
      "logo_url": "https://...",
      "website_url": "https://chat.openai.com",
      "category_id": 1,
      "category_name": "Writing & Content",
      "pricing_model": "freemium",
      "status": "published",
      "is_featured": true,
      "view_count": 5234,
      "tags": [
        {"id": 1, "name": "ChatGPT", "slug": "chatgpt"}
      ]
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "perPage": 12,
    "totalPages": 4
  }
}
```

#### Get Tool Details
```
GET /tools/:id
```

**Parameters:**
- `id`: Tool ID (path parameter)

**Response:**
```json
{
  "success": true,
  "message": "Tool retrieved successfully",
  "data": {
    "id": 1,
    "name": "ChatGPT",
    // ... full tool details
    "tags": []
  }
}
```

#### Search Tools
```
GET /tools/search
```

**Query Parameters:**
- `q`: Search query (minimum 2 characters)
- `page`: Page number
- `perPage`: Items per page

---

### Prompts

#### List Prompts
```
GET /prompts
```

Query Parameters:
- `page`: Page number (default: 1)
- `perPage`: Items per page (default: 12)
- `search`: Search query
- `category`: Category ID
- `complexity`: beginner, intermediate, advanced
- `sortBy`: created_at, copy_count, view_count
- `sortOrder`: asc, desc

#### Get Prompt Details
```
GET /prompts/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Blog Post Outline Generator",
    "content": "You are an expert...",
    "category_name": "Content Creation",
    "complexity": "beginner",
    "view_count": 1200,
    "copy_count": 340,
    "tags": []
  }
}
```

#### Increment Copy Count
```
POST /prompts/:id/copy
```

**Response:**
```json
{
  "success": true,
  "data": {
    "copy_count": 341
  }
}
```

---

### Categories

#### List Tool Categories
```
GET /categories?type=tool
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Writing & Content",
      "slug": "writing-content",
      "color": "#8B5CF6",
      "is_active": true
    }
  ]
}
```

#### List Prompt Categories
```
GET /categories?type=prompt
```

---

### Tags

#### List Popular Tags
```
GET /tags/popular?limit=20
```

#### List All Tags
```
GET /tags?page=1&perPage=50
```

---

### Featured Items

#### Get Featured Items
```
GET /featured?collection=best-writing-tools&type=tool
```

**Query Parameters:**
- `collection`: Collection slug (optional)
- `type`: tool or prompt (optional)

#### Get Featured Collections
```
GET /featured/collections
```

---

## Admin Protected Endpoints

### Authentication

#### Admin Login
```
POST /admin/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": 1,
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "super_admin"
    }
  }
}
```

#### Get Current Admin
```
GET /admin/me
Headers: Authorization: Bearer <token>
```

---

### Tools Management

#### Create Tool
```
POST /admin/tools
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Tool",
  "slug": "new-tool",
  "short_description": "Description",
  "description": "Full description",
  "logo_url": "https://...",
  "website_url": "https://...",
  "category_id": 1,
  "pricing_model": "free",
  "status": "published",
  "is_featured": false,
  "tags": [1, 2, 3]
}
```

#### Update Tool
```
PUT /admin/tools/:id
Authorization: Bearer <token>
```

**Request Body:** (same structure as create)

#### Delete Tool (soft delete)
```
DELETE /admin/tools/:id
Authorization: Bearer <token>
```

#### Restore Tool
```
POST /admin/tools/:id/restore
Authorization: Bearer <token>
```

---

### Prompts Management

#### Create Prompt
```
POST /admin/prompts
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New Prompt",
  "slug": "new-prompt",
  "short_description": "Description",
  "content": "Full prompt content",
  "preview_text": "Preview text",
  "category_id": 1,
  "prompt_type": "template",
  "industry": "Marketing",
  "complexity": "intermediate",
  "status": "published",
  "tags": [1, 2, 3]
}
```

#### Update Prompt
```
PUT /admin/prompts/:id
Authorization: Bearer <token>
```

#### Delete Prompt
```
DELETE /admin/prompts/:id
Authorization: Bearer <token>
```

---

### Media Upload

#### Upload Media
```
POST /admin/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: File to upload (max 5MB)
- `entity_type`: tool, prompt, category, setting

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "filename": "logo_12345.png",
    "file_url": "/uploads/logo_12345.png"
  }
}
```

---

## Error Responses

### Bad Request (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format"
  }
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Unprocessable Entity (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {}
}
```

---

## Rate Limiting

Currently not enforced but should be added to production:
- **Public endpoints**: 100 requests per minute per IP
- **Admin endpoints**: 50 requests per minute per token

---

## CORS

Configured for frontend at:
```
http://localhost:5173
```

All endpoints support:
- `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- Custom headers: `Content-Type`, `Authorization`

---

## Testing Endpoints

### Using cURL

```bash
# Get tools
curl http://localhost:3001/backend/src/api/tools

# Search tools
curl "http://localhost:3001/backend/src/api/tools?search=ChatGPT"

# Login
curl -X POST http://localhost:3001/backend/src/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aitoolslib.com","password":"password"}'

# Create tool (with token)
curl -X POST http://localhost:3001/backend/src/api/admin/tools \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Tool",...}'
```

### Using Postman

1. Import the endpoints into Postman
2. Set `{{BASE_URL}}` to `http://localhost:3001/backend/src/api`
3. Use the token from login as Bearer token

---

## Pagination

All list endpoints support pagination:

```
GET /tools?page=1&perPage=12
```

Response includes:
```json
"pagination": {
  "total": 100,
  "page": 1,
  "perPage": 12,
  "totalPages": 9
}
```

---

## Search

Full-text search on:
- Tools: `name`, `description`
- Prompts: `title`, `content`

Use `search` query parameter with minimum 2 characters:
```
GET /tools?search=ai%20assistant
```

---

## Filtering & Sorting

### Filters
- Category by ID
- Pricing model
- Status (published, draft, archived)
- Complexity level
- Tags

### Sorting
- `popularity_score`: Default for tools
- `created_at`: Default for prompts
- `name`: A-Z
- `view_count`
- `copy_count`: Prompts only

---

## Webhooks (Future)

Planned for Phase 2:
- Tool created/updated/deleted
- Prompt copied
- User activity events

---

For more information, refer to the main [README.md](./README.md)
