<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AppointmentService
{
    public function storeAppointment(array $data, $user)
    {
        $validator = Validator::make($data, [
            'doctor_id' => 'required|exists:Doctor,DoctorID',
            'date' => 'required|date|after:today',
            'time' => 'required|date_format:H:i'
        ]);

        if ($validator->fails()) {
            return ['error' => $validator->errors(), 'status' => 422];
        }

        if ($user->UserType !== 'Patient') {
            return ['error' => 'Only patients can book appointments', 'status' => 403];
        }

        $patient = Patient::where('UserID', $user->UserID)->first();
        if (!$patient) {
            return ['error' => 'Patient profile not found', 'status' => 404];
        }

        $doctor = Doctor::find($data['doctor_id']);
        if (!$doctor) {
            return ['error' => 'Doctor not found', 'status' => 404];
        }

        $availability = $this->checkDoctorAvailability($doctor, $data['date'], $data['time']);
        if (!$availability['available']) {
            return ['error' => $availability['message'], 'status' => 422];
        }

        $existingAppointment = Appointment::where('DoctorID', $data['doctor_id'])
            ->where('Date', $data['date'])
            ->where('Time', $data['time'])
            ->first();

        if ($existingAppointment) {
            return ['error' => 'This time slot is already booked', 'status' => 422];
        }

        $appointment = Appointment::create([
            'PatientID' => $patient->PatientID,
            'DoctorID' => $data['doctor_id'],
            'Date' => $data['date'],
            'Time' => $data['time']
        ]);

        return ['message' => 'Appointment booked successfully', 'appointment' => $appointment, 'status' => 201];
    }

    public function getPatientAppointments($user)
    {
        if ($user->UserType !== 'Patient') {
            return ['error' => 'Only patients can view their appointments', 'status' => 403];
        }

        $patient = Patient::where('UserID', $user->UserID)->first();
        if (!$patient) {
            return ['error' => 'Patient profile not found', 'status' => 404];
        }

        $appointments = Appointment::where('PatientID', $patient->PatientID)
            ->with('doctor.userAccount')
            ->orderBy('Date', 'asc')
            ->orderBy('Time', 'asc')
            ->get();

        return ['appointments' => $appointments];
    }

    public function getDoctorAppointments($user)
    {
        if ($user->UserType !== 'Doctor') {
            return ['error' => 'Only doctors can view their appointments', 'status' => 403];
        }

        $doctor = Doctor::where('UserID', $user->UserID)->first();
        if (!$doctor) {
            return ['error' => 'Doctor profile not found', 'status' => 404];
        }

        $appointments = Appointment::where('DoctorID', $doctor->DoctorID)
            ->with('patient.userAccount')
            ->orderBy('Date', 'asc')
            ->orderBy('Time', 'asc')
            ->get();

        return ['appointments' => $appointments];
    }

    private function checkDoctorAvailability($doctor, $date, $time)
    {
        $dayOfWeek = Carbon::parse($date)->format('D');
        $time = Carbon::parse($time);

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

        $startTime = Carbon::parse($startTime);
        $endTime = Carbon::parse($endTime);

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
