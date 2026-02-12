# 🔧 Backend Setup Guide

> Laravel backend installation and configuration

## Prerequisites

- PHP >= 8.2
- Composer >= 2.6
- PostgreSQL >= 16
- Redis (optional, for caching)
- Node.js & npm (for asset compilation)

---

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd massage-app/massage-app-backend
```

### 2. Install Dependencies

```bash
composer install
```

### 3. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Configure Environment Variables

Edit `.env` file:

```env
APP_NAME="Massage App"
APP_ENV=local
APP_KEY=base64:...  # Auto-generated
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=massage_app
DB_USERNAME=postgres
DB_PASSWORD=your_password

# Mail (Mailpit for development)
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@massage-app.com"
MAIL_FROM_NAME="${APP_NAME}"

# Redis (optional)
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Queue
QUEUE_CONNECTION=database
```

### 5. Database Setup

```bash
# Create database
createdb massage_app

# Run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed
```

### 6. Install Laravel Passport

```bash
# Install Passport
php artisan passport:install

# Or force regenerate keys
php artisan passport:keys --force

# Create OAuth client
php artisan passport:client --personal
```

The command will output:
```
Personal access client created successfully.
Client ID: 9c5a7c05-...
Client secret: xxxxxxxxxxxx
```

**Important**: Copy the Client ID and Secret to `.env`:

```env
PASSPORT_CLIENT_ID=9c5a7c05-...
PASSPORT_CLIENT_SECRET=xxxxxxxxxxxx
```

### 7. Storage Link

```bash
# Create symbolic link for storage
php artisan storage:link
```

### 8. Cache Configuration (Production)

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 9. Start Development Server

```bash
php artisan serve
```

Backend will be available at: `http://localhost:8000`

---

## Docker Setup (Recommended)

### 1. Using Docker Compose

```bash
# From project root
docker-compose up -d

# Check logs
docker-compose logs -f laravel_api

# Run migrations inside container
docker-compose exec laravel_api php artisan migrate

# Install Passport
docker-compose exec laravel_api php artisan passport:install --force
```

### 2. Docker Services

The `docker-compose.yml` includes:
- **postgres**: PostgreSQL 16
- **laravel_api**: Laravel application (PHP-FPM)
- **laravel_nginx**: Nginx web server
- **mailpit**: Email testing tool

---

## Testing

```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature

# Run with coverage
php artisan test --coverage
```

---

## Common Tasks

### Clear All Caches

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Generate IDE Helper (Development)

```bash
composer require --dev barryvdh/laravel-ide-helper

php artisan ide-helper:generate
php artisan ide-helper:models --write
php artisan ide-helper:meta
```

### Database Operations

```bash
# Fresh migration (WARNING: drops all tables)
php artisan migrate:fresh

# Fresh migration with seeding
php artisan migrate:fresh --seed

# Rollback last migration
php artisan migrate:rollback

# Check migration status
php artisan migrate:status
```

### Queue Workers

```bash
# Start queue worker
php artisan queue:work

# Process jobs with timeout
php artisan queue:work --timeout=60

# Run queue worker as daemon
php artisan queue:work --daemon
```

---

## Troubleshooting

### Issue: "Class not found" Error

```bash
# Solution: Clear cached autoload files
composer dump-autoload
php artisan clear-compiled
php artisan cache:clear
```

### Issue: Permission Denied on storage/

```bash
# Solution: Set proper permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Issue: "Token signature mismatch"

```bash
# Solution: Regenerate Passport keys
php artisan passport:keys --force

# Clear old tokens
php artisan tinker
>>> DB::table('oauth_access_tokens')->delete();
```

### Issue: Database Connection Failed

```bash
# Check PostgreSQL is running
pg_isready

# Verify credentials in .env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1  # or 'postgres' for Docker
DB_PORT=5432
DB_DATABASE=massage_app
```

---

## Development Tools

### Laravel Debugbar

```bash
composer require barryvdh/laravel-debugbar --dev
```

### Laravel Telescope

```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

Access at: `http://localhost:8000/telescope`

### API Documentation (Scribe)

```bash
composer require --dev knuckleswtf/scribe

php artisan scribe:generate
```

---

## Environment-Specific Configuration

### Development (.env)

```env
APP_ENV=local
APP_DEBUG=true
LOG_LEVEL=debug
DEBUGBAR_ENABLED=true
```

### Production (.env)

```env
APP_ENV=production
APP_DEBUG=false
LOG_LEVEL=error
DEBUGBAR_ENABLED=false
```

---

## Maintenance Commands

### Optimize for Production

```bash
# Optimize autoloader
composer install --optimize-autoloader --no-dev

# Cache everything
php artisan optimize

# Clear logs
php artisan log:clear
```

### Backup Database

```bash
pg_dump -U postgres massage_app > backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
psql -U postgres massage_app < backup_20260212.sql
```

---

## Next Steps

- [API Documentation](API.md) - Explore available endpoints
- [Database Schema](DATABASE.md) - Understand data structure
- [Architecture](../ARCHITECTURE.md) - Learn system design

---

**Last Updated**: February 12, 2026
