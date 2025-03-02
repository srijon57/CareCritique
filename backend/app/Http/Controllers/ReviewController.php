<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reviews;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Retrieve all reviews for a specific doctor.
     */
    public function index(Request $request, $doctorId)
    {
        // Check if the doctor exists
        $doctor = Doctor::find($doctorId);
        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }

        // Fetch reviews with related patient data
        $reviews = Reviews::where('DoctorID', $doctorId)
            ->with(['patient' => function ($query) {
                $query->select('PatientID', 'FirstName', 'LastName');
            }])
            ->get()
            ->map(function ($review) {
                return [
                    'review_id' => $review->ReviewID,
                    'rating' => $review->Rating,
                    'comment' => $review->Comment,
                    'patient' => [
                        'first_name' => $review->patient->FirstName ?? 'Anonymous',
                        'last_name' => $review->patient->LastName ?? '',
                    ],
                    'created_at' => $review->created_at,
                    'updated_at' => $review->updated_at,
                ];
            });

        return response()->json([
            'message' => 'Reviews retrieved successfully',
            'doctor_id' => $doctorId,
            'reviews' => $reviews,
            'total_reviews' => $reviews->count(),
        ], 200);
    }

    /**
     * Store a new review for a doctor.
     */
    public function store(Request $request, $doctorId)
    {
        $user = $request->attributes->get('user');

        if ($user->UserType !== 'Patient') {
            return response()->json(['error' => 'Only patients can submit reviews'], 403);
        }

        $doctor = Doctor::find($doctorId);
        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }

        $patient = Patient::where('UserID', $user->UserID)->first();
        if (!$patient) {
            return response()->json(['error' => 'Patient profile not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Validation failed', 'messages' => $validator->errors()], 422);
        }

        $existingReview = Reviews::where('PatientID', $patient->PatientID)
            ->where('DoctorID', $doctorId)
            ->first();

        if ($existingReview) {
            return response()->json(['error' => 'You have already reviewed this doctor'], 400);
        }

        $review = Reviews::create([
            'PatientID' => $patient->PatientID,
            'DoctorID' => $doctorId,
            'Rating' => $request->rating,
            'Comment' => $request->comment,
        ]);

        return response()->json(['message' => 'Review submitted successfully', 'review' => $review], 201);
    }

    /**
     * Update an existing review for a doctor.
     */
    public function update(Request $request, $doctorId, $reviewId)
    {
        $user = $request->attributes->get('user');

        if ($user->UserType !== 'Patient') {
            return response()->json(['error' => 'Only patients can update reviews'], 403);
        }

        $doctor = Doctor::find($doctorId);
        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }

        $patient = Patient::where('UserID', $user->UserID)->first();
        if (!$patient) {
            return response()->json(['error' => 'Patient profile not found'], 404);
        }

        $review = Reviews::where('ReviewID', $reviewId)
            ->where('DoctorID', $doctorId)
            ->where('PatientID', $patient->PatientID)
            ->first();

        if (!$review) {
            return response()->json(['error' => 'Review not found or you are not authorized to update this review'], 404);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Validation failed', 'messages' => $validator->errors()], 422);
        }

        $review->Rating = $request->rating;
        $review->Comment = $request->comment;
        $review->save();

        return response()->json([
            'message' => 'Review updated successfully',
            'review' => [
                'review_id' => $review->ReviewID,
                'rating' => $review->Rating,
                'comment' => $review->Comment,
                'patient' => [
                    'first_name' => $patient->FirstName,
                    'last_name' => $patient->LastName,
                ],
                'created_at' => $review->created_at,
            ]
        ], 200);
    }

    /**
     * Delete an existing review for a doctor.
     */
    public function destroy(Request $request, $doctorId, $reviewId)
    {
        $user = $request->attributes->get('user');

        if ($user->UserType !== 'Patient') {
            return response()->json(['error' => 'Only patients can delete reviews'], 403);
        }

        $doctor = Doctor::find($doctorId);
        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }

        $patient = Patient::where('UserID', $user->UserID)->first();
        if (!$patient) {
            return response()->json(['error' => 'Patient profile not found'], 404);
        }

        $review = Reviews::where('ReviewID', $reviewId)
            ->where('DoctorID', $doctorId)
            ->where('PatientID', $patient->PatientID)
            ->first();

        if (!$review) {
            return response()->json(['error' => 'Review not found or you are not authorized to delete this review'], 404);
        }

        $review->delete();

        return response()->json(['message' => 'Review deleted successfully'], 200);
    }
}