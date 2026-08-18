<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Kurikulum;
use App\Models\MataKuliah;
use App\Models\Prodi;
use App\Models\RplEvaluasiDiriCpmk;
use App\Models\RplGelombang;
use App\Models\RplPendaftar;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class FormF03Test extends TestCase
{
    use RefreshDatabase;

    public function test_asesi_can_save_evaluasi_diri_cpmk_f03(): void
    {
        $asesi = User::factory()->create(['role' => UserRole::ASESI]);
        $prodi = Prodi::create([
            'id' => (string) Str::uuid(),
            'kode_prodi' => 'TMT',
            'nama_prodi' => 'Tadris Matematika',
            'jenjang' => 'S1',
        ]);
        $gelombang = RplGelombang::create([
            'id' => (string) Str::uuid(),
            'tahun_akademik' => '2026/2027',
            'semester' => 'Ganjil',
            'nomor_gelombang' => 1,
            'nama_gelombang' => 'Gelombang 1 Ganjil',
            'tanggal_buka' => now()->subDays(5),
            'tanggal_tutup' => now()->addDays(30),
            'is_active' => true,
        ]);
        $pendaftar = RplPendaftar::create([
            'id' => (string) Str::uuid(),
            'user_id' => $asesi->id,
            'gelombang_id' => $gelombang->id,
            'prodi_id' => $prodi->id,
            'nomor_pendaftaran' => 'RPL-2026-0001',
            'nama_lengkap' => 'Toheri',
            'nik' => '3213011607730001',
            'email' => $asesi->email,
            'telepon' => '081320741803',
            'jenis_kelamin' => 'L',
            'tempat_lahir' => 'Cirebon',
            'tanggal_lahir' => '1973-07-16',
            'alamat_lengkap' => 'DS. Balingbing 016/004',
            'jenis_rpl' => 'A2',
            'status_pendaftaran' => 'draft',
        ]);

        $kurikulum = Kurikulum::create([
            'id' => (string) Str::uuid(),
            'prodi_id' => $prodi->id,
            'kode_kurikulum' => 'KUR-TMT-2026',
            'nama_kurikulum' => 'Kurikulum Tadris Matematika 2026',
            'tahun_mulai' => 2026,
            'is_active' => true,
        ]);

        $mk = MataKuliah::create([
            'id' => (string) Str::uuid(),
            'kurikulum_id' => $kurikulum->id,
            'kode_mk' => 'TMT625006',
            'nama_mk' => 'Kalkulus Differensial',
            'sks' => 3,
            'semester' => 1,
        ]);

        // Submit Form 3/F03 Evaluation Matrix
        $response = $this->actingAs($asesi)->post('/form-f02/evaluasi-diri-f03', [
            'mata_kuliah_id' => $mk->id,
            'items' => [
                [
                    'nomor_urut' => 1,
                    'pernyataan_cpmk' => 'Mampu menganalisis domain, range, grafik fungsi...',
                    'profisiensi' => 'sangat_baik',
                    'nomor_dokumen' => 'Dok. 1',
                    'jenis_dokumen' => 'Transkrip sementara',
                ],
                [
                    'nomor_urut' => 2,
                    'pernyataan_cpmk' => 'Mampu menentukan transformasi fungsi...',
                    'profisiensi' => 'baik',
                    'nomor_dokumen' => 'Dok. 2',
                    'jenis_dokumen' => 'Sertifikat tutor praktikum',
                ],
            ],
        ]);

        $response->assertSessionHas('success');

        $this->assertDatabaseHas('rpl_evaluasi_diri_cpmk', [
            'pendaftar_id' => $pendaftar->id,
            'mata_kuliah_id' => $mk->id,
            'nomor_urut' => 1,
            'profisiensi' => 'sangat_baik',
            'jenis_dokumen' => 'Transkrip sementara',
        ]);

        $this->assertDatabaseHas('rpl_evaluasi_diri_cpmk', [
            'pendaftar_id' => $pendaftar->id,
            'mata_kuliah_id' => $mk->id,
            'nomor_urut' => 2,
            'profisiensi' => 'baik',
        ]);
    }

    public function test_user_can_access_form_f03_print_page(): void
    {
        $asesi = User::factory()->create(['role' => UserRole::ASESI]);
        $prodi = Prodi::create([
            'id' => (string) Str::uuid(),
            'kode_prodi' => 'TMT',
            'nama_prodi' => 'Tadris Matematika',
            'jenjang' => 'S1',
        ]);
        $gelombang = RplGelombang::create([
            'id' => (string) Str::uuid(),
            'tahun_akademik' => '2026/2027',
            'semester' => 'Ganjil',
            'nomor_gelombang' => 1,
            'nama_gelombang' => 'Gelombang 1 Ganjil',
            'tanggal_buka' => now()->subDays(5),
            'tanggal_tutup' => now()->addDays(30),
            'is_active' => true,
        ]);
        $pendaftar = RplPendaftar::create([
            'id' => (string) Str::uuid(),
            'user_id' => $asesi->id,
            'gelombang_id' => $gelombang->id,
            'prodi_id' => $prodi->id,
            'nomor_pendaftaran' => 'RPL-2026-0001',
            'nama_lengkap' => 'Toheri',
            'nik' => '3213011607730001',
            'email' => $asesi->email,
            'telepon' => '081320741803',
            'jenis_kelamin' => 'L',
            'tempat_lahir' => 'Cirebon',
            'tanggal_lahir' => '1973-07-16',
            'alamat_lengkap' => 'DS. Balingbing 016/004',
            'jenis_rpl' => 'A2',
            'status_pendaftaran' => 'draft',
        ]);

        $response = $this->actingAs($asesi)->get("/form-f03/print/{$pendaftar->id}");
        $response->assertStatus(200);
    }
}
