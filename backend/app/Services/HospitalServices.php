<?php

namespace App\Services;

use App\Models\Hospital;
use Illuminate\Http\JsonResponse;

class HospitalServices
{
    public function getAllHospitals(): JsonResponse
    {
        $hospitals = Hospital::all();
        return response()->json($hospitals);
    }

    public function getHospitalById($id): JsonResponse
    {
        $hospital = Hospital::find($id);

        if (!$hospital) {
            return response()->json(['message' => 'Hospital not found'], 404);
        }

        return response()->json($hospital);
    }
}