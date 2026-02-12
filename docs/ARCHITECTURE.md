# 🏗️ Architecture Documentation

> Complete technical architecture of the Massage Booking Application

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Database Schema](#database-schema)
- [API Design](#api-design)
- [Authentication & Authorization](#authentication--authorization)
- [Deployment Architecture](#deployment-architecture)

---

## Overview

The Massage Booking Application is a full-stack web platform for managing and booking massage therapy services. Built with modern technologies and best practices, it provides a seamless experience for both customers and administrators.

### Key Features

- **User Management**: Registration, authentication, profile management
- **Booking System**: Real-time availability checking and reservation management
- **Admin Panel**: Complete management dashboard with Kanban board for tasks
- **Notification System**: Email notifications via Mailpit
- **Live Monitoring**: Real-time log viewing for system administrators
- **Responsive Design**: RTL support for Persian language with dark mode

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.6 | React framework with SSR/SSG capabilities |
| **TypeScript** | 5.x | Type-safe JavaScript development |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **Framer Motion** | 11.x | Animation library |
| **@dnd-kit** | 11.x | Drag-and-drop functionality for Kanban board |
| **Lucide React** | Latest | Icon library |
| **React Hook Form** | Latest | Form handling and validation |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Laravel** | 11.x | PHP framework for web applications |
| **PHP** | 8.2+ | Server-side programming language |
| **Laravel Passport** | Latest | OAuth2 authentication server |
| **PostgreSQL** | 16 | Primary database |
| **Redis** | Latest | Caching and session storage |

### DevOps & Infrastructure

| Technology | Version | Purpose |
|------------|---------|---------|
| **Docker** | Latest | Containerization platform |
| **Docker Compose** | Latest | Multi-container orchestration |
| **Nginx** | Latest | Web server and reverse proxy |
| **Mailpit** | Latest | Email testing tool |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Load Balancer                       │
│                    (Production Only)                     │
└─────────────────────────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌──────────────────┐          ┌──────────────────┐
    │   Frontend       │          │   Backend API    │
    │   Next.js App    │◄────────►│   Laravel App    │
    │   Port: 3000     │   REST   │   Port: 8000     │
    └──────────────────┘   API    └──────────────────┘
              │                             │
              │                    ┌────────┴────────┐
              │                    │                 │
              │                    ▼                 ▼
              │          ┌──────────────┐  ┌──────────────┐
              │          │  PostgreSQL  │  │   Redis      │
              │          │  Port: 5432  │  │   Port: 6379 │
              │          └──────────────┘  └──────────────┘
              │                    │
              │                    ▼
              │          ┌──────────────────┐
              │          │    Mailpit       │
              │          │  Port: 8025      │
              └─────────►│  SMTP: 1025      │
                         └──────────────────┘
```

### Communication Flow

1. **Client Request** → Frontend (Next.js on port 3000)
2. **API Call** → Backend (Laravel on port 8000)
3. **Authentication** → Laravel Passport validates JWT tokens
4. **Database Query** → PostgreSQL (port 5432)
5. **Cache Check** → Redis (port 6379)
6. **Email Notification** → Mailpit (SMTP port 1025)
7. **Response** → Backend → Frontend → Client

---

## Project Structure

### Root Directory

```
massage-app/
├── docs/                          # 📚 Documentation
│   ├── ARCHITECTURE.md            # System architecture
│   ├── backend/                   # Backend docs
│   ├── frontend/                  # Frontend docs
│   ├── deployment/                # Deployment guides
│   └── development/               # Development guides
├── massage-app-backend/           # 🔧 Laravel Backend
│   ├── app/                       # Application code
│   ├── config/                    # Configuration files
│   ├── database/                  # Migrations & seeders
│   ├── routes/                    # API routes
│   ├── storage/                   # Logs & uploaded files
│   ├── tests/                     # Unit & feature tests
│   └── docker/                    # Docker configuration
├── massage-app-frontend/          # 🎨 Next.js Frontend
│   ├── app/                       # Next.js App Router
│   │   ├── admin/                 # Admin panel pages
│   │   ├── api/                   # API routes
│   │   ├── auth/                  # Authentication pages
│   │   └── dashboard/             # User dashboard
│   ├── components/                # React components
│   │   ├── admin/                 # Admin-specific
│   │   ├── auth/                  # Auth-related
│   │   ├── shared/                # Shared components
│   │   └── ui/                    # Base UI components
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utility functions
│   └── public/                    # Static assets
├── scripts/                       # 🛠️ Utility scripts
│   └── manage-todos.js            # TODO management CLI
├── docker-compose.yml             # Docker orchestration
├── README.md                      # Project overview
└── massage.code-workspace         # VSCode workspace
```

---

## Backend Architecture

### Layers & Responsibilities

```
┌─────────────────────────────────────────────────────────┐
│                     HTTP Layer                           │
│  Controllers - Handle requests & responses               │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│                  Service Layer                           │
│  Business Logic - DTOs, Actions, Services                │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│                Repository Layer                          │
│  Data Access - Eloquent Models & Repositories            │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│                 Database Layer                           │
│  PostgreSQL - Data persistence                           │
└─────────────────────────────────────────────────────────┘
```

### Directory Structure

```
app/
├── Actions/                       # Single-purpose action classes
│   └── Auth/                      # Authentication actions
├── Contracts/                     # Interfaces & contracts
│   ├── Repositories/              # Repository interfaces
│   └── Services/                  # Service interfaces
├── DTOs/                          # Data Transfer Objects
│   └── Auth/                      # Auth-related DTOs
├── Exceptions/                    # Custom exceptions
│   ├── EmailNotVerifiedException.php
│   └── InvalidCredentialsException.php
├── Http/
│   ├── Controllers/               # Request handlers
│   │   └── Api/                   # API controllers
│   ├── Middleware/                # HTTP middleware
│   └── Requests/                  # Form request validation
├── Mail/                          # Email templates
├── Models/                        # Eloquent ORM models
│   ├── User.php
│   ├── Appointment.php
│   └── Service.php
├── Providers/                     # Service providers
│   ├── AppServiceProvider.php
│   └── AuthServiceProvider.php
├── Repositories/                  # Repository implementations
│   └── UserRepository.php
└── Services/                      # Business logic services
    └── AuthService.php

config/
├── app.php                        # Application config
├── auth.php                       # Authentication config
├── database.php                   # Database connections
├── mail.php                       # Email configuration
├── passport.php                   # OAuth2 settings
└── services.php                   # Third-party services

database/
├── factories/                     # Model factories for testing
├── migrations/                    # Database schema migrations
└── seeders/                       # Database seeders

routes/
├── api.php                        # API endpoints
├── web.php                        # Web routes
└── console.php                    # Artisan commands
```

### Key Components

#### 1. Authentication System

**Technology**: Laravel Passport (OAuth2)

```php
// Flow:
Client → /api/auth/login
       → AuthController
       → AuthService
       → JWT Token Generation
       → Response with access_token
```

**Token Storage**:
- Access tokens: `oauth_access_tokens` table
- Refresh tokens: `oauth_refresh_tokens` table
- Clients: `oauth_clients` table

#### 2. API Structure

```
/api
├── /auth
│   ├── POST /register           # User registration
│   ├── POST /login              # User login
│   ├── POST /logout             # User logout
│   ├── POST /refresh            # Refresh token
│   └── GET  /me                 # Get current user
├── /appointments
│   ├── GET    /                 # List appointments
│   ├── POST   /                 # Create appointment
│   ├── GET    /{id}             # Get appointment
│   ├── PUT    /{id}             # Update appointment
│   └── DELETE /{id}             # Delete appointment
├── /services
│   ├── GET    /                 # List services
│   └── GET    /{id}             # Get service details
└── /logs
    └── GET /tail                # Get application logs
```

#### 3. Middleware Pipeline

```
Request
  ↓
HandleCors              # CORS handling
  ↓
TrimStrings            # String trimming
  ↓
ConvertEmptyStringsToNull
  ↓
Authenticate (api)     # JWT validation
  ↓
Controller
  ↓
Response
```

---

## Frontend Architecture

### Architecture Pattern: Component-Based

```
┌─────────────────────────────────────────────────────────┐
│                    App Router (Next.js)                  │
│  Pages, Layouts, Loading, Error handling                 │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│                 Page Components                          │
│  Server & Client Components with data fetching          │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│               Shared Components                          │
│  Reusable UI components, forms, modals                   │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│              Custom Hooks                                │
│  Business logic, state management, API calls             │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│              API Layer (lib/)                            │
│  HTTP client, request/response handling                  │
└─────────────────────────────────────────────────────────┘
```

### Directory Structure

```
app/
├── admin/                         # 🔐 Admin Panel
│   ├── layout.tsx                 # Admin layout with sidebar
│   ├── page.tsx                   # Redirect to todos
│   ├── todos/                     # Kanban board for tasks
│   │   └── page.tsx               # Drag-drop task management
│   ├── logs/                      # Live log monitoring
│   │   └── page.tsx               # Real-time log viewer
│   └── appointments/              # Appointment management
│       └── page.tsx               # CRUD for appointments
├── api/                           # 🔌 API Routes (Next.js)
│   ├── todos/
│   │   └── route.ts               # TODO CRUD endpoints
│   └── logs/
│       └── tail/
│           └── route.ts           # Log fetching endpoint
├── auth/                          # 🔑 Authentication
│   └── login/
│       ├── page.tsx               # Login/Register page
│       └── loading.tsx            # Loading state
├── dashboard/                     # 📊 User Dashboard
│   ├── layout.tsx                 # Dashboard layout
│   └── page.tsx                   # Dashboard home
├── layout.tsx                     # 🏠 Root layout
├── page.tsx                       # Landing page
├── loading.tsx                    # Global loading
├── not-found.tsx                  # 404 page
└── globals.css                    # Global styles

components/
├── admin/                         # Admin-specific components
│   ├── DashboardModals.tsx        # Admin modal dialogs
│   └── NewReservationModal.tsx    # Reservation creation modal
├── auth/                          # Authentication components
│   ├── ForgotPassword.tsx         # Password reset form
│   ├── Register.tsx               # Registration form
│   └── OTPModal.tsx               # OTP verification modal
├── shared/                        # Shared/Common components
│   ├── ThemeToggle.tsx            # Dark/Light mode toggle
│   ├── CloudCompanion.tsx         # Decorative cloud animation
│   └── FloatingElements.tsx       # Animated background elements
├── figma/                         # Figma design components
└── ui/                            # Base UI components
    ├── Button.tsx
    ├── Input.tsx
    ├── Card.tsx
    └── ...

hooks/
└── auth/                          # Authentication hooks
    ├── useRegisterForm.ts         # Registration form logic
    └── useAuthApi.ts              # Auth API calls

lib/
└── api.ts                         # API client utilities
```

### Key Features

#### 1. Admin Kanban Board

**Technology**: @dnd-kit/core, @dnd-kit/sortable

```typescript
// Features:
- Drag-and-drop between columns (TODO, IN PROGRESS, DONE)
- React.memo for performance optimization
- useMemo for filtered tasks
- Touch-friendly with PointerSensor
- Real-time task updates via API
- Priority-based color coding (P0-P3)
- Subtask progress tracking
```

**Performance Optimizations**:
- Removed layout animations for smooth drag
- Single PointerSensor instead of multiple sensors
- CSS `touchAction: none` for better mobile UX
- `willChange` for GPU acceleration
- Component memoization with React.memo

#### 2. Live Log Monitor

**Features**:
- Auto-refresh every 2 seconds
- Configurable line count (100, 200, 500, 1000)
- Search/filter functionality
- Pause/Resume updates
- Auto-scroll to bottom
- Syntax highlighting for log levels

#### 3. Routing Structure

```
Frontend Routes:
/                           → Landing page (public)
/auth/login                 → Login/Register (public)
/dashboard                  → User dashboard (auth required)
/admin                      → Redirect to /admin/todos
/admin/todos                → Kanban board (admin only)
/admin/logs                 → Log monitor (admin only)
/admin/appointments         → Appointment management (admin only)
```

#### 4. State Management

**Approach**: React Hooks + Server State

```typescript
// Local state: useState, useReducer
const [tasks, setTasks] = useState<Task[]>([]);

// Server state: fetch + reload pattern
const fetchTasks = async () => {
  const response = await fetch('/api/todos');
  const data = await response.json();
  setTasks(data.tasks);
};

// Optimistic updates for drag-drop
const handleDragEnd = async (event) => {
  // Update UI immediately
  setTasks(updatedTasks);
  // Sync with server
  await fetch('/api/todos', { method: 'PATCH', ... });
};
```

---

## Database Schema

### Core Tables

#### users
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    remember_token VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### appointments
```sql
CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id BIGINT NOT NULL REFERENCES services(id),
    appointment_date TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))
);
```

#### services
```sql
CREATE TABLE services (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- in minutes
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### OAuth2 Tables (Laravel Passport)

```sql
-- Access tokens
CREATE TABLE oauth_access_tokens (
    id VARCHAR(100) PRIMARY KEY,
    user_id BIGINT,
    client_id BIGINT NOT NULL,
    name VARCHAR(255),
    scopes TEXT,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    expires_at TIMESTAMP
);

-- Refresh tokens
CREATE TABLE oauth_refresh_tokens (
    id VARCHAR(100) PRIMARY KEY,
    access_token_id VARCHAR(100) NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP
);

-- OAuth clients
CREATE TABLE oauth_clients (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    name VARCHAR(255) NOT NULL,
    secret VARCHAR(100),
    provider VARCHAR(255),
    redirect TEXT NOT NULL,
    personal_access_client BOOLEAN DEFAULT FALSE,
    password_client BOOLEAN DEFAULT FALSE,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Relationships

```
users (1) ──< (n) appointments (n) >── (1) services
  │
  │
  └──< (n) oauth_access_tokens
```

---

## API Design

### RESTful Conventions

```
HTTP Method | Endpoint           | Action
------------|-------------------|-----------------------
GET         | /api/resources    | List all resources
POST        | /api/resources    | Create new resource
GET         | /api/resources/1  | Get specific resource
PUT/PATCH   | /api/resources/1  | Update resource
DELETE      | /api/resources/1  | Delete resource
```

### Request/Response Format

#### Request Headers
```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {access_token}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe"
  },
  "message": "Operation successful"
}
```

#### Error Response (4xx/5xx)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "details": {
      "email": ["The email field is required."]
    }
  }
}
```

### Authentication Flow

```
1. POST /api/auth/register
   → Create user account
   → Send verification email

2. POST /api/auth/login
   → Validate credentials
   → Generate JWT access_token
   → Return token + user data

3. GET /api/protected-route
   → Include: Authorization: Bearer {token}
   → Validate token with Passport
   → Return requested data

4. POST /api/auth/refresh
   → Use refresh_token
   → Get new access_token

5. POST /api/auth/logout
   → Revoke current token
```

---

## Authentication & Authorization

### Laravel Passport (OAuth2)

**Key Generation**:
```bash
php artisan passport:install
php artisan passport:keys --force
```

**Token Types**:
1. **Access Token**: Short-lived (1 hour), used for API requests
2. **Refresh Token**: Long-lived (30 days), used to get new access tokens

**Middleware**:
```php
// routes/api.php
Route::middleware('auth:api')->group(function () {
    Route::get('/user', [UserController::class, 'profile']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
});
```

**Guards**:
```php
// config/auth.php
'guards' => [
    'api' => [
        'driver' => 'passport',
        'provider' => 'users',
    ],
],
```

### Frontend JWT Handling

```typescript
// Store token in localStorage
localStorage.setItem('auth_token', response.data.access_token);

// Add to requests
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
  'Content-Type': 'application/json',
};

// Clear on logout
localStorage.removeItem('auth_token');
```

---

## Deployment Architecture

### Docker Compose Services

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: massage_app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Laravel Backend API
  laravel_api:
    build:
      context: ./massage-app-backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./massage-app-backend:/var/www
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DB_CONNECTION: pgsql
      DB_HOST: postgres
      DB_PORT: 5432
      DB_DATABASE: massage_app

  # Nginx Web Server
  laravel_nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./massage-app-backend/docker/nginx.conf:/etc/nginx/conf.d/default.conf
      - ./massage-app-backend/public:/var/www/public
    depends_on:
      - laravel_api

  # Next.js Frontend
  next_app:
    build:
      context: ./massage-app-frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./massage-app-frontend:/app
      - /app/node_modules
      - /app/.next
    environment:
      NEXT_PUBLIC_API_URL: http://laravel_api:8000

  # Mailpit (Email Testing)
  mailpit:
    image: axllent/mailpit:latest
    ports:
      - "8025:8025"  # Web UI
      - "1025:1025"  # SMTP
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8025/api/v1/info"]
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  db_data:
```

### Environment Configuration

#### Backend (.env)
```env
APP_NAME="Massage App"
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://api.example.com

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=massage_app
DB_USERNAME=postgres
DB_PASSWORD=secret

PASSPORT_CLIENT_ID=...
PASSPORT_CLIENT_SECRET=...

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production Deployment

```bash
# 1. Build production images
docker-compose -f docker-compose.prod.yml build

# 2. Run migrations
docker-compose exec laravel_api php artisan migrate --force

# 3. Generate OAuth keys
docker-compose exec laravel_api php artisan passport:install --force

# 4. Cache configuration
docker-compose exec laravel_api php artisan config:cache
docker-compose exec laravel_api php artisan route:cache
docker-compose exec laravel_api php artisan view:cache

# 5. Start services
docker-compose up -d
```

---

## Performance Considerations

### Backend Optimization

1. **Database Query Optimization**
   - Eager loading relationships
   - Database indexing on foreign keys
   - Query result caching with Redis

2. **API Response Caching**
   - Cache frequently accessed data
   - Use Laravel's cache facade
   - Invalidate cache on updates

3. **Job Queues**
   - Async email sending
   - Background task processing
   - Queue workers with supervisor

### Frontend Optimization

1. **Code Splitting**
   - Route-based code splitting
   - Dynamic imports for heavy components
   - Next.js automatic chunking

2. **Image Optimization**
   - Next.js Image component
   - WebP format support
   - Lazy loading offscreen images

3. **Performance Monitoring**
   - React.memo for expensive renders
   - useMemo/useCallback hooks
   - Removed unnecessary animations

---

## Security Best Practices

### Backend

- ✅ CSRF protection enabled
- ✅ SQL injection prevention (Eloquent ORM)
- ✅ XSS protection (output escaping)
- ✅ Rate limiting on API endpoints
- ✅ JWT token expiration
- ✅ HTTPS enforcement (production)
- ✅ Environment variable security

### Frontend

- ✅ Content Security Policy headers
- ✅ Secure cookie storage
- ✅ Input validation and sanitization
- ✅ Protected routes with authentication
- ✅ No sensitive data in localStorage
- ✅ HTTPS only (production)

---

## Monitoring & Logging

### Application Logs

**Backend**: Laravel Log Viewer
```bash
# Location
storage/logs/laravel.log

# Access via API
GET /api/logs/tail?lines=200
```

**Frontend**: Browser Console + Server Logs
```bash
docker logs next_app --tail 100 --follow
```

### Health Checks

```bash
# Database
docker exec postgres pg_isready

# Backend API
curl http://localhost:8000/api/health

# Frontend
curl http://localhost:3000/api/health
```

---

## Testing Strategy

### Backend Tests

```bash
# Unit tests
php artisan test --testsuite=Unit

# Feature tests
php artisan test --testsuite=Feature

# Coverage report
php artisan test --coverage
```

### Frontend Tests

```bash
# Jest unit tests
npm run test

# Cypress E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

---

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Passport](https://laravel.com/docs/passport)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Last Updated**: February 12, 2026
**Version**: 1.0.0
**Maintained by**: Development Team
