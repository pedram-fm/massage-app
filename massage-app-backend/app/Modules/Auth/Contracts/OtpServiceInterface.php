<?php

namespace App\Modules\Auth\Contracts;

use App\Modules\Users\Models\User;

interface OtpServiceInterface
{
    public function upsertUser(array $data): User;
    public function issueOtp(User $user): string;
    public function verifyOtp(User $user, string $otp): void;
}
