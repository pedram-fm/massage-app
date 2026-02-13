<?php

namespace App\Modules\Auth\Actions;

use App\Modules\Auth\Exceptions\OtpInvalidException;
use App\Modules\Auth\Services\OtpService;
use App\Modules\Auth\Services\TokenService;
use App\Modules\Users\Models\User;

class VerifyOtpAction
{
    public function __construct(
        private readonly OtpService $otpService,
        private readonly TokenService $tokenService,
    ) {
    }

    public function execute(string $phone, string $otp): array
    {
        $user = User::where('phone', $phone)->first();

        if (!$user) {
            throw new OtpInvalidException();
        }

        $this->otpService->verifyOtp($user, $otp);

        return [
            'user' => $user,
            ...$this->tokenService->createAccessToken($user),
        ];
    }
}
