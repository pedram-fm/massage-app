<?php

declare(strict_types=1);

namespace App\Modules\Appointment\Domain;

use App\Modules\Service\Domain\ServiceType;
use App\Modules\Users\Models\User;
use Carbon\Carbon;
use App\Modules\Shared\JalaliHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'appointments';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'therapist_id',
        'client_name',
        'client_phone',
        'client_email',
        'service_type_id',
        'start_time',
        'end_time',
        'duration',
        'price',
        'status',
        'notes',
        'cancellation_reason',
        'cancelled_at',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'duration' => 'integer',
        'price' => 'integer',
        'status' => AppointmentStatus::class,
        'cancelled_at' => 'datetime',
    ];

    /**
     * Get the therapist that owns this appointment
     */
    public function therapist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'therapist_id');
    }

    /**
     * Get the service type
     */
    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class);
    }

    /**
     * Scope to get appointments by therapist
     */
    public function scopeByTherapist($query, int $therapistId)
    {
        return $query->where('therapist_id', $therapistId);
    }

    /**
     * Scope to get appointments by status
     */
    public function scopeByStatus($query, AppointmentStatus $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to get confirmed appointments
     */
    public function scopeConfirmed($query)
    {
        return $query->where('status', AppointmentStatus::CONFIRMED);
    }

    /**
     * Scope to get appointments for specific date
     */
    public function scopeForDate($query, string $date)
    {
        return $query->whereDate('start_time', $date);
    }

    /**
     * Scope to get appointments in date range
     */
    public function scopeInDateRange($query, Carbon $startDate, Carbon $endDate)
    {
        return $query->whereBetween('start_time', [$startDate, $endDate]);
    }

    /**
     * Scope to get upcoming appointments
     */
    public function scopeUpcoming($query)
    {
        return $query->where('start_time', '>', now())
            ->where('status', AppointmentStatus::CONFIRMED)
            ->orderBy('start_time');
    }

    /**
     * Scope to get past appointments
     */
    public function scopePast($query)
    {
        return $query->where('start_time', '<', now())
            ->orderBy('start_time', 'desc');
    }

    /**
     * Scope to exclude cancelled appointments
     */
    public function scopeNotCancelled($query)
    {
        return $query->where('status', '!=', AppointmentStatus::CANCELLED);
    }

    /**
     * Check if appointment can be cancelled
     */
    public function canBeCancelled(): bool
    {
        return $this->status->isCancellable() && $this->start_time->isFuture();
    }

    /**
     * Check if appointment can be marked as completed
     */
    public function canBeCompleted(): bool
    {
        return $this->status->canComplete() && $this->start_time->isPast();
    }

    /**
     * Cancel appointment
     */
    public function cancel(string $reason = null): void
    {
        $this->update([
            'status' => AppointmentStatus::CANCELLED,
            'cancellation_reason' => $reason,
            'cancelled_at' => now(),
        ]);
    }

    /**
     * Mark as completed
     */
    public function markAsCompleted(): void
    {
        $this->update(['status' => AppointmentStatus::COMPLETED]);
    }

    /**
     * Mark as no-show
     */
    public function markAsNoShow(): void
    {
        $this->update(['status' => AppointmentStatus::NO_SHOW]);
    }

    /**
     * Get formatted price
     */
    public function getFormattedPrice(): string
    {
        return number_format($this->price) . ' تومان';
    }

    /**
     * Get Jalali date
     */
    public function getJalaliDate(): string
    {
        return JalaliHelper::gregorianToJalali($this->start_time);
    }

    /**
     * Get Jalali formatted datetime
     */
    public function getJalaliDateTime(): string
    {
        return JalaliHelper::gregorianToJalali($this->start_time, 'Y/m/d') . ' ' . $this->start_time->format('H:i');
    }

    /**
     * Check if appointment overlaps with another
     */
    public function overlapsWith(Carbon $start, Carbon $end): bool
    {
        return $this->start_time < $end && $this->end_time > $start;
    }
}
