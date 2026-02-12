# 🧪 تست سیستم Role-Permission

## دسترسی سریع به کاربران تست

```
👨‍💼 Admin:      admin@massage-app.test      / password
👨‍⚕️ Masseur:    masseur@massage-app.test   / password  
👩‍⚕️ Masseuse:   masseuse@massage-app.test  / password
👤 Client:      client@massage-app.test     / password
```

---

## تست با cURL

### 1. لاگین با Admin

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@massage-app.test",
    "password": "password"
  }'
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "f_name": "Admin",
    "l_name": "User",
    "role": {
      "id": 1,
      "name": "admin",
      "display_name": "Admin"
    },
    "permissions": ["manage_users", "manage_roles", ...]
  }
}
```

### 2. دسترسی به Admin Dashboard (موفق)

```bash
# استفاده از token از مرحله قبل
curl -X GET http://localhost:8000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (200):**
```json
{
  "message": "Welcome to Admin Dashboard",
  "user": {
    "id": 1,
    "f_name": "Admin",
    "role": {...},
    "permissions": [...]
  }
}
```

### 3. سعی به دسترسی با نقش اشتباه (شکست)

```bash
# لاگین با Client
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@massage-app.test",
    "password": "password"
  }'

# سعی برای دسترسی به Admin Dashboard
curl -X GET http://localhost:8000/api/admin/dashboard \
  -H "Authorization: Bearer CLIENT_TOKEN_HERE"
```

**Response (403):**
```json
{
  "message": "Unauthorized. You do not have permission to access this resource.",
  "required_roles": ["admin"]
}
```

---

## تست با Postman

### Collection Setup

1. **Base URL**: `http://localhost:8000/api`

2. **Environment Variables**:
```
admin_token: 
masseur_token:
masseuse_token:
client_token:
```

### Test Scenarios

#### Scenario 1: Admin Access
```
POST /auth/login
{
  "email": "admin@massage-app.test",
  "password": "password"
}

→ Save `access_token` to `admin_token`

GET /admin/dashboard
Authorization: Bearer {{admin_token}}
→ ✅ Success (200)

GET /therapist/dashboard
Authorization: Bearer {{admin_token}}
→ ❌ Forbidden (403) - Admin can't access therapist routes
```

#### Scenario 2: Therapist Access
```
POST /auth/login
{
  "email": "masseur@massage-app.test",
  "password": "password"
}

→ Save `access_token` to `masseur_token`

GET /therapist/dashboard
Authorization: Bearer {{masseur_token}}
→ ✅ Success (200)

GET /admin/dashboard
Authorization: Bearer {{masseur_token}}
→ ❌ Forbidden (403)
```

#### Scenario 3: Client Access
```
POST /auth/login
{
  "email": "client@massage-app.test",
  "password": "password"
}

→ Save `access_token` to `client_token`

GET /client/dashboard
Authorization: Bearer {{client_token}}
→ ✅ Success (200)

GET /admin/dashboard
Authorization: Bearer {{client_token}}
→ ❌ Forbidden (403)
```

#### Scenario 4: Permission-based Access
```
GET /users
Authorization: Bearer {{admin_token}}
→ ✅ Success (200) - Admin has manage_users permission

GET /users
Authorization: Bearer {{client_token}}
→ ❌ Forbidden (403) - Client doesn't have manage_users permission
```

---

## تست Frontend

### 1. ایجاد صفحه تست

**`app/test-roles/page.tsx`:**
```tsx
"use client";

import { useAuth } from "@/hooks/auth/useAuth";
import { AdminOnly, TherapistOnly, ClientOnly } from "@/components/auth/RoleGuard";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { PermissionName } from "@/lib/types/auth";

export default function TestRolesPage() {
  const { user, isAdmin, isMassageTherapist, isClient, hasPermission } = useAuth();

  if (!user) {
    return <div className="p-8">لطفاً وارد شوید</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">تست سیستم نقش‌ها</h1>
      
      <div className="bg-blue-50 p-4 rounded">
        <h2 className="font-bold mb-2">اطلاعات کاربر فعلی:</h2>
        <p>نام: {user.f_name} {user.l_name}</p>
        <p>نقش: {user.role?.display_name}</p>
        <p>تعداد مجوزها: {user.permissions?.length || 0}</p>
      </div>

      <div className="space-y-4">
        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2">تست isAdmin():</h3>
          {isAdmin() ? (
            <p className="text-green-600">✅ شما ادمین هستید</p>
          ) : (
            <p className="text-red-600">❌ شما ادمین نیستید</p>
          )}
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2">تست isMassageTherapist():</h3>
          {isMassageTherapist() ? (
            <p className="text-green-600">✅ شما ماساژور هستید</p>
          ) : (
            <p className="text-red-600">❌ شما ماساژور نیستید</p>
          )}
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2">تست isClient():</h3>
          {isClient() ? (
            <p className="text-green-600">✅ شما مشتری هستید</p>
          ) : (
            <p className="text-red-600">❌ شما مشتری نیستید</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">تست RoleGuard Components:</h2>
        
        <AdminOnly>
          <div className="bg-green-100 p-4 rounded">
            ✅ این محتوا فقط برای ادمین نمایش داده می‌شود
          </div>
        </AdminOnly>

        <TherapistOnly>
          <div className="bg-blue-100 p-4 rounded">
            ✅ این محتوا فقط برای ماساژور نمایش داده می‌شود
          </div>
        </TherapistOnly>

        <ClientOnly>
          <div className="bg-purple-100 p-4 rounded">
            ✅ این محتوا فقط برای مشتری نمایش داده می‌شود
          </div>
        </ClientOnly>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">تست PermissionGuard:</h2>
        
        <PermissionGuard 
          permissions={PermissionName.MANAGE_USERS}
          fallback={<div className="text-gray-400">شما مجوز مدیریت کاربران ندارید</div>}
        >
          <div className="bg-green-100 p-4 rounded">
            ✅ شما مجوز مدیریت کاربران دارید
          </div>
        </PermissionGuard>

        <PermissionGuard 
          permissions={PermissionName.SET_AVAILABILITY}
          fallback={<div className="text-gray-400">شما مجوز تنظیم زمان‌های آزاد ندارید</div>}
        >
          <div className="bg-blue-100 p-4 rounded">
            ✅ شما مجوز تنظیم زمان‌های آزاد دارید
          </div>
        </PermissionGuard>

        <PermissionGuard 
          permissions={PermissionName.BOOK_SESSION}
          fallback={<div className="text-gray-400">شما مجوز رزرو جلسه ندارید</div>}
        >
          <div className="bg-purple-100 p-4 rounded">
            ✅ شما مجوز رزرو جلسه دارید
          </div>
        </PermissionGuard>
      </div>
    </div>
  );
}
```

### 2. تست با هر کاربر

1. لاگین با `admin@massage-app.test` → باید پیام ادمین نشان دهد
2. لاگین با `masseur@massage-app.test` → باید پیام ماساژور نشان دهد
3. لاگین با `client@massage-app.test` → باید پیام مشتری نشان دهد

---

## بررسی Database

```bash
# Check roles
docker exec -it laravel_api php artisan tinker --execute="
  App\Models\Role::all()->each(function(\$r) {
    echo \$r->name . ' - ' . \$r->display_name . PHP_EOL;
  });
"

# Check permissions
docker exec -it laravel_api php artisan tinker --execute="
  App\Models\Permission::all()->each(function(\$p) {
    echo \$p->name . ' (' . \$p->group . ')' . PHP_EOL;
  });
"

# Check user roles
docker exec -it laravel_api php artisan tinker --execute="
  App\Models\User::with('role')->get()->each(function(\$u) {
    echo \$u->email . ' => ' . (\$u->role ? \$u->role->name : 'No Role') . PHP_EOL;
  });
"

# Check role permissions
docker exec -it laravel_api php artisan tinker --execute="
  App\Models\Role::with('permissions')->get()->each(function(\$r) {
    echo \$r->display_name . ': ' . \$r->permissions->pluck('name')->join(', ') . PHP_EOL;
  });
"
```

---

## Checklist متدولوژی تست ✅

### Backend
- [ ] Migration ها اجرا شدند
- [ ] Seeder ها اجرا شدند
- [ ] کاربران تست ایجاد شدند
- [ ] Route های محافظت شده کار می‌کنند
- [ ] Admin به admin routes دسترسی دارد
- [ ] Client به admin routes دسترسی ندارد
- [ ] Therapist به therapist routes دسترسی دارد
- [ ] Permission-based routes کار می‌کنند

### Frontend
- [ ] AuthProvider در layout اضافه شد
- [ ] useAuth hook کار می‌کند
- [ ] RoleGuard components کار می‌کنند
- [ ] PermissionGuard component کار می‌کند
- [ ] هر نقش محتوای مناسب خود را می‌بیند
- [ ] محتوای unauthorized نمایش داده نمی‌شود

---

## مشکلات رایج و راه‌حل

### مشکل 1: "401 Unauthenticated"
**علت**: Token در header نیست یا نامعتبر است
**راه‌حل**: 
```bash
# بررسی کنید token را صحیح ارسال می‌کنید
Authorization: Bearer YOUR_ACTUAL_TOKEN
```

### مشکل 2: "403 Unauthorized"
**علت**: نقش کاربر مجاز نیست
**راه‌حل**: بررسی کنید از کاربر صحیح استفاده می‌کنید

### مشکل 3: Role is null
**علت**: role_id برای کاربر set نشده
**راه‌حل**:
```bash
docker exec -it laravel_api php artisan tinker --execute="
  \$user = App\Models\User::find(1);
  \$role = App\Models\Role::where('name', 'client')->first();
  \$user->role_id = \$role->id;
  \$user->save();
"
```

### مشکل 4: Permissions empty
**علت**: RolePermissionSeeder اجرا نشده
**راه‌حل**:
```bash
docker exec -it laravel_api php artisan db:seed --class=RolePermissionSeeder
```

---

## نتیجه تست

اگر همه موارد بالا کار کردند:
✅ سیستم Role-Permission به درستی نصب و فعال شده است!

می‌توانید شروع به ساخت feature های اصلی کنید:
- مدیریت کاربران (Admin)
- مدیریت زمان‌های آزاد (Therapist)
- رزرو جلسه (Client)
