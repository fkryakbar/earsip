<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class ChangeAdminPassword extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:change-admin-password';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Change Administrator Password';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $admin = User::where('username', 'administrator')->first();
        if (!$admin) {
            $this->fail('Administrator not found');
        }
        $password = $this->ask('Type new password');
        $admin->update([
            'password' => bcrypt($password)
        ]);

        $this->info('Password Successfully changed');
    }
}
