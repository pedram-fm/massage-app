<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('id');

        return [
            'f_name' => 'sometimes|string|max:255',
            'l_name' => 'sometimes|string|max:255',
            'username' => ['sometimes', 'string', 'max:255', Rule::unique('users')->ignore($userId)],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users')->ignore($userId)],
            'phone' => ['sometimes', 'string', 'max:20', Rule::unique('users')->ignore($userId)],
            'bio' => 'sometimes|string|nullable',
            'role_id' => 'sometimes|exists:roles,id',
            'password' => 'sometimes|string|min:6',
        ];
    }
}
