<?php

namespace App\Modules\Auth\Exceptions;

use RuntimeException;

class OtpInvalidException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('کد یکبار مصرف نامعتبر است');
    }
}
