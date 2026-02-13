<?php

namespace App\Modules\Service\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TherapistServiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'therapist_id' => $this->therapist_id,
            'service_type_id' => $this->service_type_id,
            'service_type' => new ServiceTypeResource($this->whenLoaded('serviceType')),
            'custom_duration' => $this->custom_duration,
            'custom_price' => $this->custom_price,
            'is_available' => $this->is_available,
            'display_order' => $this->display_order,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
