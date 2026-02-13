<?php

namespace Database\Seeders;

use App\Modules\Users\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => Role::ADMIN,
                'display_name' => 'Admin',
                'description' => 'Administrator with full system access',
            ],
            [
                'name' => Role::THERAPIST,
                'display_name' => 'Massage Therapist',
                'description' => 'Massage therapist (masseur/masseuse)',
            ],
            [
                'name' => Role::CLIENT,
                'display_name' => 'Client',
                'description' => 'Client who books massage sessions',
            ],
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(
                ['name' => $roleData['name']],
                $roleData
            );
        }
    }
}
