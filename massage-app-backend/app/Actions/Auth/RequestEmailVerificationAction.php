<?php

namespace App\Actions\Auth;

use App\Contracts\EmailCodeSender;
use App\Models\User;
use App\Services\Auth\EmailVerificationService;

class RequestEmailVerificationAction
{
    public function __construct(
        private readonly EmailVerificationService $emailVerificationService,
        private readonly EmailCodeSender $emailCodeSender,
    ) {
    }

    public function execute(string $email): ?string
    {
        $user = User::where('email', $email)->first();

        if (!$user || $user->email_verified_at) {
            return null;
        }

        $code = $this->emailVerificationService->issueCode($user);
        $this->emailCodeSender->send($email, $code);

        return $code;
    }
}
