<?php

namespace App\Modules\Auth\Services;

use App\Modules\Auth\Contracts\EmailCodeSender;
use App\Modules\Auth\Mail\EmailVerificationCodeMail;
use Illuminate\Support\Facades\Mail;

class SmtpEmailCodeSender implements EmailCodeSender
{
    public function send(string $email, string $code): void
    {
        Mail::to($email)->send(new EmailVerificationCodeMail($code));
    }
}
