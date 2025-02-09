<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'Patient';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'PatientID';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'UserID',
        'FirstName',
        'LastName',
        'Address',
        'BloodGroup',
        'Gender',
        'ContactNumber',
        'City',
        'State',
    ];

    /**
     * Get the user account associated with the patient.
     */
    public function userAccount()
    {
        return $this->belongsTo(UserAccount::class, 'UserID', 'UserID');
    }
}