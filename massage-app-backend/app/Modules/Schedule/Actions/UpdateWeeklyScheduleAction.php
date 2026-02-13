<?php

declare(strict_types=1);

namespace App\Modules\Schedule\Actions;

use App\Modules\Appointment\Domain\Appointment;
use App\Modules\Appointment\Domain\AppointmentStatus;
use App\Modules\Schedule\Domain\TherapistSchedule;
use App\Modules\Schedule\Services\ScheduleService;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class UpdateWeeklyScheduleAction
{
    public function __construct(
        private ScheduleService $scheduleService
    ) {}

    /**
     * Update therapist's weekly schedule
     *
     * @param int $therapistId
     * @param array $schedules Array of day schedules
     * @return Collection
     * @throws \Exception
     */
    public function execute(int $therapistId, array $schedules): Collection
    {
        return DB::transaction(function () use ($therapistId, $schedules) {
            
            // Validate all schedules first
            foreach ($schedules as $schedule) {
                if (!isset($schedule['is_active']) || !$schedule['is_active']) {
                    continue;
                }

                $validation = $this->scheduleService->validateSchedule($schedule);
                if ($validation) {
                    throw new \Exception($validation['message']);
                }
            }

            // Check for conflicts with future appointments
            $conflicts = $this->checkFutureAppointmentConflicts($therapistId, $schedules);
            
            if (!empty($conflicts)) {
                throw new \Exception(
                    'تغییر برنامه با ' . count($conflicts) . ' رزرو موجود تداخل دارد. لطفا ابتدا آن‌ها را مدیریت کنید.'
                );
            }

            // Update schedule
            return $this->scheduleService->updateWeeklySchedule($therapistId, $schedules);
        });
    }

    /**
     * Check if new schedule conflicts with future appointments
     *
     * @param int $therapistId
     * @param array $newSchedules
     * @return array Conflicting appointments
     */
    private function checkFutureAppointmentConflicts(int $therapistId, array $newSchedules): array
    {
        $conflicts = [];

        // Get all future confirmed appointments
        $futureAppointments = Appointment::byTherapist($therapistId)
            ->where('start_time', '>=', now())
            ->where('status', AppointmentStatus::CONFIRMED)
            ->get();

        // Index new schedules by day_of_week
        $schedulesByDay = [];
        foreach ($newSchedules as $schedule) {
            if (isset($schedule['is_active']) && $schedule['is_active']) {
                $schedulesByDay[$schedule['day_of_week']] = $schedule;
            }
        }

        // Check each appointment
        foreach ($futureAppointments as $appointment) {
            $dayOfWeek = $appointment->start_time->dayOfWeek;

            // If day is now inactive
            if (!isset($schedulesByDay[$dayOfWeek])) {
                $conflicts[] = $appointment;
                continue;
            }

            $newSchedule = $schedulesByDay[$dayOfWeek];
            $appointmentTime = $appointment->start_time->format('H:i');
            $appointmentEndTime = $appointment->end_time->format('H:i');

            // Check if appointment is outside new working hours
            if (
                $appointmentTime < $newSchedule['start_time'] ||
                $appointmentEndTime > $newSchedule['end_time']
            ) {
                $conflicts[] = $appointment;
            }
        }

        return $conflicts;
    }

    /**
     * Get conflict report for preview
     *
     * @param int $therapistId
     * @param array $newSchedules
     * @return array
     */
    public function getConflictReport(int $therapistId, array $newSchedules): array
    {
        $conflicts = $this->checkFutureAppointmentConflicts($therapistId, $newSchedules);

        $report = [
            'has_conflicts' => !empty($conflicts),
            'total_conflicts' => count($conflicts),
            'conflicts' => [],
        ];

        foreach ($conflicts as $appointment) {
            $report['conflicts'][] = [
                'id' => $appointment->id,
                'client_name' => $appointment->client_name,
                'date' => $appointment->getJalaliDate(),
                'time' => $appointment->start_time->format('H:i'),
                'service' => $appointment->serviceType->name_fa,
            ];
        }

        return $report;
    }

    /**
     * Validate schedule data
     *
     * @param array $schedules
     * @return array|null
     */
    public function validate(array $schedules): ?array
    {
        $errors = [];

        foreach ($schedules as $index => $schedule) {
            if (!isset($schedule['is_active']) || !$schedule['is_active']) {
                continue;
            }

            if (!isset($schedule['day_of_week']) || $schedule['day_of_week'] < 0 || $schedule['day_of_week'] > 6) {
                $errors["schedules.{$index}.day_of_week"] = 'روز هفته نامعتبر است';
            }

            if (empty($schedule['start_time'])) {
                $errors["schedules.{$index}.start_time"] = 'ساعت شروع الزامی است';
            }

            if (empty($schedule['end_time'])) {
                $errors["schedules.{$index}.end_time"] = 'ساعت پایان الزامی است';
            }

            if (isset($schedule['break_duration']) && $schedule['break_duration'] < 0) {
                $errors["schedules.{$index}.break_duration"] = 'مدت استراحت نامعتبر است';
            }
        }

        return empty($errors) ? null : $errors;
    }
}
