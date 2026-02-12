# 🐳 Docker Deployment Guide

> Container orchestration with Docker Compose

## Overview

The application uses Docker Compose to orchestrate multiple services:
- **PostgreSQL**: Database server
- **Laravel API**: Backend application  
- **Nginx**: Web server & reverse proxy
- **Next.js**: Frontend application
- **Mailpit**: Email testing tool

---

## Prerequisites

```bash
Docker >= 24.0
Docker Compose >= 2.20
```

##Install Docker

### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### macOS
```bash
brew install --cask docker
```

### Windows
Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)

---

## Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd massage-app
```

### 2. Copy Environment Files

```bash
# Backend
cp massage-app-backend/.env.example massage-app-backend/.env

# Frontend
cp massage-app-frontend/.env.example massage-app-frontend/.env.local
```

### 3. Configure Environment

**Backend** (`massage-app-backend/.env`):
```env
APP_NAME="Massage App"
APP_ENV=production
APP_KEY=  # Will be generated
APP_DEBUG=false
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=massage_app
DB_USERNAME=postgres
DB_PASSWORD=secret

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
```

**Frontend** (`massage-app-frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Start All Services

```bash
docker-compose up -d
```

### 5. Initialize Application

```bash
# Generate app key
docker-compose exec laravel_api php artisan key:generate

# Run migrations
docker-compose exec laravel_api php artisan migrate --force

# Install Passport
docker-compose exec laravel_api php artisan passport:install --force

# Seed database (optional)
docker-compose exec laravel_api php artisan db:seed
```

### 6. Access Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Mailpit UI**: http://localhost:8025
- **Database**: localhost:5432

---

## Docker Compose Configuration

### docker-compose.yml

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: postgres
    restart: unless-stopped
    ports:
      - "5432:5432"
    volumes:
      - massage-app_db_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: massage_app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --locale=C"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - massage-app

  # Laravel Backend
  laravel_api:
    build:
      context: ./massage-app-backend
      dockerfile: Dockerfile
    container_name: laravel_api
    restart: unless-stopped
    working_dir: /var/www
    volumes:
      - ./massage-app-backend:/var/www
      - laravel_storage:/var/www/storage
      - laravel_cache:/var/www/bootstrap/cache
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DB_CONNECTION: pgsql
      DB_HOST: postgres
      DB_PORT: 5432
      DB_DATABASE: massage_app
      DB_USERNAME: postgres
      DB_PASSWORD: secret
    networks:
      - massage-app

  # Nginx Web Server
  laravel_nginx:
    image: nginx:alpine
    container_name: laravel_nginx
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./massage-app-backend/docker/nginx.conf:/etc/nginx/conf.d/default.conf
      - ./massage-app-backend/public:/var/www/public
    depends_on:
      - laravel_api
    networks:
      - massage-app

  # Next.js Frontend
  next_app:
    build:
      context: ./massage-app-frontend
      dockerfile: Dockerfile
    container_name: next_app
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./massage-app-frontend:/app
      - /app/node_modules
      - /app/.next
    environment:
      NEXT_PUBLIC_API_URL: http://laravel_api:8000
      NODE_ENV: production
    depends_on:
      - laravel_api
    networks:
      - massage-app

  # Mailpit (Email Testing)
  mailpit:
    image: axllent/mailpit:latest
    container_name: mailpit
    restart: unless-stopped
    ports:
      - "8025:8025"  # Web UI
      - "1025:1025"  # SMTP
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8025/api/v1/info"]
      interval: 10s
      timeout: 5s
      retries: 3
    networks:
      - massage-app

volumes:
  massage-app_db_data:
    driver: local
  laravel_storage:
    driver: local
  laravel_cache:
    driver: local

networks:
  massage-app:
    driver: bridge
```

---

## Docker Commands

### Service Management

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart laravel_api

# View logs
docker-compose logs -f
docker-compose logs -f laravel_api
docker-compose logs -f next_app

# Check service status
docker-compose ps

# View resource usage
docker stats
```

### Container Access

```bash
# Execute command in container
docker-compose exec laravel_api php artisan migrate

# Access container shell
docker-compose exec laravel_api bash
docker-compose exec postgres psql -U postgres

# Copy files from container
docker cp laravel_api:/var/www/storage/logs/laravel.log ./logs/
```

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect massage-app_db_data

# Remove all volumes (WARNING: Data loss)
docker-compose down -v
```

### Image Management

```bash
# Build images
docker-compose build

# Rebuild without cache
docker-compose build --no-cache

# Pull latest images
docker-compose pull

# Remove unused images
docker image prune -a
```

---

## Backend Dockerfile

```dockerfile
# massage-app-backend/Dockerfile
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    postgresql-dev \
    zip \
    unzip \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    linux-headers

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Expose port
EXPOSE 9000

CMD ["php-fpm"]
```

---

## Frontend Dockerfile

```dockerfile
# massage-app-frontend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Build application
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

---

## Health Checks

### Check All Services

```bash
# Quick check
docker-compose ps

# Detailed health
docker inspect --format='{{.State.Health.Status}}' postgres
docker inspect --format='{{.State.Health.Status}}' mailpit
```

### Manual Health Checks

```bash
# PostgreSQL
docker-compose exec postgres pg_isready -U postgres

# Laravel API
curl http://localhost:8000/api/health

# Next.js
curl http://localhost:3000/api/health

# Mailpit
curl http://localhost:8025/api/v1/info
```

---

## Backup & Restore

### Database Backup

```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres massage_app > backup_$(date +%Y%m%d).sql

# Backup with Docker
docker-compose exec postgres pg_dump -U postgres massage_app | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Database Restore

```bash
# Restore from backup
docker-compose exec -T postgres psql -U postgres massage_app < backup_20260212.sql

# Restore from compressed backup
gunzip -c backup_20260212.sql.gz | docker-compose exec -T postgres psql -U postgres massage_app
```

### Volume Backup

```bash
# Backup volumes
docker run --rm \
  -v massage-app_db_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/db_data_backup.tar.gz /data
```

---

## Production Configuration

### Production docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    restart: always
    volumes:
      - db_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G

  laravel_api:
    build: ./massage-app-backend
    restart: always
    environment:
      APP_ENV: production
      APP_DEBUG: false
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

### SSL with Nginx

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name api.massage-app.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    location / {
        proxy_pass http://laravel_api:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Troubleshooting

### Issue: Container Won't Start

```bash
# Check logs
docker-compose logs laravel_api

# Check configuration
docker-compose config

# Rebuild container
docker-compose up -d --build laravel_api
```

### Issue: Database Connection Failed

```bash
# Check database is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Test connection
docker-compose exec laravel_api php artisan tinker
>>> DB::connection()->getPdo();
```

### Issue: Port Already in Use

```bash
# Find process using port
lsof -i :3000
sudo netstat -tulpn | grep :3000

# Kill process or change port in docker-compose.yml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Issue: Volume Permission Denied

```bash
# Fix permissions
docker-compose exec laravel_api chown -R www-data:www-data storage bootstrap/cache

# Or from host
sudo chown -R $USER:$USER massage-app-backend/storage
```

---

## Monitoring

### View Resource Usage

```bash
docker stats
```

### View Container Logs

```bash
# Real-time logs
docker-compose logs -f --tail=100

# Export logs
docker-compose logs > application.log
```

### Disk Usage

```bash
# Docker disk usage
docker system df

# Detailed breakdown
docker system df -v

# Clean up unused resources
docker system prune -a
```

---

## Security Best Practices

- ✅ Use secrets management (Docker Secrets/Vault)
- ✅ Don't commit `.env` files to Git
- ✅ Run containers as non-root user
- ✅ Keep images updated
- ✅ Scan images for vulnerabilities
- ✅ Use specific image tags (not `latest`)
- ✅ Limit container resources
- ✅ Use SSL/TLS in production

---

## References

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Last Updated**: February 12, 2026
