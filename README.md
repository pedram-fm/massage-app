# 💆 Massage App - اپلیکیشن رزرو ماساژ

> پلتفرم جامع مدیریت و رزرو خدمات ماساژ درمانی

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-11.x-red)](https://laravel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![PHP](https://img.shields.io/badge/PHP-8.2-purple)](https://www.php.net/)

## 🚀 شروع سریع

### پیش‌نیازها

```bash
Node.js >= 20.x
npm >= 10.x
PHP >= 8.2
Composer >= 2.x
Docker & Docker Compose (اختیاری)
```

### نصب و راه‌اندازی

#### 1️⃣ Clone و Setup

```bash
# Clone repository
git clone <repository-url>
cd massage-app

# کپی environment variables
cp .env.example .env
```

#### 2️⃣ Frontend Setup

```bash
cd massage-app-frontend

# نصب dependencies
npm install

# کپی env file
cp .env.example .env.local

# اجرای development server
npm run dev
```

Frontend در `http://localhost:3000` در دسترس خواهد بود.

#### 3️⃣ Backend Setup

```bash
cd massage-app-backend

# نصب dependencies
composer install

# کپی env file
cp .env.example .env

# Generate key
php artisan key:generate

# Migration و seed
php artisan migrate --seed

# اجرای server
php artisan serve
```

Backend API در `http://localhost:8000` در دسترس خواهد بود.

#### 4️⃣ Docker (روش جایگزین)

```bash
# راه‌اندازی تمام سرویس‌ها
docker-compose up -d

# مشاهده logs
docker-compose logs -f
```

---

## 📋 مدیریت تسک‌ها (TODO Management)

این پروژه دارای یک سیستم مدیریت TODO پیشرفته است که به **سه روش** قابل استفاده است:

### 🌐 روش 1: رابط وب (Web UI) - پیشنهادی ⭐

یک داشبورد کامل و تعاملی برای مدیریت تسک‌ها:

```bash
# اجرای frontend
cd massage-app-frontend
npm run dev

# سپس مراجعه به:
http://localhost:3000/todos
```

**قابلیت‌ها:**
- ✅ مشاهده آمار و پیشرفت به صورت real-time
- ✅ فیلتر بر اساس اولویت، وضعیت، و دسته‌بندی
- ✅ جستجوی سریع در تسک‌ها
- ✅ Complete/Uncomplete تسک‌ها با یک کلیک
- ✅ UI زیبا و responsive با dark mode support

### 📂 روش 2: مدیریت دستی

- **[massage-app-frontend/TODO.md](massage-app-frontend/TODO.md)** - لیست کامل تمام تسک‌ها
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - راهنمای کامل توسعه
- **[scripts/manage-todos.js](scripts/manage-todos.js)** - اسکریپت مدیریت خودکار

### � روش 3: خط فرمان (CLI)

```bash
# نمایش آمار کلی
npm run todo:stats

# لیست تسک‌های باز
npm run todo:list

# لیست تسک‌های انجام شده
npm run todo:completed

# تسک‌های فوری (P0)
npm run todo:p0

# تسک‌های با اولویت بالا (P1)
npm run todo:p1

# راهنمای کامل
npm run todo:help
```

### 📊 مثال خروجی

```bash
$ npm run todo:stats

📊 آمار کلی پروژه

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  کل تسک‌ها:        54
  ✅ انجام شده:     1
  ⏳ در انتظار:     53
  📈 پیشرفت:        1.9%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 آمار بر اساس اولویت:

  P0: 0/8 (0%)    ← فوری
  P1: 0/21 (0%)   ← بالا
  P2: 0/23 (0%)   ← متوسط
  P3: 0/1 (0%)    ← پایین
```

### ✅ مارک کردن تسک به عنوان انجام شده

```bash
# با استفاده از اسکریپت
node scripts/manage-todos.js done SEC-001

# یا به صورت دستی در TODO.md
- [x] **SEC-001**: توضیحات تسک
```

### 🔍 جستجو در تسک‌ها

```bash
# جستجوی کلمه کلیدی
node scripts/manage-todos.js search "authentication"

# مثال خروجی:
🔍 نتایج جستجو برای "authentication" (3 مورد):

  ⏳ [FUNC-001] Refresh Token Logic
     Line: 234 | Priority: P0

  ⏳ [ARCH-003] Global State Management با Zustand
     Line: 156 | Priority: P1
```

---

## 🧩 VSCode Integration

### Extension های پیشنهادی

با باز کردن پروژه در VSCode، extension های زیر به صورت خودکار پیشنهاد می‌شوند:

- ✅ **Todo Tree** - نمایش TODO ها در sidebar
- ✅ **ESLint** - Linting
- ✅ **Prettier** - Formatting
- ✅ **Tailwind CSS IntelliSense** - Autocomplete برای Tailwind
- ✅ **GitLens** - Git integration

### تنظیمات خودکار

فایل [.vscode/settings.json](.vscode/settings.json) شامل:
- Auto-formatting در save
- TODO highlighting با رنگ‌های مخصوص
- Tailwind IntelliSense
- TypeScript configuration

---

## 📁 ساختار پروژه

```
massage-app/
├── 📄 TODO.md                     # لیست تمام تسک‌ها
├── 📘 DEVELOPMENT.md              # راهنمای توسعه
├── 🐳 docker-compose.yml          # Docker configuration
├── 📦 package.json                # Workspace scripts
│
├── 🎨 massage-app-frontend/       # Next.js Frontend
│   ├── app/                       # App Router
│   ├── components/                # React Components
│   ├── hooks/                     # Custom Hooks
│   ├── lib/                       # Utilities
│   └── public/                    # Static Assets
│
├── ⚙️ massage-app-backend/        # Laravel Backend
│   ├── app/                       # Application Code
│   ├── database/                  # Migrations & Seeds
│   ├── routes/                    # API Routes
│   └── tests/                     # Tests
│
├── 🔧 scripts/                    # Automation Scripts
│   └── manage-todos.js            # TODO Management
│
└── 📝 .vscode/                    # VSCode Configuration
    ├── settings.json              # Editor Settings
    └── extensions.json            # Recommended Extensions
```

---

## 🎯 اولویت‌های توسعه

### 🔴 فوری (این هفته)

1. **امنیت**: جایگزینی localStorage با httpOnly cookies
2. **Route Protection**: پیاده‌سازی Middleware
3. **Environment Variables**: مستندسازی و setup
4. **Error Handling**: بهبود پیام‌های خطا

[مشاهده تسک‌های P0](TODO.md#-فوری---امنیت-critical-security)

### 🟡 اولویت بالا (این ماه)

1. **React Query**: پیاده‌سازی برای data fetching
2. **State Management**: استفاده از Zustand
3. **Accessibility**: بهبود A11Y
4. **Type Safety**: تقویت TypeScript

[مشاهده تسک‌های P1](TODO.md#-معماری-و-کد-architecture--code-quality)

---

## 🧪 Testing

```bash
# Frontend Tests
cd massage-app-frontend
npm test

# Backend Tests
cd massage-app-backend
php artisan test

# E2E Tests (در آینده)
npm run test:e2e
```

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd massage-app-frontend
vercel deploy
```

### Backend (Production)

```bash
cd massage-app-backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 📚 مستندات

- 📘 [راهنمای توسعه کامل](DEVELOPMENT.md)
- 📋 [لیست TODO](TODO.md)
- 🔧 [API Documentation](docs/API.md) _(در حال تکمیل)_
- 🏗️ [Architecture](docs/ARCHITECTURE.md) _(در حال تکمیل)_

---

## 🤝 مشارکت

برای مشارکت در پروژه:

1. Fork کنید
2. Branch جدید بسازید: `git checkout -b feature/my-feature`
3. Commit کنید: `git commit -m 'feat: add new feature'`
4. Push کنید: `git push origin feature/my-feature`
5. Pull Request ایجاد کنید

[راهنمای مشارکت کامل](DEVELOPMENT.md#-git-workflow)

---

## 📊 وضعیت پروژه

- ✅ **Frontend**: در حال توسعه فعال
- ✅ **Backend**: در حال توسعه فعال
- 🚧 **Testing**: در دست تکمیل
- 📝 **Documentation**: در حال نگارش

**پیشرفت کلی**: ~2% (1/54 تسک انجام شده)

---

## 📞 پشتیبانی

- 🐛 **Bug Reports**: [GitHub Issues](link)
- 💬 **Discussions**: [GitHub Discussions](link)
- 📧 **Email**: dev@example.com

---

## 📜 License

این پروژه تحت مجوز MIT منتشر شده است - [LICENSE](LICENSE) را برای جزئیات مشاهده کنید.

---

## ⭐ ستاره بدید!

اگر این پروژه براتون مفید بود، لطفاً یک ⭐ بدید!

---

**ساخته شده با ❤️ توسط تیم Massage App**
