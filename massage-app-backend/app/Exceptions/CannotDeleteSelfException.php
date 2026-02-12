<?php

namespace App\Exceptions;

use Exception;

class CannotDeleteSelfException extends Exception
{
    public function __construct()
    {
        parent::__construct('شما نمی‌توانید حساب کاربری خود را حذف کنید');
    }
}
