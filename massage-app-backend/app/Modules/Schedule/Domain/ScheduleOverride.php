<?php

declare(strict_types=1);

namespace App\Modules\Schedule\Domain;

use App\Modules\Users\Models\User;
use Carbon\Carbon;
use App\Modules\Shared\JalaliHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScheduleOverride extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'schedule_overrides';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'therapist_id',
        'date',
        'date_gregorian',
        'type',
        'start_time',
        'end_time',
        'reason',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'date_gregorian' => 'date',
        'type' => OverrideType::class,
    ];

    /**
     * Get the therapist that owns this override
     */
    public function therapist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'therapist_id');
    }

    /**
     * Scope to get overrides by therapist
     */
    public function scopeByTherapist($query, int $therapistId)
    {
        return $query->where('therapist_id', $therapistId);
    }

    /**
     * Scope to get overrides for specific date
     */
    public function scopeForDate($query, string $gregorianDate)
    {
        return $query->where('date_gregorian', $gregorianDate);
    }

    /**
     * Scope to get overrides in date range
     */
    public function scopeInDateRange($query, string $startDate, string $endDate)
    {
        return $query->whereBetween('date_gregorian', [$startDate, $endDate]);
    }

    /**
     * Scope to get only unavailable overrides
     */
    public function scopeUnavailable($query)
    {
        return $query->where('type', OverrideType::UNAVAILABLE);
    }

    /**
     * Scope to get only custom hours overrides
     */
    public function scopeCustomHours($query)
    {
        return $query->where('type', OverrideType::CUSTOM_HOURS);
    }

    /**
     * Check if this is an unavailable override
     */
    public function isUnavailable(): bool
    {
        return $this->type === OverrideType::UNAVAILABLE;
    }

    /**
     * Check if this is a custom hours override
     */
    public function isCustomHours(): bool
    {
        return $this->type === OverrideType::CUSTOM_HOURS;
    }

    /**
     * Get Jalali date from Gregorian
     */
    public function getJalaliDate(): string
    {
        if ($this->date) {
            return $this->date;
        }

        return JalaliHelper::gregorianToJalali($this->date_gregorian);
    }

    /**
     * Set dates from Jalali
     */
    public function setDatesFromJalali(string $jalaliDate): void
    {
        $this->date = $jalaliDate;
        $this->date_gregorian = JalaliHelper::jalaliToGregorian($jalaliDate);
    }
}
