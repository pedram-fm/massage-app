<?php

namespace App\Modules\Schedule\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Modules\Schedule\Domain\DayOfWeek;

class UpdateWeeklyScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'schedules' => [
                'required',
                'array',
                'min:1',
            ],
            'schedules.*.day_of_week' => [
                'required',
                Rule::enum(DayOfWeek::class),
            ],
            'schedules.*.start_time' => [
                'required',
                'string',
                'regex:/^\d{2}:\d{2}(:\d{2})?$/',
            ],
            'schedules.*.end_time' => [
                'required',
                'string',
                'regex:/^\d{2}:\d{2}(:\d{2})?$/',
                'after:schedules.*.start_time',
            ],
            'schedules.*.break_duration' => [
                'sometimes',
                'nullable',
                'integer',
                'min:0',
                'max:120',
            ],
            'schedules.*.is_active' => [
                'sometimes',
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'schedules.required' => 'برنامه هفتگی الزامی است',
            'schedules.*.day_of_week.required' => 'روز هفته الزامی است',
            'schedules.*.start_time.required' => 'زمان شروع الزامی است',
            'schedules.*.start_time.regex' => 'فرمت زمان شروع باید به صورت 09:00 باشد',
            'schedules.*.end_time.required' => 'زمان پایان الزامی است',
            'schedules.*.end_time.regex' => 'فرمت زمان پایان باید به صورت 17:00 باشد',
            'schedules.*.end_time.after' => 'زمان پایان باید بعد از زمان شروع باشد',
            'schedules.*.break_duration.integer' => 'مدت استراحت باید عدد باشد',
            'schedules.*.break_duration.max' => 'مدت استراحت نباید بیشتر از 120 دقیقه باشد',
        ];
    }

    public function attributes(): array
    {
        return [
            'schedules.*.day_of_week' => 'روز هفته',
            'schedules.*.start_time' => 'زمان شروع',
            'schedules.*.end_time' => 'زمان پایان',
            'schedules.*.break_duration' => 'مدت استراحت',
            'schedules.*.is_active' => 'وضعیت فعال',
        ];
    }
}
