<?php

namespace App\Actions\Admin;

use App\Contracts\Repositories\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateUserAction
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {
    }

    /**
     * Create a new user
     */
    public function execute(array $data): User
    {
        $userData = [
            'f_name' => $data['f_name'],
            'l_name' => $data['l_name'],
            'phone' => $data['phone'],
            'role_id' => $data['role_id'],
            'password' => Hash::make($data['password']),
        ];

        if (!empty($data['username'])) {
            $userData['username'] = $data['username'];
        }

        if (!empty($data['email'])) {
            $userData['email'] = $data['email'];
        }

        if (!empty($data['bio'])) {
            $userData['bio'] = $data['bio'];
        }

        // Auto-verify if created by admin
        $userData['phone_verified_at'] = now();
        if (!empty($data['email'])) {
            $userData['email_verified_at'] = now();
        }

        $user = User::create($userData);
        $user->load('role');

        return $user;
    }
}
