<?php

use App\Modules\Auth\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Auth Module Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1/auth')->group(function () {
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
