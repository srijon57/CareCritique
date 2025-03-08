<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AuthService;
use App\Services\OtpService;
use App\Services\CloudinaryService;
use App\Services\UserService;

class AuthController extends Controller
{
    protected $authService;
    protected $otpService;
    protected $cloudinaryService;

    public function __construct(AuthService $authService, OtpService $otpService, CloudinaryService $cloudinaryService)
    {
        $this->authService = $authService;
        $this->otpService = $otpService;
        $this->cloudinaryService = $cloudinaryService;
    }

    public function verifyAdmin($userId)
    {
        $verifier = $this->getVerifier();
        $result = $this->authService->verifyAdmin($userId, $verifier);

        if (isset($result['error'])) {
            return response()->json($result['error'], $result['status']);
        }

        return response()->json($result['message'], $result['status']);
    }

    public function register(Request $request)
    {
        $userService = new UserService($this->otpService, $this->cloudinaryService);
        return $userService->register($request);
    }

    public function verifyOtp(Request $request)
    {
        $userService = new UserService($this->otpService, $this->cloudinaryService);
        return $userService->verifyOtp($request);
    }

    public function login(Request $request)
    {
        $result = $this->authService->login($request);

        if (isset($result['error'])) {
            return response()->json($result['error'], $result['status']);
        }

        return response()->json($result, $result['status']);
    }

    public function refreshToken(Request $request)
    {
        $result = $this->authService->refreshToken($request);

        if (isset($result['error'])) {
            return response()->json($result['error'], $result['status']);
        }

        return response()->json($result, $result['status']);
    }

    public function logout(Request $request)
    {
        $result = $this->authService->logout($request);

        if (isset($result['error'])) {
            return response()->json($result['error'], $result['status']);
        }

        return response()->json($result['message'], $result['status']);
    }

    public function getProfile(Request $request)
    {
        $result = $this->authService->getProfile($request);

        if (isset($result['error'])) {
            return response()->json($result['error'], $result['status']);
        }

        return response()->json($result, $result['status']);
    }

    public function updateProfile(Request $request)
    {
        $result = $this->authService->updateProfile($request);

        if (isset($result['error'])) {
            return response()->json($result['error'], $result['status']);
        }

        return response()->json($result['message'], $result['status']);
    }

    public function toggleDoctorVerification(Request $request, $doctorId)
    {
        $verifier = $this->getVerifier();
        $result = $this->authService->toggleDoctorVerification($doctorId, $request, $verifier);

        if (isset($result['error'])) {
            return response()->json($result['error'], $result['status']);
        }

        return response()->json($result['message'], $result['status']);
    }

    private function getVerifier()
    {
        return $request->attributes->get('user');
    }
}
