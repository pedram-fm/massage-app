<?php

namespace App\Exceptions;

use RuntimeException;

class OtpExpiredException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('کد یکبار مصرف منقضی شده است');
    }
}
