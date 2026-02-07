<?php

namespace App\Services\Auth;

use App\Exceptions\OtpExpiredException;
use App\Exceptions\OtpInvalidException;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class OtpService
{
    public function upsertUser(array $data): User
    {
        $user = User::where('phone', $data['phone'])->first() ?? new User(['phone' => $data['phone']]);

        $user->fill(array_filter([
            'f_name' => $data['f_name'] ?? null,
            'l_name' => $data['l_name'] ?? null,
            'username' => $data['username'] ?? null,
            'email' => $data['email'] ?? null,
        ], fn ($value) => $value !== null));

        $user->save();

        return $user;
    }

    public function issueOtp(User $user): string
    {
        $otp = (string) random_int(100000, 999999);

        $user->otp_hash = Hash::make($otp);
        $user->otp_expires_at = Carbon::now()->addMinutes(5);
        $user->otp_sent_at = Carbon::now();
        $user->save();

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
        $user->save();
    }
}
