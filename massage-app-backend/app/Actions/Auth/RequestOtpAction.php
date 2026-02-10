<?php

namespace App\Actions\Auth;

use App\Contracts\OtpSender;
use App\Services\Auth\OtpService;

class RequestOtpAction
{
    public function __construct(
        private readonly \App\Contracts\Services\OtpServiceInterface $otpService,
        private readonly OtpSender $otpSender,
    ) {
    }

    public function execute(\App\DTOs\Auth\OtpRequestData $data): array
    {
        $user = $this->otpService->upsertUser($data->toArray());
        $otp = $this->otpService->issueOtp($user);
        $this->otpSender->send($user->phone, $otp);

        return ['user' => $user, 'otp' => $otp];
    }
}
