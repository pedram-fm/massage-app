<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Models\Role;

class RoleService
{
    /**
     * Get user data with role and permissions
     */
    public function getUserWithRoleData(User $user): array
    {
        $user->loadRoleWithPermissions();

        return [
            'id' => $user->id,
            'f_name' => $user->f_name,
            'l_name' => $user->l_name,
            'username' => $user->username,
            'email' => $user->email,
            'phone' => $user->phone,
            'bio' => $user->bio,
            'avatar_url' => $user->avatar_url,
            'role' => $user->role ? [
                'id' => $user->role->id,
                'name' => $user->role->name,
                'display_name' => $user->role->display_name,
                'description' => $user->role->description,
            ] : null,
            'permissions' => $user->role ? $user->role->permissions->map(function ($permission) {
                return [
                    'name' => $permission->name,
                    'display_name' => $permission->display_name,
                    'group' => $permission->group,
                ];
            })->values()->toArray() : [],
        ];
    }

    /**
     * Assign a role to a user
     */
    public function assignRole(User $user, string $roleName): bool
    {
        $role = Role::where('name', $roleName)->first();
        
        if (!$role) {
            return false;
        }

        $user->role_id = $role->id;
        return $user->save();
    }

    /**
     * Check if user can access a resource based on role
     */
    public function canAccessResource(User $user, string $resourceType): bool
    {
        return match ($resourceType) {
            'admin_panel' => $user->isAdmin(),
            'therapist_dashboard' => $user->isMassageTherapist() || $user->isAdmin(),
            'client_dashboard' => $user->isClient() || $user->isAdmin(),
            'availability_management' => $user->isMassageTherapist() || $user->isAdmin(),
            'user_management' => $user->isAdmin(),
            'session_booking' => $user->isClient() || $user->isAdmin(),
            default => false,
        };
    }

    /**
     * Get role-specific dashboard route
     */
    public function getDashboardRoute(User $user): string
    {
        if ($user->isAdmin()) {
            return '/admin/dashboard';
        }

        if ($user->isMassageTherapist()) {
            return '/therapist/dashboard';
        }

        return '/client/dashboard';
    }
}
