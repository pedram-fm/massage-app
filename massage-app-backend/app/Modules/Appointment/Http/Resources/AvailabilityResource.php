<?php

namespace App\Modules\Appointment\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AvailabilityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'date' => $this->resource['date'],
            'therapist_service_id' => $this->resource['therapist_service_id'],
            'slots' => $this->resource['slots']->map(function ($slot) {
                return [
                    'start_time' => $slot['start_time'],
                    'end_time' => $slot['end_time'],
                    'is_available' => $slot['is_available'],
                    'reason' => $slot['reason'] ?? null,
                ];
            }),
            'total_slots' => $this->resource['slots']->count(),
            'available_slots' => $this->resource['slots']->where('is_available', true)->count(),
        ];
    }
}
