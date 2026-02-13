<?php

declare(strict_types=1);

namespace App\Modules\Therapist\Actions;

use App\Modules\Therapist\Domain\TherapistProfile;
use App\Modules\Users\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class UpdateTherapistProfileAction
{
    /**
     * Update therapist profile
     *
     * @param User $user
     * @param array $data
     * @return TherapistProfile
     * @throws \Exception
     */
    public function execute(User $user, array $data): TherapistProfile
    {
        return DB::transaction(function () use ($user, $data) {
            $profile = TherapistProfile::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'rating' => 0,
                    'total_appointments' => 0,
                    'is_accepting_clients' => true,
                ]
            );

            // Filter only allowed fields for update
            $updateData = array_filter([
                'bio' => $data['bio'] ?? null,
                'bio_fa' => $data['bio_fa'] ?? null,
                'specialties' => $data['specialties'] ?? null,
                'years_of_experience' => $data['years_of_experience'] ?? null,
                'certifications' => $data['certifications'] ?? null,
                'is_accepting_clients' => $data['is_accepting_clients'] ?? null,
            ], fn($value) => $value !== null);

            // Validate data types
            if (isset($updateData['specialties']) && !is_array($updateData['specialties'])) {
                throw new \InvalidArgumentException('Specialties must be an array');
            }

            if (isset($updateData['certifications']) && !is_array($updateData['certifications'])) {
                throw new \InvalidArgumentException('Certifications must be an array');
            }

            if (isset($updateData['years_of_experience'])) {
                $updateData['years_of_experience'] = (int) $updateData['years_of_experience'];
                
                if ($updateData['years_of_experience'] < 0 || $updateData['years_of_experience'] > 100) {
                    throw new \InvalidArgumentException('Years of experience must be between 0 and 100');
                }
            }

            if (isset($updateData['is_accepting_clients'])) {
                $updateData['is_accepting_clients'] = (bool) $updateData['is_accepting_clients'];
            }

            $profile->update($updateData);

            return $profile->fresh();
        });
    }

    /**
     * Upload avatar for therapist profile
     *
     * @param User $user
     * @param UploadedFile $file
     * @return TherapistProfile
     * @throws \Exception
     */
    public function uploadAvatar(User $user, UploadedFile $file): TherapistProfile
    {
        return DB::transaction(function () use ($user, $file) {
            $profile = TherapistProfile::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'rating' => 0,
                    'total_appointments' => 0,
                    'is_accepting_clients' => true,
                ]
            );

            // Delete old avatar if exists
            if ($profile->avatar) {
                Storage::disk('public')->delete($profile->avatar);
            }

            // Store new avatar
            $path = $file->store('avatars', 'public');

            $profile->update(['avatar' => $path]);

            return $profile->fresh();
        });
    }

    /**
     * Delete avatar for therapist profile
     *
     * @param User $user
     * @return TherapistProfile
     * @throws \Exception
     */
    public function deleteAvatar(User $user): TherapistProfile
    {
        return DB::transaction(function () use ($user) {
            $profile = TherapistProfile::where('user_id', $user->id)->firstOrFail();

            // Delete avatar file if exists
            if ($profile->avatar) {
                Storage::disk('public')->delete($profile->avatar);
            }

            $profile->update(['avatar' => null]);

            return $profile->fresh();
        });
    }
}
