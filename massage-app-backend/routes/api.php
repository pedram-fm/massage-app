<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\UserManagementController;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('otp/request', [AuthController::class, 'requestOtp']);
    Route::post('otp/verify', [AuthController::class, 'verifyOtp']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('register/verify', [AuthController::class, 'verifyEmail']);
    Route::post('register/resend', [AuthController::class, 'resendEmailVerification']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('password/forgot', [AuthController::class, 'requestPasswordReset']);
    Route::post('password/verify', [AuthController::class, 'verifyPasswordReset']);
    Route::post('password/reset', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:api')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

Route::get('logs/tail', [LogController::class, 'tail']);

// Example: Protected routes by role
Route::middleware(['auth:api'])->group(function () {
    
    // Admin only routes
    Route::middleware(['role:' . Role::ADMIN])->prefix('admin')->group(function () {
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
    
    // Therapist routes (both masseur and masseuse)
    Route::middleware(['role:' . Role::MASSEUR . ',' . Role::MASSEUSE])->prefix('therapist')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json([
                'message' => 'Welcome to Therapist Dashboard',
                'user' => auth()->user()->loadRoleWithPermissions(),
            ]);
        });
    });
    
    // Client routes
    Route::middleware(['role:' . Role::CLIENT])->prefix('client')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json([
                'message' => 'Welcome to Client Dashboard',
                'user' => auth()->user()->loadRoleWithPermissions(),
            ]);
        });
    });
    
    // Permission-based route example
    Route::middleware(['permission:' . Permission::MANAGE_USERS])->group(function () {
        Route::get('/users', function () {
            return response()->json([
                'message' => 'User management - requires manage_users permission',
                'users' => \App\Models\User::with('role')->paginate(10),
            ]);
        });
    });
});
