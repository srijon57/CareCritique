<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh-token', [AuthController::class, 'refreshToken']);

Route::middleware(['auth.jwt'])->group(function () {
    Route::get('/profile', [AuthController::class, 'getProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile/update', [AuthController::class, 'updateProfile']);
});
