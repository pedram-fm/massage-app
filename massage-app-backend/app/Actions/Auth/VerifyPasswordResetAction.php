<?php

namespace App\Actions\Auth;

use App\Services\Auth\PasswordResetService;

class VerifyPasswordResetAction
{
    public function __construct(
        private readonly PasswordResetService $passwordResetService,
    ) {
    }

    public function execute(string $email, string $code): void
    {
        $this->passwordResetService->verifyCode($email, $code);
    }
}
