<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->user()?->id;

        return [
            'f_name' => ['sometimes', 'nullable', 'string', 'max:100'],
            'l_name' => ['sometimes', 'nullable', 'string', 'max:100'],
            'username' => [
                'sometimes',
                'nullable',
                'string',
                'max:60',
                Rule::unique('users', 'username')->ignore($userId),
            ],
            'bio' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'avatar_url' => ['sometimes', 'nullable', 'string', 'url', 'max:1024'],
        ];
    }
}
