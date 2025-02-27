<?php

use App\Http\Controllers\HospitalController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DoctorController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh-token', [AuthController::class, 'refreshToken']);

Route::middleware(['auth.jwt'])->group(function () {
    Route::get('/profile', [AuthController::class, 'getProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile/update', [AuthController::class, 'updateProfile']);
});

Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{id}', [DoctorController::class, 'show']);
Route::get('/hospitals', [HospitalController::class, 'index']);
Route::get('/hospitals/{id}', [HospitalController::class, 'show']);
Route::get('/hospitals/suggestions', [HospitalController::class, 'suggestions']); // Ensure this line is added
Route::get('/api/doctors/suggestions', [DoctorController::class, 'getSearchSuggestions']);