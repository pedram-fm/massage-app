<?php

namespace App\Modules\Schedule\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScheduleOverrideResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'therapist_id' => $this->therapist_id,
            'override_date_jalali' => $this->date,
            'override_date_gregorian' => $this->date_gregorian?->format('Y-m-d'),
            'override_type' => $this->type->value,
            'override_type_label' => $this->type->label(),
            'start_time' => is_string($this->start_time) ? substr($this->start_time, 0, 5) : $this->start_time?->format('H:i'),
            'end_time' => is_string($this->end_time) ? substr($this->end_time, 0, 5) : $this->end_time?->format('H:i'),
            'reason_fa' => $this->reason,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
