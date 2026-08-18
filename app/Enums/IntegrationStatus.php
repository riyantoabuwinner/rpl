<?php

namespace App\Enums;

enum IntegrationStatus: string
{
    case PENDING = 'pending';
    case PROCESSING = 'processing';
    case SUCCESS = 'success';
    case FAILED = 'failed';
    case RETRYING = 'retrying';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Menunggu Antrean (Pending)',
            self::PROCESSING => 'Sedang Diproses (Processing)',
            self::SUCCESS => 'Berhasil Terinjeksi (Success)',
            self::FAILED => 'Gagal Sinkronisasi (Failed)',
            self::RETRYING => 'Mencoba Ulang (Retrying)',
        };
    }
}
