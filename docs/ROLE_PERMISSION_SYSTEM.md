# Role-Based Permission System - Implementation Plan

## Overview
This document outlines the complete role-based permission system for the Massage App, including three roles:
- **Admin**: Full system access, user management, reports
- **Massage Therapist** (Masseur/Masseuse): Availability management, session handling
- **Client**: Session booking, viewing own sessions

## System Architecture

### Database Schema
```
users
  ├── role_id (FK to roles)
  
roles
  ├── id
  ├── name (admin, masseur, masseuse, client)
  ├── display_name
  └── description

permissions
  ├── id
  ├── name
  ├── display_name
  ├── description
  └── group

role_permission (pivot)
  ├── role_id (FK)
  └── permission_id (FK)
```

## Backend Setup

### Step 1: Run Migrations
```bash
cd massage-app-backend
php artisan migrate
```

This will create:
- `roles` table
- `permissions` table
- `role_permission` pivot table
- Add `role_id` column to `users` table

### Step 2: Seed Roles and Permissions
```bash
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=RolePermissionSeeder
```

Or run all seeders:
```bash
php artisan db:seed
```

This creates:
- 4 roles (admin, masseur, masseuse, client)
- 15 permissions
- Associates permissions with appropriate roles

### Step 3: Assign Roles to Users

When registering a new user:
```php
use App\Services\Auth\RoleService;
use App\Models\Role;

$roleService = new RoleService();
$roleService->assignRole($user, Role::CLIENT); // Default role
```

### Step 4: Protect Routes with Middleware

In your `routes/api.php`:

```php
use App\Models\Role;
use App\Models\Permission;

// Admin only routes
Route::middleware(['auth:api', 'role:' . Role::ADMIN])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::post('/admin/users', [UserController::class, 'store']);
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
});

// Therapist routes (masseur or masseuse)
Route::middleware(['auth:api', 'role:' . Role::MASSEUR . ',' . Role::MASSEUSE])->group(function () {
    Route::get('/therapist/sessions', [SessionController::class, 'therapistSessions']);
    Route::post('/therapist/availability', [AvailabilityController::class, 'store']);
    Route::put('/therapist/sessions/{id}/status', [SessionController::class, 'updateStatus']);
});

// Client routes
Route::middleware(['auth:api', 'role:' . Role::CLIENT])->group(function () {
    Route::post('/sessions/book', [SessionController::class, 'book']);
    Route::get('/sessions/my-sessions', [SessionController::class, 'mySessions']);
    Route::delete('/sessions/{id}/cancel', [SessionController::class, 'cancel']);
});

// Permission-based protection
Route::middleware(['auth:api', 'permission:' . Permission::MANAGE_USERS])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index']);
});
```

### Step 5: Use Role Methods in Controllers

```php
class SessionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Admin sees all sessions
        if ($user->isAdmin()) {
            return Session::with('therapist', 'client')->get();
        }
        
        // Therapist sees their own sessions
        if ($user->isMassageTherapist()) {
            return Session::where('therapist_id', $user->id)->get();
        }
        
        // Client sees their booked sessions
        return Session::where('client_id', $user->id)->get();
    }
    
    public function updateStatus(Request $request, $id)
    {
        if (!$request->user()->hasPermission(Permission::UPDATE_SESSION_STATUS)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Update logic...
    }
}
```

## Frontend Setup

### Step 1: Wrap App with AuthProvider

Update your `app/layout.tsx`:

```tsx
import { AuthProvider } from "@/hooks/auth/useAuth";

export default function RootLayout({ children }) {
  return (
    <html lang="fa">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Step 2: Update Login/Register to Include Role Data

Update your auth API calls to store role information:

```typescript
// In your login/register success handler
const response = await fetch('/api/auth/login', { ... });
const data = await response.json();

if (data.access_token && data.user) {
  localStorage.setItem('auth_token', data.access_token);
  localStorage.setItem('auth_user', JSON.stringify(data.user));
  // data.user now includes role and permissions
}
```

### Step 3: Protect Routes with RoleGuard

Create protected pages:

**Admin Dashboard** - `app/admin/dashboard/page.tsx`:
```tsx
import { AdminOnly } from "@/components/auth/RoleGuard";

export default function AdminDashboard() {
  return (
    <AdminOnly>
      <div>
        <h1>مدیریت سیستم</h1>
        {/* Admin content */}
      </div>
    </AdminOnly>
  );
}
```

**Therapist Dashboard** - `app/therapist/dashboard/page.tsx`:
```tsx
import { TherapistOnly } from "@/components/auth/RoleGuard";

export default function TherapistDashboard() {
  return (
    <TherapistOnly>
      <div>
        <h1>داشبورد ماساژور</h1>
        {/* Therapist content */}
      </div>
    </TherapistOnly>
  );
}
```

**Client Dashboard** - `app/dashboard/page.tsx`:
```tsx
import { ClientOnly } from "@/components/auth/RoleGuard";

export default function ClientDashboard() {
  return (
    <ClientOnly>
      <div>
        <h1>داشبورد من</h1>
        {/* Client content */}
      </div>
    </ClientOnly>
  );
}
```

### Step 4: Conditional Rendering Based on Permissions

```tsx
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { PermissionName } from "@/lib/types/auth";

export function SessionManagement() {
  return (
    <div>
      <h2>مدیریت جلسات</h2>
      
      {/* Only show to users with permission */}
      <PermissionGuard permissions={PermissionName.MANAGE_SESSION_PLANS}>
        <button>ایجاد برنامه درمانی</button>
      </PermissionGuard>
      
      {/* Show to users with ANY of these permissions */}
      <PermissionGuard 
        permissions={[
          PermissionName.VIEW_ALL_SESSIONS,
          PermissionName.VIEW_OWN_SESSIONS
        ]}
      >
        <SessionList />
      </PermissionGuard>
    </div>
  );
}
```

### Step 5: Use Role Helpers in Components

```tsx
import { useAuth } from "@/hooks/auth/useAuth";
import { RoleName, PermissionName } from "@/lib/types/auth";

export function Navigation() {
  const { user, hasRole, hasPermission, isAdmin, isMassageTherapist } = useAuth();
  
  return (
    <nav>
      {/* Show for all authenticated users */}
      <Link href="/dashboard">داشبورد</Link>
      
      {/* Show only for admin */}
      {isAdmin() && (
        <Link href="/admin/users">مدیریت کاربران</Link>
      )}
      
      {/* Show only for therapists */}
      {isMassageTherapist() && (
        <>
          <Link href="/therapist/availability">تنظیم زمان‌های آزاد</Link>
          <Link href="/therapist/sessions">جلسات من</Link>
        </>
      )}
      
      {/* Show only for clients */}
      {hasRole(RoleName.CLIENT) && (
        <>
          <Link href="/therapists">انتخاب ماساژور</Link>
          <Link href="/sessions/book">رزرو جلسه</Link>
        </>
      )}
      
      {/* Permission-based */}
      {hasPermission(PermissionName.VIEW_REPORTS) && (
        <Link href="/reports">گزارشات</Link>
      )}
    </nav>
  );
}
```

### Step 6: Use Role-Based Rendering Hook

```tsx
import { useRoleBasedRendering, roleUtils } from "@/hooks/auth/useRoleBasedRendering";

export function UserProfile() {
  const { IfAdmin, IfTherapist, IfClient, user } = useRoleBasedRendering();
  
  return (
    <div>
      <h1>نقش: {roleUtils.getRoleDisplayName(user?.role?.name)}</h1>
      
      <IfAdmin>
        <AdminPanel />
      </IfAdmin>
      
      <IfTherapist>
        <TherapistPanel />
      </IfTherapist>
      
      <IfClient>
        <ClientPanel />
      </IfClient>
    </div>
  );
}
```

## Permission Matrix

### Admin Permissions
- ✅ manage_users
- ✅ manage_roles
- ✅ view_all_sessions
- ✅ manage_settings
- ✅ view_reports
- ✅ All other permissions (admin has full access)

### Massage Therapist Permissions (Masseur/Masseuse)
- ✅ set_availability
- ✅ view_own_sessions
- ✅ manage_session_plans
- ✅ update_session_status
- ✅ view_client_info
- ✅ manage_own_profile

### Client Permissions
- ✅ book_session
- ✅ view_my_sessions
- ✅ cancel_session
- ✅ view_therapists
- ✅ manage_own_profile

## Usage Examples

### Example 1: Creating Admin User
```php
use App\Models\User;
use App\Models\Role;
use App\Services\Auth\RoleService;

$user = User::create([
    'f_name' => 'Admin',
    'l_name' => 'User',
    'email' => 'admin@massage-app.com',
    'phone' => '1234567890',
    'password' => bcrypt('password'),
]);

$roleService = new RoleService();
$roleService->assignRole($user, Role::ADMIN);
```

### Example 2: Creating Therapist User
```php
$user = User::create([
    'f_name' => 'John',
    'l_name' => 'Doe',
    'email' => 'john@massage-app.com',
    'phone' => '0987654321',
    'password' => bcrypt('password'),
]);

// Assign masseur role for male therapist
$roleService->assignRole($user, Role::MASSEUR);

// Or masseuse role for female therapist
// $roleService->assignRole($user, Role::MASSEUSE);
```

### Example 3: Checking Permissions in API
```php
Route::get('/sessions', function (Request $request) {
    $user = $request->user();
    
    if ($user->hasPermission(Permission::VIEW_ALL_SESSIONS)) {
        return Session::all();
    }
    
    if ($user->hasPermission(Permission::VIEW_OWN_SESSIONS)) {
        return Session::where('therapist_id', $user->id)->get();
    }
    
    if ($user->hasPermission(Permission::VIEW_MY_SESSIONS)) {
        return Session::where('client_id', $user->id)->get();
    }
    
    return response()->json(['message' => 'Unauthorized'], 403);
});
```

### Example 4: Dynamic Menu Based on Role
```tsx
export function DashboardMenu() {
  const { user } = useAuth();
  
  const menuItems = {
    admin: [
      { label: 'مدیریت کاربران', href: '/admin/users' },
      { label: 'همه جلسات', href: '/admin/sessions' },
      { label: 'گزارشات', href: '/admin/reports' },
      { label: 'تنظیمات', href: '/admin/settings' },
    ],
    therapist: [
      { label: 'جلسات من', href: '/therapist/sessions' },
      { label: 'تنظیم زمان‌های آزاد', href: '/therapist/availability' },
      { label: 'برنامه درمانی', href: '/therapist/plans' },
      { label: 'مشتریان', href: '/therapist/clients' },
    ],
    client: [
      { label: 'رزرو جلسه', href: '/sessions/book' },
      { label: 'جلسات من', href: '/sessions/my' },
      { label: 'ماساژورها', href: '/therapists' },
      { label: 'پروفایل', href: '/profile' },
    ],
  };
  
  const getMenuForRole = () => {
    if (user?.role?.name === RoleName.ADMIN) return menuItems.admin;
    if (roleUtils.isTherapistRole(user?.role?.name)) return menuItems.therapist;
    return menuItems.client;
  };
  
  return (
    <ul>
      {getMenuForRole().map(item => (
        <li key={item.href}>
          <Link href={item.href}>{item.label}</Link>
        </li>
      ))}
    </ul>
  );
}
```

## Testing the System

### Backend Tests
```php
// tests/Feature/RolePermissionTest.php
public function test_admin_can_access_all_routes()
{
    $admin = User::factory()->create();
    $admin->role_id = Role::where('name', Role::ADMIN)->first()->id;
    $admin->save();
    
    $response = $this->actingAs($admin, 'api')
        ->get('/api/admin/users');
    
    $response->assertStatus(200);
}

public function test_client_cannot_access_admin_routes()
{
    $client = User::factory()->create();
    $client->role_id = Role::where('name', Role::CLIENT)->first()->id;
    $client->save();
    
    $response = $this->actingAs($client, 'api')
        ->get('/api/admin/users');
    
    $response->assertStatus(403);
}
```

### Frontend Tests
```typescript
// Test role-based rendering
describe('RoleGuard', () => {
  it('should show content for users with correct role', () => {
    // Setup mock user with admin role
    const { getByText } = render(
      <AdminOnly>
        <div>Admin Content</div>
      </AdminOnly>
    );
    
    expect(getByText('Admin Content')).toBeInTheDocument();
  });
});
```

## Next Steps

1. **Run migrations and seeders** to set up the database
2. **Update registration flow** to assign default role (CLIENT) to new users
3. **Protect all API routes** with appropriate middleware
4. **Update frontend routes** with RoleGuard components
5. **Test thoroughly** with different user roles
6. **Create admin interface** for managing users and roles
7. **Implement session booking** with role-based access
8. **Add availability management** for therapists
9. **Create reporting dashboard** for admin

## Additional Features to Implement

### User Management (Admin)
- List all users with their roles
- Change user roles
- Activate/deactivate users
- View user activity logs

### Therapist Features
- Set weekly availability schedule
- Block specific dates
- View upcoming sessions
- Mark sessions as completed
- Add session notes
- View client history

### Client Features
- Browse available therapists
- Filter therapists by gender (masseur/masseuse)
- Book sessions based on availability
- View booking history
- Rate and review sessions
- Cancel bookings (with policy)

### Notifications
- Email/SMS when session is booked
- Reminder notifications before session
- Session completion confirmation
- Cancellation notifications

## Security Considerations

1. **Always validate on backend** - Never trust frontend role checks
2. **Use middleware consistently** - All protected routes should use role/permission middleware
3. **Audit trail** - Log important actions (role changes, permission grants)
4. **Rate limiting** - Protect sensitive endpoints
5. **Token refresh** - Implement token refresh mechanism
6. **Session timeout** - Auto-logout after inactivity

## Maintenance

### Adding New Permissions
```php
// Create permission
$permission = Permission::create([
    'name' => 'new_permission',
    'display_name' => 'New Permission',
    'group' => 'group_name',
]);

// Assign to role
$role = Role::where('name', Role::ADMIN)->first();
$role->givePermission($permission);
```

### Adding New Roles
```php
$role = Role::create([
    'name' => 'new_role',
    'display_name' => 'New Role',
    'description' => 'Description',
]);

// Assign permissions
$permissions = Permission::whereIn('name', [...])->get();
$role->permissions()->sync($permissions->pluck('id'));
```

## Troubleshooting

### User role not loading
- Check if `role_id` is set in users table
- Verify relationships are loaded: `$user->loadRoleWithPermissions()`
- Check if seeders ran successfully

### Middleware not working
- Verify middleware is registered in `bootstrap/app.php`
- Check route syntax for middleware application
- Clear route cache: `php artisan route:clear`

### Frontend not reflecting role changes
- Clear localStorage and re-login
- Check if user data includes role and permissions
- Verify AuthProvider is wrapping the app

## Support

For questions or issues with the role permission system:
1. Check this documentation first
2. Review the code in created files
3. Test with different user roles
4. Check Laravel logs: `storage/logs/laravel.log`
5. Check browser console for frontend errors
