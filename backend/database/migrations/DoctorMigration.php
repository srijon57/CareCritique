<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePatientTable extends Migration
{
    public function up()
    {
        Schema::create('Patient', function (Blueprint $table) {
            $table->increments('PatientID');
            $table->unsignedInteger('UserID');
            $table->string('FirstName');
            $table->string('LastName');
            $table->string('Address')->nullable();
            $table->string('BloodGroup')->nullable();
            $table->enum('Gender', ['Male', 'Female', 'Other'])->nullable();
            $table->string('ContactNumber')->nullable();
            $table->string('City')->nullable();
            $table->string('State')->nullable();

            $table->foreign('UserID')->references('UserID')->on('UserAccount')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('Patient');
    }
}
