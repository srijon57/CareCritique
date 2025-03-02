<?php
namespace App\Services;

use App\Models\UserAccount;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\OtpMail;
use Carbon\Carbon;

class UserService
{
    protected $otpService;
    protected $cloudinaryService;

    public function __construct(OtpService $otpService, CloudinaryService $cloudinaryService)
    {
        $this->otpService = $otpService;
        $this->cloudinaryService = $cloudinaryService;
    }

    public function register($request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255|unique:UserAccount,Email',
            'password' => 'required|string|min:6',
            'user_type' => 'required|string|in:Patient,Doctor,Admin',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'certificate_path1' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'certificate_path2' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'certificate_path3' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Validation failed', 'messages' => $validator->errors()], 422);
        }

        $userAccount = UserAccount::create([
            'Email' => $request->email,
            'PasswordHash' => Hash::make($request->password),
            'UserType' => $request->user_type,
            'verified' => false,
            'otp_expires_at' => Carbon::now()->addMinutes(5), // Set OTP expiration time
        ]);

        $otp = $this->otpService->generateOtp($request->email);
        Log::info('OTP generated for email: ' . $request->email . ', OTP: ' . $otp);

        try {
            Mail::to($request->email)->send(new OtpMail($otp));
            Log::info('OTP email sent to: ' . $request->email);
        } catch (\Exception $e) {
            Log::error('Failed to send OTP email: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to send OTP email'], 500);
        }

        // Upload files to Cloudinary
        $profilePictureUrl = $request->hasFile('profile_picture') ? $this->cloudinaryService->upload($request->file('profile_picture')) : null;
        $certificatePath1Url = $request->hasFile('certificate_path1') ? $this->cloudinaryService->upload($request->file('certificate_path1')) : null;
        $certificatePath2Url = $request->hasFile('certificate_path2') ? $this->cloudinaryService->upload($request->file('certificate_path2')) : null;
        $certificatePath3Url = $request->hasFile('certificate_path3') ? $this->cloudinaryService->upload($request->file('certificate_path3')) : null;

        // Store file URLs in the database
        if ($userAccount->UserType === 'Doctor') {
            Doctor::create([
                'UserID' => $userAccount->UserID,
                'FirstName' => $request->first_name,
                'LastName' => $request->last_name,
                'ProfilePicture' => $profilePictureUrl,
                'CertificatePath1' => $certificatePath1Url,
                'CertificatePath2' => $certificatePath2Url,
                'CertificatePath3' => $certificatePath3Url,
            ]);
        }

        return response()->json(['message' => 'OTP sent to your email. Please verify to complete registration.'], 201);
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

    public function verifyOtp($request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|exists:UserAccount,Email',
            'otp' => 'required|string',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['error' => 'Validation failed', 'messages' => $validator->errors()], 422);
        }
    
        $userAccount = UserAccount::where('Email', $request->email)->first();
    
        // Check if the OTP is expired (using Asia/Dhaka timezone)
        if (now()->gt($userAccount->otp_expires_at)) {
            $userAccount->delete(); // Delete the user if OTP is expired
            return response()->json(['error' => 'OTP has expired. Please register again.'], 422);
        }
    
        if (!$this->otpService->validateOtp($request->email, $request->otp)) {
            return response()->json(['error' => 'Invalid OTP'], 422);
        }
    
        $userAccount->verified = true;
        $userAccount->save();
    
        if ($userAccount->UserType === 'Patient') {
            Patient::create([
                'UserID' => $userAccount->UserID,
                'FirstName' => $request->first_name,
                'LastName' => $request->last_name,
            ]);
        } elseif ($userAccount->UserType === 'Doctor') {
            // Check if a Doctor entry already exists
            $doctor = Doctor::where('UserID', $userAccount->UserID)->first();
            if (!$doctor) {
                Doctor::create([
                    'UserID' => $userAccount->UserID,
                    'FirstName' => $request->first_name,
                    'LastName' => $request->last_name,
                    'CertificatePath1' => $request->certificate_path1,
                    'CertificatePath2' => $request->certificate_path2,
                    'CertificatePath3' => $request->certificate_path3,
                ]);
            }
        }
    
        return response()->json(['message' => 'Registration completed successfully'], 200);
    }
    

    
}
