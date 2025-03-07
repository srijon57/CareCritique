<?php

use App\Http\Controllers\HospitalController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AppointmentController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh-token', [AuthController::class, 'refreshToken']);

Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{id}', [DoctorController::class, 'show']);
Route::get('/hospitals', [HospitalController::class, 'index']);
Route::get('/hospitals/{id}', [HospitalController::class, 'show']);
Route::get('/hospitals/{hospitalId}/doctors', [DoctorController::class, 'showDoctorsByHospital']);
Route::get('/doctors/{doctorId}/reviews', [ReviewController::class, 'index']);

Route::middleware(['auth.jwt'])->group(function () {
    Route::post('/verify-admin/{userId}', [AuthController::class, 'verifyAdmin']);
    Route::get('/profile', [AuthController::class, 'getProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile/update', [AuthController::class, 'updateProfile']);
    Route::post('/doctors/{doctorId}/reviews', [ReviewController::class, 'store']);
    Route::put('/doctors/{doctorId}/reviews/{reviewId}', [ReviewController::class, 'update']);
    Route::delete('/doctors/{doctorId}/reviews/{reviewId}', [ReviewController::class, 'destroy']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/patient/appointments', [AppointmentController::class, 'getPatientAppointments']);
    Route::get('/doctor/appointments', [AppointmentController::class, 'getDoctorAppointments']);
    Route::post('/doctors/{doctorId}/verify', [AuthController::class, 'toggleDoctorVerification']);
});
