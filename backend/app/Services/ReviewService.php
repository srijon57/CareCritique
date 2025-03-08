<?php

namespace App\Services;

use App\Models\Reviews;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Support\Facades\Validator;

class ReviewService
{
    public function getReviews($doctorId)
    {
        $doctor = Doctor::find($doctorId);
        if (!$doctor) {
            return ['error' => 'Doctor not found', 'status' => 404];
        }

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

        return [
            'message' => 'Reviews retrieved successfully',
            'doctor_id' => $doctorId,
            'reviews' => $reviews,
            'total_reviews' => $reviews->count(),
            'status' => 200,
        ];
    }

    public function storeReview(array $data, $doctorId, $user)
    {
        if ($user->UserType !== 'Patient') {
            return ['error' => 'Only patients can submit reviews', 'status' => 403];
        }

        $doctor = Doctor::find($doctorId);
        if (!$doctor) {
            return ['error' => 'Doctor not found', 'status' => 404];
        }

        $patient = Patient::where('UserID', $user->UserID)->first();
        if (!$patient) {
            return ['error' => 'Patient profile not found', 'status' => 404];
        }

        $validator = Validator::make($data, [
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return ['error' => 'Validation failed', 'messages' => $validator->errors(), 'status' => 422];
        }

        $existingReview = Reviews::where('PatientID', $patient->PatientID)
            ->where('DoctorID', $doctorId)
            ->first();

        if ($existingReview) {
            return ['error' => 'You have already reviewed this doctor', 'status' => 400];
        }

        $review = Reviews::create([
            'PatientID' => $patient->PatientID,
            'DoctorID' => $doctorId,
            'Rating' => $data['rating'],
            'Comment' => $data['comment'],
        ]);

        return ['message' => 'Review submitted successfully', 'review' => $review, 'status' => 201];
    }

    public function updateReview(array $data, $doctorId, $reviewId, $user)
    {
        if ($user->UserType !== 'Patient') {
            return ['error' => 'Only patients can update reviews', 'status' => 403];
        }

        $doctor = Doctor::find($doctorId);
        if (!$doctor) {
            return ['error' => 'Doctor not found', 'status' => 404];
        }

        $patient = Patient::where('UserID', $user->UserID)->first();
        if (!$patient) {
            return ['error' => 'Patient profile not found', 'status' => 404];
        }

        $review = Reviews::where('ReviewID', $reviewId)
            ->where('DoctorID', $doctorId)
            ->where('PatientID', $patient->PatientID)
            ->first();

        if (!$review) {
            return ['error' => 'Review not found or you are not authorized to update this review', 'status' => 404];
        }

        $validator = Validator::make($data, [
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return ['error' => 'Validation failed', 'messages' => $validator->errors(), 'status' => 422];
        }

        $review->Rating = $data['rating'];
        $review->Comment = $data['comment'];
        $review->save();

        return [
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
            ],
            'status' => 200,
        ];
    }

    public function deleteReview($doctorId, $reviewId, $user)
    {
        if ($user->UserType !== 'Patient') {
            return ['error' => 'Only patients can delete reviews', 'status' => 403];
        }

        $doctor = Doctor::find($doctorId);
        if (!$doctor) {
            return ['error' => 'Doctor not found', 'status' => 404];
        }

        $patient = Patient::where('UserID', $user->UserID)->first();
        if (!$patient) {
            return ['error' => 'Patient profile not found', 'status' => 404];
        }

        $review = Reviews::where('ReviewID', $reviewId)
            ->where('DoctorID', $doctorId)
            ->where('PatientID', $patient->PatientID)
            ->first();

        if (!$review) {
            return ['error' => 'Review not found or you are not authorized to delete this review', 'status' => 404];
        }

        $review->delete();

        return ['message' => 'Review deleted successfully', 'status' => 200];
    }
}
