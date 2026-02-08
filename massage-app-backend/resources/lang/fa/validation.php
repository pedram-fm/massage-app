<?php

return [
    'required' => ':attribute الزامی است.',
    'required_without' => ':attribute الزامی است.',
    'email' => ':attribute معتبر نیست.',
    'string' => ':attribute باید متن باشد.',
    'min' => [
        'string' => ':attribute باید حداقل :min کاراکتر باشد.',
    ],
    'max' => [
        'string' => ':attribute نباید بیشتر از :max کاراکتر باشد.',
    ],
    'confirmed' => ':attribute با تاییدیه مطابقت ندارد.',
    'unique' => ':attribute قبلا استفاده شده است.',
    'digits' => ':attribute باید :digits رقم باشد.',
    'attributes' => [
        'email' => 'ایمیل',
        'phone' => 'شماره تلفن',
        'password' => 'رمز عبور',
        'password_confirmation' => 'تایید رمز عبور',
        'f_name' => 'نام',
        'l_name' => 'نام خانوادگی',
        'username' => 'نام کاربری',
        'otp' => 'کد یکبار مصرف',
        'code' => 'کد تایید',
    ],
];
