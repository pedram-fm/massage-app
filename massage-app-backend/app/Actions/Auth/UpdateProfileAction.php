<?php

namespace App\Actions\Auth;

use App\Models\User;

class UpdateProfileAction
{
    public function execute(User $user, array $data): User
    {
        $payload = [];

        if (array_key_exists('f_name', $data)) {
            $payload['f_name'] = $data['f_name'];
        }

        if (array_key_exists('l_name', $data)) {
            $payload['l_name'] = $data['l_name'];
        }

        if (array_key_exists('username', $data)) {
            $payload['username'] = $data['username'];
        }

        if (array_key_exists('bio', $data)) {
            $payload['bio'] = $data['bio'];
        }

        if (array_key_exists('avatar_url', $data)) {
            $payload['avatar_url'] = $data['avatar_url'];
        }

        if ($payload) {
            $user->fill($payload);
        }

        $user->save();

        return $user;
    }
}
