<?php

namespace App\Services;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\UserAccount;
use App\Models\Doctor;
use App\Services\JwtService;
use Illuminate\Http\Request;
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
            return ['error' => 'Validation failed', 'messages' => $validator->errors(), 'status' => 422];
        }

        $user = UserAccount::where('Email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->PasswordHash)) {
            return ['error' => 'Invalid credentials', 'status' => 401];
        }

        if (!$user->verified) {
            return ['error' => 'Please verify your email first.', 'status' => 401];
        }

        $accessToken = $this->jwtService->generateToken($user, config('app.jwt_ttl'));
        $refreshToken = $this->jwtService->generateToken($user, config('app.jwt_refresh_ttl'));

        return [
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'user_type' => $user->UserType,
            'status' => 200,
        ];
    }

    public function refreshToken($request)
    {
        $tokenString = $request->header('Authorization');

        if (!$this->jwtService->validateToken($tokenString)) {
            return ['error' => 'Invalid token', 'status' => 401];
        }

        $payload = $this->jwtService->getPayload($tokenString);
        $user = UserAccount::find($payload->get('uid'));

        if (!$user) {
            return ['error' => 'User not found', 'status' => 404];
        }

        $newAccessToken = $this->jwtService->generateToken($user, config('app.jwt_ttl'));

        return ['access_token' => $newAccessToken, 'status' => 200];
    }

    public function logout($request)
    {
        $tokenString = $request->header('Authorization');

        if (!$this->jwtService->validateToken($tokenString)) {
            return ['error' => 'Invalid token', 'status' => 401];
        }

        $payload = $this->jwtService->getPayload($tokenString);
        $tokenId = $payload->get('jti');
        \Cache::put('invalidated_token_' . $tokenId, true, now()->addMinutes(60));

        return ['message' => 'Logged out successfully', 'status' => 200];
    }

    public function getProfile($request)
    {
        $tokenString = $request->header('Authorization');

        if (!$this->jwtService->validateToken($tokenString)) {
            return ['error' => 'Invalid token', 'status' => 401];
        }

        $payload = $this->jwtService->getPayload($tokenString);
        $user = UserAccount::find($payload->get('uid'));

        if (!$user) {
            return ['error' => 'User not found', 'status' => 404];
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

        return ['success' => true, 'profile' => $profileData, 'status' => 200];
    }

    public function updateProfile($request)
    {
        $tokenString = $request->header('Authorization');

        if (!$this->jwtService->validateToken($tokenString)) {
            return ['error' => 'Invalid token', 'status' => 401];
        }

        $payload = $this->jwtService->getPayload($tokenString);
        $user = UserAccount::find($payload->get('uid'));

        if (!$user) {
            return ['error' => 'User not found', 'status' => 404];
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
            return ['error' => $validator->errors(), 'status' => 422];
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

        return ['message' => 'Profile updated successfully', 'status' => 200];
    }

    public function verifyAdmin($userId, $verifier)
    {
        // Check if verifier is UserID 14
        if ($verifier->UserID != 14) {
            return ['error' => 'Unauthorized', 'status' => 403];
        }

        // Find the user to verify
        $user = UserAccount::find($userId);

        if (!$user || $user->UserType != 'Admin') {
            return ['error' => 'Admin not found', 'status' => 404];
        }

        // Update verification status
        $user->verified = 1;
        $user->save();

        return ['message' => 'Admin verified successfully', 'status' => 200];
    }

    public function toggleDoctorVerification($doctorId, $request, $verifier)
    {
        // Check if verifier exists and is an Admin
        if (!$verifier || $verifier->UserType !== 'Admin') {
            return ['error' => 'Unauthorized: Only Admin can verify doctors', 'status' => 403];
        }

        // Find the doctor
        $doctor = Doctor::find($doctorId);

        if (!$doctor) {
            return ['error' => 'Doctor not found', 'status' => 404];
        }

        // Validate the request
        $validator = Validator::make($request->all(), [
            'is_verified' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return ['error' => 'Validation failed', 'messages' => $validator->errors(), 'status' => 422];
        }

        // Toggle the verification status
        $doctor->isVerified = $request->input('is_verified');
        $doctor->save();

        $status = $doctor->isVerified ? 'verified' : 'unverified';
        return ['message' => "Doctor {$status} successfully", 'status' => 200];
    }
}
