<?php

namespace App\Modules\Schedule\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Modules\Schedule\Domain\OverrideType;

class CreateOverrideRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'override_date_jalali' => [
                'required',
                'string',
                'regex:/^\d{4}[\/-]\d{2}[\/-]\d{2}$/',
            ],
            'override_type' => [
                'required',
                Rule::enum(OverrideType::class),
            ],
            'start_time' => [
                'required_if:override_type,' . OverrideType::CUSTOM_HOURS->value,
                'nullable',
                'string',
                'regex:/^\d{2}:\d{2}(:\d{2})?$/',
            ],
            'end_time' => [
                'required_if:override_type,' . OverrideType::CUSTOM_HOURS->value,
                'nullable',
                'string',
                'regex:/^\d{2}:\d{2}(:\d{2})?$/',
                'after:start_time',
            ],
            'reason_fa' => [
                'sometimes',
                'nullable',
                'string',
                'max:500',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'override_date_jalali.required' => 'تاریخ الزامی است',
            'override_date_jalali.regex' => 'فرمت تاریخ باید به صورت 1402/11/25 باشد',
            'override_type.required' => 'نوع استثنا الزامی است',
            'start_time.required_if' => 'در ساعات خاص، زمان شروع الزامی است',
            'start_time.regex' => 'فرمت زمان شروع باید به صورت 09:00 باشد',
            'end_time.required_if' => 'در ساعات خاص، زمان پایان الزامی است',
            'end_time.regex' => 'فرمت زمان پایان باید به صورت 17:00 باشد',
            'end_time.after' => 'زمان پایان باید بعد از زمان شروع باشد',
            'reason_fa.max' => 'دلیل نباید بیشتر از 500 کاراکتر باشد',
        ];
    }

    public function attributes(): array
    {
        return [
            'override_date_jalali' => 'تاریخ',
            'override_type' => 'نوع استثنا',
            'start_time' => 'زمان شروع',
            'end_time' => 'زمان پایان',
            'reason_fa' => 'دلیل',
        ];
    }
}
