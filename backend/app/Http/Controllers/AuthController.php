<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AuthService;
use App\Services\OtpService;
use App\Models\UserAccount;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected $authService;
    protected $otpService;

    public function __construct(AuthService $authService, OtpService $otpService)
    {
        $this->authService = $authService;
        $this->otpService = $otpService;
    }

    public function register(Request $request)
    {
        $userService = new \App\Services\UserService($this->otpService);
        return $userService->register($request);
    }

    public function verifyOtp(Request $request)
    {
        $userService = new \App\Services\UserService($this->otpService);
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
