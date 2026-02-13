<?php

namespace Database\Seeders;

use App\Modules\Users\Models\User;
use App\Modules\Users\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'admin' => Role::where('name', Role::ADMIN)->first(),
            'therapist' => Role::where('name', Role::THERAPIST)->first(),
            'client' => Role::where('name', Role::CLIENT)->first(),
        ];

        // Create Admin User
        User::firstOrCreate(
            ['email' => 'admin@massage-app.test'],
            [
                'role_id' => $roles['admin']->id,
                'f_name' => 'Admin',
                'l_name' => 'User',
                'username' => 'admin',
                'phone' => '09111111111',
                'password' => Hash::make('password'),
                'phone_verified_at' => now(),
                'email_verified_at' => now(),
            ]
        );

        // Create Male Therapist
        User::firstOrCreate(
            ['email' => 'therapist.male@massage-app.test'],
            [
                'role_id' => $roles['therapist']->id,
                'gender' => 'male',
                'f_name' => 'محمد',
                'l_name' => 'احمدی',
                'username' => 'mohammad_therapist',
                'phone' => '09122222222',
                'password' => Hash::make('password'),
                'phone_verified_at' => now(),
                'email_verified_at' => now(),
                'bio' => 'ماساژور متخصص با 5 سال سابقه',
            ]
        );

        // Create Female Therapist
        User::firstOrCreate(
            ['email' => 'therapist.female@massage-app.test'],
            [
                'role_id' => $roles['therapist']->id,
                'gender' => 'female',
                'f_name' => 'فاطمه',
                'l_name' => 'حسینی',
                'username' => 'fatemeh_therapist',
                'phone' => '09133333333',
                'password' => Hash::make('password'),
                'phone_verified_at' => now(),
                'email_verified_at' => now(),
                'bio' => 'ماساژور متخصص با 3 سال سابقه',
            ]
        );

        // Create Client User
        User::firstOrCreate(
            ['email' => 'client@massage-app.test'],
            [
                'role_id' => $roles['client']->id,
                'f_name' => 'علی',
                'l_name' => 'رضایی',
                'username' => 'ali_client',
                'phone' => '09144444444',
                'password' => Hash::make('password'),
                'phone_verified_at' => now(),
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('✅ Test users created successfully!');
        $this->command->newLine();
        $this->command->info('Login credentials:');
        $this->command->newLine();
        $this->command->table(
            ['Role', 'Email', 'Password'],
            [
                ['Admin', 'admin@massage-app.test', 'password'],
                ['Therapist (Male)', 'therapist.male@massage-app.test', 'password'],
                ['Therapist (Female)', 'therapist.female@massage-app.test', 'password'],
                ['Client', 'client@massage-app.test', 'password'],
            ]
        );
    }
}
