<?php

use App\Modules\Schedule\Http\Controllers\TherapistScheduleController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Schedule Module Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->middleware(['auth:api', 'role:therapist'])->group(function () {
    
    Route::prefix('therapist/schedule')->group(function () {
        // Weekly Schedule
        Route::get('/', [TherapistScheduleController::class, 'index']);
        Route::put('/', [TherapistScheduleController::class, 'update']);
        Route::post('/check-conflicts', [TherapistScheduleController::class, 'checkConflicts']);

        // Schedule Overrides
        Route::get('/overrides', [TherapistScheduleController::class, 'getOverrides']);
        Route::post('/overrides', [TherapistScheduleController::class, 'storeOverride']);
        Route::post('/overrides/check-conflicts', [TherapistScheduleController::class, 'checkOverrideConflicts']);
        Route::delete('/overrides/{id}', [TherapistScheduleController::class, 'destroyOverride']);
    });
});

// Without v1 prefix (for backward compatibility)
Route::middleware(['auth:api', 'role:therapist'])->group(function () {
    
    Route::prefix('therapist/schedule')->group(function () {
        // Weekly Schedule
        Route::get('/', [TherapistScheduleController::class, 'index']);
        Route::put('/', [TherapistScheduleController::class, 'update']);
        Route::post('/check-conflicts', [TherapistScheduleController::class, 'checkConflicts']);

        // Schedule Overrides
        Route::get('/overrides', [TherapistScheduleController::class, 'getOverrides']);
        Route::post('/overrides', [TherapistScheduleController::class, 'storeOverride']);
        Route::post('/overrides/check-conflicts', [TherapistScheduleController::class, 'checkOverrideConflicts']);
        Route::delete('/overrides/{id}', [TherapistScheduleController::class, 'destroyOverride']);
    });
});
