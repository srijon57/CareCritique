<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AuthService;
use App\Services\OtpService;
use App\Services\CloudinaryService;
use App\Models\UserAccount;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected $authService;
    protected $otpService;
    protected $cloudinaryService;
    public function verifyAdmin($userId)
    {
        $verifier = auth()->user();

        // Check if verifier is UserID 14
        if ($verifier->UserID != 14) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Find the user to verify
        $user = UserAccount::find($userId);

        if (!$user || $user->UserType != 'Admin') {
            return response()->json(['error' => 'Admin not found'], 404);
        }

        // Update verification status
        $user->verified = 1;
        $user->save();

        return response()->json(['message' => 'Admin verified successfully']);
    }

    public function __construct(AuthService $authService, OtpService $otpService, CloudinaryService $cloudinaryService)
    {
        $this->authService = $authService;
        $this->otpService = $otpService;
        $this->cloudinaryService = $cloudinaryService;
    }

    public function register(Request $request)
    {
        $userService = new \App\Services\UserService($this->otpService, $this->cloudinaryService);
        return $userService->register($request);
    }

    public function verifyOtp(Request $request)
    {
        $userService = new \App\Services\UserService($this->otpService, $this->cloudinaryService);
        return $userService->verifyOtp($request);
    }

    public function login(Request $request)
    {
        $user = UserAccount::where('Email', $request->email)->first();

        if (!$user || !$user->verified) {
            return response()->json(['error' => 'Please verify your email first.'], 401);
        }

        return $this->authService->login($request);
    }

    public function refreshToken(Request $request)
    {
        return $this->authService->refreshToken($request);
    }

    public function logout(Request $request)
    {
        return $this->authService->logout($request);
    }

    public function getProfile(Request $request)
    {
        return $this->authService->getProfile($request);
    }

    public function updateProfile(Request $request)
    {
        return $this->authService->updateProfile($request);
    }
    public function toggleDoctorVerification(Request $request, $doctorId)
    {
        // Retrieve the authenticated user from request attributes instead of auth()
        $verifier = $request->attributes->get('user');

        // Check if verifier exists and is an Admin with UserID 14
        if (!$verifier || $verifier->UserType !== 'Admin') {
            return response()->json(['error' => 'Unauthorized: Only Admin with UserID 14 can verify doctors'], 403);
        }

        // Find the doctor
        $doctor = Doctor::find($doctorId);

        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }

        // Validate the request
        $validator = Validator::make($request->all(), [
            'is_verified' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Validation failed', 'messages' => $validator->errors()], 422);
        }

        // Toggle the verification status
        $doctor->isVerified = $request->input('is_verified');
        $doctor->save();

        $status = $doctor->isVerified ? 'verified' : 'unverified';
        return response()->json(['message' => "Doctor {$status} successfully"]);
    }
}
