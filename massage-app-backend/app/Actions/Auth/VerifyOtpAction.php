<?php

namespace App\Actions\Auth;

use App\Exceptions\OtpInvalidException;
use App\Models\User;
use App\Services\Auth\OtpService;
use App\Services\Auth\TokenService;

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
