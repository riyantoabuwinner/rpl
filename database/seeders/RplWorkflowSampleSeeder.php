<?php

namespace Database\Seeders;

use App\Enums\ApplicationStatus;
use App\Enums\DocumentType;
use App\Enums\RecognitionStatus;
use App\Enums\RplType;
use App\Models\MataKuliah;
use App\Models\Prodi;
use App\Models\RplAsesmen;
use App\Models\RplAsesmenVatc;
use App\Models\RplBuktiAsesi;
use App\Models\RplBuktiMetadata;
use App\Models\RplGelombang;
use App\Models\RplKlaimCpmk;
use App\Models\RplPendaftar;
use App\Models\RplPendidikan;
use App\Models\RplPengalaman;
use App\Models\RplPenugasanAsesor;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RplWorkflowSampleSeeder extends Seeder
{
    public function run(): void
    {
        $gelombang = RplGelombang::first();
        $prodi = Prodi::where('kode_prodi', '55201')->first();
        $userAsesi1 = User::where('email', 'asesi.ahmad@example.com')->first();
        $userAsesi2 = User::where('email', 'asesi.rina@example.com')->first();
        $asesor1 = User::where('email', 'asesor1@kampus.ac.id')->first();
        $adminRpl = User::where('email', 'adminrpl@kampus.ac.id')->first();

        // 1. Pendaftar 1: Ahmad Fauzi (RPL A2)
        $pendaftar1 = RplPendaftar::firstOrCreate(
            ['nomor_pendaftaran' => 'RPL-2026-0001'],
            [
                'id' => (string) Str::uuid(),
                'user_id' => $userAsesi1->id,
                'gelombang_id' => $gelombang->id,
                'prodi_id' => $prodi->id,
                'nama_lengkap' => 'Ahmad Fauzi',
                'nik' => '3271011508980008',
                'email' => 'asesi.ahmad@example.com',
                'telepon' => '085712345678',
                'jenis_kelamin' => 'L',
                'tempat_lahir' => 'Bandung',
                'tanggal_lahir' => '1998-08-15',
                'alamat_lengkap' => 'Jl. Dago Asri No. 42, Kota Bandung, Jawa Barat',
                'pekerjaan_saat_ini' => 'Senior Backend Engineer & Software Architect',
                'instansi_pekerjaan' => 'PT Teknologi Nusantara Solusindo',
                'jenis_rpl' => RplType::A2,
                'status_pendaftaran' => ApplicationStatus::PROSES_ASESMEN,
                'tanggal_submit' => now()->subDays(4),
                'sla_verifikasi_due_at' => now()->subDays(1),
                'sla_asesmen_due_at' => now()->addDays(3),
                'tanggal_verifikasi' => now()->subDays(2),
                'verifikator_id' => $adminRpl?->id,
                'catatan_verifikasi' => 'Berkas administrasi dan KTP telah terverifikasi valid dan sesuai persyaratan.',
                'total_sks_diakui' => 6,
                'total_nilai_angka' => 4.00,
                'ipk_rekognisi' => 4.00,
            ]
        );

        // Pendidikan
        RplPendidikan::create([
            'id' => (string) Str::uuid(),
            'pendaftar_id' => $pendaftar1->id,
            'jenjang' => 'SMK / Kejuruan',
            'nama_institusi' => 'SMK Negeri 1 Cimahi',
            'jurusan' => 'Rekayasa Perangkat Lunak',
            'nomor_ijazah' => 'DN-01/M-SMK/16/0012345',
            'tahun_lulus' => '2016',
            'ipk_nilai_akhir' => 88.50,
        ]);

        // Pengalaman Kerja
        RplPengalaman::create([
            'id' => (string) Str::uuid(),
            'pendaftar_id' => $pendaftar1->id,
            'nama_instansi' => 'PT Solusi Awan Digital',
            'jabatan_posisi' => 'Fullstack Web Developer',
            'tanggal_mulai' => '2016-08-01',
            'tanggal_selesai' => '2020-12-31',
            'is_masih_bekerja' => false,
            'deskripsi_tugas_kunci' => 'Membangun aplikasi web sistem informasi akademik dan integrasi REST API pembayaran online.',
        ]);

        RplPengalaman::create([
            'id' => (string) Str::uuid(),
            'pendaftar_id' => $pendaftar1->id,
            'nama_instansi' => 'PT Teknologi Nusantara Solusindo',
            'jabatan_posisi' => 'Senior Backend Engineer',
            'tanggal_mulai' => '2021-01-01',
            'tanggal_selesai' => null,
            'is_masih_bekerja' => true,
            'deskripsi_tugas_kunci' => 'Memimpin tim perancangan arsitektur microservices, high-traffic database indexing, dan CI/CD pipeline.',
        ]);

        // Bukti Dokumen Portofolio
        $sampleHash1 = hash('sha256', 'sample_content_sertifikat_bnsp_2024');
        $bukti1 = RplBuktiAsesi::create([
            'id' => (string) Str::uuid(),
            'pendaftar_id' => $pendaftar1->id,
            'nama_dokumen' => 'Sertifikat Kompetensi Software Architect BNSP.pdf',
            'jenis_bukti' => DocumentType::SERTIFIKAT_KOMPETENSI,
            'file_path' => 'private/rpl/portofolio/sample_sertifikat_bnsp_2024.pdf',
            'file_original_name' => 'Sertifikat_BNSP_Ahmad_Fauzi.pdf',
            'file_hash' => $sampleHash1,
            'file_size' => 1048576, // 1 MB
            'mime_type' => 'application/pdf',
            'tahun_penerbitan' => '2023',
            'penerbit_institusi' => 'Lembaga Sertifikasi Profesi (LSP) Telematika BNSP',
            'deskripsi_dokumen' => 'Sertifikasi kompetensi nasional tingkat Madya bidang Rekayasa Perangkat Lunak dan Arsitektur Sistem.',
            'is_potential_duplicate' => false,
        ]);

        RplBuktiMetadata::create([
            'id' => (string) Str::uuid(),
            'bukti_id' => $bukti1->id,
            'author' => 'LSP Telematika Indonesia',
            'creator_tool' => 'Adobe Acrobat Pro 2023',
            'producer' => 'Adobe PDF Library 23.1',
            'pdf_creation_date' => now()->subMonths(18),
            'pdf_modification_date' => now()->subMonths(18),
            'is_metadata_suspicious' => false,
            'analisis_risiko' => 'Metadata valid dan konsisten dengan tanggal sertifikasi.',
        ]);

        $sampleHash2 = hash('sha256', 'sample_content_sk_jabatan_2021');
        $bukti2 = RplBuktiAsesi::create([
            'id' => (string) Str::uuid(),
            'pendaftar_id' => $pendaftar1->id,
            'nama_dokumen' => 'Surat Pengangkatan & Portfolio Proyek Microservices.pdf',
            'jenis_bukti' => DocumentType::SK_JABATAN,
            'file_path' => 'private/rpl/portofolio/sample_sk_jabatan.pdf',
            'file_original_name' => 'SK_Senior_Backend_Ahmad.pdf',
            'file_hash' => $sampleHash2,
            'file_size' => 2097152, // 2 MB
            'mime_type' => 'application/pdf',
            'tahun_penerbitan' => '2022',
            'penerbit_institusi' => 'PT Teknologi Nusantara Solusindo',
            'deskripsi_dokumen' => 'Surat Keputusan Pengangkatan Senior Engineer dan dokumentasi arsitektur sistem high load.',
            'is_potential_duplicate' => false,
        ]);

        // Klaim CPMK untuk Mata Kuliah IF302 (Rekayasa Perangkat Lunak) & IF201 (Basis Data)
        $mkRpl = MataKuliah::where('kode_mk', 'IF302')->first();
        $mkDb = MataKuliah::where('kode_mk', 'IF201')->first();
        $mkWeb = MataKuliah::where('kode_mk', 'IF204')->first();

        $cpmkRpl1 = $mkRpl?->cpmk()->first();
        $indRpl1 = $cpmkRpl1?->indikator()->first();

        $klaim1 = RplKlaimCpmk::create([
            'id' => (string) Str::uuid(),
            'pendaftar_id' => $pendaftar1->id,
            'mata_kuliah_id' => $mkRpl->id,
            'cpmk_id' => $cpmkRpl1?->id,
            'indikator_cpmk_id' => $indRpl1?->id,
            'deskripsi_pengalaman_relevan' => 'Memiliki pengalaman 6+ tahun merancang arsitektur sistem enterprise, menyusun SRS, serta memimpin implementasi clean architecture pada 5 platform web skala nasional.',
            'tingkat_kemampuan_diri' => 'Sangat Baik',
        ]);
        $klaim1->bukti()->attach([$bukti1->id, $bukti2->id]);

        $cpmkDb1 = $mkDb?->cpmk()->first();
        $indDb1 = $cpmkDb1?->indikator()->first();

        $klaim2 = RplKlaimCpmk::create([
            'id' => (string) Str::uuid(),
            'pendaftar_id' => $pendaftar1->id,
            'mata_kuliah_id' => $mkDb->id,
            'cpmk_id' => $cpmkDb1?->id,
            'indikator_cpmk_id' => $indDb1?->id,
            'deskripsi_pengalaman_relevan' => 'Berpengalaman mendesain skema database terdistribusi, query tuning, indexing 10 juta+ records, dan arsitektur redis cache.',
            'tingkat_kemampuan_diri' => 'Sangat Baik',
        ]);
        $klaim2->bukti()->attach([$bukti2->id]);

        // Penugasan Asesor ke Dr. Ahmad Dahlan
        $penugasan = RplPenugasanAsesor::create([
            'id' => (string) Str::uuid(),
            'pendaftar_id' => $pendaftar1->id,
            'asesor_id' => $asesor1->id,
            'ditugaskan_oleh_id' => $adminRpl?->id,
            'tanggal_penugasan' => now()->subDays(2),
            'status_penugasan' => 'sedang_dinilai',
            'catatan_admin' => 'Mohon evaluasi mendalam portofolio terkait pengalaman industri arsitektur sistem.',
        ]);

        // Lembar Kerja Asesmen Asesor (Form F-03)
        $asesmen1 = RplAsesmen::create([
            'id' => (string) Str::uuid(),
            'penugasan_id' => $penugasan->id,
            'pendaftar_id' => $pendaftar1->id,
            'mata_kuliah_id' => $mkRpl->id,
            'asesor_id' => $asesor1->id,
            'status_rekognisi' => RecognitionStatus::DIAKUI,
            'nilai_rekomendasi' => 'A',
            'nilai_angka' => 4.00,
            'sks_rekomendasi' => 3,
            'is_butuh_uji_petik' => false,
            'catatan_asesor' => 'Portofolio sangat lengkap, sertifikat BNSP valid dan mutakhir, karya arsitektur memenuhi seluruh CPMK Rekayasa Perangkat Lunak.',
            'catatan_internal' => 'Bukti terverifikasi autentik melalui checksum SHA-256 dan metadata institusi penerbit.',
            'is_final' => true,
            'finalized_at' => now()->subHours(5),
        ]);

        RplAsesmenVatc::create([
            'id' => (string) Str::uuid(),
            'asesmen_id' => $asesmen1->id,
            'bukti_id' => $bukti1->id,
            'is_valid' => true,
            'is_asli' => true,
            'is_terkini' => true,
            'is_cukup' => true,
            'catatan_evaluasi' => 'Sertifikat kompetensi nasional terakreditasi BNSP tahun 2023, kompetensi sangat relevan dengan CPMK-1 & CPMK-2.',
        ]);

        // 2. Pendaftar 2: Rina Wulandari (RPL A1)
        RplPendaftar::create([
            'id' => (string) Str::uuid(),
            'user_id' => $userAsesi2->id,
            'gelombang_id' => $gelombang->id,
            'prodi_id' => $prodi->id,
            'nomor_pendaftaran' => 'RPL-2026-0002',
            'nama_lengkap' => 'Rina Wulandari',
            'nik' => '3271012509990009',
            'email' => 'asesi.rina@example.com',
            'telepon' => '085787654321',
            'jenis_kelamin' => 'P',
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '1999-09-25',
            'alamat_lengkap' => 'Jl. Tebet Barat Raya No. 18, Jakarta Selatan',
            'pekerjaan_saat_ini' => 'Junior System Analyst',
            'instansi_pekerjaan' => 'PT Mitra Integrasi Prima',
            'jenis_rpl' => RplType::A1,
            'status_pendaftaran' => ApplicationStatus::VERIFIKASI_ADMINISTRASI,
            'tanggal_submit' => now()->subDays(1),
            'sla_verifikasi_due_at' => now()->addDays(2),
            'sla_asesmen_due_at' => null,
            'total_sks_diakui' => 0,
            'total_nilai_angka' => 0.00,
            'ipk_rekognisi' => 0.00,
        ]);
    }
}
