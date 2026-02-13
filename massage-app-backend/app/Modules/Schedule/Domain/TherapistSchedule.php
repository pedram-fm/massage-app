<?php

declare(strict_types=1);

namespace App\Modules\Schedule\Domain;

use App\Modules\Users\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TherapistSchedule extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'therapist_schedules';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'therapist_id',
        'day_of_week',
        'start_time',
        'end_time',
        'break_duration',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'day_of_week' => DayOfWeek::class,
        'break_duration' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get the therapist that owns this schedule
     */
    public function therapist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'therapist_id');
    }

    /**
     * Scope to get active schedules
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get schedule by therapist
     */
    public function scopeByTherapist($query, int $therapistId)
    {
        return $query->where('therapist_id', $therapistId);
    }

    /**
     * Scope to get schedule for specific day
     */
    public function scopeForDay($query, int $dayOfWeek)
    {
        return $query->where('day_of_week', $dayOfWeek);
    }

    /**
     * Get DayOfWeek enum
     */
    public function getDayOfWeekEnum(): DayOfWeek
    {
        return DayOfWeek::from($this->day_of_week);
    }

    /**
     * Get Persian day name
     */
    public function getPersianDayName(): string
    {
        return $this->getDayOfWeekEnum()->persianName();
    }

    /**
     * Calculate total working hours
     */
    public function getTotalWorkingMinutes(): int
    {
        $start = \Carbon\Carbon::parse($this->start_time);
        $end = \Carbon\Carbon::parse($this->end_time);
        
        return $end->diffInMinutes($start);
    }
}
