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
                'name' => 'Dr. Ahmad Dahlan, M.Kom.',
                'username' => 'asesor1',
                'email' => 'asesor1@kampus.ac.id',
                'nik' => '3271010303850003',
                'phone' => '081234567892',
                'role' => UserRole::ASESOR,
                'password' => $defaultPassword,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dr. Siti Aminah, M.T.',
                'username' => 'asesor2',
                'email' => 'asesor2@kampus.ac.id',
                'nik' => '3271010404870004',
                'phone' => '081234567893',
                'role' => UserRole::ASESOR,
                'password' => $defaultPassword,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Prof. Dr. Ir. Bambang Hermanto',
                'username' => 'kaprodi.ti',
                'email' => 'kaprodi.ti@kampus.ac.id',
                'nik' => '3271010505800005',
                'phone' => '081234567894',
                'role' => UserRole::KAPRODI,
                'password' => $defaultPassword,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dr. Hendra Wijaya, M.Pd. (LPM)',
                'username' => 'lpm',
                'email' => 'lpm@kampus.ac.id',
                'nik' => '3271010606820006',
                'phone' => '081234567895',
                'role' => UserRole::LPM,
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
            [
                'name' => 'Ahmad Fauzi (Calon Asesi RPL A2)',
                'username' => 'asesi.ahmad',
                'email' => 'asesi.ahmad@example.com',
                'nik' => '3271011508980008',
                'phone' => '085712345678',
                'role' => UserRole::ASESI,
                'password' => $defaultPassword,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Rina Wulandari (Calon Asesi RPL A1)',
                'username' => 'asesi.rina',
                'email' => 'asesi.rina@example.com',
                'nik' => '3271012509990009',
                'phone' => '085787654321',
                'role' => UserRole::ASESI,
                'password' => $defaultPassword,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Toheri (Calon Asesi Tadris Matematika)',
                'username' => 'toheri',
                'email' => 'toheri@uinssc.ac.id',
                'nik' => '3213011607730001',
                'phone' => '081320741803',
                'role' => UserRole::ASESI,
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
