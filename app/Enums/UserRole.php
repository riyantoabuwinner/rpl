<?php

namespace App\Enums;

enum UserRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case ADMIN_RPL = 'admin_rpl';
    case ASESI = 'asesi';
    case ASESOR = 'asesor';
    case KAPRODI = 'kaprodi';
    case LPM = 'lpm';
    case ADMIN_SIAKAD = 'admin_siakad';

    public function label(): string
    {
        return match ($this) {
            self::SUPER_ADMIN => 'Super Administrator',
            self::ADMIN_RPL => 'Admin Pusat RPL',
            self::ASESI => 'Asesi / Calon Mahasiswa',
            self::ASESOR => 'Asesor Evaluator',
            self::KAPRODI => 'Ketua Program Studi / Pimpinan',
            self::LPM => 'Lembaga Penjaminan Mutu (LPM)',
            self::ADMIN_SIAKAD => 'Administrator SIAKAD & Feeder',
        };
    }
}
