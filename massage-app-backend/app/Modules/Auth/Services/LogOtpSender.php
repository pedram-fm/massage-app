<?php

namespace App\Modules\Auth\Services;

use App\Modules\Auth\Contracts\OtpSender;
use Illuminate\Support\Facades\Log;

class LogOtpSender implements OtpSender
{
    public function send(string $phone, string $otp): void
    {
        Log::info('OTP sent', ['phone' => $phone, 'otp' => $otp]);
    }
}
