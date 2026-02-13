<?php

declare(strict_types=1);

namespace App\Modules\Appointment\Services;

use App\Modules\Appointment\Domain\Appointment;
use App\Modules\Schedule\Services\ScheduleService;
use App\Modules\Service\Domain\TherapistService;
use Carbon\Carbon;
use App\Modules\Shared\JalaliHelper;

class AvailabilityService
{
    public function __construct(
        private ScheduleService $scheduleService,
        private SlotGeneratorService $slotGenerator,
        private OverlapDetectionService $overlapDetector
    ) {}

    /**
     * Get available slots for therapist on specific date
     *
     * @param int $therapistId
     * @param string $jalaliDate Jalali date: '1405-11-25'
     * @return array
     */
    public function getAvailableSlots(int $therapistId, string $jalaliDate): array
    {
        // Convert Jalali to Gregorian
        $gregorianDate = $this->jalaliToGregorian($jalaliDate);
        $date = Carbon::parse($gregorianDate);

        // Get schedule for this date (weekly or override)
        $scheduleInfo = $this->scheduleService->getScheduleForDate($therapistId, $date);

        // If unavailable, return empty
        if ($scheduleInfo['type'] === 'unavailable') {
            return [
                'date' => $jalaliDate,
                'date_gregorian' => $gregorianDate,
                'is_available' => false,
                'reason' => 'therapist_unavailable',
                'slots_by_service' => [],
            ];
        }

        $scheduleData = $scheduleInfo['data'];
        $startTime = $scheduleData['start_time'];
        $endTime = $scheduleData['end_time'];
        $breakDuration = $scheduleData['break_duration'];

        // Get therapist's active services
        $services = TherapistService::byTherapist($therapistId)
            ->available()
            ->with('serviceType')
            ->get();

        if ($services->isEmpty()) {
            return [
                'date' => $jalaliDate,
                'date_gregorian' => $gregorianDate,
                'is_available' => false,
                'reason' => 'no_services_configured',
                'slots_by_service' => [],
            ];
        }

        // Generate slots for each service
        $slotsByService = [];
        foreach ($services as $service) {
            $slots = $this->slotGenerator->generate(
                $date,
                $startTime,
                $endTime,
                $service->duration,
                $breakDuration
            );

            $slotsByService[$service->id] = [
                'service_id' => $service->id,
                'service_name' => $service->serviceType->name,
                'service_name_fa' => $service->serviceType->name_fa,
                'duration' => $service->duration,
                'price' => $service->price,
                'slots' => $slots,
            ];
        }

        // Get existing appointments for this date
        $appointments = Appointment::byTherapist($therapistId)
            ->forDate($gregorianDate)
            ->notCancelled()
            ->get();

        // Filter out occupied slots for each service
        foreach ($slotsByService as $serviceId => &$serviceData) {
            $serviceData['slots'] = $this->overlapDetector->filterOccupiedSlots(
                $serviceData['slots'],
                $appointments
            );

            // Reindex array
            $serviceData['slots'] = array_values($serviceData['slots']);
            $serviceData['total_slots'] = count($serviceData['slots']);
            $serviceData['has_available_slots'] = !empty($serviceData['slots']);
        }

        return [
            'date' => $jalaliDate,
            'date_gregorian' => $gregorianDate,
            'day_of_week' => $date->dayOfWeek,
            'day_name_fa' => $this->getPersianDayName($date->dayOfWeek),
            'is_available' => true,
            'schedule_type' => $scheduleInfo['type'],
            'working_hours' => [
                'start' => $startTime,
                'end' => $endTime,
            ],
            'slots_by_service' => array_values($slotsByService),
            'total_services' => count($slotsByService),
        ];
    }

    /**
     * Get available slots for multiple dates
     *
     * @param int $therapistId
     * @param array $jalaliDates
     * @return array
     */
    public function getAvailableSlotsForMultipleDates(int $therapistId, array $jalaliDates): array
    {
        $result = [];
        
        foreach ($jalaliDates as $date) {
            $result[] = $this->getAvailableSlots($therapistId, $date);
        }

        return $result;
    }

    /**
     * Check if specific slot is available
     *
     * @param int $therapistId
     * @param string $jalaliDate
     * @param string $startTime (HH:MM)
     * @param int $duration
     * @return bool
     */
    public function isSlotAvailable(
        int $therapistId,
        string $jalaliDate,
        string $startTime,
        int $duration
    ): bool {
        $gregorianDate = $this->jalaliToGregorian($jalaliDate);
        $date = Carbon::parse($gregorianDate);
        
        $slotStart = Carbon::parse($gregorianDate . ' ' . $startTime);
        $slotEnd = $slotStart->copy()->addMinutes($duration);

        // Check schedule
        $scheduleInfo = $this->scheduleService->getScheduleForDate($therapistId, $date);
        
        if ($scheduleInfo['type'] === 'unavailable') {
            return false;
        }

        // Check if within working hours
        $scheduleData = $scheduleInfo['data'];
        if (!$this->overlapDetector->isWithinWorkingHours(
            $slotStart,
            $slotEnd,
            $scheduleData['start_time'],
            $scheduleData['end_time']
        )) {
            return false;
        }

        // Check for conflicts with existing appointments
        return !$this->overlapDetector->hasOverlap($therapistId, $slotStart, $slotEnd);
    }

    /**
     * Get availability summary for date range
     *
     * @param int $therapistId
     * @param string $jalaliStartDate
     * @param string $jalaliEndDate
     * @return array
     */
    public function getAvailabilitySummary(
        int $therapistId,
        string $jalaliStartDate,
        string $jalaliEndDate
    ): array {
        $startDate = Carbon::parse($this->jalaliToGregorian($jalaliStartDate));
        $endDate = Carbon::parse($this->jalaliToGregorian($jalaliEndDate));

        $summary = [];
        $current = $startDate->copy();

        while ($current->lte($endDate)) {
            $jalaliCurrent = $this->gregorianToJalali($current);
            $availability = $this->getAvailableSlots($therapistId, $jalaliCurrent);

            $totalSlots = 0;
            foreach ($availability['slots_by_service'] as $service) {
                $totalSlots += $service['total_slots'];
            }

            $summary[] = [
                'date' => $jalaliCurrent,
                'date_gregorian' => $current->format('Y-m-d'),
                'is_available' => $availability['is_available'],
                'total_slots' => $totalSlots,
                'has_slots' => $totalSlots > 0,
            ];

            $current->addDay();
        }

        return $summary;
    }

    /**
     * Get next available slot for therapist
     *
     * @param int $therapistId
     * @param int $serviceId
     * @param int $daysToCheck
     * @return array|null
     */
    public function getNextAvailableSlot(
        int $therapistId,
        int $serviceId,
        int $daysToCheck = 14
    ): ?array {
        $today = Carbon::today();

        for ($i = 0; $i < $daysToCheck; $i++) {
            $checkDate = $today->copy()->addDays($i);
            $jalaliDate = $this->gregorianToJalali($checkDate);
            
            $availability = $this->getAvailableSlots($therapistId, $jalaliDate);

            if (!$availability['is_available']) {
                continue;
            }

            foreach ($availability['slots_by_service'] as $service) {
                if ($service['service_id'] == $serviceId && !empty($service['slots'])) {
                    return [
                        'date' => $jalaliDate,
                        'date_gregorian' => $checkDate->format('Y-m-d'),
                        'slot' => $service['slots'][0], // First available slot
                        'service' => $service,
                    ];
                }
            }
        }

        return null;
    }

    /**
     * Convert Jalali to Gregorian
     *
     * @param string $jalaliDate (Y-m-d)
     * @return string Gregorian date (Y-m-d)
     */
    private function jalaliToGregorian(string $jalaliDate): string
    {
        $jalaliDate = str_replace('/', '-', $jalaliDate);
        return JalaliHelper::jalaliToGregorian($jalaliDate)->format('Y-m-d');
    }

    /**
     * Convert Gregorian to Jalali
     *
     * @param Carbon $date
     * @return string Jalali date (Y-m-d)
     */
    private function gregorianToJalali(Carbon $date): string
    {
        return JalaliHelper::gregorianToJalali($date);
    }

    /**
     * Get Persian day name
     *
     * @param int $dayOfWeek (0-6)
     * @return string
     */
    private function getPersianDayName(int $dayOfWeek): string
    {
        $days = [
            0 => 'یکشنبه',
            1 => 'دوشنبه',
            2 => 'سه‌شنبه',
            3 => 'چهارشنبه',
            4 => 'پنج‌شنبه',
            5 => 'جمعه',
            6 => 'شنبه',
        ];

        return $days[$dayOfWeek] ?? '';
    }
}
