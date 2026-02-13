<?php

namespace App\Modules\Auth\Actions;

use App\Modules\Auth\Services\PasswordResetService;

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
