<?php

namespace App\Modules\Auth\Services;

use App\Modules\Users\Models\User;
use Laravel\Passport\ClientRepository;
use RuntimeException;

class TokenService
{
    public function __construct(
        private readonly ClientRepository $clientRepository,
    ) {
    }

    public function createAccessToken(User $user): array
    {
        try {
            $tokenResult = $user->createToken('auth');
        } catch (RuntimeException $exception) {
            if (!$this->isMissingPersonalClientException($exception)) {
                throw $exception;
            }

            $this->ensurePersonalAccessClientExists();
            $tokenResult = $user->createToken('auth');
        }

        // Load role and permissions for the response
        $user->loadRoleWithPermissions();

        return [
            'token_type' => 'Bearer',
            'access_token' => $tokenResult->accessToken,
            'expires_at' => optional($tokenResult->token->expires_at)->toDateTimeString(),
            'user' => $this->getUserData($user),
        ];
    }

    /**
     * Get formatted user data with role and permissions
     */
    private function getUserData(User $user): array
    {
        return [
            'id' => $user->id,
            'f_name' => $user->f_name,
            'l_name' => $user->l_name,
            'username' => $user->username,
            'email' => $user->email,
            'phone' => $user->phone,
            'bio' => $user->bio,
            'avatar_url' => $user->avatar_url,
            'role' => $user->role ? [
                'id' => $user->role->id,
                'name' => $user->role->name,
                'display_name' => $user->role->display_name,
            ] : null,
            'permissions' => $user->role ? $user->role->permissions->pluck('name')->toArray() : [],
        ];
    }

    private function ensurePersonalAccessClientExists(): void
    {
        $provider = config('auth.guards.api.provider', 'users');
        $clientName = config('app.name', 'Laravel') . ' Personal Access Client';

        $this->clientRepository->createPersonalAccessGrantClient($clientName, $provider);
    }

    private function isMissingPersonalClientException(RuntimeException $exception): bool
    {
        return str_contains($exception->getMessage(), 'Personal access client not found');
    }
}
