<?php

namespace App\Modules\Auth\Actions;

use App\Modules\Auth\Contracts\EmailCodeSender;
use App\Modules\Auth\Contracts\OtpSender;
use App\Modules\Auth\Contracts\OtpServiceInterface;
use App\Modules\Auth\DTOs\UserRegistrationData;
use App\Modules\Auth\Services\EmailVerificationService;
use App\Modules\Users\Contracts\UserRepositoryInterface;
use App\Modules\Users\Models\Role;
use App\Modules\Users\Models\User;
use Illuminate\Support\Facades\Hash;

class RegisterRequestAction
{
    public function __construct(
        private readonly EmailVerificationService $emailVerificationService,
        private readonly EmailCodeSender $emailCodeSender,
        private readonly OtpServiceInterface $otpService,
        private readonly OtpSender $otpSender,
        private readonly UserRepositoryInterface $userRepository,
    ) {
    }

    public function execute(UserRegistrationData $data): array
    {
        $userData = $data->toArray();
        $userData['password'] = Hash::make($data->password);

        // Assign default role (client) for new users
        if (!isset($userData['role_id'])) {
            $clientRole = Role::where('name', Role::CLIENT)->first();
            if ($clientRole) {
                $userData['role_id'] = $clientRole->id;
            }
        }

        $user = new User($userData);
        $this->userRepository->save($user);

        if (!empty($data->email)) {
            $code = $this->emailVerificationService->issueCode($user);
            $this->emailCodeSender->send($user->email, $code);

            return ['user' => $user, 'channel' => 'email', 'code' => $code];
        }

        $otp = $this->otpService->issueOtp($user);
        $this->otpSender->send($user->phone, $otp);

        return ['user' => $user, 'channel' => 'phone', 'otp' => $otp];
    }
}
