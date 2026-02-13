<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Controllers;

use App\Modules\Service\Domain\ServiceType;
use App\Modules\Service\Domain\TherapistService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TherapistServiceController
{
    /**
     * Get therapist's services
     */
    public function index(Request $request): JsonResponse
    {
        $therapistId = $request->user()->id;

        $services = TherapistService::byTherapist($therapistId)
            ->with('serviceType')
            ->ordered()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $services,
        ]);
    }

    /**
     * Get available service types that therapist hasn't added yet
     */
    public function available(Request $request): JsonResponse
    {
        $therapistId = $request->user()->id;

        // Get service types not yet added by therapist
        $existingServiceIds = TherapistService::byTherapist($therapistId)
            ->pluck('service_type_id');

        $availableServices = ServiceType::active()
            ->whereNotIn('id', $existingServiceIds)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $availableServices,
        ]);
    }

    /**
     * Add service to therapist
     */
    public function store(Request $request): JsonResponse
    {
        $therapistId = $request->user()->id;

        $validated = $request->validate([
            'service_type_id' => 'required|exists:service_types,id',
            'duration' => 'nullable|integer|min:15|max:480',
            'price' => 'nullable|integer|min:0',
            'is_available' => 'boolean',
            'display_order' => 'integer|min:0',
        ]);

        // Check if already exists
        $exists = TherapistService::byTherapist($therapistId)
            ->where('service_type_id', $validated['service_type_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'این سرویس قبلا اضافه شده است',
            ], 422);
        }

        // Use service type defaults if not provided
        $serviceType = ServiceType::findOrFail($validated['service_type_id']);

        $service = TherapistService::create([
            'therapist_id' => $therapistId,
            'service_type_id' => $validated['service_type_id'],
            'duration' => $validated['duration'] ?? $serviceType->default_duration ?? 60,
            'price' => $validated['price'] ?? 0,
            'is_available' => $validated['is_available'] ?? true,
            'display_order' => $validated['display_order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'سرویس با موفقیت اضافه شد',
            'data' => $service->load('serviceType'),
        ], 201);
    }

    /**
     * Update therapist service
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $therapistId = $request->user()->id;

        $service = TherapistService::byTherapist($therapistId)
            ->findOrFail($id);

        $validated = $request->validate([
            'duration' => 'sometimes|integer|min:15|max:480',
            'price' => 'sometimes|integer|min:0',
            'is_available' => 'boolean',
            'display_order' => 'integer|min:0',
        ]);

        $service->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'سرویس با موفقیت بروزرسانی شد',
            'data' => $service->fresh()->load('serviceType'),
        ]);
    }

    /**
     * Delete therapist service
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $therapistId = $request->user()->id;

        $service = TherapistService::byTherapist($therapistId)
            ->findOrFail($id);

        // Check if there are future appointments using this service
        $futureAppointments = DB::table('appointments')
            ->where('therapist_id', $therapistId)
            ->where('service_type_id', $service->service_type_id)
            ->where('start_time', '>=', now())
            ->whereIn('status', ['confirmed'])
            ->count();

        if ($futureAppointments > 0) {
            return response()->json([
                'success' => false,
                'message' => "این سرویس {$futureAppointments} رزرو آینده دارد و قابل حذف نیست",
            ], 422);
        }

        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'سرویس با موفقیت حذف شد',
        ]);
    }

    /**
     * Bulk update display order
     */
    public function reorder(Request $request): JsonResponse
    {
        $therapistId = $request->user()->id;

        $validated = $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:therapist_services,id',
            'orders.*.display_order' => 'required|integer|min:0',
        ]);

        foreach ($validated['orders'] as $order) {
            TherapistService::byTherapist($therapistId)
                ->where('id', $order['id'])
                ->update(['display_order' => $order['display_order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'ترتیب سرویس‌ها با موفقیت بروزرسانی شد',
        ]);
    }
}
