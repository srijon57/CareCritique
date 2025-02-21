<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserAccount extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'UserAccount';
    protected $primaryKey = 'UserID';
    public $timestamps = false;
    
    protected $fillable = [
        'Email',
        'PasswordHash',
        'UserType',
        'verified',
        'otp_expires_at',
    ];

    protected $hidden = [
        'PasswordHash',
        'remember_token',
    ];

    public function patient()
    {
        return $this->hasOne(Patient::class, 'UserID', 'UserID');
    }

    public function doctor()
    {
        return $this->hasOne(Doctor::class, 'UserID', 'UserID');
    }
}
