<?php

namespace App\Http\Controllers;

use App\Services\DoctorServices;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    protected $doctorServices;

    public function __construct(DoctorServices $doctorServices)
    {
        $this->doctorServices = $doctorServices;
    }

    public function index()
    {
        return $this->doctorServices->getAllDoctors();
    }

    public function show($id)
    {
        return $this->doctorServices->getDoctorById($id);
    }
    public function showDoctorsByHospital($hospitalId)
    {
        return $this->doctorServices->getDoctorsByHospitalId($hospitalId);
    }
}