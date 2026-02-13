<?php

declare(strict_types=1);

namespace App\Modules\Schedule\Http\Controllers;

use App\Modules\Schedule\Actions\CreateOverrideAction;
use App\Modules\Schedule\Actions\UpdateWeeklyScheduleAction;
use App\Modules\Schedule\Domain\ScheduleOverride;
use App\Modules\Schedule\Services\ScheduleService;
use App\Modules\Schedule\Http\Requests\UpdateWeeklyScheduleRequest;
use App\Modules\Schedule\Http\Requests\CreateOverrideRequest;
use App\Modules\Schedule\Http\Resources\TherapistScheduleResource;
use App\Modules\Schedule\Http\Resources\ScheduleOverrideResource;
use App\Modules\Shared\JalaliHelper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TherapistScheduleController
{
    public function __construct(
        private ScheduleService $scheduleService,
        private UpdateWeeklyScheduleAction $updateWeeklyAction,
        private CreateOverrideAction $createOverrideAction
    ) {}

    /**
     * Get therapist's weekly schedule
     */
    public function index(Request $request): JsonResponse
    {
        $therapistId = $request->user()->id;

        $schedules = $this->scheduleService->getWeeklySchedule($therapistId);

        return response()->json([
            'success' => true,
            'data' => TherapistScheduleResource::collection($schedules),
        ]);
    }

    /**
     * Update weekly schedule
     */
    public function update(UpdateWeeklyScheduleRequest $request): JsonResponse
    {
        $therapistId = $request->user()->id;

        try {
            $schedules = $this->updateWeeklyAction->execute($therapistId, $request->validated()['schedules']);

            return response()->json([
                'success' => true,
                'message' => 'برنامه هفتگی با موفقیت بروزرسانی شد',
                'data' => TherapistScheduleResource::collection($schedules),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get conflict report before updating schedule
     */
    public function checkConflicts(Request $request): JsonResponse
    {
        $therapistId = $request->user()->id;

        $validated = $request->validate([
            'schedules' => 'required|array',
            'schedules.*.day_of_week' => 'required|integer|between:0,6',
            'schedules.*.start_time' => 'required_if:schedules.*.is_active,true',
            'schedules.*.end_time' => 'required_if:schedules.*.is_active,true',
            'schedules.*.is_active' => 'boolean',
        ]);

        $report = $this->updateWeeklyAction->getConflictReport(
            $therapistId,
            $validated['schedules']
        );

        return response()->json([
            'success' => true,
            'data' => $report,
        ]);
    }

    /**
     * Get schedule overrides
     */
    public function getOverrides(Request $request): JsonResponse
    {
        $therapistId = $request->user()->id;

        $query = ScheduleOverride::byTherapist($therapistId);

        // Filter by month if provided
        if ($request->has('month')) {
            // month format: 1405-11
            $jalaliMonth = $request->input('month');
            [$startOfMonth, $endOfMonth] = JalaliHelper::parseJalaliMonth($jalaliMonth);

            $query->whereBetween('date_gregorian', [
                $startOfMonth->format('Y-m-d'),
                $endOfMonth->format('Y-m-d'),
            ]);
        }

        $overrides = $query->orderBy('date_gregorian')->get();

        return response()->json([
            'success' => true,
            'data' => ScheduleOverrideResource::collection($overrides),
        ]);
    }

    /**
     * Create schedule override
     */
    public function storeOverride(CreateOverrideRequest $request): JsonResponse
    {
        $therapistId = $request->user()->id;

        try {
            $override = $this->createOverrideAction->execute([
                'therapist_id' => $therapistId,
                ...$request->validated(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'استثنا با موفقیت ایجاد شد',
                'data' => new ScheduleOverrideResource($override),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Check override conflicts
     */
    public function checkOverrideConflicts(Request $request): JsonResponse
    {
        $therapistId = $request->user()->id;

        $validated = $request->validate([
            'date' => 'required|string',
            'type' => 'required|in:unavailable,custom_hours',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
        ]);

        $report = $this->createOverrideAction->getConflictReport(
            $therapistId,
            $validated['date'],
            $validated['type'],
            $validated['start_time'] ?? null,
            $validated['end_time'] ?? null
        );

        return response()->json([
            'success' => true,
            'data' => $report,
        ]);
    }

    /**
     * Delete schedule override
     */
    public function destroyOverride(Request $request, int $id): JsonResponse
    {
        $therapistId = $request->user()->id;

        try {
            $this->createOverrideAction->delete($id, $therapistId);

            return response()->json([
                'success' => true,
                'message' => 'استثنا با موفقیت حذف شد',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'استثنا یافت نشد',
            ], 404);
        }
    }
}
