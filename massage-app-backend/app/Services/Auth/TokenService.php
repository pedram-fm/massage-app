<?php

namespace App\Services\Auth;

use App\Models\User;

class TokenService
{
    public function createAccessToken(User $user): array
    {
        $tokenResult = $user->createToken('auth');

        return [
            'token_type' => 'Bearer',
            'access_token' => $tokenResult->accessToken,
            'expires_at' => optional($tokenResult->token->expires_at)->toDateTimeString(),
        ];
    }
}
