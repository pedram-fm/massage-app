<?php

namespace App\Modules\Service\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTherapistServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware
    }

    public function rules(): array
    {
        return [
            'service_type_id' => [
                'required',
                'integer',
                'exists:service_types,id',
            ],
            'custom_duration' => [
                'sometimes',
                'nullable',
                'integer',
                'min:15',
                'max:300',
            ],
            'custom_price' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
            ],
            'is_available' => [
                'sometimes',
                'boolean',
            ],
            'display_order' => [
                'sometimes',
                'nullable',
                'integer',
                'min:0',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'service_type_id.required' => 'انتخاب نوع سرویس الزامی است',
            'service_type_id.exists' => 'نوع سرویس انتخاب شده معتبر نیست',
            'custom_duration.min' => 'مدت زمان نباید کمتر از 15 دقیقه باشد',
            'custom_duration.max' => 'مدت زمان نباید بیشتر از 300 دقیقه باشد',
            'custom_price.min' => 'قیمت نمی‌تواند منفی باشد',
        ];
    }

    public function attributes(): array
    {
        return [
            'service_type_id' => 'نوع سرویس',
            'custom_duration' => 'مدت زمان سفارشی',
            'custom_price' => 'قیمت سفارشی',
            'is_available' => 'وضعیت دسترسی',
            'display_order' => 'ترتیب نمایش',
        ];
    }
}
