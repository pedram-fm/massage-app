<?php

namespace App\Contracts;

interface PasswordResetCodeSender
{
    public function send(string $email, string $code): void;
}
