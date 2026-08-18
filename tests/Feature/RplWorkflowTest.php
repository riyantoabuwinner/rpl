<?php

namespace Tests\Feature;

use App\Enums\ApplicationStatus;
use App\Enums\RecognitionStatus;
use App\Enums\RplType;
use App\Enums\UserRole;
use App\Models\Kurikulum;
use App\Models\MataKuliah;
use App\Models\Prodi;
use App\Models\RplAsesmen;
use App\Models\RplBuktiAsesi;
use App\Models\RplGelombang;
use App\Models\RplKlaimCpmk;
use App\Models\RplPendaftar;
use App\Models\RplPenugasanAsesor;
use App\Models\RplPleno;
use App\Models\RplSkRekognisi;
use App\Models\RplUjiPetik;
use App\Models\RplUjiPetikRubrik;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class RplWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected User $asesi;
    protected User $adminRpl;
    protected User $asesor;
    protected User $kaprodi;
    protected Prodi $prodi;
    protected RplGelombang $gelombang;
    protected MataKuliah $matkul;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');

        // Create Users
        $this->asesi = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'nik' => '3271011508980001',
            'phone' => '081234567890',
            'role' => UserRole::ASESI,
            'password' => Hash::make('password123'),
        ]);

        $this->adminRpl = User::create([
            'name' => 'Admin Pusat RPL',
            'email' => 'admin@kampus.ac.id',
            'nik' => '3271011508980002',
            'phone' => '081234567891',
            'role' => UserRole::ADMIN_RPL,
            'password' => Hash::make('password123'),
        ]);

        $this->asesor = User::create([
            'name' => 'Dr. Evaluator Asesor',
            'email' => 'asesor@kampus.ac.id',
            'nik' => '3271011508980003',
            'phone' => '081234567892',
            'role' => UserRole::ASESOR,
            'password' => Hash::make('password123'),
        ]);

        $this->kaprodi = User::create([
            'name' => 'Prof. Kaprodi TI',
            'email' => 'kaprodi@kampus.ac.id',
            'nik' => '3271011508980004',
            'phone' => '081234567893',
            'role' => UserRole::KAPRODI,
            'password' => Hash::make('password123'),
        ]);

        // Academic Setup
        $this->prodi = Prodi::create([
            'id' => (string) Str::uuid(),
            'kode_prodi' => '55201',
            'nama_prodi' => 'Teknik Informatika',
            'jenjang' => 'S1',
            'fakultas' => 'Fakultas Sains & Teknologi',
            'kaprodi_id' => $this->kaprodi->id,
            'is_active' => true,
        ]);

        $this->gelombang = RplGelombang::create([
            'id' => (string) Str::uuid(),
            'nama_gelombang' => 'Gelombang 1 2026/2027',
            'tahun_akademik' => '2026/2027',
            'semester' => 'Ganjil',
            'tanggal_buka' => now()->subDays(5),
            'tanggal_tutup' => now()->addDays(25),
            'kuota_pendaftar' => 100,
            'biaya_pendaftaran' => 500000,
            'biaya_asesmen_per_sks' => 150000,
            'is_active' => true,
        ]);

        $kurikulum = Kurikulum::create([
            'id' => (string) Str::uuid(),
            'prodi_id' => $this->prodi->id,
            'kode_kurikulum' => 'KUR-TI-2024',
            'nama_kurikulum' => 'Kurikulum Merdeka TI 2024',
            'tahun_mulai' => 2024,
            'is_active' => true,
        ]);

        $this->matkul = MataKuliah::create([
            'id' => (string) Str::uuid(),
            'kurikulum_id' => $kurikulum->id,
            'kode_mk' => 'TI-201',
            'nama_mk' => 'Rekayasa Perangkat Lunak',
            'sks' => 3,
            'semester' => 4,
            'kategori_mk' => 'Wajib Prodi',
            'terbuka_rpl' => true,
        ]);

        // Rubrics
        $rubriks = [
            ['nama_dimensi' => 'Autentisitas Pengalaman', 'bobot_persen' => 25, 'urutan' => 1],
            ['nama_dimensi' => 'Kedalaman Penguasaan Konsep', 'bobot_persen' => 35, 'urutan' => 2],
            ['nama_dimensi' => 'Kemampuan Pemecahan Masalah', 'bobot_persen' => 25, 'urutan' => 3],
            ['nama_dimensi' => 'Kemutakhiran & Etika Profesional', 'bobot_persen' => 15, 'urutan' => 4],
        ];
        foreach ($rubriks as $r) {
            RplUjiPetikRubrik::create(array_merge($r, [
                'id' => (string) Str::uuid(),
                'deskripsi_indikator' => 'Deskripsi ' . $r['nama_dimensi'],
                'is_active' => true,
            ]));
        }
    }

    public function test_full_rpl_lifecycle_from_f02_to_sk_generation(): void
    {
        // 1. Asesi fills Step 1 (Profile)
        $profileResponse = $this->actingAs($this->asesi)->post('/form-f02/profile', [
            'gelombang_id' => $this->gelombang->id,
            'prodi_id' => $this->prodi->id,
            'jenis_rpl' => 'A2',
            'nama_lengkap' => 'Budi Santoso',
            'nik' => '3271011508980001',
            'telepon' => '081234567890',
            'jenis_kelamin' => 'L',
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '1998-05-10',
            'alamat_lengkap' => 'Jl. Kebon Jeruk No. 10',
            'pekerjaan_saat_ini' => 'Senior Developer',
            'instansi_pekerjaan' => 'PT Tech Nusantara',
        ]);
        $profileResponse->assertRedirect();

        $pendaftar = RplPendaftar::where('user_id', $this->asesi->id)->first();
        $this->assertNotNull($pendaftar);
        $this->assertEquals(ApplicationStatus::DRAFT, $pendaftar->status_pendaftaran);

        // 2. Asesi uploads portfolio
        $file = UploadedFile::fake()->create('sertifikat_ahli.pdf', 500, 'application/pdf');
        $uploadResponse = $this->actingAs($this->asesi)->post('/form-f02/bukti', [
            'file' => $file,
            'nama_dokumen' => 'Sertifikat BNSP Software Engineer',
            'jenis_bukti' => 'sertifikat_kompetensi',
            'tahun_penerbitan' => '2024',
            'penerbit_institusi' => 'BNSP LSP Telematika',
            'deskripsi_dokumen' => 'Sertifikasi kompetensi level 6 KKNI.',
        ]);
        $uploadResponse->assertRedirect();

        $bukti = RplBuktiAsesi::where('pendaftar_id', $pendaftar->id)->first();
        $this->assertNotNull($bukti);
        $this->assertNotEmpty($bukti->file_hash);

        // 3. Asesi maps claim to Course CPMK
        $klaimResponse = $this->actingAs($this->asesi)->post('/form-f02/klaim', [
            'mata_kuliah_id' => $this->matkul->id,
            'deskripsi_pengalaman_relevan' => 'Telah memimpin 10+ proyek arsitektur perangkat lunak selama 5 tahun.',
            'tingkat_kemampuan_diri' => 'Sangat Baik',
            'bukti_ids' => [$bukti->id],
        ]);
        $klaimResponse->assertRedirect();

        // 4. Asesi submits Form F-02
        $submitResponse = $this->actingAs($this->asesi)->post('/form-f02/submit');
        $submitResponse->assertRedirect();

        $pendaftar->refresh();
        $this->assertEquals(ApplicationStatus::TERKIRIM, $pendaftar->status_pendaftaran);
        $this->assertNotNull($pendaftar->sla_verifikasi_due_at);

        // 5. Admin Pusat RPL verifies document & assigns Asesor
        $verifyResponse = $this->actingAs($this->adminRpl)->post("/admin/pendaftar/{$pendaftar->id}/verify", [
            'action' => 'valid',
            'asesor_id' => $this->asesor->id,
            'catatan' => 'Berkas terverifikasi lengkap dan sah.',
        ]);
        $verifyResponse->assertRedirect();

        $pendaftar->refresh();
        $this->assertEquals(ApplicationStatus::PROSES_ASESMEN, $pendaftar->status_pendaftaran);
        $this->assertNotNull($pendaftar->sla_asesmen_due_at);

        // 6. Asesor evaluates via Dual-Panel Workspace (VATC & Grade)
        $assessmentResponse = $this->actingAs($this->asesor)->postJson('/asesor/assessment', [
            'pendaftar_id' => $pendaftar->id,
            'mata_kuliah_id' => $this->matkul->id,
            'status_rekognisi' => 'diakui',
            'nilai_rekomendasi' => 'A',
            'nilai_angka' => 4.00,
            'sks_rekomendasi' => 3,
            'is_butuh_uji_petik' => false,
            'is_final' => true,
            'vatc_list' => [
                [
                    'bukti_id' => $bukti->id,
                    'is_valid' => true,
                    'is_asli' => true,
                    'is_terkini' => true,
                    'is_cukup' => true,
                ],
            ],
        ]);
        $assessmentResponse->assertJson(['success' => true]);

        // Asesor finalizes all
        $finalizeResponse = $this->actingAs($this->asesor)->post("/asesor/finalize/{$pendaftar->id}");
        $finalizeResponse->assertRedirect();

        $pendaftar->refresh();
        $this->assertEquals(ApplicationStatus::PLENO, $pendaftar->status_pendaftaran);

        // 7. Sidang Pleno scheduled & legalized
        $plenoResponse = $this->actingAs($this->kaprodi)->post('/pleno', [
            'gelombang_id' => $this->gelombang->id,
            'prodi_id' => $this->prodi->id,
            'nomor_berita_acara' => 'BA-RPL/2026/001',
            'tanggal_sidang' => now()->toDateString(),
            'ruangan_media' => 'Ruang Senat',
            'peserta_ids' => [$this->kaprodi->id, $this->asesor->id],
            'pendaftar_ids' => [$pendaftar->id],
        ]);
        $plenoResponse->assertSessionHasNoErrors();
        $plenoResponse->assertRedirect();

        $pleno = RplPleno::where('nomor_berita_acara', 'BA-RPL/2026/001')->first();
        $legalizeResponse = $this->actingAs($this->kaprodi)->post("/pleno/{$pleno->id}/legalize");
        $legalizeResponse->assertRedirect();

        $pendaftar->refresh();
        $this->assertEquals(ApplicationStatus::PENERBITAN_SK, $pendaftar->status_pendaftaran);

        // 8. Admin RPL / Kaprodi generates official SK Rekognisi
        $skResponse = $this->actingAs($this->adminRpl)->post('/sk-rekognisi/generate', [
            'pendaftar_id' => $pendaftar->id,
            'nomor_sk' => 'SK-RPL/2026/8899',
            'tanggal_sk' => now()->toDateString(),
            'pejabat_nama' => 'Prof. Dr. H. M. Zainuri, M.Kom.',
            'pejabat_jabatan' => 'Wakil Rektor Bidang Akademik',
            'pejabat_nip' => '197204151998031002',
        ]);
        $skResponse->assertRedirect();

        $pendaftar->refresh();
        $this->assertEquals(ApplicationStatus::SELESAI, $pendaftar->status_pendaftaran);
        $this->assertEquals(3, $pendaftar->total_sks_diakui);
        $this->assertEquals(4.00, $pendaftar->ipk_rekognisi);

        $sk = RplSkRekognisi::where('nomor_sk', 'SK-RPL/2026/8899')->first();
        $this->assertNotNull($sk);
        $this->assertNotEmpty($sk->qr_token);
        $this->assertNotEmpty($sk->document_hash);

        // 9. Public QR Verification endpoint test
        $verifyPublic = $this->get("/verify/{$sk->qr_token}");
        $verifyPublic->assertStatus(200);
    }
}
