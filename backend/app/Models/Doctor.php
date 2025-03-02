<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $table = 'Doctor';
    protected $primaryKey = 'DoctorID';
    public $timestamps = false; 
    protected $fillable = [
        'UserID',
        'FirstName',
        'LastName',
        'Email',
        'Address',
        'BloodGroup',
        'Gender',
        'ContactNumber',
        'City',
        'Area',
        'Hospital',
        'Specialty',
        'Education',
        'Experience',
        'Languages',
        'Availability',
        'Biography',
        'CertificatePath1',
        'CertificatePath2',
        'CertificatePath3',
        'ProfilePicture',
    ];

    public function userAccount()
    {
        return $this->belongsTo(UserAccount::class, 'UserID', 'UserID');
    }
}
