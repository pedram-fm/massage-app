<?php

namespace App\Actions\Auth;

use App\Exceptions\EmailNotVerifiedException;
use App\Exceptions\InvalidCredentialsException;
use App\Exceptions\PhoneNotVerifiedException;
use App\Models\User;
use App\Services\Auth\TokenService;
use Illuminate\Support\Facades\Hash;

class LoginAction
{
    public function __construct(
        private readonly TokenService $tokenService,
    ) {
    }

    public function execute(array $data): array
    {
        $user = null;
        $usingEmail = !empty($data['email']);

        if ($usingEmail) {
            $user = User::where('email', $data['email'])->first();
        } elseif (!empty($data['phone'])) {
            $user = User::where('phone', $data['phone'])->first();
        }

        if (!$user || !$user->password || !Hash::check($data['password'], $user->password)) {
            throw new InvalidCredentialsException();
        }

        if ($usingEmail && !$user->email_verified_at) {
            throw new EmailNotVerifiedException();
        }

        if (!$usingEmail && !$user->phone_verified_at) {
            throw new PhoneNotVerifiedException();
        }

        $user->last_login_at = now();
        $user->save();

        return [
            'user' => $user,
            ...$this->tokenService->createAccessToken($user),
        ];
    }
}
