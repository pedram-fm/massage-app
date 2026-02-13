<?php

declare(strict_types=1);

namespace App\Modules\Appointment\Http\Controllers;

use App\Modules\Appointment\Actions\CancelAppointmentAction;
use App\Modules\Appointment\Actions\CreateAppointmentAction;
use App\Modules\Appointment\Domain\Appointment;
use App\Modules\Appointment\Domain\AppointmentStatus;
use App\Modules\Appointment\Http\Requests\CreateAppointmentRequest;
use App\Modules\Appointment\Http\Requests\UpdateAppointmentRequest;
use App\Modules\Appointment\Http\Resources\AppointmentResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TherapistAppointmentController
{
    public function __construct(
        private CreateAppointmentAction $createAction,
        private CancelAppointmentAction $cancelAction
    ) {}

    /**
     * Get all therapist appointments
     */
    public function index(Request $request): JsonResponse
    {
        $therapistId = $request->user()->id;

        $query = Appointment::byTherapist($therapistId)
            ->with(['serviceType']);

        // Filter by status
        if ($request->has('status')) {
            $status = AppointmentStatus::from($request->input('status'));
            $query->byStatus($status);
        }

        // Filter by date range
        if ($request->has('date_from') && $request->has('date_to')) {
            // Convert Jalali to Gregorian if needed
            $query->whereBetween('start_time', [
                $request->input('date_from'),
                $request->input('date_to'),
            ]);
        }

        // Filter upcoming
        if ($request->boolean('upcoming')) {
            $query->upcoming();
        }

        // Filter past
        if ($request->boolean('past')) {
            $query->past();
        }

        // Order
        $query->orderBy('start_time', $request->input('order', 'asc'));

        // Paginate
        $perPage = $request->input('per_page', 20);
        $appointments = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => AppointmentResource::collection($appointments->items()),
            'meta' => [
                'current_page' => $appointments->currentPage(),
                'last_page' => $appointments->lastPage(),
                'per_page' => $appointments->perPage(),
                'total' => $appointments->total(),
            ],
        ]);
    }

    /**
     * Get single appointment
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $therapistId = $request->user()->id;

        $appointment = Appointment::byTherapist($therapistId)
            ->with(['serviceType'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new AppointmentResource($appointment),
        ]);
    }

    /**
     * Create new appointment (manual booking by therapist)
     */
    public function store(CreateAppointmentRequest $request): JsonResponse
    {
        $therapistId = $request->user()->id;

        try {
            $appointment = $this->createAction->execute([
                'therapist_id' => $therapistId,
                ...$request->validated(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'رزرو با موفقیت ایجاد شد',
                'data' => new AppointmentResource($appointment->load('serviceType')),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Update appointment (notes, reschedule)
     */
    public function update(UpdateAppointmentRequest $request, int $id): JsonResponse
    {
        $therapistId = $request->user()->id;

        $appointment = Appointment::byTherapist($therapistId)
            ->findOrFail($id);

        $validated = $request->validated();

        // Only allow certain status changes
        if (isset($validated['status'])) {
            $newStatus = AppointmentStatus::from($validated['status']);
            
            if ($newStatus === AppointmentStatus::COMPLETED && !$appointment->canBeCompleted()) {
                return response()->json([
                    'success' => false,
                    'message' => 'فقط رزروهای گذشته را می‌توان به عنوان انجام شده علامت زد',
                ], 422);
            }
        }

        $appointment->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'رزرو با موفقیت بروزرسانی شد',
            'data' => new AppointmentResource($appointment->fresh()->load('serviceType')),
        ]);
    }

    /**
     * Cancel appointment
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $therapistId = $request->user()->id;

        $appointment = Appointment::byTherapist($therapistId)
            ->findOrFail($id);

        $validated = $request->validate([
            'reason' => 'nullable|string|max:255',
        ]);

        try {
            $this->cancelAction->execute(
                $id,
                $validated['reason'] ?? null,
                $therapistId
            );

            return response()->json([
                'success' => true,
                'message' => 'رزرو با موفقیت لغو شد',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get appointments statistics
     */
    public function stats(Request $request): JsonResponse
    {
        $therapistId = $request->user()->id;

        $stats = [
            'total' => Appointment::byTherapist($therapistId)->count(),
            'upcoming' => Appointment::byTherapist($therapistId)->upcoming()->count(),
            'today' => Appointment::byTherapist($therapistId)
                ->whereDate('start_time', today())
                ->notCancelled()
                ->count(),
            'confirmed' => Appointment::byTherapist($therapistId)
                ->byStatus(AppointmentStatus::CONFIRMED)
                ->count(),
            'completed' => Appointment::byTherapist($therapistId)
                ->byStatus(AppointmentStatus::COMPLETED)
                ->count(),
            'cancelled' => Appointment::byTherapist($therapistId)
                ->byStatus(AppointmentStatus::CANCELLED)
                ->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Get cancellation policy for appointment
     */
    public function cancellationPolicy(Request $request, int $id): JsonResponse
    {
        $therapistId = $request->user()->id;

        $appointment = Appointment::byTherapist($therapistId)
            ->findOrFail($id);

        $policy = $this->cancelAction->getCancellationPolicy($appointment);

        return response()->json([
            'success' => true,
            'data' => $policy,
        ]);
    }
}
