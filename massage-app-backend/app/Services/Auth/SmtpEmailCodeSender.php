<?php

namespace App\Services\Auth;

use App\Contracts\EmailCodeSender;
use App\Mail\EmailVerificationCodeMail;
use Illuminate\Support\Facades\Mail;

class SmtpEmailCodeSender implements EmailCodeSender
{
    public function send(string $email, string $code): void
    {
        Mail::to($email)->send(new EmailVerificationCodeMail($code));
    }
}
