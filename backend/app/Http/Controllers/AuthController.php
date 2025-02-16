<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AuthService;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(Request $request)
    {
        $userService = new \App\Services\UserService();
        return $userService->register($request);
    }

    public function login(Request $request)
    {
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
