<?php

namespace App\Actions\Auth;

use App\Models\User;
use App\Services\Auth\PasswordResetService;
use Illuminate\Support\Facades\Hash;

class ResetPasswordAction
{
    public function __construct(
        private readonly PasswordResetService $passwordResetService,
    ) {
    }

    public function execute(string $email, string $code, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->passwordResetService->verifyCode($email, $code);
            $this->passwordResetService->consume($email);

            return [];
        }

        $this->passwordResetService->verifyCode($email, $code);

        $user->password = Hash::make($password);
        $user->save();

        $this->passwordResetService->consume($email);

        return [];
    }
}
