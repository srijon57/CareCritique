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
}
