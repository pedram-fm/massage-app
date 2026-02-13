<?php

namespace Database\Seeders;

use App\Modules\Users\Models\Permission;
use App\Modules\Users\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all roles
        $adminRole = Role::where('name', Role::ADMIN)->first();
        $masseurRole = Role::where('name', Role::MASSEUR)->first();
        $masseuseRole = Role::where('name', Role::MASSEUSE)->first();
        $clientRole = Role::where('name', Role::CLIENT)->first();

        // Admin gets all permissions
        $allPermissions = Permission::all();
        $adminRole->permissions()->sync($allPermissions->pluck('id'));

        // Massage Therapist permissions (same for masseur and masseuse)
        $therapistPermissions = Permission::whereIn('name', [
            Permission::SET_AVAILABILITY,
            Permission::VIEW_OWN_SESSIONS,
            Permission::MANAGE_SESSION_PLANS,
            Permission::UPDATE_SESSION_STATUS,
            Permission::VIEW_CLIENT_INFO,
            Permission::MANAGE_OWN_PROFILE,
        ])->pluck('id');

        $masseurRole->permissions()->sync($therapistPermissions);
        $masseuseRole->permissions()->sync($therapistPermissions);

        // Client permissions
        $clientPermissions = Permission::whereIn('name', [
            Permission::BOOK_SESSION,
            Permission::VIEW_MY_SESSIONS,
            Permission::CANCEL_SESSION,
            Permission::VIEW_THERAPISTS,
            Permission::MANAGE_OWN_PROFILE,
        ])->pluck('id');

        $clientRole->permissions()->sync($clientPermissions);
    }
}
