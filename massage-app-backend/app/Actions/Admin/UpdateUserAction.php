<?php

namespace App\Actions\Admin;

use App\Contracts\Repositories\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UpdateUserAction
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {
    }

    /**
     * Update user details
     */
    public function execute(User $user, array $data): User
    {
        $updateData = [];

        if (isset($data['f_name'])) {
            $updateData['f_name'] = $data['f_name'];
        }

        if (isset($data['l_name'])) {
            $updateData['l_name'] = $data['l_name'];
        }

        if (isset($data['username'])) {
            $updateData['username'] = $data['username'];
        }

        if (isset($data['email'])) {
            $updateData['email'] = $data['email'];
        }

        if (isset($data['phone'])) {
            $updateData['phone'] = $data['phone'];
        }

        if (isset($data['bio'])) {
            $updateData['bio'] = $data['bio'];
        }

        if (isset($data['role_id'])) {
            $updateData['role_id'] = $data['role_id'];
        }

        if (!empty($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        if (!empty($updateData)) {
            $user->update($updateData);
        }

        $user->load('role');

        return $user;
    }
}
