<?php

namespace App\DTOs\Auth;

use Illuminate\Http\Request;

class UserLoginData
{
    public function __construct(
        public readonly string $password,
        public readonly ?string $email = null,
        public readonly ?string $phone = null,
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        $data = $request->validated();

        return new self(
            password: $data['password'],
            email: $data['email'] ?? null,
            phone: $data['phone'] ?? null,
        );
    }
}
