<?php

namespace App\Modules\Appointment\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Modules\Service\Http\Resources\ServiceTypeResource;
use App\Modules\Shared\JalaliHelper;

class AppointmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $jalaliDate = null;
        $gregorianDate = null;

        if ($this->start_time) {
            $jalaliDate = JalaliHelper::gregorianToJalali($this->start_time, 'Y/m/d');
            $gregorianDate = $this->start_time->format('Y-m-d');
        }

        return [
            'id' => $this->id,
            'therapist_id' => $this->therapist_id,
            'client_name' => $this->client_name,
            'client_phone' => $this->client_phone,
            'client_email' => $this->client_email,
            'service_type' => new ServiceTypeResource($this->whenLoaded('serviceType')),
            'appointment_date_jalali' => $jalaliDate,
            'appointment_date_gregorian' => $gregorianDate,
            'start_time' => $this->start_time?->format('H:i'),
            'end_time' => $this->end_time?->format('H:i'),
            'duration' => $this->duration,
            'price' => $this->price,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'notes' => $this->notes,
            'cancellation_reason' => $this->cancellation_reason,
            'cancelled_at' => $this->cancelled_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
