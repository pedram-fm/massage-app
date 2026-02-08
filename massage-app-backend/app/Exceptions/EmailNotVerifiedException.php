<?php

namespace App\Exceptions;

use RuntimeException;

class EmailNotVerifiedException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('ایمیل شما تایید نشده است');
    }
}
