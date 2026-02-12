# 📚 Documentation Index

> Complete documentation for the Massage Booking Application

## Quick Links

| Document | Description |
|----------|-------------|
| [**Architecture**](ARCHITECTURE.md) | Complete system architecture and technical design |
| [**Backend API**](backend/API.md) | RESTful API documentation and endpoints |
| [**Backend Setup**](backend/SETUP.md) | Laravel backend installation and configuration |
| [**Frontend Guide**](frontend/README.md) | Next.js frontend development guide |
| [**Frontend Structure**](frontend/STRUCTURE.md) | Frontend folder organization and patterns |
| [**Docker Deployment**](deployment/DOCKER.md) | Container orchestration and deployment |
| [**Development Guide**](development/GUIDE.md) | Development workflow and best practices |
| [**TODO Management**](development/TODO.md) | Task tracking and project management |

---

## 📖 Documentation Structure

```
docs/
├── ARCHITECTURE.md              # 🏗️ System architecture (READ FIRST)
├── README.md                    # This file
│
├── backend/                     # Backend documentation
│   ├── README.md                # Backend overview
│   ├── API.md                   # API endpoints & examples
│   ├── SETUP.md                 # Installation guide
│   └── DATABASE.md              # Database schema & migrations
│
├── frontend/                    # Frontend documentation
│   ├── README.md                # Frontend overview
│   ├── STRUCTURE.md             # Folder structure
│   ├── COMPONENTS.md            # Component library
│   └── STYLING.md               # CSS & Tailwind usage
│
├── deployment/                  # Deployment guides
│   ├── DOCKER.md                # Docker Compose setup
│   ├── PRODUCTION.md            # Production deployment
│   └── TROUBLESHOOTING.md       # Common issues & fixes
│
└── development/                 # Development resources
    ├── GUIDE.md                 # Development workflow
    ├── TODO.md                  # Task management
    ├── CONTRIBUTING.md          # Contribution guidelines
    └── CHANGELOG.md             # Version history
```

---

## 🚀 Getting Started

### For New Developers

1. **Read [ARCHITECTURE.md](ARCHITECTURE.md)** - Understand the system design
2. **Follow [Backend Setup](backend/SETUP.md)** - Get backend running
3. **Follow [Frontend Guide](frontend/README.md)** - Get frontend running
4. **Check [Development Guide](development/GUIDE.md)** - Learn the workflow

### For DevOps Engineers

1. **Read [Docker Deployment](deployment/DOCKER.md)** - Container setup
2. **Read [Production Guide](deployment/PRODUCTION.md)** - Deploy to production
3. **Check [Troubleshooting](deployment/TROUBLESHOOTING.md)** - Fix common issues

### For API Consumers

1. **Read [API Documentation](backend/API.md)** - Available endpoints
2. **Check [Authentication Flow](ARCHITECTURE.md#authentication--authorization)** - OAuth2 setup

---

## 🎯 Key Concepts

### Technology Stack

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Backend**: Laravel 11 + PHP 8.2 + PostgreSQL 16
- **Infrastructure**: Docker Compose + Nginx + Mailpit
- **Authentication**: Laravel Passport (OAuth2)

### Architecture Pattern

```
Frontend (Next.js) ←→ REST API ←→ Backend (Laravel) ←→ Database (PostgreSQL)
```

### Key Features

- 🔐 OAuth2 authentication with JWT
- 📅 Real-time appointment booking
- 👨‍💼 Admin panel with Kanban board
- 📊 Live log monitoring
- 📧 Email notifications
- 🌙 Dark mode support
- 🌐 RTL (Right-to-Left) for Persian

---

## 📝 Documentation Guidelines

### When to Update

- Adding new features → Update relevant docs
- Changing APIs → Update API.md
- Modifying database → Update DATABASE.md
- Changing deployment → Update DOCKER.md

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Update documentation
4. Submit a pull request

### Documentation Standards

- Use **clear, concise language**
- Include **code examples**
- Add **diagrams** where helpful
- Keep **table of contents** updated
- Use **markdown formatting**

---

## 🔍 Search Tips

Use GitHub's search or your IDE's file search:

- **API endpoints**: Search in `backend/API.md`
- **Component examples**: Search in `frontend/COMPONENTS.md`
- **Error fixes**: Search in `deployment/TROUBLESHOOTING.md`
- **Setup steps**: Search in `**/SETUP.md`

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: dev@example.com

---

## 📜 License

This documentation is licensed under the same license as the project.

---

**Last Updated**: February 12, 2026  
**Documentation Version**: 1.0.0
