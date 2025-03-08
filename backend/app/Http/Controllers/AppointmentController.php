<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AppointmentService;

class AppointmentController extends Controller
{
    protected $appointmentService;

    public function __construct(AppointmentService $appointmentService)
    {
        $this->middleware('auth.jwt');
        $this->appointmentService = $appointmentService;
    }

    public function store(Request $request)
    {
        $result = $this->appointmentService->storeAppointment($request->all(), $request->attributes->get('user'));

        if (isset($result['error'])) {
            return response()->json($result['error'], $result['status']);
        }

        return response()->json($result['message'], $result['status']);
    }

    public function getPatientAppointments(Request $request)
    {
        $result = $this->appointmentService->getPatientAppointments($request->attributes->get('user'));

        if (isset($result['error'])) {
            return response()->json($result['error'], $result['status']);
        }

        return response()->json($result);
    }

    public function getDoctorAppointments(Request $request)
    {
        $result = $this->appointmentService->getDoctorAppointments($request->attributes->get('user'));

        if (isset($result['error'])) {
            return response()->json($result['error'], $result['status']);
        }

        return response()->json($result);
    }
}
