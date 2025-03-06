<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth.jwt');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'required|exists:Doctor,DoctorID',
            'date' => 'required|date|after:today',
            'time' => 'required|date_format:H:i'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = $request->attributes->get('user');
        
        if ($user->UserType !== 'Patient') {
            return response()->json(['error' => 'Only patients can book appointments'], 403);
        }

        $patient = Patient::where('UserID', $user->UserID)->first();
        if (!$patient) {
            return response()->json(['error' => 'Patient profile not found'], 404);
        }

        $doctor = Doctor::find($request->doctor_id);
        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }

        // Check doctor's availability
        $availability = $this->checkDoctorAvailability($doctor, $request->date, $request->time);
        if (!$availability['available']) {
            return response()->json(['error' => $availability['message']], 422);
        }

        // Check if appointment slot is already taken
        $existingAppointment = Appointment::where('DoctorID', $request->doctor_id)
            ->where('Date', $request->date)
            ->where('Time', $request->time)
            ->first();

        if ($existingAppointment) {
            return response()->json(['error' => 'This time slot is already booked'], 422);
        }

        $appointment = Appointment::create([
            'PatientID' => $patient->PatientID,
            'DoctorID' => $request->doctor_id,
            'Date' => $request->date,
            'Time' => $request->time
        ]);

        return response()->json([
            'message' => 'Appointment booked successfully',
            'appointment' => $appointment
        ], 201);
    }

    public function getPatientAppointments(Request $request)
    {
        $user = $request->attributes->get('user');
        
        if ($user->UserType !== 'Patient') {
            return response()->json(['error' => 'Only patients can view their appointments'], 403);
        }

        $patient = Patient::where('UserID', $user->UserID)->first();
        if (!$patient) {
            return response()->json(['error' => 'Patient profile not found'], 404);
        }

        $appointments = Appointment::where('PatientID', $patient->PatientID)
            ->with('doctor.userAccount')
            ->orderBy('Date', 'asc')
            ->orderBy('Time', 'asc')
            ->get();

        return response()->json(['appointments' => $appointments]);
    }

    public function getDoctorAppointments(Request $request)
    {
        $user = $request->attributes->get('user');
        
        if ($user->UserType !== 'Doctor') {
            return response()->json(['error' => 'Only doctors can view their appointments'], 403);
        }

        $doctor = Doctor::where('UserID', $user->UserID)->first();
        if (!$doctor) {
            return response()->json(['error' => 'Doctor profile not found'], 404);
        }

        $appointments = Appointment::where('DoctorID', $doctor->DoctorID)
            ->with('patient.userAccount')
            ->orderBy('Date', 'asc')
            ->orderBy('Time', 'asc')
            ->get();

        return response()->json(['appointments' => $appointments]);
    }

    private function checkDoctorAvailability($doctor, $date, $time)
    {
        $dayOfWeek = Carbon::parse($date)->format('D');
        $time = Carbon::parse($time);

        // Parse availability string (e.g., "Sun-Thu 9AM-4PM")
        if (!$doctor->Availability) {
            return [
                'available' => false,
                'message' => 'Doctor availability not set'
            ];
        }

        $availabilityParts = explode(' ', $doctor->Availability);
        if (count($availabilityParts) !== 2) {
            return [
                'available' => false,
                'message' => 'Invalid availability format'
            ];
        }

        list($days, $hours) = $availabilityParts;
        list($startDay, $endDay) = explode('-', $days);
        list($startTime, $endTime) = explode('-', $hours);

        // Convert AM/PM to 24-hour format
        $startTime = Carbon::parse($startTime);
        $endTime = Carbon::parse($endTime);

        // Check if requested day is within available days
        $daysMap = ['Sun' => 0, 'Mon' => 1, 'Tue' => 2, 'Wed' => 3, 'Thu' => 4, 'Fri' => 5, 'Sat' => 6];
        $requestedDayNum = $daysMap[$dayOfWeek];
        $startDayNum = $daysMap[$startDay];
        $endDayNum = $daysMap[$endDay];

        if ($startDayNum <= $endDayNum) {
            $dayInRange = $requestedDayNum >= $startDayNum && $requestedDayNum <= $endDayNum;
        } else {
            $dayInRange = $requestedDayNum >= $startDayNum || $requestedDayNum <= $endDayNum;
        }

        if (!$dayInRange) {
            return [
                'available' => false,
                'message' => 'Doctor is not available on this day'
            ];
        }

        // Check if requested time is within available hours
        if ($time->lessThan($startTime) || $time->greaterThanOrEqualTo($endTime)) {
            return [
                'available' => false,
                'message' => 'Doctor is not available at this time'
            ];
        }

        return [
            'available' => true,
            'message' => 'Doctor is available'
        ];
    }
}