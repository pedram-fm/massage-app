<?php

namespace App\Modules\Auth\Contracts;

interface EmailCodeSender
{
    public function send(string $email, string $code): void;
}
