<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hospital extends Model
{
    use HasFactory;

    
    protected $table = 'Hospital';

    protected $primaryKey = 'HospitalID';

    protected $fillable = [
        'Name',
        'Address',
        'ContactNumber',
        'HospitalArea',
        'HospitalCity',
    ];

    // public function doctors()
    // {
    //     return $this->hasMany(Doctor::class, 'HospitalID');
    // }

    // public function getContactNumberAttribute($value)
    // {
    //     return substr($value, 0, 3) . '-' . substr($value, 3, 3) . '-' . substr($value, 6);
    // }
}
