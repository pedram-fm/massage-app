<?php

namespace App\Modules\Auth\Actions;

use App\Modules\Auth\Exceptions\EmailVerificationInvalidException;
use App\Modules\Auth\Services\EmailVerificationService;
use App\Modules\Auth\Services\TokenService;
use App\Modules\Users\Models\User;

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
