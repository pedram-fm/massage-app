<?php

namespace App\Modules\Auth\Actions;

use App\Modules\Auth\Contracts\OtpSender;
use App\Modules\Auth\Contracts\OtpServiceInterface;
use App\Modules\Auth\DTOs\OtpRequestData;

class RequestOtpAction
{
    public function __construct(
        private readonly OtpServiceInterface $otpService,
        private readonly OtpSender $otpSender,
    ) {
    }

    public function execute(OtpRequestData $data): array
    {
        $user = $this->otpService->upsertUser($data->toArray());
        $otp = $this->otpService->issueOtp($user);
        $this->otpSender->send($user->phone, $otp);

        return ['user' => $user, 'otp' => $otp];
    }
}
