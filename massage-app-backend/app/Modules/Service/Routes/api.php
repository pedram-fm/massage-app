<?php

use App\Modules\Service\Http\Controllers\ServiceTypeController;
use App\Modules\Service\Http\Controllers\TherapistServiceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Service Module Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->middleware('auth:api')->group(function () {
    
    // Service Types (Public for therapists)
    Route::get('service-types', [ServiceTypeController::class, 'index']);
    Route::get('service-types/{id}', [ServiceTypeController::class, 'show']);

    // Admin only routes for service types
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        Route::post('service-types', [ServiceTypeController::class, 'store']);
        Route::put('service-types/{id}', [ServiceTypeController::class, 'update']);
        Route::delete('service-types/{id}', [ServiceTypeController::class, 'destroy']);
    });

    // Therapist Services (Therapist only)
    Route::middleware(['role:therapist'])->prefix('therapist')->group(function () {
        Route::get('services', [TherapistServiceController::class, 'index']);
        Route::get('services/available', [TherapistServiceController::class, 'available']);
        Route::post('services', [TherapistServiceController::class, 'store']);
        Route::put('services/{id}', [TherapistServiceController::class, 'update']);
        Route::delete('services/{id}', [TherapistServiceController::class, 'destroy']);
        Route::post('services/reorder', [TherapistServiceController::class, 'reorder']);
    });
});

// Without v1 prefix (for backward compatibility)
Route::middleware('auth:api')->group(function () {
    
    // Service Types (Public for therapists)
    Route::get('service-types', [ServiceTypeController::class, 'index']);
    Route::get('service-types/{id}', [ServiceTypeController::class, 'show']);

    // Admin only routes for service types
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        Route::post('service-types', [ServiceTypeController::class, 'store']);
        Route::put('service-types/{id}', [ServiceTypeController::class, 'update']);
        Route::delete('service-types/{id}', [ServiceTypeController::class, 'destroy']);
    });

    // Therapist Services (Therapist only)
    Route::middleware(['role:therapist'])->prefix('therapist')->group(function () {
        Route::get('services', [TherapistServiceController::class, 'index']);
        Route::get('services/available', [TherapistServiceController::class, 'available']);
        Route::post('services', [TherapistServiceController::class, 'store']);
        Route::put('services/{id}', [TherapistServiceController::class, 'update']);
        Route::delete('services/{id}', [TherapistServiceController::class, 'destroy']);
        Route::post('services/reorder', [TherapistServiceController::class, 'reorder']);
    });
});
