<?php

namespace App\Modules\Auth\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'f_name' => ['required', 'string', 'max:100'],
            'l_name' => ['required', 'string', 'max:100'],
            'username' => ['required', 'string', 'max:60', 'unique:users,username'],
            'email' => ['required_without:phone', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required_without:email', 'string', 'min:7', 'max:20', 'unique:users,phone'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }
}
