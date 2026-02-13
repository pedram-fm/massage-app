<?php

declare(strict_types=1);

namespace App\Modules\Appointment\Http\Controllers;

use App\Modules\Appointment\Services\AvailabilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AvailabilityController
{
    public function __construct(
        private AvailabilityService $availabilityService
    ) {}

    /**
     * Get available slots for specific date
     */
    public function getSlots(Request $request): JsonResponse
    {
        $therapistId = $request->user()->id;

        $validated = $request->validate([
            'date_jalali' => 'required|string', // Jalali date: 1405-11-25
        ]);

        $availability = $this->availabilityService->getAvailableSlots(
            $therapistId,
            $validated['date_jalali']
        );

        return response()->json([
            'success' => true,
            'data' => $availability,
        ]);
    }

    /**
     * Get availability summary for date range
     */
    public function getSummary(Request $request): JsonResponse
    {
        $therapistId = $request->user()->id;

        $validated = $request->validate([
            'start_date' => 'required|string', // Jalali
            'end_date' => 'required|string', // Jalali
        ]);

        $summary = $this->availabilityService->getAvailabilitySummary(
            $therapistId,
            $validated['start_date'],
            $validated['end_date']
        );

        return response()->json([
            'success' => true,
            'data' => $summary,
        ]);
    }

    /**
     * Check if specific slot is available
     */
    public function checkSlot(Request $request): JsonResponse
    {
        $therapistId = $request->user()->id;

        $validated = $request->validate([
            'date' => 'required|string',
            'time' => 'required|string', // HH:MM
            'duration' => 'required|integer|in:30,60,90,120',
        ]);

        $isAvailable = $this->availabilityService->isSlotAvailable(
            $therapistId,
            $validated['date'],
            $validated['time'],
            $validated['duration']
        );

        return response()->json([
            'success' => true,
            'data' => [
                'is_available' => $isAvailable,
            ],
        ]);
    }

    /**
     * Get next available slot for service
     */
    public function getNextAvailable(Request $request): JsonResponse
    {
        $therapistId = $request->user()->id;

        $validated = $request->validate([
            'service_id' => 'required|exists:therapist_services,id',
            'days_to_check' => 'integer|min:1|max:30',
        ]);

        $nextSlot = $this->availabilityService->getNextAvailableSlot(
            $therapistId,
            $validated['service_id'],
            $validated['days_to_check'] ?? 14
        );

        if (!$nextSlot) {
            return response()->json([
                'success' => true,
                'data' => null,
                'message' => 'هیچ زمان خالی در بازه زمانی انتخابی یافت نشد',
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $nextSlot,
        ]);
    }
}
