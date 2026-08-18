<?php

namespace App\Enums;

enum InterviewType: string
{
    case WAWANCARA = 'wawancara';
    case TES_LISAN = 'tes_lisan';
    case PRAKTIK = 'praktik';
    case STUDI_KASUS = 'studi_kasus';

    public function label(): string
    {
        return match ($this) {
            self::WAWANCARA => 'Wawancara Eksplorasi Portofolio',
            self::TES_LISAN => 'Tes Lisan Penguasaan Konsep',
            self::PRAKTIK => 'Demonstrasi / Ujian Praktik',
            self::STUDI_KASUS => 'Penyelesaian Studi Kasus Terstruktur',
        };
    }
}
