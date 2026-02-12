# 📋 TODO List - Massage App Frontend

> آخرین بروزرسانی: 2026-02-12

## 🔴 فوری - امنیت (Critical Security)

### 🔐 Token Management
- [ ] **SEC-001**: جایگزینی localStorage با httpOnly cookies
  - Priority: P0
  - Estimate: 4h
  - Files: `hooks/auth/useAuthApi.ts`, `app/auth/login/page.tsx`
  - Details: پیاده‌سازی server-side cookie management برای توکن‌های JWT
  
- [ ] **SEC-002**: پیاده‌سازی CSRF Protection
  - Priority: P0
  - Estimate: 3h
  - Files: `middleware.ts` (new), `lib/api.ts`
  - Details: اضافه کردن CSRF token به هر درخواست

- [ ] **SEC-003**: اجباری کردن HTTPS در production
  - Priority: P0
  - Estimate: 1h
  - Files: `next.config.ts`, `middleware.ts`
  - Details: Redirect تمام HTTP requests به HTTPS

### 🛡️ Validation & Security
- [ ] **SEC-004**: Rate limiting برای login endpoint
  - Priority: P0
  - Estimate: 2h
  - Files: `app/auth/login/page.tsx`, `hooks/auth/useAuthApi.ts`
  - Details: محدود کردن تعداد تلاش‌های login (max 5 per 15min)

- [ ] **SEC-005**: Server-side validation برای فرم‌ها
  - Priority: P1
  - Estimate: 3h
  - Files: Backend API
  - Details: اطمینان از validation دوباره در سمت سرور

## 🟡 معماری و کد (Architecture & Code Quality)

### 🏗️ Code Refactoring
- [ ] **ARCH-001**: حذف code duplication در API base URL
  - Priority: P1
  - Estimate: 1h
  - Files: `lib/api.ts`, `app/dashboard/layout.tsx`, `app/auth/login/page.tsx`
  - Details: استفاده از یک helper function مرکزی

- [ ] **ARCH-002**: پیاده‌سازی React Query
  - Priority: P1
  - Estimate: 6h
  - Files: همه API calls
  - Dependencies: `@tanstack/react-query`
  - Details: جایگزینی fetch manual با React Query

- [ ] **ARCH-003**: Global State Management با Zustand
  - Priority: P1
  - Estimate: 4h
  - Files: `stores/auth.ts` (new), `stores/ui.ts` (new)
  - Dependencies: `zustand`
  - Details: مدیریت مرکزی auth state

- [ ] **ARCH-004**: بهبود TypeScript strictness
  - Priority: P2
  - Estimate: 3h
  - Files: `tsconfig.json`, تمام فایل‌های .ts/.tsx
  - Details: اضافه کردن `noUnusedLocals`, `noImplicitReturns`, etc.

### 📁 File Organization
- [ ] **ARCH-005**: ساختاردهی مجدد features
  - Priority: P2
  - Estimate: 4h
  - Details: تبدیل به feature-based structure به جای type-based

- [ ] **ARCH-006**: تجمیع API Types
  - Priority: P2
  - Estimate: 2h
  - Files: `types/api.ts` (new), `types/models.ts` (new)
  - Details: تعریف مرکزی تمام API response/request types

## 🟠 UX و Accessibility

### ♿ Accessibility
- [ ] **A11Y-001**: اضافه کردن aria-labels به تمام buttons
  - Priority: P1
  - Estimate: 2h
  - Files: تمام components
  - Details: بهبود screen reader support

- [ ] **A11Y-002**: Focus management در Modals
  - Priority: P1
  - Estimate: 3h
  - Files: `components/NewReservationModal.tsx`, `components/OTPModal.tsx`, etc.
  - Details: Focus trap و auto-focus پیاده‌سازی

- [ ] **A11Y-003**: Keyboard Navigation
  - Priority: P1
  - Estimate: 4h
  - Files: تمام interactive components
  - Details: تمام عملیات باید با صفحه‌کلید قابل انجام باشند

- [ ] **A11Y-004**: Skip Links برای navigation
  - Priority: P2
  - Estimate: 1h
  - Files: `app/layout.tsx`
  - Details: اضافه کردن "پرش به محتوا" برای keyboard users

### 🎨 UX Improvements
- [ ] **UX-001**: بهبود Loading States
  - Priority: P1
  - Estimate: 3h
  - Files: تمام forms و data fetching components
  - Details: skeleton screens و progress indicators

- [ ] **UX-002**: پیام‌های خطای قابل فهم‌تر
  - Priority: P1
  - Estimate: 2h
  - Files: `hooks/auth/useAuthApi.ts`, error handlers
  - Details: پیام‌های خطای کاربرپسند با راهنمای رفع مشکل

- [ ] **UX-003**: Optimistic Updates
  - Priority: P2
  - Estimate: 3h
  - Files: forms و CRUD operations
  - Details: UI بلافاصله update شود قبل از تأیید server

## 🔵 Performance

### ⚡ Bundle Optimization
- [ ] **PERF-001**: Code Splitting برای routes
  - Priority: P1
  - Estimate: 2h
  - Files: `app/**/page.tsx`
  - Details: dynamic imports برای route components

- [ ] **PERF-002**: Lazy Loading برای Radix UI components
  - Priority: P1
  - Estimate: 2h
  - Files: `components/ui/*`
  - Details: import فقط components مورد استفاده

- [ ] **PERF-003**: بهینه‌سازی Motion animations
  - Priority: P2
  - Estimate: 2h
  - Files: components با motion/react
  - Details: lazy load motion library

- [ ] **PERF-004**: Image Optimization
  - Priority: P2
  - Estimate: 3h
  - Files: جایی که تصویر اضافه می‌شود
  - Details: استفاده از next/image و WebP/AVIF formats

### 🚀 Runtime Performance
- [ ] **PERF-005**: React.memo برای component optimization
  - Priority: P2
  - Estimate: 3h
  - Files: components پرکاربرد
  - Details: جلوگیری از re-renders غیرضروری

- [ ] **PERF-006**: useMemo/useCallback optimization
  - Priority: P2
  - Estimate: 2h
  - Files: تمام components
  - Details: memoization مقادیر محاسباتی سنگین

## 🟢 Configuration

### ⚙️ Environment & Config
- [ ] **CONF-001**: ایجاد `.env.example`
  - Priority: P0
  - Estimate: 0.5h
  - Files: `.env.example` (new)
  - Details: مستندسازی تمام environment variables

- [ ] **CONF-002**: بهبود `next.config.ts`
  - Priority: P1
  - Estimate: 1h
  - Files: `next.config.ts`
  - Details: اضافه کردن security headers، compression، etc.

- [ ] **CONF-003**: ایجاد Middleware برای Route Protection
  - Priority: P0
  - Estimate: 2h
  - Files: `middleware.ts` (new)
  - Details: محافظت اتوماتیک route های protected

- [ ] **CONF-004**: تنظیم ESLint سخت‌گیرانه
  - Priority: P2
  - Estimate: 2h
  - Files: `eslint.config.mjs`
  - Details: اضافه کردن rules بیشتر برای code quality

## 🟣 Testing & Quality

### 🧪 Testing Setup
- [ ] **TEST-001**: نصب و راه‌اندازی Jest
  - Priority: P1
  - Estimate: 2h
  - Dependencies: `jest`, `@testing-library/react`, `@testing-library/jest-dom`
  - Files: `jest.config.js` (new), `jest.setup.js` (new)

- [ ] **TEST-002**: نوشتن Unit Tests برای utilities
  - Priority: P1
  - Estimate: 4h
  - Files: `lib/**/*.test.ts`
  - Details: تست functions در lib/api.ts

- [ ] **TEST-003**: Integration Tests برای Auth Flow
  - Priority: P1
  - Estimate: 6h
  - Files: `__tests__/auth/*.test.tsx`
  - Details: تست کامل login/register/logout

- [ ] **TEST-004**: E2E Testing با Playwright
  - Priority: P2
  - Estimate: 8h
  - Dependencies: `@playwright/test`
  - Files: `e2e/**/*.spec.ts` (new)

### 📊 Code Quality
- [ ] **QA-001**: نصب و تنظیم Husky
  - Priority: P2
  - Estimate: 1h
  - Dependencies: `husky`, `lint-staged`
  - Details: pre-commit hooks برای lint و format

- [ ] **QA-002**: تنظیم Prettier
  - Priority: P2
  - Estimate: 0.5h
  - Files: `.prettierrc` (new), `.prettierignore` (new)

- [ ] **QA-003**: TypeScript Type Coverage بالا
  - Priority: P2
  - Estimate: 4h
  - Files: تمام فایل‌های .ts/.tsx
  - Details: حذف any types و بهبود type inference

## 📋 Functionality

### 🔄 Authentication & Authorization
- [ ] **FUNC-001**: Refresh Token Logic
  - Priority: P0
  - Estimate: 4h
  - Files: `hooks/auth/useAuthApi.ts`, `lib/api.ts`
  - Details: اتوماتیک refresh کردن token قبل از expire

- [ ] **FUNC-002**: Session Timeout Warning
  - Priority: P1
  - Estimate: 2h
  - Files: `components/SessionTimeoutModal.tsx` (new)
  - Details: هشدار به کاربر قبل از expire شدن session

### 📅 Dashboard & Features
- [ ] **FUNC-003**: اتصال Dashboard به API واقعی
  - Priority: P1
  - Estimate: 6h
  - Files: `app/dashboard/page.tsx`, `hooks/useDashboard.ts` (new)
  - Details: حذف fake data و استفاده از API

- [ ] **FUNC-004**: پیاده‌سازی کامل NewReservation Form
  - Priority: P1
  - Estimate: 5h
  - Files: `components/NewReservationModal.tsx`
  - Details: اضافه کردن submit handler و API integration

- [ ] **FUNC-005**: پیاده‌سازی صفحه Appointments
  - Priority: P1
  - Estimate: 8h
  - Files: `app/dashboard/appointments/page.tsx`
  - Details: لیست، فیلتر، و مدیریت appointments

- [ ] **FUNC-006**: پیاده‌سازی صفحه Notes
  - Priority: P2
  - Estimate: 6h
  - Files: `app/dashboard/notes/page.tsx`
  - Details: یادداشت‌های درمانگر

### 📱 Progressive Web App
- [ ] **FUNC-007**: تبدیل به PWA
  - Priority: P2
  - Estimate: 4h
  - Dependencies: `next-pwa`
  - Files: `next.config.ts`, `public/manifest.json` (new)
  - Details: Offline support و Install prompt

- [ ] **FUNC-008**: Service Worker برای Caching
  - Priority: P2
  - Estimate: 3h
  - Files: `public/sw.js` (new)
  - Details: cache استراتژی برای static assets

## ⚪ Documentation

### 📚 Project Documentation
- [ ] **DOC-001**: بازنویسی README.md
  - Priority: P1
  - Estimate: 2h
  - Files: `README.md`
  - Details: مستندات کامل پروژه، نصب، و استفاده

- [ ] **DOC-002**: ایجاد CONTRIBUTING.md
  - Priority: P2
  - Estimate: 1h
  - Files: `CONTRIBUTING.md` (new)
  - Details: راهنمای مشارکت در پروژه

- [ ] **DOC-003**: API Documentation
  - Priority: P2
  - Estimate: 3h
  - Files: `docs/API.md` (new)
  - Details: مستندات تمام API endpoints

- [ ] **DOC-004**: Component Documentation با Storybook
  - Priority: P2
  - Estimate: 8h
  - Dependencies: `@storybook/react`
  - Files: `.storybook/**`, `**/*.stories.tsx`

### 🔧 Developer Experience
- [ ] **DOC-005**: Setup Guide
  - Priority: P1
  - Estimate: 1h
  - Files: `docs/SETUP.md` (new)
  - Details: راهنمای راه‌اندازی محیط development

- [ ] **DOC-006**: Architecture Documentation
  - Priority: P2
  - Estimate: 2h
  - Files: `docs/ARCHITECTURE.md` (new)
  - Details: توضیح معماری و تصمیمات فنی

## 🎯 Monitoring & Analytics

- [ ] **MON-001**: راه‌اندازی Error Tracking (Sentry)
  - Priority: P2
  - Estimate: 2h
  - Dependencies: `@sentry/nextjs`

- [ ] **MON-002**: Performance Monitoring
  - Priority: P2
  - Estimate: 2h
  - Files: `lib/monitoring.ts` (new)

- [ ] **MON-003**: Analytics Integration
  - Priority: P3
  - Estimate: 2h
  - Dependencies: analytics library

---

## 📊 آمار پروژه

- **تعداد کل تسک‌ها**: 68
- **تخمین زمان کل**: ~180 ساعت
- **P0 (فوری)**: 7 تسک - ~18 ساعت
- **P1 (بالا)**: 31 تسک - ~90 ساعت
- **P2 (متوسط)**: 27 تسک - ~65 ساعت
- **P3 (پایین)**: 3 تسک - ~7 ساعت

## 🏷️ Labels

- `P0`: فوری - باید همین الان انجام شود
- `P1`: اولویت بالا - این هفته
- `P2`: اولویت متوسط - این ماه
- `P3`: اولویت پایین - آینده

## 📝 نحوه استفاده

برای مارک کردن یک تسک به عنوان انجام شده:
```markdown
- [x] **TASK-ID**: توضیحات
```

برای اضافه کردن تسک جدید، از فرمت زیر استفاده کنید:
```markdown
- [ ] **CATEGORY-ID**: عنوان کوتاه
  - Priority: P0/P1/P2/P3
  - Estimate: Xh
  - Files: `path/to/file.ts`
  - Details: توضیحات تکمیلی
```
