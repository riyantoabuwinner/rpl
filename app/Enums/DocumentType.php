<?php

namespace App\Enums;

enum DocumentType: string
{
    case RIWAYAT_PEKERJAAN_PENDIDIKAN = 'riwayat_pekerjaan_pendidikan';
    case SERTIFIKAT_KOMPETENSI = 'sertifikat_kompetensi';
    case SERTIFIKAT_LISENSI = 'sertifikat_lisensi';
    case FOTO_VIDEO_KEGIATAN = 'foto_video_kegiatan';
    case BUKU_HARIAN_REFLEKSI = 'buku_harian_refleksi';
    case LEMBAR_TUGAS_KERJA = 'lembar_tugas_kerja';
    case DOKUMEN_ANALISIS_PERANCANGAN = 'dokumen_analisis_perancangan';
    case LOGBOOK_KEGIATAN = 'logbook_kegiatan';
    case CATATAN_PELATIHAN = 'catatan_pelatihan';
    case KEANGGOTAAN_PROFESI = 'keanggotaan_profesi';
    case SURAT_VERIFIKASI_PIHAK_KETIGA = 'surat_verifikasi_pihak_ketiga';
    case PENGHARGAAN_PRESTASI = 'penghargaan_prestasi';
    case PENILAIAN_KINERJA = 'penilaian_kinerja';

    // Legacy aliases for backward compatibility
    case SERTIFIKAT_PELATIHAN = 'sertifikat_pelatihan';
    case SK_JABATAN = 'sk_jabatan';
    case PORTOFOLIO_KARYA = 'portofolio_karya';
    case TRANSKRIP_NILAI = 'transkrip_nilai';
    case SILABUS_KULIAH = 'silabus_kuliah';
    case SURAT_REKOMENDASI = 'surat_rekomendasi';
    case DOKUMEN_LAINNYA = 'dokumen_lainnya';

    public function label(): string
    {
        return match ($this) {
            self::RIWAYAT_PEKERJAAN_PENDIDIKAN => '1. Riwayat Pekerjaan / Pendidikan',
            self::SERTIFIKAT_KOMPETENSI => '2. Sertifikat Kompetensi',
            self::SERTIFIKAT_LISENSI => '3. Sertifikat Lisensi / Pengoperasian',
            self::FOTO_VIDEO_KEGIATAN => '4. Foto / Video Kegiatan',
            self::BUKU_HARIAN_REFLEKSI => '5. Buku Harian / Jurnal Refleksi',
            self::LEMBAR_TUGAS_KERJA => '6. Lembar Tugas / Lembar Kerja',
            self::DOKUMEN_ANALISIS_PERANCANGAN => '7. Dokumen Analisis / Perancangan',
            self::LOGBOOK_KEGIATAN => '8. Logbook Kegiatan Layanan',
            self::CATATAN_PELATIHAN => '9. Catatan Pelatihan',
            self::KEANGGOTAAN_PROFESI => '10. Keanggotaan Asosiasi Profesi',
            self::SURAT_VERIFIKASI_PIHAK_KETIGA => '11. Surat Verifikasi Pihak Ketiga',
            self::PENGHARGAAN_PRESTASI => '12. Penghargaan / Prestasi',
            self::PENILAIAN_KINERJA => '13. Penilaian Kinerja',
            self::SERTIFIKAT_PELATIHAN => 'Sertifikat Pelatihan',
            self::SK_JABATAN => 'Surat Keputusan / Jabatan',
            self::PORTOFOLIO_KARYA => 'Portofolio Karya Proyek',
            self::TRANSKRIP_NILAI => 'Transkrip Nilai Akademik',
            self::SILABUS_KULIAH => 'Silabus / Rencana Pembelajaran',
            self::SURAT_REKOMENDASI => 'Surat Rekomendasi Atasan',
            self::DOKUMEN_LAINNYA => 'Dokumen Pendukung Lainnya',
        };
    }
}
