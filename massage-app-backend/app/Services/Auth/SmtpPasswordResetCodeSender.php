<?php

namespace App\Services\Auth;

use App\Contracts\PasswordResetCodeSender;
use App\Mail\PasswordResetCodeMail;
use Illuminate\Support\Facades\Mail;

class SmtpPasswordResetCodeSender implements PasswordResetCodeSender
{
    public function send(string $email, string $code): void
    {
        Mail::to($email)->send(new PasswordResetCodeMail($code));
    }
}
