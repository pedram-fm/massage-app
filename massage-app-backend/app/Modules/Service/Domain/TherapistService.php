<?php

declare(strict_types=1);

namespace App\Modules\Service\Domain;

use App\Modules\Users\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TherapistService extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'therapist_services';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'therapist_id',
        'service_type_id',
        'duration',
        'price',
        'is_available',
        'display_order',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'duration' => 'integer',
        'price' => 'integer',
        'is_available' => 'boolean',
        'display_order' => 'integer',
    ];

    /**
     * Get the therapist that owns this service
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
     * Scope to get only available services
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    /**
     * Scope to order by display order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }

    /**
     * Scope to get services by therapist
     */
    public function scopeByTherapist($query, int $therapistId)
    {
        return $query->where('therapist_id', $therapistId);
    }

    /**
     * Get formatted price
     */
    public function getFormattedPrice(): string
    {
        return number_format($this->price) . ' تومان';
    }

    /**
     * Get formatted duration
     */
    public function getFormattedDuration(): string
    {
        return $this->duration . ' دقیقه';
    }
}
