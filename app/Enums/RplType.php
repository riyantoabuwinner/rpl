<?php

namespace App\Enums;

enum RplType: string
{
    case A1 = 'A1'; // Transfer Kredit (PT sebelumnya / D3 ke S1)
    case A2 = 'A2'; // Perolehan Kredit (Pengalaman Kerja / Nonformal)
    case B = 'B';   // Penyetaraan Kualifikasi KKNI

    public function label(): string
    {
        return match ($this) {
            self::A1 => 'RPL Tipe A1 (Transfer Kredit)',
            self::A2 => 'RPL Tipe A2 (Perolehan Kredit)',
            self::B => 'RPL Tipe B (Penyetaraan Kualifikasi)',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::A1 => 'Pengakuan hasil belajar perguruan tinggi sebelumnya (pindahan/lanjutan D3 ke S1)',
            self::A2 => 'Pengakuan perolehan capaian pembelajaran dari pengalaman kerja/pendidikan nonformal',
            self::B => 'Pengakuan kesetaraan jenjang kualifikasi KKNI (dosen/tenaga profesional)',
        };
    }
}
