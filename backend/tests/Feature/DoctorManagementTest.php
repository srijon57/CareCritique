<?php
namespace Tests\Feature;

use App\Models\Doctor;
use App\Models\UserAccount;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DoctorManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_doctors_can_be_retrieved(): void
    {
        $doctor = Doctor::factory()->create();

        $response = $this->get('/doctors');

        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJsonFragment([
            'FirstName' => $doctor->FirstName,
            'LastName' => $doctor->LastName,
        ]);
    }

    public function test_a_doctor_can_be_retrieved_by_id(): void
    {
        $doctor = Doctor::factory()->create();

        $response = $this->get('/doctors/' . $doctor->DoctorID);

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'FirstName' => $doctor->FirstName,
            'LastName' => $doctor->LastName,
        ]);
    }
}
