<?php

namespace Database\Seeders;

use App\Models\RplGelombang;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RplGelombangSeeder extends Seeder
{
    public function run(): void
    {
        RplGelombang::firstOrCreate(
            ['nama_gelombang' => 'Penerimaan RPL Semester Ganjil 2026/2027'],
            [
                'id' => (string) Str::uuid(),
                'tahun_akademik' => '2026/2027',
                'semester' => 'Ganjil',
                'tanggal_buka' => '2026-08-01',
                'tanggal_tutup' => '2026-09-30',
                'tanggal_pengumuman' => '2026-10-15',
                'biaya_pendaftaran' => 500000.00,
                'biaya_asesmen_per_sks' => 150000.00,
                'kuota_pendaftar' => 150,
                'is_active' => true,
                'catatan_panduan' => 'Pendaftaran terbuka untuk Jalur RPL Tipe A1 (Transfer Kredit D3/Pindahan) dan Tipe A2 (Perolehan Kredit Pengalaman Kerja). Pastikan bukti portofolio telah di-scan dalam format PDF beresolusi jelas.',
            ]
        );
    }
}
