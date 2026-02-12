<?php

namespace App\Actions\Auth;

use App\Contracts\EmailCodeSender;
use App\Models\User;
use App\Models\Role;
use App\Services\Auth\EmailVerificationService;
use App\Services\Auth\OtpService;
use Illuminate\Support\Facades\Hash;
use App\Contracts\OtpSender;

class RegisterRequestAction
{
    public function __construct(
        private readonly EmailVerificationService $emailVerificationService,
        private readonly EmailCodeSender $emailCodeSender,
        private readonly \App\Contracts\Services\OtpServiceInterface $otpService,
        private readonly OtpSender $otpSender,
        private readonly \App\Contracts\Repositories\UserRepositoryInterface $userRepository,
    ) {
    }

    public function execute(\App\DTOs\Auth\UserRegistrationData $data): array
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
        
        // We need to handle the creation via repository. 
        // Since upsert is available, we can use it or add a create method. 
        // For now, let's use upsert with a dummy search or just add create to interface? 
        // The interface has upsert and save. 
        // Let's use save.
        
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
