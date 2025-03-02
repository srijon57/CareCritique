<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    use HasFactory;

    protected $table = 'Admin';
    protected $primaryKey = 'AdminID';
    public $timestamps = false;
    protected $fillable = [
        'UserID',
        'FirstName',
        'LastName',
    ];

    public function userAccount()
    {
        return $this->belongsTo(UserAccount::class, 'UserID', 'UserID');
    }
}
