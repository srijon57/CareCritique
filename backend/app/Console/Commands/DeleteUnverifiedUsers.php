<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\UserAccount;
use Carbon\Carbon;

class DeleteUnverifiedUsers extends Command
{
    protected $signature = 'users:delete-unverified';
    protected $description = 'Delete unverified users';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $expiredUsers = UserAccount::where('verified', false)
            ->where('otp_expires_at', '<', Carbon::now())
            ->get();

        foreach ($expiredUsers as $user) {
            $user->delete();
        }

        $this->info('Unverified users deleted successfully.');
    }
}

