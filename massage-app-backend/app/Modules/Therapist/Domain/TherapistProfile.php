<?php

declare(strict_types=1);

namespace App\Modules\Therapist\Domain;

use App\Modules\Service\Domain\TherapistService;
use App\Modules\Users\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TherapistProfile extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'therapist_profiles';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'bio',
        'bio_fa',
        'avatar',
        'specialties',
        'years_of_experience',
        'certifications',
        'rating',
        'total_appointments',
        'is_accepting_clients',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'specialties' => 'array',
        'certifications' => 'array',
        'rating' => 'decimal:2',
        'years_of_experience' => 'integer',
        'total_appointments' => 'integer',
        'is_accepting_clients' => 'boolean',
    ];

    /**
     * Get the user that owns the therapist profile
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get therapist services
     */
    public function services(): HasMany
    {
        return $this->hasMany(TherapistService::class, 'therapist_id', 'user_id');
    }

    /**
     * Scope to get only therapists accepting clients
     */
    public function scopeAcceptingClients($query)
    {
        return $query->where('is_accepting_clients', true);
    }

    /**
     * Scope to get therapists with high ratings
     */
    public function scopeHighRated($query, float $minRating = 4.0)
    {
        return $query->where('rating', '>=', $minRating);
    }

    /**
     * Get display bio based on locale
     */
    public function getDisplayBio(): ?string
    {
        return app()->getLocale() === 'fa' ? $this->bio_fa : $this->bio;
    }

    /**
     * Get avatar URL
     */
    public function getAvatarUrl(): ?string
    {
        return $this->avatar ? asset('storage/' . $this->avatar) : null;
    }

    /**
     * Increment total appointments
     */
    public function incrementAppointments(): void
    {
        $this->increment('total_appointments');
    }

    /**
     * Update rating
     */
    public function updateRating(float $newRating): void
    {
        $this->update(['rating' => $newRating]);
    }
}
