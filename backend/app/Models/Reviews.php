<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reviews extends Model
{
    protected $table = 'Reviews';
    protected $primaryKey = 'ReviewID';
    protected $fillable = ['PatientID', 'DoctorID', 'Rating', 'Comment'];

    // Disable timestamps since the table doesn't have created_at and updated_at
    public $timestamps = false;

    // Relationship with Patient
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'PatientID', 'PatientID');
    }

    // Relationship with Doctor
    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'DoctorID', 'DoctorID');
    }
}