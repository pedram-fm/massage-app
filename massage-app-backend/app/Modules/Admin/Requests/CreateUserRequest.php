<?php

namespace App\Modules\Admin\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'f_name' => 'required|string|max:255',
            'l_name' => 'required|string|max:255',
            'username' => 'nullable|string|max:255|unique:users',
            'email' => 'nullable|email|max:255|unique:users',
            'phone' => 'required|string|max:20|unique:users',
            'password' => 'required|string|min:6',
            'role_id' => 'required|exists:roles,id',
            'bio' => 'nullable|string',
        ];
    }
}
