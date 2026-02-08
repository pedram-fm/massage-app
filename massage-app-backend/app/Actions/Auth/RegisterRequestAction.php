<?php

namespace App\Actions\Auth;

use App\Contracts\EmailCodeSender;
use App\Models\User;
use App\Services\Auth\EmailVerificationService;
use App\Services\Auth\OtpService;
use Illuminate\Support\Facades\Hash;
use App\Contracts\OtpSender;

class RegisterRequestAction
{
    public function __construct(
        private readonly EmailVerificationService $emailVerificationService,
        private readonly EmailCodeSender $emailCodeSender,
        private readonly OtpService $otpService,
        private readonly OtpSender $otpSender,
    ) {
    }

    public function execute(array $data): array
    {
        $user = User::create([
            'f_name' => $data['f_name'],
            'l_name' => $data['l_name'],
            'username' => $data['username'],
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'password' => Hash::make($data['password']),
        ]);

        if (!empty($data['email'])) {
            $code = $this->emailVerificationService->issueCode($user);
            $this->emailCodeSender->send($user->email, $code);

            return ['user' => $user, 'channel' => 'email', 'code' => $code];
        }

        $otp = $this->otpService->issueOtp($user);
        $this->otpSender->send($user->phone, $otp);

        return ['user' => $user, 'channel' => 'phone', 'otp' => $otp];
    }
}
