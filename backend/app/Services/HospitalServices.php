<?php

namespace App\Services;

use App\Models\Hospital;
use Illuminate\Http\JsonResponse;

class HospitalServices
{
    /**
     * Get all hospitals with optional search and area filters.
     *
     * @param string|null $search
     * @param string|null $area
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFilteredHospitals($search = null, $area = null): JsonResponse
    {
        $query = Hospital::query();

        // Filter by search query (Name)
        if ($search) {
            $query->where('Name', 'like', '%' . $search . '%');
        }

        // Filter by area query (HospitalArea)
        if ($area) {
            $query->where('HospitalArea', 'like', '%' . $area . '%');
        }

        $hospitals = $query->get();
        return response()->json($hospitals);
    }

    /**
     * Get a specific hospital by ID.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHospitalById($id): JsonResponse
    {
        $hospital = Hospital::find($id);

        if (!$hospital) {
            return response()->json(['message' => 'Hospital not found'], 404);
        }

        return response()->json($hospital);
    }

    /**
     * Get suggestions for hospitals and areas based on the search query.
     *
     * @param string $query
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSuggestions($query): JsonResponse
    {
        $hospitals = Hospital::where('Name', 'like', '%' . $query . '%')
            ->orWhere('HospitalArea', 'like', '%' . $query . '%')
            ->get(['Name', 'HospitalArea']);

        return response()->json($hospitals);
    }
}