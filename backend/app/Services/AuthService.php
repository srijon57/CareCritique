<?php

namespace App\Services;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\UserAccount;
use App\Services\JwtService;

class AuthService
{
    protected $jwtService;

    public function __construct(JwtService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    public function login($request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);
    
        if ($validator->fails()) {
            return response()->json(['error' => 'Validation failed', 'messages' => $validator->errors()], 422);
        }
    
        $user = UserAccount::where('Email', $request->email)->first();
    
        if (!$user || !Hash::check($request->password, $user->PasswordHash)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }
    
        $accessToken = $this->jwtService->generateToken($user, config('app.jwt_ttl'));
        $refreshToken = $this->jwtService->generateToken($user, config('app.jwt_refresh_ttl'));
    
        return response()->json([
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken
        ]);
    }

    public function refreshToken($request)
    {
        $tokenString = $request->header('Authorization');

        if (!$this->jwtService->validateToken($tokenString)) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        $payload = $this->jwtService->getPayload($tokenString);
        $user = UserAccount::find($payload->get('uid'));

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $newAccessToken = $this->jwtService->generateToken($user, config('app.jwt_ttl'));

        return response()->json(['access_token' => $newAccessToken]);
    }

    public function logout($request)
    {
        $tokenString = $request->header('Authorization');

        if (!$this->jwtService->validateToken($tokenString)) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        $payload = $this->jwtService->getPayload($tokenString);
        $tokenId = $payload->get('jti');
        \Cache::put('invalidated_token_' . $tokenId, true, now()->addMinutes(60));

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function getProfile($request)
    {
        $tokenString = $request->header('Authorization');

        if (!$this->jwtService->validateToken($tokenString)) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        $payload = $this->jwtService->getPayload($tokenString);
        $user = UserAccount::find($payload->get('uid'));

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        return response()->json([
            'success' => true,
            'profile' => [
                'user_id' => $user->UserID,
                'email' => $user->Email,
                'user_type' => $user->UserType,
            ]
        ]);
    }

    public function updateProfile($request)
    {
        $tokenString = $request->header('Authorization');

        if (!$this->jwtService->validateToken($tokenString)) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        $payload = $this->jwtService->getPayload($tokenString);
        $user = UserAccount::find($payload->get('uid'));

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'sometimes|required|string|email|max:255|unique:UserAccount,Email,' . $user->UserID . ',UserID',
            'password' => 'nullable|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($request->has('email')) {
            $user->Email = $request->email;
        }

        if ($request->has('password')) {
            $user->PasswordHash = Hash::make($request->password);
        }

        $user->save();

        return response()->json(['message' => 'Profile updated successfully'], 200);
    }
}
