<?php

namespace App\Exceptions;

use RuntimeException;

class PhoneNotVerifiedException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('شماره تلفن شما تایید نشده است');
    }
}
