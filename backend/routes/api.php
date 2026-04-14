<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppointmentController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/appointments', [AppointmentController::class, 'index']);
Route::post('/appointments', [AppointmentController::class, 'store']);
Route::put('/appointments/{id}', [AppointmentController::class, 'updateStatus']);