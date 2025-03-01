<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $table = 'Doctor';
    protected $primaryKey = 'DoctorID';
    protected $fillable = [
        'UserID', 'HospitalID', 'FirstName', 'LastName', 'Address',
        'Gender', 'ContactNumber', 'Specialty', 'Education', 'Hospital',
        'Experience', 'Languages', 'Availability', 'Biography',
        'CertificatePath1', 'CertificatePath2', 'CertificatePath3', 'ProfilePicture',
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
        return $this->hasMany(Reviews::class, 'DoctorID', 'DoctorID');
    }
}