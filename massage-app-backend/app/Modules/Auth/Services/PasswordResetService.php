<?php

namespace App\Modules\Auth\Services;

use App\Modules\Auth\Exceptions\PasswordResetExpiredException;
use App\Modules\Auth\Exceptions\PasswordResetInvalidException;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PasswordResetService
{
    public function issueCode(string $email): string
    {
        $code = (string) random_int(100000, 999999);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            [
                'token' => Hash::make($code),
                'created_at' => Carbon::now(),
            ],
        );

        return $code;
    }

    public function verifyCode(string $email, string $code): void
    {
        $record = DB::table('password_reset_tokens')->where('email', $email)->first();

        if (!$record) {
            throw new PasswordResetInvalidException();
        }

        $createdAt = $record->created_at ? Carbon::parse($record->created_at) : null;

        if (!$createdAt || Carbon::now()->greaterThan($createdAt->addMinutes(10))) {
            throw new PasswordResetExpiredException();
        }

        if (!Hash::check($code, $record->token)) {
            throw new PasswordResetInvalidException();
        }
    }

    public function consume(string $email): void
    {
        DB::table('password_reset_tokens')->where('email', $email)->delete();
    }
}
