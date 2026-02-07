<?php

namespace App\Contracts;

interface EmailCodeSender
{
    public function send(string $email, string $code): void;
}
