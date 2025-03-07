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

        if (!$user->verified) {
            return response()->json(['error' => 'Please verify your email first.'], 401);
        }

        $accessToken = $this->jwtService->generateToken($user, config('app.jwt_ttl'));
        $refreshToken = $this->jwtService->generateToken($user, config('app.jwt_refresh_ttl'));

        return response()->json([
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'user_type' => $user->UserType
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

        $profileData = [
            'user_id' => $user->UserID,
            'email' => $user->Email,
            'user_type' => $user->UserType,
        ];

        if ($user->UserType === 'Patient') {
            $patient = $user->patient;
            $profileData = array_merge($profileData, [
                'first_name' => $patient->FirstName,
                'last_name' => $patient->LastName,
                'address' => $patient->Address,
                'blood_group' => $patient->BloodGroup,
                'gender' => $patient->Gender,
                'contact_number' => $patient->ContactNumber,
                'city' => $patient->City,
                'area' => $patient->Area,
            ]);
        } elseif ($user->UserType === 'Doctor') {
            $doctor = $user->doctor;
            $profileData = array_merge($profileData, [
                'first_name' => $doctor->FirstName,
                'last_name' => $doctor->LastName,
                'address' => $doctor->Address,
                'gender' => $doctor->Gender,
                'contact_number' => $doctor->ContactNumber,
                'hospital' => $doctor->Hospital,
                'specialty' => $doctor->Specialty,
                'education' => $doctor->Education,
                'experience' => $doctor->Experience,
                'languages' => $doctor->Languages,
                'availability' => $doctor->Availability,
                'biography' => $doctor->Biography,
                'profile_picture' => $doctor->ProfilePicture,
            ]);
        }

        return response()->json(['success' => true, 'profile' => $profileData]);
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
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'address' => 'nullable|string',
            'blood_group' => 'nullable|string',
            'gender' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'city' => 'nullable|string',
            'area' => 'nullable|string',
            'specialty' => 'nullable|string',
            'education' => 'nullable|string',
            'hospital' => 'nullable|string',
            'experience' => 'nullable|string',
            'languages' => 'nullable|string',
            'availability' => 'nullable|string',
            'biography' => 'nullable|string',
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

        if ($user->UserType === 'Patient') {
            $patient = $user->patient;
            if ($request->has('first_name')) {
                $patient->FirstName = $request->first_name;
            }
            if ($request->has('last_name')) {
                $patient->LastName = $request->last_name;
            }
            if ($request->has('address')) {
                $patient->Address = $request->address;
            }
            if ($request->has('blood_group')) {
                $patient->BloodGroup = $request->blood_group;
            }
            if ($request->has('gender')) {
                $patient->Gender = $request->gender;
            }
            if ($request->has('contact_number')) {
                $patient->ContactNumber = $request->contact_number;
            }
            if ($request->has('city')) {
                $patient->City = $request->city;
            }
            if ($request->has('area')) {
                $patient->Area = $request->area;
            }
            $patient->save();
        } elseif ($user->UserType === 'Doctor') {
            $doctor = $user->doctor;
            if ($request->has('first_name')) {
                $doctor->FirstName = $request->first_name;
            }
            if ($request->has('last_name')) {
                $doctor->LastName = $request->last_name;
            }
            if ($request->has('contact_number')) {
                $doctor->ContactNumber = $request->contact_number;
            }
            if ($request->has('address')) {
                $doctor->Address = $request->address;
            }
            if ($request->has('gender')) {
                $doctor->Gender = $request->gender;
            }
            if ($request->has('specialty')) {
                $doctor->Specialty = $request->specialty;
            }
            if ($request->has('education')) {
                $doctor->Education = $request->education;
            }
            if ($request->has('hospital')) {
                $doctor->Hospital = $request->hospital;
            }
            if ($request->has('experience')) {
                $doctor->Experience = $request->experience;
            }
            if ($request->has('languages')) {
                $doctor->Languages = $request->languages;
            }
            if ($request->has('availability')) {
                $doctor->Availability = $request->availability;
            }
            if ($request->has('biography')) {
                $doctor->Biography = $request->biography;
            }
            $doctor->save();
        }

        return response()->json(['message' => 'Profile updated successfully'], 200);
    }
}
