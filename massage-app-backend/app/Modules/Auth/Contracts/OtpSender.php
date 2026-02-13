<?php

namespace App\Modules\Auth\Contracts;

interface OtpSender
{
    public function send(string $phone, string $otp): void;
}
