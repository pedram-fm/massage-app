<?php

namespace App\Contracts\Services;

use App\Models\User;

interface OtpServiceInterface
{
    public function upsertUser(array $data): User;
    public function issueOtp(User $user): string;
    public function verifyOtp(User $user, string $otp): void;
}
