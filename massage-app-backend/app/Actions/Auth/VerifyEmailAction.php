<?php

namespace App\Actions\Auth;

use App\Exceptions\EmailVerificationInvalidException;
use App\Models\User;
use App\Services\Auth\EmailVerificationService;
use App\Services\Auth\TokenService;

class VerifyEmailAction
{
    public function __construct(
        private readonly EmailVerificationService $emailVerificationService,
        private readonly TokenService $tokenService,
    ) {
    }

    public function execute(string $email, string $code): array
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            throw new EmailVerificationInvalidException();
        }

        $this->emailVerificationService->verifyCode($user, $code);

        return [
            'user' => $user,
            ...$this->tokenService->createAccessToken($user),
        ];
    }
}
