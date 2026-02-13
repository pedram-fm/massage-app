<?php

namespace App\Modules\Auth\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required_without:phone', 'email', 'max:255'],
            'phone' => ['required_without:email', 'string', 'min:7', 'max:20'],
            'password' => ['required', 'string', 'min:8'],
        ];
    }
}
