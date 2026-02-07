<?php

namespace App\Exceptions;

use RuntimeException;

class EmailVerificationInvalidException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('Email verification code invalid');
    }
}
