<?php

namespace App\Exceptions;

use RuntimeException;

class EmailVerificationExpiredException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('کد تایید ایمیل منقضی شده است');
    }
}
