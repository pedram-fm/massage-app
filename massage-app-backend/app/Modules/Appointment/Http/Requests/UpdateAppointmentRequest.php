<?php

namespace App\Modules\Appointment\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Modules\Appointment\Domain\AppointmentStatus;

class UpdateAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => [
                'sometimes',
                'required',
                Rule::enum(AppointmentStatus::class),
            ],
            'cancellation_reason' => [
                'required_if:status,' . AppointmentStatus::CANCELLED->value,
                'nullable',
                'string',
                'max:500',
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
            'status.required' => 'وضعیت الزامی است',
            'cancellation_reason.required_if' => 'دلیل لغو الزامی است',
            'cancellation_reason.max' => 'دلیل لغو نباید بیشتر از 500 کاراکتر باشد',
            'notes.max' => 'یادداشت نباید بیشتر از 1000 کاراکتر باشد',
        ];
    }

    public function attributes(): array
    {
        return [
            'status' => 'وضعیت',
            'cancellation_reason' => 'دلیل لغو',
            'notes' => 'یادداشت',
        ];
    }
}
