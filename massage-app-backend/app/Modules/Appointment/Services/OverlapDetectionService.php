<?php

declare(strict_types=1);

namespace App\Modules\Appointment\Services;

use App\Modules\Appointment\Domain\Appointment;
use App\Modules\Appointment\Domain\AppointmentStatus;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class OverlapDetectionService
{
    /**
     * Check if a time range overlaps with any appointments
     *
     * @param int $therapistId
     * @param Carbon $startTime
     * @param Carbon $endTime
     * @param int|null $excludeAppointmentId Exclude specific appointment (for updates)
     * @return bool
     */
    public function hasOverlap(
        int $therapistId,
        Carbon $startTime,
        Carbon $endTime,
        ?int $excludeAppointmentId = null
    ): bool {
        $query = Appointment::byTherapist($therapistId)
            ->notCancelled()
            ->where(function ($q) use ($startTime, $endTime) {
                $q->where(function ($query) use ($startTime, $endTime) {
                    // Appointment starts before and ends after requested start
                    $query->where('start_time', '<', $endTime)
                          ->where('end_time', '>', $startTime);
                });
            });

        if ($excludeAppointmentId) {
            $query->where('id', '!=', $excludeAppointmentId);
        }

        return $query->exists();
    }

    /**
     * Get overlapping appointments
     *
     * @param int $therapistId
     * @param Carbon $startTime
     * @param Carbon $endTime
     * @return Collection
     */
    public function getOverlappingAppointments(
        int $therapistId,
        Carbon $startTime,
        Carbon $endTime
    ): Collection {
        return Appointment::byTherapist($therapistId)
            ->notCancelled()
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime)
            ->get();
    }

    /**
     * Filter out occupied slots from available slots
     *
     * @param array $slots
     * @param Collection $appointments
     * @return array
     */
    public function filterOccupiedSlots(array $slots, Collection $appointments): array
    {
        return array_filter($slots, function ($slot) use ($appointments) {
            $slotStart = Carbon::parse($slot['start_time']);
            $slotEnd = Carbon::parse($slot['end_time']);

            foreach ($appointments as $appointment) {
                if ($this->timeRangesOverlap(
                    $slotStart,
                    $slotEnd,
                    $appointment->start_time,
                    $appointment->end_time
                )) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Check if two time ranges overlap
     *
     * @param Carbon $start1
     * @param Carbon $end1
     * @param Carbon $start2
     * @param Carbon $end2
     * @return bool
     */
    public function timeRangesOverlap(
        Carbon $start1,
        Carbon $end1,
        Carbon $start2,
        Carbon $end2
    ): bool {
        return $start1 < $end2 && $end1 > $start2;
    }

    /**
     * Check if requested time is within working hours
     *
     * @param Carbon $startTime
     * @param Carbon $endTime
     * @param string $workingStartTime (HH:MM)
     * @param string $workingEndTime (HH:MM)
     * @return bool
     */
    public function isWithinWorkingHours(
        Carbon $startTime,
        Carbon $endTime,
        string $workingStartTime,
        string $workingEndTime
    ): bool {
        $workingStart = Carbon::parse($startTime->format('Y-m-d') . ' ' . $workingStartTime);
        $workingEnd = Carbon::parse($startTime->format('Y-m-d') . ' ' . $workingEndTime);

        return $startTime->gte($workingStart) && $endTime->lte($workingEnd);
    }

    /**
     * Get available time gaps between appointments
     *
     * @param Collection $appointments
     * @param string $workingStartTime
     * @param string $workingEndTime
     * @param Carbon $date
     * @return array
     */
    public function getAvailableGaps(
        Collection $appointments,
        string $workingStartTime,
        string $workingEndTime,
        Carbon $date
    ): array {
        $gaps = [];
        
        $currentTime = Carbon::parse($date->format('Y-m-d') . ' ' . $workingStartTime);
        $endTime = Carbon::parse($date->format('Y-m-d') . ' ' . $workingEndTime);

        $sortedAppointments = $appointments->sortBy('start_time');

        foreach ($sortedAppointments as $appointment) {
            if ($appointment->start_time->gt($currentTime)) {
                $gaps[] = [
                    'start' => $currentTime->format('H:i'),
                    'end' => $appointment->start_time->format('H:i'),
                    'minutes' => $appointment->start_time->diffInMinutes($currentTime),
                ];
            }
            
            $currentTime = $appointment->end_time->copy();
        }

        // Check for gap after last appointment
        if ($currentTime->lt($endTime)) {
            $gaps[] = [
                'start' => $currentTime->format('H:i'),
                'end' => $endTime->format('H:i'),
                'minutes' => $endTime->diffInMinutes($currentTime),
            ];
        }

        return $gaps;
    }
}
