<?php

namespace App\Actions\Auth;

use App\Contracts\PasswordResetCodeSender;
use App\Models\User;
use App\Services\Auth\PasswordResetService;

class RequestPasswordResetAction
{
    public function __construct(
        private readonly PasswordResetService $passwordResetService,
        private readonly PasswordResetCodeSender $passwordResetCodeSender,
    ) {
    }

    public function execute(string $email): ?string
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return null;
        }

        $code = $this->passwordResetService->issueCode($email);
        $this->passwordResetCodeSender->send($email, $code);

        return $code;
    }
}
