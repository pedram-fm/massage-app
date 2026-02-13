<?php

declare(strict_types=1);

namespace App\Modules\Schedule\Services;

use App\Modules\Schedule\Domain\DayOfWeek;
use App\Modules\Schedule\Domain\ScheduleOverride;
use App\Modules\Schedule\Domain\TherapistSchedule;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ScheduleService
{
    /**
     * Get therapist's weekly schedule
     *
     * @param int $therapistId
     * @return Collection
     */
    public function getWeeklySchedule(int $therapistId): Collection
    {
        return TherapistSchedule::byTherapist($therapistId)
            ->orderBy('day_of_week')
            ->get();
    }

    /**
     * Get schedule for specific day
     *
     * @param int $therapistId
     * @param int $dayOfWeek (0-6)
     * @return TherapistSchedule|null
     */
    public function getScheduleForDay(int $therapistId, int $dayOfWeek): ?TherapistSchedule
    {
        return TherapistSchedule::byTherapist($therapistId)
            ->forDay($dayOfWeek)
            ->active()
            ->first();
    }

    /**
     * Update weekly schedule (bulk update)
     *
     * @param int $therapistId
     * @param array $schedules Array of day schedules
     * @return Collection
     */
    public function updateWeeklySchedule(int $therapistId, array $schedules): Collection
    {
        // Delete existing schedules
        TherapistSchedule::byTherapist($therapistId)->delete();

        // Create new schedules
        $created = [];
        foreach ($schedules as $schedule) {
            if (!isset($schedule['is_active']) || !$schedule['is_active']) {
                continue;
            }

            $created[] = TherapistSchedule::create([
                'therapist_id' => $therapistId,
                'day_of_week' => $schedule['day_of_week'],
                'start_time' => $schedule['start_time'],
                'end_time' => $schedule['end_time'],
                'break_duration' => $schedule['break_duration'] ?? 15,
                'is_active' => true,
            ]);
        }

        return collect($created);
    }

    /**
     * Get base schedule for a specific date (considering overrides)
     *
     * @param int $therapistId
     * @param Carbon $date
     * @return array ['type' => 'weekly|override|unavailable', 'data' => mixed]
     */
    public function getScheduleForDate(int $therapistId, Carbon $date): array
    {
        // Check for override first
        $override = ScheduleOverride::byTherapist($therapistId)
            ->forDate($date->format('Y-m-d'))
            ->first();

        if ($override) {
            if ($override->isUnavailable()) {
                return [
                    'type' => 'unavailable',
                    'data' => $override,
                ];
            }

            if ($override->isCustomHours()) {
                return [
                    'type' => 'override',
                    'data' => [
                        'start_time' => $override->start_time,
                        'end_time' => $override->end_time,
                        'break_duration' => 15, // default
                        'override' => $override,
                    ],
                ];
            }
        }

        // Get weekly template
        $dayOfWeek = $date->dayOfWeek;
        $weeklySchedule = $this->getScheduleForDay($therapistId, $dayOfWeek);

        if (!$weeklySchedule) {
            return [
                'type' => 'unavailable',
                'data' => null,
            ];
        }

        return [
            'type' => 'weekly',
            'data' => [
                'start_time' => $weeklySchedule->start_time,
                'end_time' => $weeklySchedule->end_time,
                'break_duration' => $weeklySchedule->break_duration,
                'schedule' => $weeklySchedule,
            ],
        ];
    }

    /**
     * Check if therapist is available on a specific date
     *
     * @param int $therapistId
     * @param Carbon $date
     * @return bool
     */
    public function isAvailableOnDate(int $therapistId, Carbon $date): bool
    {
        $schedule = $this->getScheduleForDate($therapistId, $date);
        return $schedule['type'] !== 'unavailable';
    }

    /**
     * Get overrides in date range
     *
     * @param int $therapistId
     * @param Carbon $startDate
     * @param Carbon $endDate
     * @return Collection
     */
    public function getOverridesInRange(
        int $therapistId,
        Carbon $startDate,
        Carbon $endDate
    ): Collection {
        return ScheduleOverride::byTherapist($therapistId)
            ->inDateRange($startDate->format('Y-m-d'), $endDate->format('Y-m-d'))
            ->orderBy('date_gregorian')
            ->get();
    }

    /**
     * Get total working hours per week
     *
     * @param int $therapistId
     * @return int Total minutes
     */
    public function getTotalWeeklyWorkingMinutes(int $therapistId): int
    {
        $schedules = $this->getWeeklySchedule($therapistId);
        
        return $schedules->sum(function ($schedule) {
            return $schedule->getTotalWorkingMinutes();
        });
    }

    /**
     * Check if schedule has conflicts
     *
     * @param array $schedule
     * @return array|null Error if conflict, null if ok
     */
    public function validateSchedule(array $schedule): ?array
    {
        $startTime = Carbon::parse($schedule['start_time']);
        $endTime = Carbon::parse($schedule['end_time']);

        if ($startTime->gte($endTime)) {
            return [
                'error' => 'start_time_after_end_time',
                'message' => 'ساعت شروع باید قبل از ساعت پایان باشد',
            ];
        }

        if (abs($endTime->diffInMinutes($startTime)) < 30) {
            return [
                'error' => 'insufficient_duration',
                'message' => 'حداقل مدت زمان کاری 30 دقیقه است',
            ];
        }

        return null;
    }
}
