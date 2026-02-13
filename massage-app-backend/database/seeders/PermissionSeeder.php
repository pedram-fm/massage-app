<?php

namespace Database\Seeders;

use App\Modules\Users\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Admin Permissions
            [
                'name' => Permission::MANAGE_USERS,
                'display_name' => 'Manage Users',
                'description' => 'Create, update, delete users',
                'group' => 'users',
            ],
            [
                'name' => Permission::MANAGE_ROLES,
                'display_name' => 'Manage Roles',
                'description' => 'Assign and modify user roles',
                'group' => 'users',
            ],
            [
                'name' => Permission::VIEW_ALL_SESSIONS,
                'display_name' => 'View All Sessions',
                'description' => 'View all massage sessions in the system',
                'group' => 'sessions',
            ],
            [
                'name' => Permission::MANAGE_SETTINGS,
                'display_name' => 'Manage Settings',
                'description' => 'Modify system settings',
                'group' => 'settings',
            ],
            [
                'name' => Permission::VIEW_REPORTS,
                'display_name' => 'View Reports',
                'description' => 'Access system reports and analytics',
                'group' => 'reports',
            ],

            // Massage Therapist Permissions
            [
                'name' => Permission::SET_AVAILABILITY,
                'display_name' => 'Set Availability',
                'description' => 'Set and manage available time slots',
                'group' => 'availability',
            ],
            [
                'name' => Permission::VIEW_OWN_SESSIONS,
                'display_name' => 'View Own Sessions',
                'description' => 'View own scheduled sessions',
                'group' => 'sessions',
            ],
            [
                'name' => Permission::MANAGE_SESSION_PLANS,
                'display_name' => 'Manage Session Plans',
                'description' => 'Create and manage treatment plans',
                'group' => 'sessions',
            ],
            [
                'name' => Permission::UPDATE_SESSION_STATUS,
                'display_name' => 'Update Session Status',
                'description' => 'Update status of sessions (completed, cancelled, etc.)',
                'group' => 'sessions',
            ],
            [
                'name' => Permission::VIEW_CLIENT_INFO,
                'display_name' => 'View Client Information',
                'description' => 'View client details and history',
                'group' => 'clients',
            ],

            // Client Permissions
            [
                'name' => Permission::BOOK_SESSION,
                'display_name' => 'Book Session',
                'description' => 'Book massage sessions',
                'group' => 'sessions',
            ],
            [
                'name' => Permission::VIEW_MY_SESSIONS,
                'display_name' => 'View My Sessions',
                'description' => 'View own booked sessions',
                'group' => 'sessions',
            ],
            [
                'name' => Permission::CANCEL_SESSION,
                'display_name' => 'Cancel Session',
                'description' => 'Cancel own booked sessions',
                'group' => 'sessions',
            ],
            [
                'name' => Permission::VIEW_THERAPISTS,
                'display_name' => 'View Therapists',
                'description' => 'View available massage therapists',
                'group' => 'therapists',
            ],
            [
                'name' => Permission::MANAGE_OWN_PROFILE,
                'display_name' => 'Manage Own Profile',
                'description' => 'Update own profile information',
                'group' => 'profile',
            ],
        ];

        foreach ($permissions as $permissionData) {
            Permission::firstOrCreate(
                ['name' => $permissionData['name']],
                $permissionData
            );
        }
    }
}
