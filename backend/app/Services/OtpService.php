<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class OtpService
{
    protected $otpLength = 6;
    protected $otpExpiry = 5; // minutes

    public function generateOtp($email)
    {
        $otp = rand(pow(10, $this->otpLength - 1), pow(10, $this->otpLength) - 1);
        Cache::put('otp_' . $email, $otp, now()->addMinutes($this->otpExpiry));
        return $otp;
    }

    public function validateOtp($email, $otp)
    {
        $cachedOtp = Cache::get('otp_' . $email);
        return $cachedOtp == $otp;
    }
}