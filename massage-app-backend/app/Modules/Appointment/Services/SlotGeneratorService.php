<?php

declare(strict_types=1);

namespace App\Modules\Appointment\Services;

use Carbon\Carbon;

class SlotGeneratorService
{
    /**
     * Generate time slots for a given time range
     *
     * @param Carbon $date The base date
     * @param string $startTime Start time (HH:MM)
     * @param string $endTime End time (HH:MM)
     * @param int $duration Duration in minutes
     * @param int $breakDuration Break duration in minutes between slots
     * @return array Array of slots with start_time and end_time
     */
    public function generate(
        Carbon $date,
        string $startTime,
        string $endTime,
        int $duration,
        int $breakDuration
    ): array {
        $slots = [];
        
        $currentSlot = Carbon::parse($date->format('Y-m-d') . ' ' . $startTime);
        $endDateTime = Carbon::parse($date->format('Y-m-d') . ' ' . $endTime);

        while ($currentSlot->copy()->addMinutes($duration)->lte($endDateTime)) {
            $slotEnd = $currentSlot->copy()->addMinutes($duration);
            
            $slots[] = [
                'start_time' => $currentSlot->toIso8601String(),
                'end_time' => $slotEnd->toIso8601String(),
                'start_time_formatted' => $currentSlot->format('H:i'),
                'end_time_formatted' => $slotEnd->format('H:i'),
                'duration' => $duration,
            ];

            // Move to next slot (duration + break)
            $currentSlot->addMinutes($duration + $breakDuration);
        }

        return $slots;
    }

    /**
     * Generate slots for multiple durations
     *
     * @param Carbon $date
     * @param string $startTime
     * @param string $endTime
     * @param array $services Array of ['duration' => int, 'break' => int]
     * @return array Keyed by service id
     */
    public function generateForMultipleDurations(
        Carbon $date,
        string $startTime,
        string $endTime,
        array $services
    ): array {
        $result = [];

        foreach ($services as $serviceId => $config) {
            $result[$serviceId] = $this->generate(
                $date,
                $startTime,
                $endTime,
                $config['duration'],
                $config['break'] ?? 15
            );
        }

        return $result;
    }

    /**
     * Check if a time range has enough space for a slot
     *
     * @param string $startTime
     * @param string $endTime
     * @param int $requiredDuration
     * @return bool
     */
    public function hasEnoughSpace(
        string $startTime,
        string $endTime,
        int $requiredDuration
    ): bool {
        $start = Carbon::parse($startTime);
        $end = Carbon::parse($endTime);

        return $end->diffInMinutes($start) >= $requiredDuration;
    }
}
