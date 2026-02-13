<?php

declare(strict_types=1);

namespace App\Modules\Appointment\Actions;

use App\Modules\Appointment\Domain\Appointment;
use App\Modules\Appointment\Domain\AppointmentStatus;
use App\Modules\Appointment\Services\OverlapDetectionService;
use App\Modules\Service\Domain\TherapistService;
use Carbon\Carbon;
use App\Modules\Shared\JalaliHelper;
use Illuminate\Support\Facades\DB;

class CreateAppointmentAction
{
    public function __construct(
        private OverlapDetectionService $overlapDetector
    ) {}

    /**
     * Create a new appointment with concurrency safety
     *
     * @param array $data
     * @return Appointment
     * @throws \Exception
     */
    public function execute(array $data): Appointment
    {
        return DB::transaction(function () use ($data) {
            
            // 1. Lock all therapist appointments for this date
            Appointment::byTherapist($data['therapist_id'])
                ->whereDate('start_time', $this->prepareDatetime($data))
                ->lockForUpdate()
                ->get();

            // 2. Get service details
            $service = TherapistService::byTherapist($data['therapist_id'])
                ->where('id', $data['therapist_service_id'])
                ->available()
                ->with('serviceType')
                ->firstOrFail();

            // 3. Calculate appointment times
            $startTime = $this->prepareStartTime($data);
            $endTime = $startTime->copy()->addMinutes($service->duration);

            // 4. Re-check availability (double-check after lock)
            if ($this->overlapDetector->hasOverlap(
                $data['therapist_id'],
                $startTime,
                $endTime
            )) {
                throw new \Exception('این زمان دیگر در دسترس نیست. لطفا زمان دیگری انتخاب کنید.');
            }

            // 5. Validate time is in future
            if ($startTime->isPast()) {
                throw new \Exception('زمان انتخابی باید در آینده باشد.');
            }

            // 6. Create appointment
            $appointment = Appointment::create([
                'therapist_id' => $data['therapist_id'],
                'client_name' => $data['client_name'] ?? null,
                'client_phone' => $data['client_phone'] ?? null,
                'client_email' => $data['client_email'] ?? null,
                'service_type_id' => $service->service_type_id,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'duration' => $service->duration,
                'price' => $service->price,
                'status' => AppointmentStatus::CONFIRMED,
                'notes' => $data['notes'] ?? null,
            ]);

            // 7. (Optional) Dispatch notification event
            // event(new AppointmentCreated($appointment));

            return $appointment->load(['therapist', 'serviceType']);
        });
    }

    /**
     * Prepare start datetime from Jalali date and time
     *
     * @param array $data
     * @return Carbon
     */
    private function prepareStartTime(array $data): Carbon
    {
        $jalaliDate = $data['appointment_date_jalali'] ?? $data['date'] ?? $data['jalali_date'];
        $time = $data['start_time'] ?? $data['time'];

        // Convert Jalali to Gregorian (handle both slash and dash separators)
        $jalaliDate = str_replace('/', '-', $jalaliDate);
        $gregorianDate = JalaliHelper::jalaliToGregorian($jalaliDate)->format('Y-m-d');

        return Carbon::parse($gregorianDate . ' ' . $time);
    }

    /**
     * Get date only for locking query
     *
     * @param array $data
     * @return string
     */
    private function prepareDatetime(array $data): string
    {
        $jalaliDate = $data['appointment_date_jalali'] ?? $data['date'] ?? $data['jalali_date'];
        $jalaliDate = str_replace('/', '-', $jalaliDate);
        return JalaliHelper::jalaliToGregorian($jalaliDate)->format('Y-m-d');
    }

    /**
     * Validate appointment data
     *
     * @param array $data
     * @return array|null Errors or null
     */
    public function validate(array $data): ?array
    {
        $errors = [];

        if (empty($data['therapist_id'])) {
            $errors['therapist_id'] = 'تراپیست الزامی است';
        }

        if (empty($data['therapist_service_id'])) {
            $errors['therapist_service_id'] = 'سرویس الزامی است';
        }

        if (empty($data['client_name'])) {
            $errors['client_name'] = 'نام مشتری الزامی است';
        }

        if (empty($data['client_email']) && empty($data['client_phone'])) {
            $errors['client_contact'] = 'ایمیل یا شماره تلفن الزامی است';
        }

        if (!empty($data['client_email']) && !filter_var($data['client_email'], FILTER_VALIDATE_EMAIL)) {
            $errors['client_email'] = 'فرمت ایمیل نامعتبر است';
        }

        return empty($errors) ? null : $errors;
    }
}
