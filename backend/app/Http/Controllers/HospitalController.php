<?php

namespace App\Http\Controllers;

use App\Services\HospitalServices;
use Illuminate\Http\Request;

class HospitalController extends Controller
{
    protected $hospitalServices;

    public function __construct(HospitalServices $hospitalServices)
    {
        $this->hospitalServices = $hospitalServices;
    }

    /**
     * Get all hospitals with optional search and area filters.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $area = $request->input('area');

        return $this->hospitalServices->getFilteredHospitals($search, $area);
    }

    /**
     * Get a specific hospital by ID.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        return $this->hospitalServices->getHospitalById($id);
    }

    /**
     * Get suggestions for hospitals and areas based on the search query.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function suggestions(Request $request)
    {
        $query = $request->input('query');
        return $this->hospitalServices->getSuggestions($query);
    }
}