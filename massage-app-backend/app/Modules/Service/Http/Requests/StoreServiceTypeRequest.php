<?php

namespace App\Modules\Service\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only admin can create service types
        return $this->user()?->hasRole('admin') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:service_types,name',
            ],
            'name_fa' => [
                'required',
                'string',
                'max:255',
            ],
            'description' => [
                'sometimes',
                'nullable',
                'string',
                'max:1000',
            ],
            'description_fa' => [
                'sometimes',
                'nullable',
                'string',
                'max:1000',
            ],
            'default_duration' => [
                'required',
                'integer',
                'min:15',
                'max:300',
            ],
            'default_price' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
            ],
            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'نام سرویس الزامی است',
            'name.unique' => 'این نام قبلاً استفاده شده است',
            'name_fa.required' => 'نام فارسی سرویس الزامی است',
            'default_duration.required' => 'مدت زمان پیش‌فرض الزامی است',
            'default_duration.min' => 'مدت زمان نباید کمتر از 15 دقیقه باشد',
            'default_duration.max' => 'مدت زمان نباید بیشتر از 300 دقیقه باشد',
            'default_price.min' => 'قیمت نمی‌تواند منفی باشد',
        ];
    }
}
