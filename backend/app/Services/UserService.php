<?php

namespace App\Services;

use App\Models\UserAccount;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserService
{
    public function register($request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255|unique:UserAccount',
            'password' => 'required|string|min:6',
            'user_type' => 'required|string|in:Patient,Doctor',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'contact_number' => 'nullable|string',
            'address' => 'nullable|string',
            'blood_group' => 'nullable|string',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'hospital' => 'nullable|string',
            'specialty' => 'nullable|string',
            'education' => 'nullable|string',
            'experience' => 'nullable|string',
            'languages' => 'nullable|string',
            'availability' => 'nullable|string',
            'biography' => 'nullable|string',
            'certificate_path1' => 'nullable|string',
            'certificate_path2' => 'nullable|string',
            'certificate_path3' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $userAccount = UserAccount::create([
            'Email' => $request->email,
            'PasswordHash' => Hash::make($request->password),
            'UserType' => $request->user_type,
        ]);

        if ($request->user_type === 'Patient') {
            Patient::create([
                'UserID' => $userAccount->UserID,
                'FirstName' => $request->first_name,
                'LastName' => $request->last_name,
                'Address' => $request->address,
                'BloodGroup' => $request->blood_group,
                'Gender' => $request->gender,
                'ContactNumber' => $request->contact_number,
                'City' => $request->city,
                'State' => $request->state,
            ]);
        } elseif ($request->user_type === 'Doctor') {
            Doctor::create([
                'UserID' => $userAccount->UserID,
                'FirstName' => $request->first_name,
                'LastName' => $request->last_name,
                'Email' => $request->email,
                'Address' => $request->address,
                'BloodGroup' => $request->blood_group,
                'Gender' => $request->gender,
                'ContactNumber' => $request->contact_number,
                'City' => $request->city,
                'State' => $request->state,
                'Hospital' => $request->hospital,
                'Specialty' => $request->specialty,
                'Education' => $request->education,
                'Experience' => $request->experience,
                'Languages' => $request->languages,
                'Availability' => $request->availability,
                'Biography' => $request->biography,
                'CertificatePath1' => $request->certificate_path1,
                'CertificatePath2' => $request->certificate_path2,
                'CertificatePath3' => $request->certificate_path3,
            ]);
        }

        return response()->json(['message' => 'User registered successfully'], 201);
    }

    public function updateProfile($request, $user)
    {
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
