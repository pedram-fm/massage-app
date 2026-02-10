<?php

namespace App\DTOs\Auth;

use Illuminate\Http\Request;

class UserRegistrationData
{
    public function __construct(
        public readonly string $firstName,
        public readonly string $lastName,
        public readonly string $username,
        public readonly string $password,
        public readonly ?string $email = null,
        public readonly ?string $phone = null,
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        $data = $request->validated();

        return new self(
            firstName: $data['f_name'],
            lastName: $data['l_name'],
            username: $data['username'],
            password: $data['password'],
            email: $data['email'] ?? null,
            phone: $data['phone'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'f_name' => $this->firstName,
            'l_name' => $this->lastName,
            'username' => $this->username,
            'email' => $this->email,
            'phone' => $this->phone,
            'password' => $this->password,
        ], fn ($value) => $value !== null);
    }
}
