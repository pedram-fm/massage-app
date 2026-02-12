# 🛠️ راهنمای توسعه - Development Guide

> مستندات کامل برای developers

## 📚 فهرست مطالب

- [شروع سریع](#شروع-سریع)
- [مدیریت TODO](#مدیریت-todo)
- [استانداردهای کدنویسی](#استانداردهای-کدنویسی)
- [ساختار پروژه](#ساختار-پروژه)
- [Git Workflow](#git-workflow)
- [Testing](#testing)
- [Deployment](#deployment)

---

## 🚀 شروع سریع

### پیش‌نیازها
```bash
- Node.js >= 20.x
- npm >= 10.x
- Git
```

### نصب

```bash
# Clone repository
git clone <repository-url>
cd massage-app

# نصب dependencies - Frontend
cd massage-app-frontend
npm install

# نصب dependencies - Backend
cd ../massage-app-backend
composer install

# راه‌اندازی Docker
cd ..
docker-compose up -d
```

### اجرای پروژه

```bash
# Frontend (در پورت 3000)
cd massage-app-frontend
npm run dev

# Backend (در پورت 8000)
cd massage-app-backend
php artisan serve
```

---

## 📋 مدیریت TODO

### استفاده از TODO.md

فایل [TODO.md](TODO.md) شامل تمام تسک‌های پروژه است.

#### فرمت تسک‌ها:
```markdown
- [ ] **TASK-ID**: عنوان کوتاه
  - Priority: P0/P1/P2/P3
  - Estimate: Xh
  - Files: `path/to/file.ts`
  - Details: توضیحات تکمیلی
```

#### اولویت‌ها:
- **P0**: فوری - باید فوراً انجام شود (Critical/Security)
- **P1**: بالا - این هفته (High)
- **P2**: متوسط - این ماه (Medium)
- **P3**: پایین - آینده (Low)

### استفاده از اسکریپت مدیریت

اسکریپت [scripts/manage-todos.js](scripts/manage-todos.js) ابزار قدرتمندی برای مدیریت تسک‌هاست.

#### نمایش آمار:
```bash
node scripts/manage-todos.js stats
```

خروجی:
```
📊 آمار کلی پروژه

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  کل تسک‌ها:        68
  ✅ انجام شده:     12
  ⏳ در انتظار:     56
  📈 پیشرفت:        17.6%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 آمار بر اساس اولویت:

  P0: 1/7 (14%)
  P1: 8/31 (26%)
  P2: 3/27 (11%)
  P3: 0/3 (0%)
```

#### لیست تسک‌های باز:
```bash
node scripts/manage-todos.js list
```

#### تسک‌های فوری:
```bash
node scripts/manage-todos.js priority P0
```

#### جستجو در تسک‌ها:
```bash
node scripts/manage-todos.js search "authentication"
```

#### مارک کردن تسک به عنوان انجام شده:
```bash
node scripts/manage-todos.js done SEC-001
```

#### بازکردن تسک:
```bash
node scripts/manage-todos.js reopen SEC-001
```

### استفاده از VSCode Extensions

برای تجربه بهتر، extension های زیر را نصب کنید:

1. **Todo Tree** - نمایش تمام TODO ها در sidebar
2. **Todo Highlight** - رنگ‌آمیزی TODO ها در کد

این extension ها به صورت خودکار TODO.md را می‌خوانند و در sidebar نمایش می‌دهند.

---

## 📝 استانداردهای کدنویسی

### TypeScript

#### نام‌گذاری:
```typescript
// Components: PascalCase
export function UserProfile() {}

// Hooks: camelCase با پیشوند use
export function useAuthState() {}

// Types/Interfaces: PascalCase
interface UserData {}
type ApiResponse = {}

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = "...";

// Functions: camelCase
function fetchUserData() {}
```

#### Type Safety:
```typescript
// ❌ Bad
const data: any = await fetch(...);

// ✅ Good
interface ApiResponse {
  data: User[];
  message: string;
}
const data: ApiResponse = await fetch(...);
```

#### Avoid:
```typescript
// ❌ استفاده از any
// ❌ Type assertion بدون دلیل
// ❌ Implicit any
// ❌ Non-null assertion (!.) بدون check
```

### React

#### Component Structure:
```typescript
// 1. Imports
import { useState, useEffect } from 'react';
import { SomeType } from '@/types';

// 2. Types/Interfaces
interface Props {
  userId: string;
}

// 3. Component
export function UserProfile({ userId }: Props) {
  // 3.1. Hooks
  const [user, setUser] = useState<User | null>(null);
  
  // 3.2. Effects
  useEffect(() => {
    // ...
  }, [userId]);
  
  // 3.3. Handlers
  const handleClick = () => {
    // ...
  };
  
  // 3.4. Render
  return (
    <div>{/* ... */}</div>
  );
}
```

#### Hooks Best Practices:
```typescript
// ✅ Dependencies را صحیح مشخص کنید
useEffect(() => {
  fetchData(userId);
}, [userId]); // ✅

// ✅ از useMemo برای محاسبات سنگین استفاده کنید
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ✅ از useCallback برای functions که به children پاس می‌شوند
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### Tailwind CSS

```tsx
// ✅ استفاده از ترکیب classes
<div className="flex items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-sm">

// ✅ استفاده از CSS variables برای theming
<div className="bg-[color:var(--surface)] text-[color:var(--brand)]">

// ❌ استفاده بیش از حد از inline styles
<div style={{ color: 'red', padding: '10px' }}> // Bad
```

### Git Commit Messages

فرمت:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: قابلیت جدید
- `fix`: رفع باگ
- `docs`: تغییرات در documentation
- `style`: تغییرات formatting (بدون تأثیر روی کد)
- `refactor`: refactoring کد
- `perf`: بهبود performance
- `test`: اضافه کردن/تغییر تست‌ها
- `chore`: تغییرات build/tools

مثال‌ها:
```bash
feat(auth): add refresh token logic
fix(dashboard): resolve loading state bug
docs(readme): update setup instructions
refactor(api): extract API base URL to helper
perf(components): memoize expensive calculations
```

---

## 🗂️ ساختار پروژه

### Frontend (Next.js)

```
massage-app-frontend/
├── app/                      # Next.js App Router
│   ├── (routes)/            # Route groups
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── ui/                  # Base UI components (shadcn)
│   └── [feature]/           # Feature-specific components
├── hooks/                   # Custom React hooks
│   └── [feature]/
├── lib/                     # Utilities & helpers
│   ├── api.ts              # API utilities
│   └── utils.ts            # General utilities
├── types/                   # TypeScript types (to be added)
│   ├── api.ts
│   └── models.ts
├── stores/                  # State management (to be added)
│   ├── auth.ts
│   └── ui.ts
└── public/                  # Static assets
```

### Backend (Laravel)

```
massage-app-backend/
├── app/
│   ├── Actions/            # Business logic
│   ├── DTOs/               # Data Transfer Objects
│   ├── Http/
│   │   └── Controllers/
│   ├── Models/
│   ├── Repositories/       # Data access layer
│   └── Services/           # Service layer
├── config/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
└── tests/
```

---

## 🔄 Git Workflow

### Branching Strategy

```
main (production)
  ├── develop (development)
  │   ├── feature/SEC-001-httponly-cookies
  │   ├── feature/ARCH-002-react-query
  │   ├── fix/login-validation
  │   └── refactor/api-base-url
```

### Branch Naming:
- `feature/TASK-ID-short-description`
- `fix/issue-description`
- `refactor/what-is-being-refactored`
- `docs/what-docs-updated`

### Workflow:

1. **ایجاد branch جدید:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/SEC-001-httponly-cookies
```

2. **کار روی feature:**
```bash
# تغییرات خود را commit کنید
git add .
git commit -m "feat(auth): implement httpOnly cookie storage"

# TODO را update کنید
node scripts/manage-todos.js done SEC-001
git add TODO.md
git commit -m "docs(todo): mark SEC-001 as completed"
```

3. **Push و PR:**
```bash
git push origin feature/SEC-001-httponly-cookies
# ایجاد Pull Request در GitHub/GitLab
```

4. **Merge به develop:**
```bash
# بعد از review و approval
git checkout develop
git merge feature/SEC-001-httponly-cookies
git push origin develop
```

---

## 🧪 Testing

### Unit Tests (Jest)

```bash
# اجرای تست‌ها
npm test

# اجرای با coverage
npm test -- --coverage

# watch mode
npm test -- --watch
```

### نوشتن تست:

```typescript
// lib/api.test.ts
import { getApiBaseUrl } from './api';

describe('getApiBaseUrl', () => {
  it('should return env variable if set', () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.example.com';
    expect(getApiBaseUrl()).toBe('https://api.example.com');
  });

  it('should fallback to localhost', () => {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
    expect(getApiBaseUrl()).toBe('http://localhost:8000');
  });
});
```

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
# نصب Vercel CLI
npm i -g vercel

# Deploy
cd massage-app-frontend
vercel
```

### Backend (Laravel)

```bash
# Build
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Deploy
# (بستگی به hosting شما دارد)
```

---

## 💡 نکات مهم

### Performance

1. **Code Splitting**: از dynamic imports استفاده کنید
2. **Image Optimization**: همیشه از `next/image` استفاده کنید
3. **Bundle Analysis**: 
   ```bash
   npm run build
   npm run analyze
   ```

### Security

1. **Environment Variables**: هیچ‌وقت sensitive data را commit نکنید
2. **Dependencies**: به طور منظم `npm audit` اجرا کنید
3. **HTTPS**: در production همیشه HTTPS استفاده کنید

### Accessibility

1. **Semantic HTML**: از تگ‌های معنایی استفاده کنید
2. **ARIA**: aria-label, aria-describedby را فراموش نکنید
3. **Keyboard Navigation**: تمام UI باید با keyboard قابل استفاده باشد

---

## 🆘 دریافت کمک

- مشکلات فنی: [GitHub Issues](link)
- سوالات: [Discussion Board](link)
- Security Issues: security@example.com

---

## 📄 License

MIT License - جزئیات در فایل LICENSE
