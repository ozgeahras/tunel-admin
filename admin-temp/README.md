# 🚀 Tunel Admin Backend

Professional admin backend API for the Tunel job platform - Complete content management system.

## ✨ Features

- 🔐 **Secure Admin Authentication** - JWT-based login system
- 💼 **Jobs Management** - Complete CRUD operations for job postings
- 🏢 **Companies Management** - Manage partner companies and profiles
- 📝 **Content Management** - Dynamic homepage content editing
- 📊 **Analytics Dashboard** - Real-time platform statistics
- 🖼️ **Media Upload** - Image upload and management system
- 🔒 **Security** - Helmet, CORS, input validation
- ⚡ **TypeScript** - Full type safety and modern development

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## 🔧 Environment Setup

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Admin Authentication
JWT_SECRET=your-super-secret-jwt-key
ADMIN_EMAIL=admin@tunel.com
ADMIN_PASSWORD=admin123

# Database (Supabase)
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
```

## 📡 API Endpoints

### 🔐 Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

### 💼 Jobs Management
- `GET /api/jobs` - List all jobs (with pagination)
- `POST /api/jobs` - Create new job posting
- `PUT /api/jobs/:id` - Update existing job
- `DELETE /api/jobs/:id` - Delete job posting
- `PATCH /api/jobs/:id/status` - Toggle job status

### 🏢 Companies Management
- `GET /api/companies` - List all companies
- `POST /api/companies` - Add new company
- `PUT /api/companies/:id` - Update company profile
- `DELETE /api/companies/:id` - Remove company

### 📝 Content Management
- `GET /api/content/homepage` - Get homepage content
- `PUT /api/content/homepage` - Update homepage content
- `POST /api/content/upload` - Upload images
- `GET /api/content/images` - List uploaded media
- `GET /api/content/analytics` - Platform analytics

## 🔑 Default Admin Access

- **Email:** `admin@tunel.com`
- **Password:** `admin123`

> ⚠️ **Important:** Change default credentials in production!

## 🚁 Deployment Options

### Railway (Recommended)
```bash
# Connect to Railway
railway login
railway link
railway up
```

### Render
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables

### Vercel (Serverless)
```bash
vercel --prod
```

### Heroku
```bash
git push heroku main
```

## 📊 API Response Examples

### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "id": "1",
    "email": "admin@tunel.com",
    "name": "Admin"
  }
}
```

### Jobs Response
```json
{
  "jobs": [
    {
      "id": "1",
      "title": "Senior React Developer",
      "company": "Spotify",
      "location": "Stockholm, Sweden",
      "salary": "€70,000 - €95,000",
      "status": "active",
      "applications": 23
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 156,
    "pages": 16
  }
}
```

## 🛡️ Security Features

- JWT token authentication
- Request rate limiting
- Input validation and sanitization
- CORS protection
- Helmet security headers
- File upload restrictions
- Environment variable protection

## 🔄 Development Workflow

```bash
# Install dependencies
npm install

# Start development with auto-reload
npm run dev

# Run type checking
npx tsc --noEmit

# Build production bundle
npm run build

# Start production server
npm start
```

## 📱 Frontend Integration

Connect your frontend to this admin API:

```javascript
// Login to admin
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Use token for authenticated requests
const jobs = await fetch('/api/jobs', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   lsof -ti:5000 | xargs kill -9
   ```

2. **Environment variables not loading**
   - Check `.env` file exists
   - Verify variable names match exactly

3. **Database connection issues**
   - Verify Supabase credentials
   - Check network connectivity

## 📞 Support

For questions or issues:
- 📧 Email: admin@tunel.com
- 💬 GitHub Issues: Create an issue in this repository

---

Built with ❤️ for the Tunel platform