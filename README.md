# AI Tools & Prompt Library Platform

A premium, full-stack web application for discovering, sharing, and managing AI tools and prompt templates. Built with React, Vite, Tailwind CSS, PHP, and MySQL.

## 🌟 Features

### Public Frontend
- **Landing Page**: Hero section, featured tools, trending prompts, categories
- **AI Tools Listing**: Advanced search, filtering, sorting, pagination
- **Prompt Library**: Trending prompts, category filters, copy-to-clipboard
- **Tool Details**: Complete tool information, related tools, external link handling
- **Prompt Preview**: Full prompt content, tags, use cases
- **Search Results**: Global search across tools and prompts
- **Responsive Design**: Mobile-first, fully responsive UI
- **Dark/Light Mode**: Theme support with system preference detection
- **Premium UI**: Glassmorphism, smooth animations, gradient accents

### Admin Dashboard
- **Authentication**: Secure JWT-based login
- **Dashboard**: Metrics, recent activities, quick stats
- **Tools Management**: CRUD operations, featured status, soft delete
- **Prompt Management**: Create, edit, delete, publish/archive prompts
- **Media Management**: Logo/screenshot upload with preview
- **Category & Tags**: Manage taxonomies
- **Featured Content**: Manage trending items
- **Settings**: Platform configuration

## 📁 Project Structure

```
AIToolsWebApp/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom hooks
│   │   ├── context/         # React context
│   │   ├── utils/           # Utilities
│   │   ├── styles/          # Global styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/                 # PHP backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Middleware
│   │   ├── validators/      # Input validators
│   │   ├── utils/           # Utilities
│   │   ├── config/          # Configuration
│   │   └── index.php        # Entry point
│   ├── uploads/             # Media uploads
│   ├── composer.json
│   └── .env.example
├── database/
│   ├── schema.sql           # Database schema
│   ├── seed.sql             # Seed data
│   └── migrations/
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PHP 8.0+
- MySQL 8.0+
- Composer

### Installation

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Root Shortcut
```bash
npm start
```

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure .env with your database credentials
npm start
```

#### Database Setup
```bash
# Create database
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

## 📚 API Documentation

### Public Endpoints

#### Tools
- `GET /api/tools` - List tools with pagination
- `GET /api/tools/:id` - Get tool details
- `GET /api/tools/search` - Search tools
- `GET /api/tools/category/:id` - Tools by category

#### Prompts
- `GET /api/prompts` - List prompts
- `GET /api/prompts/:id` - Get prompt details
- `GET /api/prompts/search` - Search prompts
- `POST /api/prompts/:id/copy` - Increment copy count

#### Categories & Tags
- `GET /api/categories` - List categories
- `GET /api/tags` - List tags
- `GET /api/featured` - Get featured items

### Admin Endpoints (Protected)

#### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/me` - Get current admin

#### Tools Management
- `POST /api/admin/tools` - Create tool
- `PUT /api/admin/tools/:id` - Update tool
- `DELETE /api/admin/tools/:id` - Delete tool
- `POST /api/admin/tools/:id/restore` - Restore deleted tool

#### Prompts Management
- `POST /api/admin/prompts` - Create prompt
- `PUT /api/admin/prompts/:id` - Update prompt
- `DELETE /api/admin/prompts/:id` - Delete prompt

#### Media
- `POST /api/admin/upload` - Upload media
- `DELETE /api/admin/media/:id` - Delete media

## 🗄️ Database Schema

### Core Tables
- **admins**: Admin users
- **tools**: AI tools directory
- **tool_categories**: Tool categories
- **prompts**: Prompt templates
- **prompt_categories**: Prompt categories
- **tags**: Shared tags
- **tool_tags**: Tool-tag relationships
- **prompt_tags**: Prompt-tag relationships
- **media**: Uploaded files
- **settings**: Platform settings
- **featured_items**: Featured content management

## 🎨 Design System

### Color Palette
- **Primary**: Modern gradient blue-purple
- **Background**: Dark: `#0F0F23`, Light: `#FFFFFF`
- **Surface**: Dark: `#1A1A2E`, Light: `#F8F9FA`
- **Text**: Dark: `#E0E0FF`, Light: `#1A1A2E`

### Component Library
- Tailwind CSS for styling
- shadcn/ui components (buttons, cards, modals, etc.)
- Custom premium components for unique sections
- Smooth animations and transitions

### Key Features
- Glassmorphism cards
- Gradient accents
- Smooth hover states
- Loading skeletons
- Empty state illustrations
- Toast notifications

## 🔐 Security

- JWT token-based authentication
- Environment variable protection
- SQL injection prevention via prepared statements
- CORS configured
- XSS protection (rel="noopener noreferrer" on external links)
- Rate limiting ready
- Input validation on all endpoints

## 📊 Performance

- Server-side pagination
- Image lazy loading
- Debounced search
- Query caching
- Optimized database indexes
- Responsive images

## 🛠️ Development

### Code Quality
- ESLint for JavaScript/React
- Prettier for code formatting
- PHP_CodeSniffer for PHP
- Consistent code style across project

### Environment Variables
See `.env.example` files in frontend and backend directories.

### Running Tests
```bash
# Frontend
npm run test

# Backend
composer test
```

## 📱 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚢 Deployment

### Frontend (Vite)
```bash
npm run build
# Deploy dist/ folder to CDN or static hosting
```

### Backend (PHP)
```bash
# Deploy src/ to web server with PHP 8.0+
# Configure .env for production
# Set up SSL/TLS
```

## 📝 License
MIT

## 🤝 Contributing
See CONTRIBUTING.md for guidelines.

## 📞 Support
For issues and questions, open an issue in the repository.

---

Built with ❤️ for the AI community
