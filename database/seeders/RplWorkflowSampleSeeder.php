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

        // 3. Pendaftar 3: Toheri (Tadris Matematika - Form 2/F02 & Form 3/F03 UIN SSC)
        $userToheri = User::where('email', 'toheri@uinssc.ac.id')->first();
        $prodiTmt = Prodi::where('kode_prodi', 'TMT')->first();
        $mkKalkulusDiff = MataKuliah::where('kode_mk', 'TMT625006')->first();
        $mkKalkulusInt = MataKuliah::where('kode_mk', 'TMT625015')->first();

        if ($userToheri && $prodiTmt) {
            $pendaftarToheri = RplPendaftar::create([
                'id' => (string) Str::uuid(),
                'user_id' => $userToheri->id,
                'gelombang_id' => $gelombang->id,
                'prodi_id' => $prodiTmt->id,
                'nomor_pendaftaran' => 'RPL-2026-0003',
                'nama_lengkap' => 'TOHERI',
                'nik' => '3213011607730001',
                'email' => 'toheri@uinssc.ac.id',
                'telepon' => '081320741803',
                'telepon_rumah' => '0260-412345',
                'telepon_kantor' => '0231-481264',
                'jenis_kelamin' => 'L',
                'status_pernikahan' => 'Menikah',
                'kebangsaan' => 'INDONESIA',
                'tempat_lahir' => 'CIREBON',
                'tanggal_lahir' => '1973-07-16',
                'alamat_lengkap' => 'DS. BALINGBING',
                'rt_rw' => '016/004',
                'kecamatan' => 'PAGADEN BARAT',
                'kabupaten_kota' => 'KAB. SUBANG',
                'kode_pos' => '42152',
                'pekerjaan_saat_ini' => 'Pengajar / Praktisi Matematika',
                'instansi_pekerjaan' => 'Lembaga Pendidikan & Pelatihan Sains',
                'jenis_rpl' => RplType::A2,
                'status_pendaftaran' => ApplicationStatus::PROSES_ASESMEN,
                'tanggal_submit' => now()->subDays(2),
                'sla_verifikasi_due_at' => now()->subDays(1),
                'sla_asesmen_due_at' => now()->addDays(5),
                'tanggal_verifikasi' => now()->subDay(),
                'verifikator_id' => $adminRpl?->id,
                'catatan_verifikasi' => 'Berkas pendaftaran Form 2/F02 dan Form 3/F03 lengkap.',
                'total_sks_diakui' => 6,
                'total_nilai_angka' => 4.00,
                'ipk_rekognisi' => 4.00,
            ]);

            // Pendidikan Toheri
            RplPendidikan::create([
                'id' => (string) Str::uuid(),
                'pendaftar_id' => $pendaftarToheri->id,
                'jenjang' => 'SMA',
                'nama_institusi' => 'SMAN 2 CIREBON',
                'jurusan' => 'IPA',
                'tahun_lulus' => '1992',
            ]);

            // Pengalaman Toheri
            RplPengalaman::create([
                'id' => (string) Str::uuid(),
                'pendaftar_id' => $pendaftarToheri->id,
                'nama_instansi' => 'Pusat Bimbingan Belajar Cirebon & Subang',
                'jabatan_posisi' => 'Tutor Senior Kalkulus & Matematika Diskrit',
                'tanggal_mulai' => '2010-01-01',
                'tanggal_selesai' => null,
                'is_masih_bekerja' => true,
                'deskripsi_tugas_kunci' => 'Mengajar dan membimbing mahasiswa dalam pemecahan masalah turunan, integral, limit, dan transformasi fungsi berbantuan software GeoGebra.',
            ]);

            // Bukti Portofolio Toheri
            $buktiToheri1 = RplBuktiAsesi::create([
                'id' => (string) Str::uuid(),
                'pendaftar_id' => $pendaftarToheri->id,
                'nama_dokumen' => 'Transkrip Nilai Akademik & Modul Kalkulus',
                'jenis_bukti' => DocumentType::CATATAN_PELATIHAN,
                'file_path' => 'portofolio/toheri_transkrip.pdf',
                'file_original_name' => 'toheri_transkrip.pdf',
                'file_hash' => hash('sha256', 'sample_transkrip_toheri'),
                'file_size' => 1024 * 350,
                'mime_type' => 'application/pdf',
                'tahun_penerbitan' => '2023',
                'penerbit_institusi' => 'Lembaga Pendidikan Matematika Terapan',
                'deskripsi_dokumen' => 'Transkrip nilai pelatihan dan modul pembelajaran materi Kalkulus Differensial dan Integral.',
            ]);

            $buktiToheri2 = RplBuktiAsesi::create([
                'id' => (string) Str::uuid(),
                'pendaftar_id' => $pendaftarToheri->id,
                'nama_dokumen' => 'Surat Keterangan Tutor & Asisten Praktikum Kalkulus',
                'jenis_bukti' => DocumentType::SURAT_VERIFIKASI_PIHAK_KETIGA,
                'file_path' => 'portofolio/toheri_sk_tutor.pdf',
                'file_original_name' => 'toheri_sk_tutor.pdf',
                'file_hash' => hash('sha256', 'sample_sk_tutor_toheri'),
                'file_size' => 1024 * 220,
                'mime_type' => 'application/pdf',
                'tahun_penerbitan' => '2024',
                'penerbit_institusi' => 'Pusat Bimbingan Belajar Cirebon',
                'deskripsi_dokumen' => 'Surat rekomendasi dan verifikasi pengalaman menjadi tutor kalkulus integral dan diferensial selama 10 tahun.',
            ]);

            // Klaim MK
            if ($mkKalkulusDiff) {
                $klaimDiff = RplKlaimCpmk::create([
                    'id' => (string) Str::uuid(),
                    'pendaftar_id' => $pendaftarToheri->id,
                    'mata_kuliah_id' => $mkKalkulusDiff->id,
                    'jenis_pengajuan' => 'transfer_sks',
                    'deskripsi_pengalaman_relevan' => 'Memiliki kompetensi mendalam mengenai fungsi aljabar, limit fungsi, turunan polinom dan trigonometri, serta aplikasi software GeoGebra.',
                    'tingkat_kemampuan_diri' => 'Sangat Baik',
                ]);
                $klaimDiff->bukti()->sync([$buktiToheri1->id, $buktiToheri2->id]);
            }

            if ($mkKalkulusInt) {
                $klaimInt = RplKlaimCpmk::create([
                    'id' => (string) Str::uuid(),
                    'pendaftar_id' => $pendaftarToheri->id,
                    'mata_kuliah_id' => $mkKalkulusInt->id,
                    'jenis_pengajuan' => 'perolehan_sks',
                    'deskripsi_pengalaman_relevan' => 'Berpengalaman 10 tahun sebagai tutor materi integral tentu, anti turunan, dan volume benda putar.',
                    'tingkat_kemampuan_diri' => 'Sangat Baik',
                ]);
                $klaimInt->bukti()->sync([$buktiToheri1->id, $buktiToheri2->id]);
            }

            // Form 3/F03 Evaluasi Diri Items (Kalkulus Differensial)
            if ($mkKalkulusDiff) {
                $f03DiffItems = [
                    'mampu menganalisis domain, range, grafik, dan karakteristik Fungsi berdasarkan grafiknya untuk persamaan linear, kuadrat, kubik, pecahan, akar dan trigonometri dasar secara mandiri.',
                    'Mampu menentukan keputusan hasil transformasi Fungsi berupa refleksi, rotasi, dilatasi, komposisi fungsi secara manual dan menggunakan software.',
                    'mampu menggunakan definisi Limit Fungsi secara intuitif dan formal, menggunakan Sifat-Sifat Limit Fungsi secara tepat sesuai dengan jenis fungsi secara manual dan menggunakan software geogebra.',
                    'Mampu membuktikan nilai limit secara intuisi dan formal serta menentukan penyelesaian yang berkaitan dengan Limit Fungsi Trigonometri dasar secara aljabar dan menggunakan software.',
                    'Menganalisis Teorema-teorema dan sifat-sifat yang tepat untuk menentukan nilai limit fungsi yang diberikan dan menggunakan geogebra untuk penentuan nilai limit.',
                    'Mampu menganalisis kesamaan ide Pendekatan sebagai landasan dalam mendefinisikan Turunan untuk menentukan turunan dari sebuah fungsi serta merepresentasikan melalui geogebra.',
                    'Mampu mengidentifikasi dan membuktikan beberapa Sifat-sifat turunan Fungsi serta mengilustrasikan melalui aplikasi geogebra.',
                    'Mampu membuktikan dan menggunakan teorema-teorema turunan dalam rangka menyelesaikan permasalahan turunan fungsi secara manual dan berbantuan geogebra.',
                    'Mampu memutuskan penyelesaian dari permasalah yang melibatkan turunan untuk menentukan nilai maksimum dan minimum fungsi polinom dan pecahan secara manual dan geogebra.',
                    'Mampu memutuskan prosedur yang tepat dalam menggunakan turunan untuk menemukan solusi dari masalah praktis yang dihadapi.',
                    'Mampu menganalisis kecenderungan nilai limit di ketakhinggaan, takhingga, dan menggunakannya untuk menentukan jenis Asimtot dari sebuah fungsi dan mengilustrasikannya melalui geogebra.',
                    'Mampu menganalisis perilaku grafik yang memiliki Kemonotonan dan kecekungan melalui turunan pertama dan kedua serta mengamati pola grafik yang dibuat melalui geogebra.',
                    'Mampu menganalisis grafik secara tepat dengan menggunakan Turunan dan geogebra untuk fungsi polinom dan trigonometri serta campurannya.',
                ];

                foreach ($f03DiffItems as $idx => $pernyataan) {
                    \App\Models\RplEvaluasiDiriCpmk::create([
                        'id' => (string) Str::uuid(),
                        'pendaftar_id' => $pendaftarToheri->id,
                        'mata_kuliah_id' => $mkKalkulusDiff->id,
                        'nomor_urut' => $idx + 1,
                        'pernyataan_cpmk' => $pernyataan,
                        'profisiensi' => ($idx === 4 || $idx === 12) ? 'baik' : 'sangat_baik',
                        'is_valid' => true,
                        'is_autentik' => true,
                        'is_terkini' => true,
                        'is_memadai' => true,
                        'nomor_dokumen' => 'Dok. 1',
                        'jenis_dokumen' => 'Transkrip sementara',
                    ]);
                }
            }

            // Form 3/F03 Evaluasi Diri Items (Kalkulus Integral)
            if ($mkKalkulusInt) {
                $f03IntItems = [
                    'Mampu menganalisis berbagai bentuk anti turunan dari fungsi integran fungsi aljabar secara mandiri.',
                    'Mampu menyelesaikan permasalahan yang berkaitan dengan notasi sigma berdasarkan sifat-sifatnya secara manual dan menggunakan software geogebra.',
                    'Mampu menganalisis perbedaan luas polygon dalam dan polygon luar untuk mendekati luas daerah dibawah kurva dengan batas tertentu secara manual dan software geogebra.',
                    'Mampu menganalisis jumlah Riemann untuk mendefinisikan definisi integral tentu dan sifat-sifatnya.',
                    'Mampu menganalisis jumlah Riemann untuk mendefinisikan definisi integral tentu dan sifat-sifatnya.',
                    'Mampu menggunakan aplikasi integral dalam menyelesaikan permasalahan luas daerah bidang datar untuk berbagai bentuk daerah.',
                    'Trampil dalam mengaplikasikan integral untuk volume dengan menggunakan metode yang tepat dan sesuai baik secara manual dan geogebra.',
                    'Trampil dalam menyelesaikan permasalahan berkaitan dengan Aplikasi integral untuk panjang kurva dan luas permukaan.',
                    'Mampu menyelesaikan permasalahan turunan dan integral untuk Fungsi transenden logaritma dan eksponen secara manual dan atau menggunakan geogebra.',
                    'Mampu menyelesaikan permasalahan turunan dan integral untuk Fungsi transenden logaritma dan eksponen secara manual dan atau menggunakan geogebra.',
                    'Trampil memilih secara tepat Teknik pengintegralan substitusi dan merasionalkan sesuai dengan karakteristik fungsi integrannya.',
                    'Trampil memilih secara tepat Teknik Pengintegralan parsial dan fungsi rasional sesuai dengan karakteristik fungsi integrannya.',
                ];

                foreach ($f03IntItems as $idx => $pernyataan) {
                    \App\Models\RplEvaluasiDiriCpmk::create([
                        'id' => (string) Str::uuid(),
                        'pendaftar_id' => $pendaftarToheri->id,
                        'mata_kuliah_id' => $mkKalkulusInt->id,
                        'nomor_urut' => $idx + 1,
                        'pernyataan_cpmk' => $pernyataan,
                        'profisiensi' => ($idx === 4) ? 'baik' : 'sangat_baik',
                        'is_valid' => true,
                        'is_autentik' => true,
                        'is_terkini' => true,
                        'is_memadai' => true,
                        'nomor_dokumen' => ($idx % 2 === 0) ? 'Dok. 1' : 'Dok. 2',
                        'jenis_dokumen' => ($idx % 2 === 0) ? 'Menjadi tutor MK Kalkulus Integral' : 'Menjadi asisten praktikum MK Kalkulus Integral',
                    ]);
                }
            }
        }
    }
}
