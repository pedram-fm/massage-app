<?php

namespace App\Services\Auth;

use App\Contracts\EmailCodeSender;
use Illuminate\Support\Facades\Log;

class LogEmailCodeSender implements EmailCodeSender
{
    public function send(string $email, string $code): void
    {
        Log::info('Email verification code sent', ['email' => $email, 'code' => $code]);
    }
}
