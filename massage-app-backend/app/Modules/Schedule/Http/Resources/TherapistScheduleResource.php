<?php

namespace App\Modules\Schedule\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TherapistScheduleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'therapist_id' => $this->therapist_id,
            'day_of_week' => $this->day_of_week->value,
            'day_name' => $this->day_of_week->persianName(),
            'start_time' => is_string($this->start_time) ? substr($this->start_time, 0, 5) : $this->start_time?->format('H:i'),
            'end_time' => is_string($this->end_time) ? substr($this->end_time, 0, 5) : $this->end_time?->format('H:i'),
            'break_duration' => $this->break_duration,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
