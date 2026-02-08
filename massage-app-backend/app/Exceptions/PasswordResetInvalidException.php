<?php

namespace App\Exceptions;

use RuntimeException;

class PasswordResetInvalidException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('Invalid reset code.');
    }
}
