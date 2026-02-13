<?php

use App\Modules\Appointment\Http\Controllers\AvailabilityController;
use App\Modules\Appointment\Http\Controllers\TherapistAppointmentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Appointment Module Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->middleware(['auth:api', 'role:therapist'])->group(function () {
    
    Route::prefix('therapist')->group(function () {
        
        // Availability
        Route::prefix('availability')->group(function () {
            Route::get('/', [AvailabilityController::class, 'getSlots']);
            Route::get('/summary', [AvailabilityController::class, 'getSummary']);
            Route::post('/check-slot', [AvailabilityController::class, 'checkSlot']);
            Route::get('/next-available', [AvailabilityController::class, 'getNextAvailable']);
        });

        // Appointments
        Route::prefix('appointments')->group(function () {
            Route::get('/', [TherapistAppointmentController::class, 'index']);
            Route::post('/', [TherapistAppointmentController::class, 'store']);
            Route::get('/stats', [TherapistAppointmentController::class, 'stats']);
            Route::get('/{id}', [TherapistAppointmentController::class, 'show']);
            Route::patch('/{id}', [TherapistAppointmentController::class, 'update']);
            Route::delete('/{id}', [TherapistAppointmentController::class, 'destroy']);
            Route::get('/{id}/cancellation-policy', [TherapistAppointmentController::class, 'cancellationPolicy']);
        });
    });
});

// Without v1 prefix (for backward compatibility)
Route::middleware(['auth:api', 'role:therapist'])->group(function () {
    
    Route::prefix('therapist')->group(function () {
        
        // Availability
        Route::prefix('availability')->group(function () {
            Route::get('/', [AvailabilityController::class, 'getSlots']);
            Route::get('/summary', [AvailabilityController::class, 'getSummary']);
            Route::post('/check-slot', [AvailabilityController::class, 'checkSlot']);
            Route::get('/next-available', [AvailabilityController::class, 'getNextAvailable']);
        });

        // Appointments
        Route::prefix('appointments')->group(function () {
            Route::get('/', [TherapistAppointmentController::class, 'index']);
            Route::post('/', [TherapistAppointmentController::class, 'store']);
            Route::get('/stats', [TherapistAppointmentController::class, 'stats']);
            Route::get('/{id}', [TherapistAppointmentController::class, 'show']);
            Route::patch('/{id}', [TherapistAppointmentController::class, 'update']);
            Route::delete('/{id}', [TherapistAppointmentController::class, 'destroy']);
            Route::get('/{id}/cancellation-policy', [TherapistAppointmentController::class, 'cancellationPolicy']);
        });
    });
});
