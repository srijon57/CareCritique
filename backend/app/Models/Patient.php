<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $table = 'Patient';
    protected $primaryKey = 'PatientID';
    protected $fillable = [
        'UserID', 'FirstName', 'LastName', 'Address', 'BloodGroup',
        'Gender', 'ContactNumber', 'City', 'Area',
    ];

    public $timestamps = true;

    // Relationship with UserAccount
    public function userAccount()
    {
        return $this->belongsTo(UserAccount::class, 'UserID', 'UserID');
    }

    // Relationship with Reviews
    public function reviews()
    {
        return $this->hasMany(Reviews::class, 'PatientID', 'PatientID');
    }
}