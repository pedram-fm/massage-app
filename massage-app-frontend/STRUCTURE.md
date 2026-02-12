# ساختار فولدرها - Frontend

## 📁 ساختار کلی

```
app/
├── admin/                    # پنل مدیریت
│   ├── layout.tsx           # Layout اصلی admin با sidebar
│   ├── page.tsx             # Redirect به /admin/todos
│   ├── todos/               # مدیریت تسک‌ها (Kanban Board)
│   │   └── page.tsx
│   ├── logs/                # مشاهده لاگ‌ها (Live Monitor)
│   │   └── page.tsx
│   └── appointments/        # مدیریت رزروها
│       └── page.tsx
├── api/                     # API Routes
│   ├── todos/
│   │   └── route.ts
│   └── logs/
│       └── tail/
│           └── route.ts
├── auth/                    # صفحات احراز هویت
│   └── login/
│       ├── page.tsx
│       └── loading.tsx
├── dashboard/               # داشبورد کاربران
│   ├── layout.tsx
│   └── page.tsx
├── layout.tsx               # Root layout
├── page.tsx                 # صفحه اصلی (Landing)
├── loading.tsx
├── not-found.tsx
└── globals.css

components/
├── admin/                   # کامپوننت‌های مخصوص پنل ادمین
│   ├── DashboardModals.tsx
│   └── NewReservationModal.tsx
├── auth/                    # کامپوننت‌های احراز هویت
│   ├── ForgotPassword.tsx
│   ├── Register.tsx
│   └── OTPModal.tsx
├── shared/                  # کامپوننت‌های مشترک
│   ├── ThemeToggle.tsx
│   ├── CloudCompanion.tsx
│   └── FloatingElements.tsx
├── figma/                   # کامپوننت‌های طراحی از Figma
└── ui/                      # کامپوننت‌های UI اصلی

hooks/
└── auth/                    # Custom hooks مربوط به auth

lib/
└── api.ts                   # توابع کمکی API
```

## 🎯 توضیحات

### `/app/admin`
پنل مدیریت با sidebar و navigation مشترک:
- **todos**: تابلو کانبان برای مدیریت تسک‌ها (drag & drop)
- **logs**: مانیتور زنده لاگ‌های سیستم
- **appointments**: مدیریت رزروهای مشتریان

### `/app/api`
API Routes برای ارتباط با backend:
- فایل‌های `route.ts` شامل handler های GET/POST/PUT/DELETE

### `/components`
سازماندهی شده بر اساس نوع استفاده:
- **admin**: فقط در پنل ادمین استفاده می‌شود
- **auth**: مربوط به login/register/OTP
- **shared**: قابل استفاده در تمام پروژه
- **ui**: کامپوننت‌های پایه مثل Button, Input, Card

## 🚀 نکات مهم

1. **همه صفحات admin از `/app/admin/layout.tsx` استفاده می‌کنند**
2. **Import paths را با `@/components/{folder}/` شروع کنید**
3. **برای افزودن صفحه جدید admin: فولدر جدید در `/app/admin/` بسازید**
4. **کامپوننت‌های جدید را در فولدر مناسب (`admin`/`shared`/`auth`) قرار دهید**

## 📝 مثال Import

```tsx
// ✅ درست
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { DashboardModals } from "@/components/admin/DashboardModals";
import { Register } from "@/components/auth/Register";

// ❌ غلط
import { ThemeToggle } from "@/components/ThemeToggle";
```

## 🔗 Routes

### صفحات عمومی
- `/` - صفحه اصلی
- `/auth/login` - ورود/ثبت نام

### پنل مدیریت
- `/admin` → redirect به `/admin/todos`
- `/admin/todos` - تابلو کانبان
- `/admin/logs` - مانیتور لاگ
- `/admin/appointments` - مدیریت رزروها

### داشبورد کاربر
- `/dashboard` - داشبورد شخصی
