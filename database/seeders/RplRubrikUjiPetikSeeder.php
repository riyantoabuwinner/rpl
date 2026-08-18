<?php

namespace Database\Seeders;

use App\Models\RplUjiPetikRubrik;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RplRubrikUjiPetikSeeder extends Seeder
{
    public function run(): void
    {
        $rubrik = [
            [
                'nama_dimensi' => 'Autentisitas Pengalaman',
                'deskripsi_indikator' => 'Asesi mampu menceritakan secara rinci kronologi, konteks, dan peran spesifiknya dalam proyek/pekerjaan yang tertulis pada portofolio.',
                'bobot_persen' => 25.00,
                'urutan' => 1,
            ],
            [
                'nama_dimensi' => 'Kedalaman Penguasaan Konsep (Kognitif)',
                'deskripsi_indikator' => 'Asesi mampu menjelaskan landasan teori, metodologi, dan alasan teknis di balik keputusan kerja yang diambil pada masa lalu.',
                'bobot_persen' => 35.00,
                'urutan' => 2,
            ],
            [
                'nama_dimensi' => 'Kemampuan Pemecahan Masalah (Psikomotor)',
                'deskripsi_indikator' => 'Asesi mampu merespons studi kasus spontan atau mendemonstrasikan langkah teknis pemecahan masalah secara terstruktur.',
                'bobot_persen' => 25.00,
                'urutan' => 3,
            ],
            [
                'nama_dimensi' => 'Kemutakhiran & Etika Profesional',
                'deskripsi_indikator' => 'Asesi memahami standar industri terkini, etika profesi, serta batasan kualifikasi dari pekerjaan yang pernah dilakukannya.',
                'bobot_persen' => 15.00,
                'urutan' => 4,
            ],
        ];

        foreach ($rubrik as $r) {
            RplUjiPetikRubrik::firstOrCreate(
                ['nama_dimensi' => $r['nama_dimensi']],
                array_merge($r, [
                    'id' => (string) Str::uuid(),
                    'is_active' => true,
                ])
            );
        }
    }
}
