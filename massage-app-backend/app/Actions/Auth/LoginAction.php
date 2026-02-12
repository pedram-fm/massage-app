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
        private readonly \App\Contracts\Repositories\UserRepositoryInterface $userRepository
    ) {
    }

    public function execute(\App\DTOs\Auth\UserLoginData $data): array
    {
        $user = null;
        $usingEmail = !empty($data->email);

        if ($usingEmail) {
            $user = $this->userRepository->findByEmail($data->email);
        } elseif (!empty($data->phone)) {
            $user = $this->userRepository->findByPhone($data->phone);
        }

        if (!$user || !$user->password || !Hash::check($data->password, $user->password)) {
            throw new InvalidCredentialsException();
        }

        if ($usingEmail && !$user->email_verified_at) {
            throw new EmailNotVerifiedException();
        }

        if (!$usingEmail && !$user->phone_verified_at) {
            throw new PhoneNotVerifiedException();
        }

        $user->last_login_at = now();
        $this->userRepository->save($user);

        $tokenData = $this->tokenService->createAccessToken($user);

        return [
            'user' => $user,
            ...$tokenData,
        ];
    }
}
