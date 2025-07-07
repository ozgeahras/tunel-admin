# Tunel Admin Backend

Admin backend API for the Tunel job platform.

## Features

- 🔐 Admin authentication with JWT
- 📝 Content management (jobs, companies, homepage)
- 📊 Analytics and reporting  
- 🖼️ Image upload and management
- 🔧 RESTful API endpoints

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

### Jobs Management
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `PATCH /api/jobs/:id/status` - Toggle job status

### Companies Management
- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create company
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company

### Content Management
- `GET /api/content/homepage` - Get homepage content
- `PUT /api/content/homepage` - Update homepage content
- `POST /api/content/upload` - Upload image
- `GET /api/content/images` - Get uploaded images
- `GET /api/content/analytics` - Get analytics data

## Environment Variables

```bash
PORT=5000
NODE_ENV=development
JWT_SECRET=your-jwt-secret
ADMIN_EMAIL=admin@tunel.com
ADMIN_PASSWORD=admin123
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
```

## Default Admin Credentials

- Email: `admin@tunel.com`
- Password: `admin123`

## Deployment

This backend can be deployed to:
- Railway
- Heroku  
- Vercel (serverless)
- DigitalOcean App Platform