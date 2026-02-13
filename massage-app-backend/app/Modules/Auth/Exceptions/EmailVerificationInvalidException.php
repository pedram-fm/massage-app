<?php

namespace App\Modules\Auth\Exceptions;

use RuntimeException;

class EmailVerificationInvalidException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('کد تایید ایمیل نامعتبر است');
    }
}
