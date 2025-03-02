<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $table = 'Patient';
    protected $primaryKey = 'PatientID';
    public $timestamps = false; 
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

    public function userAccount()
    {
        return $this->belongsTo(UserAccount::class, 'UserID', 'UserID');
    }
}
