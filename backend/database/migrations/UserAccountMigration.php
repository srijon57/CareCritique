<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserAccountTable extends Migration
{
    public function up()
    {
        Schema::create('UserAccount', function (Blueprint $table) {
            $table->increments('UserID');
            $table->string('Email')->unique();
            $table->string('PasswordHash');
            $table->enum('UserType', ['Patient', 'Doctor', 'Admin']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('UserAccount');
    }
}
