<?php

namespace App\Modules\Auth\Services;

use App\Modules\Auth\Contracts\PasswordResetCodeSender;
use Illuminate\Support\Facades\Log;

class LogPasswordResetCodeSender implements PasswordResetCodeSender
{
    public function send(string $email, string $code): void
    {
        Log::info('Password reset code sent', ['email' => $email, 'code' => $code]);
    }
}
