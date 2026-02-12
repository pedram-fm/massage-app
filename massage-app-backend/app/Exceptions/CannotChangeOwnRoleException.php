<?php

namespace App\Exceptions;

use Exception;

class CannotChangeOwnRoleException extends Exception
{
    public function __construct()
    {
        parent::__construct('شما نمی‌توانید نقش خود را تغییر دهید');
    }
}
