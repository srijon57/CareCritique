<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    public function getTestHuman(Request $request)
    {
        return "This is a test human response from TestController";
    }
 
}