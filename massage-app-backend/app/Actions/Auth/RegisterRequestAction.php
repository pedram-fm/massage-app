<?php

namespace App\Actions\Auth;

use App\Contracts\EmailCodeSender;
use App\Models\User;
use App\Services\Auth\EmailVerificationService;
use Illuminate\Support\Facades\Hash;

class RegisterRequestAction
{
    public function __construct(
        private readonly EmailVerificationService $emailVerificationService,
        private readonly EmailCodeSender $emailCodeSender,
    ) {
    }

    public function execute(array $data): array
    {
        $user = User::create([
            'f_name' => $data['f_name'],
            'l_name' => $data['l_name'],
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $code = $this->emailVerificationService->issueCode($user);
        $this->emailCodeSender->send($user->email, $code);

        return ['user' => $user, 'code' => $code];
    }
}
