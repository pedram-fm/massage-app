<?php

namespace App\Services\Auth;

use App\Exceptions\EmailVerificationExpiredException;
use App\Exceptions\EmailVerificationInvalidException;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class EmailVerificationService
{
    public function issueCode(User $user): string
    {
        $code = (string) random_int(100000, 999999);

        $user->email_verification_hash = Hash::make($code);
        $user->email_verification_expires_at = Carbon::now()->addMinutes(10);
        $user->email_verification_sent_at = Carbon::now();
        $user->save();

        return $code;
    }

    public function verifyCode(User $user, string $code): void
    {
        if (!$user->email_verification_hash || !$user->email_verification_expires_at) {
            throw new EmailVerificationInvalidException();
        }

        if (Carbon::now()->greaterThan($user->email_verification_expires_at)) {
            throw new EmailVerificationExpiredException();
        }

        if (!Hash::check($code, $user->email_verification_hash)) {
            throw new EmailVerificationInvalidException();
        }

        $user->email_verification_hash = null;
        $user->email_verification_expires_at = null;
        $user->email_verification_sent_at = null;
        $user->email_verified_at = $user->email_verified_at ?? Carbon::now();
        $user->save();
    }
}
