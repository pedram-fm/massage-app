<?php

namespace App\Modules\Auth\Actions;

use App\Modules\Auth\Exceptions\EmailNotVerifiedException;
use App\Modules\Auth\Exceptions\InvalidCredentialsException;
use App\Modules\Auth\Exceptions\PhoneNotVerifiedException;
use App\Modules\Auth\DTOs\UserLoginData;
use App\Modules\Auth\Services\TokenService;
use App\Modules\Users\Contracts\UserRepositoryInterface;
use App\Modules\Users\Models\User;
use Illuminate\Support\Facades\Hash;

class LoginAction
{
    public function __construct(
        private readonly TokenService $tokenService,
        private readonly UserRepositoryInterface $userRepository
    ) {
    }

    public function execute(UserLoginData $data): array
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
