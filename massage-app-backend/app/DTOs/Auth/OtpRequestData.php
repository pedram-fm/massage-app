<?php

namespace App\DTOs\Auth;

use Illuminate\Http\Request;

class OtpRequestData
{
    public function __construct(
        public readonly string $phone,
        public readonly ?string $firstName = null,
        public readonly ?string $lastName = null,
        public readonly ?string $username = null,
        public readonly ?string $email = null,
    ) {
    }

    public static function fromRequest(Request $request): self
    {
        $data = $request->validated();

        return new self(
            phone: $data['phone'],
            firstName: $data['f_name'] ?? null,
            lastName: $data['l_name'] ?? null,
            username: $data['username'] ?? null,
            email: $data['email'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'phone' => $this->phone,
            'f_name' => $this->firstName,
            'l_name' => $this->lastName,
            'username' => $this->username,
            'email' => $this->email,
        ], fn ($value) => $value !== null);
    }
}
