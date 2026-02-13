<?php

declare(strict_types=1);

namespace App\Modules\Therapist\Http\Controllers;

use App\Modules\Therapist\Actions\UpdateTherapistProfileAction;
use App\Modules\Therapist\Domain\TherapistProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TherapistProfileController
{
    public function __construct(
        private UpdateTherapistProfileAction $updateProfileAction
    ) {}

    /**
     * Get therapist profile
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $profile = TherapistProfile::with(['services.serviceType'])
            ->where('user_id', $user->id)
            ->first();

        if (!$profile) {
            // Return empty profile structure
            return response()->json([
                'success' => true,
                'data' => [
                    'user_id' => $user->id,
                    'bio' => null,
                    'bio_fa' => null,
                    'avatar' => null,
                    'specialties' => [],
                    'years_of_experience' => 0,
                    'certifications' => [],
                    'rating' => 0,
                    'total_appointments' => 0,
                    'is_accepting_clients' => true,
                ],
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'user_id' => $profile->user_id,
                'bio' => $profile->bio,
                'bio_fa' => $profile->bio_fa,
                'avatar' => $profile->getAvatarUrl(),
                'specialties' => $profile->specialties ?? [],
                'years_of_experience' => $profile->years_of_experience,
                'certifications' => $profile->certifications ?? [],
                'rating' => $profile->rating,
                'total_appointments' => $profile->total_appointments,
                'is_accepting_clients' => $profile->is_accepting_clients,
                'created_at' => $profile->created_at,
                'updated_at' => $profile->updated_at,
            ],
        ]);
    }

    /**
     * Update therapist profile
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bio' => 'nullable|string|max:1000',
            'bio_fa' => 'nullable|string|max:1000',
            'specialties' => 'nullable|array|max:10',
            'specialties.*' => 'string|max:100',
            'years_of_experience' => 'nullable|integer|min:0|max:100',
            'certifications' => 'nullable|array|max:20',
            'certifications.*' => 'string|max:200',
            'is_accepting_clients' => 'nullable|boolean',
        ]);

        try {
            $profile = $this->updateProfileAction->execute($request->user(), $validated);

            return response()->json([
                'success' => true,
                'message' => 'پروفایل با موفقیت بروزرسانی شد',
                'data' => [
                    'user_id' => $profile->user_id,
                    'bio' => $profile->bio,
                    'bio_fa' => $profile->bio_fa,
                    'avatar' => $profile->getAvatarUrl(),
                    'specialties' => $profile->specialties ?? [],
                    'years_of_experience' => $profile->years_of_experience,
                    'certifications' => $profile->certifications ?? [],
                    'rating' => $profile->rating,
                    'total_appointments' => $profile->total_appointments,
                    'is_accepting_clients' => $profile->is_accepting_clients,
                    'updated_at' => $profile->updated_at,
                ],
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطا در بروزرسانی پروفایل',
            ], 500);
        }
    }

    /**
     * Upload avatar
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'avatar' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120', // 5MB max
        ]);

        try {
            $profile = $this->updateProfileAction->uploadAvatar(
                $request->user(),
                $validated['avatar']
            );

            return response()->json([
                'success' => true,
                'message' => 'تصویر پروفایل با موفقیت آپلود شد',
                'data' => [
                    'avatar' => $profile->getAvatarUrl(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطا در آپلود تصویر',
            ], 500);
        }
    }

    /**
     * Delete avatar
     */
    public function deleteAvatar(Request $request): JsonResponse
    {
        try {
            $profile = $this->updateProfileAction->deleteAvatar($request->user());

            return response()->json([
                'success' => true,
                'message' => 'تصویر پروفایل با موفقیت حذف شد',
                'data' => [
                    'avatar' => null,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطا در حذف تصویر',
            ], 500);
        }
    }

    /**
     * Get public profile by therapist ID (for clients)
     */
    public function showPublic(int $therapistId): JsonResponse
    {
        $profile = TherapistProfile::with(['services' => function ($query) {
            $query->available()->ordered()->with('serviceType');
        }])
            ->where('user_id', $therapistId)
            ->where('is_accepting_clients', true)
            ->first();

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'پروفایل یافت نشد یا غیرفعال است',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'user_id' => $profile->user_id,
                'bio' => $profile->getDisplayBio(),
                'avatar' => $profile->getAvatarUrl(),
                'specialties' => $profile->specialties ?? [],
                'years_of_experience' => $profile->years_of_experience,
                'rating' => $profile->rating,
                'total_appointments' => $profile->total_appointments,
                'services' => $profile->services,
            ],
        ]);
    }
}
