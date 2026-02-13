<?php

namespace App\Modules\Auth\Services;

use App\Modules\Auth\Contracts\OtpServiceInterface;
use App\Modules\Auth\Exceptions\OtpExpiredException;
use App\Modules\Auth\Exceptions\OtpInvalidException;
use App\Modules\Users\Contracts\UserRepositoryInterface;
use App\Modules\Users\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class OtpService implements OtpServiceInterface
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {
    }

    public function upsertUser(array $data): User
    {
        $search = ['phone' => $data['phone']];
        $updateData = array_filter([
            'f_name' => $data['f_name'] ?? null,
            'l_name' => $data['l_name'] ?? null,
            'username' => $data['username'] ?? null,
            'email' => $data['email'] ?? null,
        ], fn ($value) => $value !== null);

        return $this->userRepository->upsert($search, $updateData);
    }

    public function issueOtp(User $user): string
    {
        $otp = (string) random_int(100000, 999999);

        $user->otp_hash = Hash::make($otp);
        $user->otp_expires_at = Carbon::now()->addMinutes(5);
        $user->otp_sent_at = Carbon::now();
        $this->userRepository->save($user);

        return $otp;
    }

    public function verifyOtp(User $user, string $otp): void
    {
        if (!$user->otp_hash || !$user->otp_expires_at) {
            throw new OtpInvalidException();
        }

        if (Carbon::now()->greaterThan($user->otp_expires_at)) {
            throw new OtpExpiredException();
        }

        if (!Hash::check($otp, $user->otp_hash)) {
            throw new OtpInvalidException();
        }

        $user->otp_hash = null;
        $user->otp_expires_at = null;
        $user->otp_sent_at = null;
        $user->phone_verified_at = $user->phone_verified_at ?? Carbon::now();
        $user->last_login_at = Carbon::now();
        $this->userRepository->save($user);
    }
}
