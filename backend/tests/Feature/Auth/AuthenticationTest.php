<?php
namespace Tests\Feature\Auth;

use App\Models\UserAccount;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = UserAccount::factory()->create([
            'password' => bcrypt('password'),
            'verified' => true,
        ]);

        $response = $this->post('/api/login', [
            'email' => $user->Email,
            'password' => '111111',
        ]);

        $response->assertStatus(200);
        $this->assertAuthenticatedAs($user);
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = UserAccount::factory()->create([
            'password' => bcrypt('password'),
            'verified' => true,
        ]);

        $this->post('/api/login', [
            'email' => $user->Email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }
}
