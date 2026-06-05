# Setup Instructions

Complete step-by-step guide to set up and run the AI Tools & Prompt Library platform.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download](https://www.mysql.com/downloads/)

## Quick Start (5 minutes)

### 1. Database Setup

```bash
# Open MySQL and create database
mysql -u root -p

# In MySQL terminal:
CREATE DATABASE ai_tools_db;
USE ai_tools_db;

# Import schema
mysql -u root -p ai_tools_db < database/schema.sql

# Import seed data (optional)
mysql -u root -p ai_tools_db < database/seed.sql

# Exit MySQL
exit;
```

### 2. Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# nano .env  (or use your text editor)

# Install dependencies
npm install

# Start Node backend
npm start

# Backend will be available at: http://localhost:3001
```

### 3. Frontend Setup

```bash
# In a new terminal window
cd frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will be available at: http://localhost:5173
```

### 4. Access the Application

- **Public Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin/login
- **Demo Credentials**:
  - Email: `admin@aitoolslib.com`
  - Password: `password`

## Detailed Setup

### Backend Configuration

1. **Environment Variables** (`.env`):
```env
APP_NAME=AI Tools Library
APP_ENV=development
APP_DEBUG=true

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ai_tools_db
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRY=86400

# CORS
CORS_ORIGIN=http://localhost:5173
```

2. **Install Dependencies**:
```bash
cd backend
npm install
```

3. **Database Migrations**:
```bash
# The schema is already in database/schema.sql
mysql -u root -p ai_tools_db < ../database/schema.sql
```

### Frontend Configuration

1. **Environment Variables** (`.env`):
```env
VITE_API_URL=http://localhost:3001/backend/src/api
VITE_APP_NAME=AI Tools Library
VITE_APP_DESCRIPTION=Discover and share AI tools and prompt templates
```

2. **Install Dependencies**:
```bash
cd frontend
npm install
```

3. **Available Scripts**:
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code with ESLint
npm run format   # Format code with Prettier
```

## Development Workflow

### Running Both Services

**Terminal 1 - Backend:**
```bash
cd backend
php -S localhost:3001 -t src
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Making API Requests

The frontend automatically connects to the backend at `http://localhost:3001/backend/src/api`.

Example API requests in browser:
- `http://localhost:3001/backend/src/api/tools`
- `http://localhost:3001/backend/src/api/prompts`
- `http://localhost:3001/backend/src/api/categories`

### Creating Test Data

Use the seed data already included:
```bash
mysql -u root -p ai_tools_db < database/seed.sql
```

## Production Deployment

### Frontend (Vite Build)

```bash
cd frontend
npm run build

# Output will be in dist/
# Deploy dist/ to CDN or static hosting
```

### Backend (PHP)

1. Set `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false`
3. Generate a new `JWT_SECRET`
4. Configure database on production server
5. Deploy files to web server with PHP 8.0+
6. Set proper file permissions:
```bash
chmod 755 backend
chmod 644 backend/src/index.php
chmod 755 backend/uploads
```

## Troubleshooting

### "Connection refused" error

**Frontend:**
- Ensure backend is running on port 3001
- Check CORS_ORIGIN in backend .env matches frontend URL

**Backend:**
- Check database credentials in .env
- Verify MySQL server is running
- Try: `mysql -u root -p -e "SELECT 1"`

### "No database selected" error

```bash
# Make sure database is created and imported
mysql -u root -p
CREATE DATABASE ai_tools_db;
USE ai_tools_db;
SOURCE /path/to/database/schema.sql;
```

### Port already in use

```bash
# Find process using port
lsof -i :3001  # Backend
lsof -i :5173  # Frontend

# Kill process
kill -9 <PID>
```

### NPM dependency issues

```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## File Structure

```
AIToolsWebApp/
├── frontend/
│   ├── src/
│   │   ├── pages/          # React pages
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   ├── context/        # React context
│   │   ├── utils/          # Utilities
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Middleware
│   │   ├── utils/          # Utilities
│   │   └── index.php       # Entry point
│   ├── uploads/            # User uploads
│   ├── composer.json
│   └── .env.example
└── database/
    ├── schema.sql          # Database schema
    └── seed.sql            # Sample data
```

## Next Steps

1. ✅ Explore the admin dashboard
2. ✅ Add your own tools and prompts
3. ✅ Customize styling and branding
4. ✅ Set up email notifications (optional)
5. ✅ Deploy to production

## Support & Documentation

- API Documentation: See [README.md](./README.md)
- Component Library: Check `frontend/src/components/`
- Database Schema: See `database/schema.sql`

## Common Commands

```bash
# Start fresh
npm run dev          # Frontend
php -S localhost:3001 -t src  # Backend

# Code quality
npm run lint         # Check code
npm run format       # Format code

# Production build
npm run build        # Build frontend

# Database
mysql -u root -p ai_tools_db < database/schema.sql  # Reset DB
```

Happy coding! 🚀
