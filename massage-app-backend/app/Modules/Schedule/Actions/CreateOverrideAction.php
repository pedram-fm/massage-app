<?php

declare(strict_types=1);

namespace App\Modules\Schedule\Actions;

use App\Modules\Appointment\Domain\Appointment;
use App\Modules\Appointment\Domain\AppointmentStatus;
use App\Modules\Schedule\Domain\OverrideType;
use App\Modules\Schedule\Domain\ScheduleOverride;
use Carbon\Carbon;
use App\Modules\Shared\JalaliHelper;
use Illuminate\Support\Facades\DB;

class CreateOverrideAction
{
    /**
     * Create a schedule override
     *
     * @param array $data
     * @return ScheduleOverride
     * @throws \Exception
     */
    public function execute(array $data): ScheduleOverride
    {
        return DB::transaction(function () use ($data) {
            
            // Validate
            $validation = $this->validate($data);
            if ($validation) {
                throw new \Exception(json_encode($validation));
            }

            // Convert Jalali to Gregorian
            $jalaliDate = $data['override_date_jalali'] ?? $data['date'];
            $gregorianDate = JalaliHelper::jalaliToGregorian($jalaliDate);

            // Check for existing appointments on this date
            $existingAppointments = $this->getAppointmentsOnDate(
                $data['therapist_id'],
                $gregorianDate->format('Y-m-d')
            );

            $overrideType = $data['override_type'] ?? $data['type'];

            if ($existingAppointments->isNotEmpty()) {
                // Check if override conflicts with appointments
                $conflicts = $this->checkConflicts(
                    $existingAppointments,
                    $overrideType,
                    $data['start_time'] ?? null,
                    $data['end_time'] ?? null
                );

                if (!empty($conflicts)) {
                    throw new \Exception(
                        'این روز ' . count($conflicts) . ' رزرو دارد. ' .
                        'لطفا ابتدا رزروها را لغو یا تغییر دهید.'
                    );
                }
            }

            // Delete existing override for this date (update scenario)
            ScheduleOverride::byTherapist($data['therapist_id'])
                ->forDate($gregorianDate->format('Y-m-d'))
                ->delete();

            // Create override
            $override = ScheduleOverride::create([
                'therapist_id' => $data['therapist_id'],
                'date' => $jalaliDate,
                'date_gregorian' => $gregorianDate,
                'type' => $overrideType,
                'start_time' => $data['start_time'] ?? null,
                'end_time' => $data['end_time'] ?? null,
                'reason' => $data['reason_fa'] ?? $data['reason'] ?? null,
            ]);

            return $override;
        });
    }

    /**
     * Get appointments on specific date
     *
     * @param int $therapistId
     * @param string $gregorianDate
     * @return \Illuminate\Support\Collection
     */
    private function getAppointmentsOnDate(int $therapistId, string $gregorianDate)
    {
        return Appointment::byTherapist($therapistId)
            ->forDate($gregorianDate)
            ->where('status', AppointmentStatus::CONFIRMED)
            ->get();
    }

    /**
     * Check if override conflicts with appointments
     *
     * @param \Illuminate\Support\Collection $appointments
     * @param string $overrideType
     * @param string|null $newStartTime
     * @param string|null $newEndTime
     * @return array Conflicting appointments
     */
    private function checkConflicts($appointments, string $overrideType, $newStartTime, $newEndTime): array
    {
        $conflicts = [];

        // If unavailable, all appointments conflict
        if ($overrideType === OverrideType::UNAVAILABLE->value) {
            return $appointments->all();
        }

        // If custom hours, check if appointments fall outside new hours
        if ($overrideType === OverrideType::CUSTOM_HOURS->value && $newStartTime && $newEndTime) {
            foreach ($appointments as $appointment) {
                $appStartTime = $appointment->start_time->format('H:i');
                $appEndTime = $appointment->end_time->format('H:i');

                if ($appStartTime < $newStartTime || $appEndTime > $newEndTime) {
                    $conflicts[] = $appointment;
                }
            }
        }

        return $conflicts;
    }

    /**
     * Get conflict report for preview
     *
     * @param int $therapistId
     * @param string $jalaliDate
     * @param string $type
     * @param string|null $startTime
     * @param string|null $endTime
     * @return array
     */
    public function getConflictReport(
        int $therapistId,
        string $jalaliDate,
        string $type,
        ?string $startTime = null,
        ?string $endTime = null
    ): array {
        $jalaliDateNormalized = str_replace('/', '-', $jalaliDate);
        $gregorianDate = JalaliHelper::jalaliToGregorian($jalaliDateNormalized)->format('Y-m-d');
        $appointments = $this->getAppointmentsOnDate($therapistId, $gregorianDate);

        $conflicts = $this->checkConflicts($appointments, $type, $startTime, $endTime);

        $report = [
            'date' => $jalaliDate,
            'total_appointments' => $appointments->count(),
            'has_conflicts' => !empty($conflicts),
            'total_conflicts' => count($conflicts),
            'conflicts' => [],
        ];

        foreach ($conflicts as $appointment) {
            $report['conflicts'][] = [
                'id' => $appointment->id,
                'client_name' => $appointment->client_name,
                'time' => $appointment->start_time->format('H:i'),
                'service' => $appointment->serviceType->name_fa,
            ];
        }

        return $report;
    }

    /**
     * Delete an override
     *
     * @param int $overrideId
     * @param int $therapistId
     * @return bool
     */
    public function delete(int $overrideId, int $therapistId): bool
    {
        $override = ScheduleOverride::byTherapist($therapistId)
            ->findOrFail($overrideId);

        return $override->delete();
    }

    /**
     * Validate override data
     *
     * @param array $data
     * @return array|null
     */
    public function validate(array $data): ?array
    {
        $errors = [];

        if (empty($data['therapist_id'])) {
            $errors['therapist_id'] = 'تراپیست الزامی است';
        }

        if (empty($data['override_date_jalali']) && empty($data['date'])) {
            $errors['date'] = 'تاریخ الزامی است';
        }

        if (empty($data['override_type']) && empty($data['type'])) {
            $errors['type'] = 'نوع استثنا الزامی است';
        }

        $overrideType = $data['override_type'] ?? $data['type'] ?? null;

        if (
            $overrideType === OverrideType::CUSTOM_HOURS->value &&
            (empty($data['start_time']) || empty($data['end_time']))
        ) {
            $errors['time_range'] = 'برای ساعات کاری خاص، باید ساعت شروع و پایان مشخص شود';
        }

        return empty($errors) ? null : $errors;
    }
}
