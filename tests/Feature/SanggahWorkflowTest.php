<?php

namespace Tests\Feature;

use App\Enums\ApplicationStatus;
use App\Enums\UserRole;
use App\Models\Prodi;
use App\Models\RplGelombang;
use App\Models\RplPendaftar;
use App\Models\RplSanggah;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class SanggahWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected User $asesi;
    protected User $adminRpl;
    protected RplPendaftar $pendaftar;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');

        $this->asesi = User::create([
            'name' => 'Fauzi Mahasiswa',
            'email' => 'fauzi@example.com',
            'nik' => '3271011508980099',
            'phone' => '081298765432',
            'role' => UserRole::ASESI,
            'password' => Hash::make('password123'),
        ]);

        $this->adminRpl = User::create([
            'name' => 'Admin Tim RPL',
            'email' => 'admin.tim@kampus.ac.id',
            'nik' => '3271011508980088',
            'phone' => '081298765431',
            'role' => UserRole::ADMIN_RPL,
            'password' => Hash::make('password123'),
        ]);

        $gelombang = RplGelombang::create([
            'id' => (string) Str::uuid(),
            'nama_gelombang' => 'Gelombang 1 2026/2027',
            'tahun_akademik' => '2026/2027',
            'semester' => 'Ganjil',
            'tanggal_buka' => now()->subDays(10),
            'tanggal_tutup' => now()->addDays(20),
            'is_active' => true,
        ]);

        $prodi = Prodi::create([
            'id' => (string) Str::uuid(),
            'kode_prodi' => '55201',
            'nama_prodi' => 'Teknik Informatika',
            'jenjang' => 'S1',
            'is_active' => true,
        ]);

        $this->pendaftar = RplPendaftar::create([
            'id' => (string) Str::uuid(),
            'user_id' => $this->asesi->id,
            'gelombang_id' => $gelombang->id,
            'prodi_id' => $prodi->id,
            'nomor_pendaftaran' => 'RPL-2026-0099',
            'nama_lengkap' => 'Fauzi Mahasiswa',
            'nik' => '3271011508980099',
            'email' => 'fauzi@example.com',
            'telepon' => '081298765432',
            'jenis_rpl' => 'A2',
            'status_pendaftaran' => ApplicationStatus::PLENO,
        ]);
    }

    public function test_asesi_can_submit_appeal_and_tim_rpl_can_review(): void
    {
        // 1. Asesi views Masa Sanggah page
        $indexResponse = $this->actingAs($this->asesi)->get('/sanggah');
        $indexResponse->assertStatus(200);

        // 2. Asesi submits appeal with additional evidence file
        $file = UploadedFile::fake()->create('evidensi_tambahan.pdf', 300, 'application/pdf');
        $submitResponse = $this->actingAs($this->asesi)->post('/sanggah', [
            'alasan_keberatan' => 'Mohon ditinjau kembali untuk mata kuliah RPL karena saya telah menyertakan sertifikasi BNSP tambahan.',
            'file_bukti' => $file,
        ]);
        $submitResponse->assertRedirect();

        $sanggah = RplSanggah::where('pendaftar_id', $this->pendaftar->id)->first();
        $this->assertNotNull($sanggah);
        $this->assertEquals('diajukan', $sanggah->status_sanggah);
        $this->assertNotEmpty($sanggah->nomor_sanggah);

        // 3. Tim RPL reviews and accepts the appeal
        $reviewResponse = $this->actingAs($this->adminRpl)->post("/sanggah/{$sanggah->id}/review", [
            'status_sanggah' => 'diterima',
            'tanggapan_tim_rpl' => 'Sanggahan diterima setelah meninjau sertifikasi kompetensi BNSP level 6 yang sah.',
        ]);
        $reviewResponse->assertRedirect();

        $sanggah->refresh();
        $this->assertEquals('diterima', $sanggah->status_sanggah);
        $this->assertEquals($this->adminRpl->id, $sanggah->ditinjau_oleh_id);
    }
}
