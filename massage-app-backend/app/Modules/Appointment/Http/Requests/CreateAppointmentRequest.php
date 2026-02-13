<?php

namespace App\Modules\Appointment\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Modules\Appointment\Domain\AppointmentStatus;

class CreateAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware/policy
    }

    public function rules(): array
    {
        return [
            'therapist_service_id' => [
                'required',
                'integer',
                'exists:therapist_services,id',
            ],
            'appointment_date_jalali' => [
                'required',
                'string',
                'regex:/^\d{4}[\/-]\d{2}[\/-]\d{2}$/', // Format: 1402/11/25 or 1402-11-25
            ],
            'start_time' => [
                'required',
                'string',
                'regex:/^\d{2}:\d{2}(:\d{2})?$/', // Format: 14:30 or 14:30:00
            ],
            'client_name' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],
            'client_phone' => [
                'sometimes',
                'nullable',
                'string',
                'regex:/^09\d{9}$/', // Iranian mobile format
            ],
            'client_email' => [
                'sometimes',
                'nullable',
                'email',
                'max:255',
            ],
            'notes' => [
                'sometimes',
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'therapist_service_id.required' => 'انتخاب سرویس الزامی است',
            'therapist_service_id.exists' => 'سرویس انتخاب شده معتبر نیست',
            'appointment_date_jalali.required' => 'تاریخ رزرو الزامی است',
            'appointment_date_jalali.regex' => 'فرمت تاریخ باید به صورت 1402/11/25 باشد',
            'start_time.required' => 'زمان شروع الزامی است',
            'start_time.regex' => 'فرمت زمان باید به صورت 14:30 باشد',
            'client_phone.regex' => 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد',
            'client_email.email' => 'فرمت ایمیل معتبر نیست',
            'notes.max' => 'یادداشت نباید بیشتر از 1000 کاراکتر باشد',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'therapist_service_id' => 'سرویس',
            'appointment_date_jalali' => 'تاریخ رزرو',
            'start_time' => 'زمان شروع',
            'client_name' => 'نام مراجع',
            'client_phone' => 'شماره تماس',
            'client_email' => 'ایمیل',
            'notes' => 'یادداشت',
        ];
    }
}
