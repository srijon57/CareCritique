<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\UserAccount;
use Illuminate\Support\Facades\Cache;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_verify_otp_successfully()
    {
        $user = UserAccount::factory()->create([
            'Email' => 'test@example.com',
            'verified' => false
        ]);

        Cache::put('otp_test@example.com', '123456', now()->addMinutes(5));

        $response = $this->postJson('/api/verify-otp', [
            'email' => 'test@example.com',
            'otp' => '123456'
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Registration completed successfully']);
        
        $this->assertDatabaseHas('UserAccount', [
            'Email' => 'test@example.com',
            'verified' => true
        ]);
    }

    public function test_verify_expired_otp()
    {
        $user = UserAccount::factory()->create([
            'Email' => 'test@example.com',
            'verified' => false,
            'otp_expires_at' => now()->subMinute()
        ]);

        $response = $this->postJson('/api/verify-otp', [
            'email' => 'test@example.com',
            'otp' => '123456'
        ]);

        $response->assertStatus(422)
            ->assertJson(['error' => 'OTP has expired. Please register again.']);
        
        $this->assertDatabaseMissing('UserAccount', [
            'Email' => 'test@example.com'
        ]);
    }

    public function test_verify_invalid_otp()
    {
        $user = UserAccount::factory()->create([
            'Email' => 'test@example.com',
            'verified' => false
        ]);

        Cache::put('otp_test@example.com', '123456', now()->addMinutes(5));

        $response = $this->postJson('/api/verify-otp', [
            'email' => 'test@example.com',
            'otp' => 'wrongotp'
        ]);

        $response->assertStatus(422)
            ->assertJson(['error' => 'Invalid OTP']);
    }
}