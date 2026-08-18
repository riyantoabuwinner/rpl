<?php

namespace App\Enums;

enum RecognitionStatus: string
{
    case DIREKOGNISI_PENUH = 'direkognisi_penuh';
    case DIREKOGNISI_SEBAGIAN = 'direkognisi_sebagian';
    case ASESMEN_LANJUTAN = 'asesmen_lanjutan';
    case TIDAK_DIREKOGNISI = 'tidak_direkognisi';

    // Aliases
    case DIAKUI = 'diakui';
    case DITOLAK = 'ditolak';
    case UJI_PETIK = 'uji_petik';
    case BELUM_DINILAI = 'belum_dinilai';

    public function label(): string
    {
        return match ($this) {
            self::DIREKOGNISI_PENUH, self::DIAKUI => 'Direkognisi (Penuh)',
            self::DIREKOGNISI_SEBAGIAN => 'Direkognisi Sebagian',
            self::ASESMEN_LANJUTAN, self::UJI_PETIK => 'Asesmen Lanjutan (Uji Petik)',
            self::TIDAK_DIREKOGNISI, self::DITOLAK => 'Tidak Direkognisi',
            self::BELUM_DINILAI => 'Belum Dinilai',
        };
    }

    public function badgeColor(): string
    {
        return match ($this) {
            self::DIREKOGNISI_PENUH, self::DIAKUI => 'emerald',
            self::DIREKOGNISI_SEBAGIAN => 'blue',
            self::ASESMEN_LANJUTAN, self::UJI_PETIK => 'purple',
            self::TIDAK_DIREKOGNISI, self::DITOLAK => 'red',
            self::BELUM_DINILAI => 'slate',
        };
    }
}
