# 💆 Massage App - Appointment Booking Platform

> Modern full-stack platform for massage therapy service booking and management

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-11.x-red)](https://laravel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![PHP](https://img.shields.io/badge/PHP-8.2-purple)](https://www.php.net/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

---

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd massage-app

# Start all services
docker-compose up -d

# Initialize backend
docker-compose exec laravel_api php artisan migrate
docker-compose exec laravel_api php artisan passport:install --force

# Access services
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Mailpit: http://localhost:8025
```

### Manual Setup

#### Prerequisites
- Node.js >= 20.x
- PHP >= 8.2
- PostgreSQL >= 16
- Composer >= 2.6

#### Backend
```bash
cd massage-app-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan passport:install
php artisan serve  # http://localhost:8000
```

#### Frontend
```bash
cd massage-app-frontend
npm install
cp .env.example .env.local
npm run dev  # http://localhost:3000
```

---

## 📚 Documentation

**Complete documentation is available in the [`docs/`](docs/) directory.**

| Document | Description |
|----------|-------------|
| [**Architecture**](docs/ARCHITECTURE.md) | Complete system architecture and design |
| [**Backend Setup**](docs/backend/SETUP.md) | Laravel installation and configuration |
| [**Backend API**](docs/backend/API.md) | RESTful API endpoints and examples |
| [**Frontend Guide**](docs/frontend/README.md) | Next.js development guide |
| [**Frontend Structure**](docs/frontend/STRUCTURE.md) | Project structure and patterns |
| [**Docker Deployment**](docs/deployment/DOCKER.md) | Container orchestration guide |
| [**Development Guide**](docs/development/GUIDE.md) | Development workflow |

---

## 🎯 Key Features

### For Users
- 🔐 **Secure Authentication**: OAuth2 with JWT tokens
- 📅 **Easy Booking**: Real-time appointment scheduling
- 👤 **Profile Management**: Personal information and history
- 📧 **Email Notifications**: Booking confirmations and reminders
- 🌙 **Dark Mode**: Comfortable viewing experience

### For Administrators
- 📊 **Admin Dashboard**: Complete management interface
- 📋 **Kanban Board**: Task management with drag-and-drop
- 📈 **Live Logs**: Real-time application monitoring
- 🎯 **Appointment Control**: Manage bookings and services
- 🌐 **RTL Support**: Persian language interface

---

## 🏗️ Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **@dnd-kit** - Drag-and-drop functionality

### Backend
- **Laravel 11** - PHP framework
- **PostgreSQL 16** - Relational database
- **Laravel Passport** - OAuth2 authentication
- **PHP 8.2** - Modern PHP features

### Infrastructure
- **Docker** - Containerization
- **Nginx** - Web server
- **Mailpit** - Email testing

---

## 📂 Project Structure

```
massage-app/
├── docs/                          # 📚 Complete documentation
│   ├── ARCHITECTURE.md            # System architecture
│   ├── backend/                   # Backend docs
│   ├── frontend/                  # Frontend docs
│   ├── deployment/                # Deployment guides
│   └── development/               # Development guides
│
├── massage-app-backend/           # 🔧 Laravel Backend
│   ├── app/                       # Application code
│   ├── config/                    # Configuration
│   ├── database/                  # Migrations & seeders
│   └── routes/                    # API routes
│
├── massage-app-frontend/          # 🎨 Next.js Frontend
│   ├── app/                       # App Router pages
│   │   ├── admin/                 # Admin panel
│   │   ├── api/                   # API routes
│   │   ├── auth/                  # Authentication
│   │   └── dashboard/             # User dashboard
│   ├── components/                # React components
│   └── hooks/                     # Custom hooks
│
├── scripts/                       # 🛠️ Utility scripts
│   └── manage-todos.js            # TODO management
│
└── docker-compose.yml             # 🐳 Docker orchestration
```

---

## 🔧 Development

### TODO Management

This project includes a powerful Kanban-style task management system:

```bash
# Web UI (Recommended)
npm run dev
# Visit: http://localhost:3000/admin/todos

# CLI
node scripts/manage-todos.js stats
node scripts/manage-todos.js view
```

### Common Commands

```bash
# Backend
php artisan migrate              # Run migrations
php artisan test                 # Run tests
php artisan cache:clear          # Clear cache

# Frontend
npm run dev                      # Development server
npm run build                    # Production build
npm run lint                     # Lint code

# Docker
docker-compose up -d             # Start services
docker-compose logs -f           # View logs
docker-compose down              # Stop services
```

---

## 🧪 Testing

### Backend Tests
```bash
cd massage-app-backend
php artisan test
php artisan test --coverage
```

### Frontend Tests
```bash
cd massage-app-frontend
npm run test
npm run test:coverage
```

---

## 🚢 Deployment

### Production Build

```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose exec laravel_api php artisan migrate --force
```

For detailed deployment instructions, see [Docker Deployment Guide](docs/deployment/DOCKER.md).

---

## 📊 Architecture Overview

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│   Frontend  │◄───────►│  Backend    │◄───────►│  PostgreSQL  │
│  Next.js    │  REST   │  Laravel    │  Query  │   Database   │
│  Port 3000  │   API   │  Port 8000  │         │   Port 5432  │
└─────────────┘         └─────────────┘         └──────────────┘
                              │
                              ▼
                        ┌─────────────┐
                        │   Mailpit   │
                        │   SMTP      │
                        │  Port 1025  │
                        └─────────────┘
```

For complete architecture details, see [Architecture Documentation](docs/ARCHITECTURE.md).

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [Development Guide](docs/development/GUIDE.md) for more details.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Email**: support@massage-app.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Laravel](https://laravel.com/) - PHP framework
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Docker](https://www.docker.com/) - Containerization

---

**Version**: 1.0.0  
**Last Updated**: February 12, 2026  
**Status**: Active Development

---

**Made with ❤️ by the Massage App Team**
