<?php

namespace App\Exceptions;

use RuntimeException;

class OtpInvalidException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('OTP invalid');
    }
}
