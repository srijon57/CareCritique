<?php

namespace App\Services;

use App\Models\Doctor;
use Illuminate\Http\JsonResponse;

class DoctorServices
{
    public function getAllDoctors(): JsonResponse
    {
        $doctors = Doctor::all();
        return response()->json($doctors);
    }

    public function getDoctorById($id): JsonResponse
    {
        $doctor = Doctor::find($id);

        if (!$doctor) {
            return response()->json(['message' => 'Doctor not found'], 404);
        }

        return response()->json($doctor);
    }
}