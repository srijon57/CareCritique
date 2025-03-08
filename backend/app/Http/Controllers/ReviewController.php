<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ReviewService;

class ReviewController extends Controller
{
    protected $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    public function index(Request $request, $doctorId)
    {
        $result = $this->reviewService->getReviews($doctorId);

        if (isset($result['error'])) {
            return response()->json($result['error'], $result['status']);
        }

        return response()->json($result, $result['status']);
    }

    public function store(Request $request, $doctorId)
    {
        $result = $this->reviewService->storeReview($request->all(), $doctorId, $request->attributes->get('user'));

        if (isset($result['error'])) {
            return response()->json($result['error'], $result['status']);
        }

        return response()->json($result['message'], $result['status']);
    }

    public function update(Request $request, $doctorId, $reviewId)
    {
        $result = $this->reviewService->updateReview($request->all(), $doctorId, $reviewId, $request->attributes->get('user'));

        if (isset($result['error'])) {
            return response()->json($result['error'], $result['status']);
        }

        return response()->json($result['message'], $result['status']);
    }

    public function destroy(Request $request, $doctorId, $reviewId)
    {
        $result = $this->reviewService->deleteReview($doctorId, $reviewId, $request->attributes->get('user'));

        if (isset($result['error'])) {
            return response()->json($result['error'], $result['status']);
        }

        return response()->json($result['message'], $result['status']);
    }
}
