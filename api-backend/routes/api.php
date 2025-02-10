<?php

use App\Http\Controllers\TestController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Existing routes
Route::get('/tests', [TestController::class, 'getTestHuman']);
Route::get('/test/{id}', [TestController::class, 'getTestHumanWithId']);
Route::get('/test', [TestController::class, 'getTestHuman']);

// New route to fetch all users
Route::get('/users', [TestController::class, 'getAllUsers']);
