<?php

use App\Modules\Shared\Controllers\LogController;
use App\Modules\Users\Models\Role;
use App\Modules\Users\Models\Permission;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Shared Routes
|--------------------------------------------------------------------------
*/

Route::get('v1/logs/tail', [LogController::class, 'tail']);

// Therapist routes placeholder (both masseur and masseuse)
Route::middleware(['auth:api', 'role:' . Role::MASSEUR . ',' . Role::MASSEUSE])->prefix('v1/therapist')->group(function () {
    Route::get('/dashboard', function () {
        return response()->json([
            'message' => 'Welcome to Therapist Dashboard',
            'user' => auth()->user()->loadRoleWithPermissions(),
        ]);
    });
});

// Client routes placeholder
Route::middleware(['auth:api', 'role:' . Role::CLIENT])->prefix('v1/client')->group(function () {
    Route::get('/dashboard', function () {
        return response()->json([
            'message' => 'Welcome to Client Dashboard',
            'user' => auth()->user()->loadRoleWithPermissions(),
        ]);
    });
});
