<?php

namespace App\Modules\Auth\Exceptions;

use RuntimeException;

class PasswordResetExpiredException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('Reset code expired.');
    }
}
