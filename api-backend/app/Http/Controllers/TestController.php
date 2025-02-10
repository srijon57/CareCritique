<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserAccount; // Import the UserAccount model

class TestController extends Controller
{
    // Existing methods
    public function getTestHuman()
    {
        // Your existing logic
    }

    public function getTestHumanWithId($id)
    {
        // Your existing logic
    }

    // New method to fetch all users
    public function getAllUsers()
    {
        // Fetch all users from the UserAccount table
        $users = UserAccount::all();

        // Return the users as a JSON response
        return response()->json($users);
    }
}