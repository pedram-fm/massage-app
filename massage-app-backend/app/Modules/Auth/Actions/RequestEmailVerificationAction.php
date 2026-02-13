<?php

namespace App\Modules\Auth\Actions;

use App\Modules\Auth\Contracts\EmailCodeSender;
use App\Modules\Auth\Services\EmailVerificationService;
use App\Modules\Users\Models\User;

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
