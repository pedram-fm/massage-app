<?php

namespace App\Services\Auth;

use App\Models\User;
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

        return [
            'token_type' => 'Bearer',
            'access_token' => $tokenResult->accessToken,
            'expires_at' => optional($tokenResult->token->expires_at)->toDateTimeString(),
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
