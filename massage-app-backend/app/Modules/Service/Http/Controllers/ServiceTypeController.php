<?php

declare(strict_types=1);

namespace App\Modules\Service\Http\Controllers;

use App\Modules\Service\Domain\ServiceType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceTypeController
{
    /**
     * Get all service types
     */
    public function index(Request $request): JsonResponse
    {
        $query = ServiceType::query();

        // Filter by active status
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        $serviceTypes = $query->get();

        return response()->json([
            'success' => true,
            'data' => $serviceTypes,
        ]);
    }

    /**
     * Get single service type
     */
    public function show(int $id): JsonResponse
    {
        $serviceType = ServiceType::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $serviceType,
        ]);
    }

    /**
     * Create new service type (Admin only)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'name_fa' => 'required|string|max:100',
            'description' => 'nullable|string',
            'description_fa' => 'nullable|string',
            'default_duration' => 'nullable|integer|min:15',
            'is_active' => 'boolean',
        ]);

        $serviceType = ServiceType::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'سرویس با موفقیت ایجاد شد',
            'data' => $serviceType,
        ], 201);
    }

    /**
     * Update service type (Admin only)
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $serviceType = ServiceType::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'name_fa' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'description_fa' => 'nullable|string',
            'default_duration' => 'nullable|integer|min:15',
            'is_active' => 'boolean',
        ]);

        $serviceType->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'سرویس با موفقیت بروزرسانی شد',
            'data' => $serviceType->fresh(),
        ]);
    }

    /**
     * Delete service type (Admin only)
     */
    public function destroy(int $id): JsonResponse
    {
        $serviceType = ServiceType::findOrFail($id);
        
        // Check if any therapist is using this service
        $usageCount = $serviceType->therapistServices()->count();
        
        if ($usageCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "این سرویس توسط {$usageCount} تراپیست استفاده می‌شود و قابل حذف نیست",
            ], 422);
        }

        $serviceType->delete();

        return response()->json([
            'success' => true,
            'message' => 'سرویس با موفقیت حذف شد',
        ]);
    }
}
