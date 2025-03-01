<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reviews;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\UserAccount;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Store a new review for a doctor.
     */
    public function store(Request $request, $doctorId)
    {
        // Get the authenticated user from the JWT token
        $user = $request->attributes->get('user');

        // Ensure the user is a patient
        if ($user->UserType !== 'Patient') {
            return response()->json(['error' => 'Only patients can submit reviews'], 403);
        }

        // Validate the doctor exists
        $doctor = Doctor::find($doctorId);
        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }

        // Get the patient associated with the user
        $patient = Patient::where('UserID', $user->UserID)->first();
        if (!$patient) {
            return response()->json(['error' => 'Patient profile not found'], 404);
        }

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Validation failed', 'messages' => $validator->errors()], 422);
        }

        // Check if the patient has already reviewed this doctor
        $existingReview = Reviews::where('PatientID', $patient->PatientID)
            ->where('DoctorID', $doctorId)
            ->first();

        if ($existingReview) {
            return response()->json(['error' => 'You have already reviewed this doctor'], 400);
        }

        // Create the review
        $review = Reviews::create([
            'PatientID' => $patient->PatientID,
            'DoctorID' => $doctorId,
            'Rating' => $request->rating,
            'Comment' => $request->comment,
        ]);

        return response()->json(['message' => 'Review submitted successfully', 'review' => $review], 201);
    }

    /**
     * Retrieve all reviews for a specific doctor.
     */
    public function index($doctorId)
    {
        // Validate the doctor exists
        $doctor = Doctor::find($doctorId);
        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }

        // Retrieve reviews with patient details for the doctor
        $reviews = Reviews::where('DoctorID', $doctorId)
            ->with(['patient.userAccount' => function ($query) {
                $query->select('UserID', 'Email');
            }])
            ->get()
            ->map(function ($review) {
                return [
                    'review_id' => $review->ReviewID,
                    'rating' => $review->Rating,
                    'comment' => $review->Comment,
                    'patient' => [
                        'first_name' => $review->patient->FirstName,
                        'last_name' => $review->patient->LastName,
                    ],
                    'created_at' => $review->created_at,
                ];
            });

        // Calculate average rating
        $averageRating = Reviews::where('DoctorID', $doctorId)
            ->avg('Rating') ?? 0;

        return response()->json([
            'average_rating' => round($averageRating, 2),
            'total_reviews' => $reviews->count(),
            'reviews' => $reviews,
        ], 200);
    }
}