<?php

namespace App\Modules\Auth\Actions;

use App\Modules\Auth\Contracts\PasswordResetCodeSender;
use App\Modules\Auth\Services\PasswordResetService;
use App\Modules\Users\Models\User;

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
