<?php

namespace App\Modules\Auth\Requests;

use App\Modules\Users\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RequestOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->resolveUserIdByPhone();

        return [
            'phone' => ['required', 'string', 'min:7', 'max:20'],
            'f_name' => ['nullable', 'string', 'max:100'],
            'l_name' => ['nullable', 'string', 'max:100'],
            'username' => [
                'nullable',
                'string',
                'max:60',
                Rule::unique('users', 'username')->ignore($userId),
            ],
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
        ];
    }

    private function resolveUserIdByPhone(): ?int
    {
        $phone = $this->input('phone');

        if (!$phone) {
            return null;
        }

        return User::where('phone', $phone)->value('id');
    }
}
