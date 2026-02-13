<?php

use App\Modules\Admin\Controllers\UserManagementController;
use App\Modules\Users\Models\Role;
use App\Modules\Users\Models\Permission;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Module Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:api', 'role:' . Role::ADMIN])->prefix('v1/admin')->group(function () {
    Route::get('/dashboard', function () {
        return response()->json([
            'message' => 'Welcome to Admin Dashboard',
            'user' => auth()->user()->loadRoleWithPermissions(),
        ]);
    });

    // User Management Routes
    Route::get('/users', [UserManagementController::class, 'index']);
    Route::post('/users', [UserManagementController::class, 'store']);
    Route::get('/users/stats', [UserManagementController::class, 'getStats']);
    Route::get('/users/{id}', [UserManagementController::class, 'show']);
    Route::put('/users/{id}', [UserManagementController::class, 'update']);
    Route::delete('/users/{id}', [UserManagementController::class, 'destroy']);
    Route::post('/users/{id}/change-role', [UserManagementController::class, 'changeRole']);
    Route::get('/roles', [UserManagementController::class, 'getRoles']);
});
