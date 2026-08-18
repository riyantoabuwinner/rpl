<?php

namespace App\Enums;

enum ApplicationStatus: string
{
    case DRAFT = 'draft';
    case TERKIRIM = 'terkirim';
    case VERIFIKASI_ADMINISTRASI = 'verifikasi_administrasi';
    case VALID = 'valid';
    case DITOLAK_ADMINISTRASI = 'ditolak_administrasi';
    case PROSES_ASESMEN = 'proses_asesmen';
    case UJI_PETIK = 'uji_petik';
    case PLENO = 'pleno';
    case DISETUJUI = 'disetujui';
    case DITOLAK = 'ditolak';
    case PENERBITAN_SK = 'penerbitan_sk';
    case SELESAI = 'selesai';
    case SINKRONISASI = 'sinkronisasi';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Draft Formulir',
            self::TERKIRIM => 'Terkirim / Menunggu Verifikasi',
            self::VERIFIKASI_ADMINISTRASI => 'Verifikasi Berkas',
            self::VALID => 'Berkas Valid (Siap Asesmen)',
            self::DITOLAK_ADMINISTRASI => 'Ditolak Administrasi',
            self::PROSES_ASESMEN => 'Proses Asesmen Portofolio',
            self::UJI_PETIK => 'Uji Petik / Wawancara',
            self::PLENO => 'Sidang Pleno Rekognisi',
            self::DISETUJUI => 'Rekomendasi Disetujui',
            self::DITOLAK => 'Ditolak / Wajib Kuliah Reguler',
            self::PENERBITAN_SK => 'Penerbitan SK Rekognisi',
            self::SELESAI => 'SK Selesai Diterbitkan',
            self::SINKRONISASI => 'Sinkronisasi SIAKAD & PDDikti',
        };
    }

    public function badgeColor(): string
    {
        return match ($this) {
            self::DRAFT => 'slate',
            self::TERKIRIM => 'blue',
            self::VERIFIKASI_ADMINISTRASI => 'amber',
            self::VALID => 'emerald',
            self::DITOLAK_ADMINISTRASI, self::DITOLAK => 'red',
            self::PROSES_ASESMEN => 'indigo',
            self::UJI_PETIK => 'purple',
            self::PLENO => 'teal',
            self::DISETUJUI => 'cyan',
            self::PENERBITAN_SK, self::SELESAI => 'emerald',
            self::SINKRONISASI => 'sky',
        };
    }
}
