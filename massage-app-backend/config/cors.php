<?php

return [
    // برای توسعه: اجازه به همه مسیرها و همه originها
    'paths' => ['*'],

    'allowed_methods' => ['*'],

    // در محیط توسعه، تمام originها مجاز هستند
    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];

