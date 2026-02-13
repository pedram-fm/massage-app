<?php

use App\Modules\Therapist\Http\Controllers\TherapistProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Therapist Module Routes
|--------------------------------------------------------------------------
*/

// With v1 prefix
Route::prefix('v1')->middleware(['auth:api', 'role:therapist'])->group(function () {
    Route::prefix('therapist')->group(function () {
        Route::get('profile', [TherapistProfileController::class, 'show']);
        Route::put('profile', [TherapistProfileController::class, 'update']);
        Route::post('profile/avatar', [TherapistProfileController::class, 'uploadAvatar']);
        Route::delete('profile/avatar', [TherapistProfileController::class, 'deleteAvatar']);
    });
});

// Without v1 prefix (for backward compatibility)
Route::middleware(['auth:api', 'role:therapist'])->group(function () {
    Route::prefix('therapist')->group(function () {
        Route::get('profile', [TherapistProfileController::class, 'show']);
        Route::put('profile', [TherapistProfileController::class, 'update']);
        Route::post('profile/avatar', [TherapistProfileController::class, 'uploadAvatar']);
        Route::delete('profile/avatar', [TherapistProfileController::class, 'deleteAvatar']);
    });
});

// Public profile endpoint
Route::middleware('auth:api')->group(function () {
    Route::get('v1/therapists/{therapistId}/profile', [TherapistProfileController::class, 'showPublic']);
    Route::get('therapists/{therapistId}/profile', [TherapistProfileController::class, 'showPublic']);
});
