<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $defaultPassword = Hash::make('password123');

        $users = [
            [
                'name' => 'Admin Portal IAIN / UIN SSC',
                'username' => 'adminportal_iain',
                'email' => 'adminportal@uinssc.ac.id',
                'nik' => '3271010101900099',
                'phone' => '081234567899',
                'role' => UserRole::ADMIN_RPL,
                'password' => Hash::make('123'),
                'portal_id' => 'portal_adminportal_iain',
                'portal_synced_at' => now(),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Super Administrator',
                'username' => 'superadmin',
                'email' => 'superadmin@kampus.ac.id',
                'nik' => '3271010101900001',
                'phone' => '081234567890',
                'role' => UserRole::SUPER_ADMIN,
                'password' => $defaultPassword,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Pengelola Pusat RPL',
                'username' => 'adminrpl',
                'email' => 'adminrpl@kampus.ac.id',
                'nik' => '3271010202880002',
                'phone' => '081234567891',
                'role' => UserRole::ADMIN_RPL,
                'password' => $defaultPassword,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Admin Data SIAKAD & Feeder',
                'username' => 'siakad',
                'email' => 'siakad@kampus.ac.id',
                'nik' => '3271010707920007',
                'phone' => '081234567896',
                'role' => UserRole::ADMIN_SIAKAD,
                'password' => $defaultPassword,
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }
    }
}
