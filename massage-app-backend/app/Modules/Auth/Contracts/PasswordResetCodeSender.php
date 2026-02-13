<?php

namespace App\Modules\Auth\Contracts;

interface PasswordResetCodeSender
{
    public function send(string $email, string $code): void;
}
