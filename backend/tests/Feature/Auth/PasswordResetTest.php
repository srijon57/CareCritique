<?php
namespace Tests\Feature\Auth;

use App\Models\UserAccount;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_reset_password_link_can_be_requested(): void
    {
        Notification::fake();

        $user = UserAccount::factory()->create();

        $this->post('/forgot-password', ['email' => $user->Email]);

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_password_can_be_reset_with_valid_token(): void
    {
        Notification::fake();

        $user = UserAccount::factory()->create();

        $this->post('/forgot-password', ['email' => $user->Email]);

        Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) {
            $token = $notification->token;

            $this->post('/reset-password', [
                'email' => $user->Email,
                'token' => $token,
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ]);

            $this->assertDatabaseHas('UserAccount', [
                'Email' => $user->Email,
                'PasswordHash' => bcrypt('new-password'),
            ]);

            return true;
        });
    }
}
