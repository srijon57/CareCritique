<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'Doctor';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'DoctorID';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
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
        'State',
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
    ];

    /**
     * Get the user account associated with the doctor.
     */
    public function userAccount()
    {
        return $this->belongsTo(UserAccount::class, 'UserID', 'UserID');
    }
}