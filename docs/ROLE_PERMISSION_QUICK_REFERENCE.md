# Role & Permission System - Quick Reference

## Backend Quick Reference

### Check User Role
```php
// In controller or anywhere with $user
$user->isAdmin()              // true/false
$user->isMassageTherapist()   // true/false
$user->isClient()             // true/false
$user->hasRole('admin')       // true/false
$user->hasAnyRole(['masseur', 'masseuse'])  // true/false
```

### Check Permission
```php
$user->hasPermission('manage_users')  // true/false
```

### Protect Routes
```php
// Single role
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    // Routes here
});

// Multiple roles
Route::middleware(['auth:api', 'role:masseur,masseuse'])->group(function () {
    // Routes here
});

// By permission
Route::middleware(['auth:api', 'permission:manage_users'])->group(function () {
    // Routes here
});
```

### Assign Role to User
```php
use App\Services\Auth\RoleService;
use App\Models\Role;

$roleService = new RoleService();
$roleService->assignRole($user, Role::ADMIN);
```

## Frontend Quick Reference

### Use Auth Hook
```tsx
import { useAuth } from "@/hooks/auth/useAuth";

function MyComponent() {
  const { user, isAdmin, isMassageTherapist, isClient, hasRole, hasPermission } = useAuth();
  
  // Use these methods...
}
```

### Protect Pages
```tsx
// app/admin/dashboard/page.tsx
import { AdminOnly } from "@/components/auth/RoleGuard";

export default function Page() {
  return (
    <AdminOnly>
      {/* Admin content */}
    </AdminOnly>
  );
}
```

### Conditional Rendering
```tsx
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { PermissionName } from "@/lib/types/auth";

function Component() {
  return (
    <PermissionGuard permissions={PermissionName.MANAGE_USERS}>
      <UserManagementPanel />
    </PermissionGuard>
  );
}
```

### Check Role in Component
```tsx
import { useAuth } from "@/hooks/auth/useAuth";

function Navigation() {
  const { isAdmin, isMassageTherapist } = useAuth();
  
  return (
    <nav>
      {isAdmin() && <Link href="/admin">Admin Panel</Link>}
      {isMassageTherapist() && <Link href="/therapist">My Sessions</Link>}
    </nav>
  );
}
```

## Available Roles

1. **admin** - Full system access
2. **masseur** - Male massage therapist
3. **masseuse** - Female massage therapist
4. **client** - Customer who books sessions

## Available Permissions

### Admin
- manage_users
- manage_roles
- view_all_sessions
- manage_settings
- view_reports

### Therapist
- set_availability
- view_own_sessions
- manage_session_plans
- update_session_status
- view_client_info

### Client
- book_session
- view_my_sessions
- cancel_session
- view_therapists
- manage_own_profile

## Setup Commands

```bash
# Run migrations
php artisan migrate

# Seed roles and permissions
php artisan db:seed

# Or seed specific seeders
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=RolePermissionSeeder
```

## File Locations

### Backend
- Migrations: `database/migrations/2026_02_12_*.php`
- Models: `app/Models/Role.php`, `app/Models/Permission.php`
- Middleware: `app/Http/Middleware/CheckRole.php`, `CheckPermission.php`
- Seeders: `database/seeders/RoleSeeder.php`, etc.
- Services: `app/Services/Auth/RoleService.php`

### Frontend
- Types: `lib/types/auth.ts`
- Auth Hook: `hooks/auth/useAuth.tsx`
- Guards: `components/auth/RoleGuard.tsx`, `PermissionGuard.tsx`
- Utils: `hooks/auth/useRoleBasedRendering.tsx`

## Common Patterns

### API Endpoint Protection
```php
Route::middleware(['auth:api'])->group(function () {
    // Admin only
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
    });
    
    // Therapists only
    Route::middleware(['role:masseur,masseuse'])->prefix('therapist')->group(function () {
        Route::get('/sessions', [SessionController::class, 'therapistSessions']);
    });
    
    // Clients only
    Route::middleware(['role:client'])->prefix('client')->group(function () {
        Route::post('/sessions/book', [SessionController::class, 'book']);
    });
});
```

### Dynamic Dashboard Redirect
```php
use App\Services\Auth\RoleService;

$roleService = new RoleService();
$dashboardRoute = $roleService->getDashboardRoute($user);
// Returns: '/admin/dashboard', '/therapist/dashboard', or '/client/dashboard'
```

### Role-Based Menu
```tsx
const { user } = useAuth();
const menuItems = user?.role?.name === 'admin' 
  ? adminMenuItems 
  : user?.role?.name === 'client'
  ? clientMenuItems
  : therapistMenuItems;
```
