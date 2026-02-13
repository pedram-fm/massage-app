<?php

declare(strict_types=1);

namespace App\Modules\Service\Domain;

use App\Modules\Service\Domain\TherapistService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceType extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'service_types';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'name_fa',
        'description',
        'description_fa',
        'default_duration',
        'default_price',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'default_duration' => 'integer',
        'default_price' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get therapist services using this service type
     */
    public function therapistServices(): HasMany
    {
        return $this->hasMany(TherapistService::class);
    }

    /**
     * Scope to get only active service types
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get display name based on locale
     */
    public function getDisplayName(): string
    {
        return app()->getLocale() === 'fa' ? $this->name_fa : $this->name;
    }

    /**
     * Get display description based on locale
     */
    public function getDisplayDescription(): ?string
    {
        return app()->getLocale() === 'fa' ? $this->description_fa : $this->description;
    }
}
