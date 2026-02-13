<?php

namespace App\Modules\Auth\Services;

use App\Modules\Auth\Contracts\PasswordResetCodeSender;
use App\Modules\Auth\Mail\PasswordResetCodeMail;
use Illuminate\Support\Facades\Mail;

class SmtpPasswordResetCodeSender implements PasswordResetCodeSender
{
    public function send(string $email, string $code): void
    {
        Mail::to($email)->send(new PasswordResetCodeMail($code));
    }
}
