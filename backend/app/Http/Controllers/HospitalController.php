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

    public function index()
    {
        return $this->hospitalServices->getAllHospitals();
    }

    public function show($id)
    {
        return $this->hospitalServices->getHospitalById($id);
    }
}