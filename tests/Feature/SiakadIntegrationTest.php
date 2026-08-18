<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\IntegrationLog;
use App\Models\MataKuliah;
use App\Models\Prodi;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SiakadIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed basic user for authenticated API calls
        $this->seed(\Database\Seeders\UserSeeder::class);
    }

    public function test_siakad_client_fetches_and_syncs_program_studi_successfully(): void
    {
        // Mock SIAKAD Bridge GET /program_studi
        Http::fake([
            'https://bridge.uinssc.ac.id/api/program_studi*' => Http::response([
                'status' => 'success',
                'data' => [
                    [
                        'kode_prodi' => '101',
                        'nama_prodi' => 'S1 Teknik Informatika',
                        'jenjang' => 'S1',
                        'fakultas' => 'Fakultas Sains dan Teknologi',
                    ],
                    [
                        'kode_prodi' => '102',
                        'nama_prodi' => 'S1 Sistem Informasi',
                        'jenjang' => 'S1',
                        'fakultas' => 'Fakultas Sains dan Teknologi',
                    ],
                ]
            ], 200),
        ]);

        $response = $this->postJson('/api/v1/integrations/siakad/sync-prodi', [
            'fakultas' => '2',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'synced_count' => 2,
            ]);

        $this->assertDatabaseHas('prodi', [
            'kode_prodi' => '101',
            'nama_prodi' => 'S1 Teknik Informatika',
        ]);

        $this->assertDatabaseHas('prodi', [
            'kode_prodi' => '102',
            'nama_prodi' => 'S1 Sistem Informasi',
        ]);

        // Verify Integration Log
        $this->assertDatabaseHas('integration_logs', [
            'target_system' => 'SIAKAD',
            'action' => 'FetchProgramStudi',
            'status' => 'success',
        ]);

        // Verify Audit Log
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'SYNC_SIAKAD',
            'entity_type' => 'Prodi',
        ]);
    }

    public function test_siakad_client_fetches_and_syncs_matakuliah_successfully(): void
    {
        // Setup initial Prodi
        $prodi = Prodi::create([
            'kode_prodi' => '101',
            'nama_prodi' => 'Teknik Informatika',
            'jenjang' => 'S1',
            'is_active' => true,
        ]);

        // Mock SIAKAD Bridge POST /matakuliah
        Http::fake([
            'https://bridge.uinssc.ac.id/api/matakuliah' => Http::response([
                'status' => 'success',
                'data' => [
                    [
                        'kode_mk' => 'TIF101',
                        'nama_mk' => 'Algoritma dan Pemrograman',
                        'sks' => 3,
                        'semester' => 1,
                        'kategori_mk' => 'Wajib',
                    ],
                    [
                        'kode_mk' => 'TIF201',
                        'nama_mk' => 'Rekayasa Perangkat Lunak',
                        'sks' => 3,
                        'semester' => 3,
                        'kategori_mk' => 'Wajib',
                    ],
                ]
            ], 200),
        ]);

        $response = $this->postJson('/api/v1/integrations/siakad/sync-matakuliah', [
            'kode_prodi' => '101',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'synced_count' => 2,
            ]);

        $this->assertDatabaseHas('mata_kuliah', [
            'kode_mk' => 'TIF101',
            'nama_mk' => 'Algoritma dan Pemrograman',
            'sks' => 3,
        ]);

        $this->assertDatabaseHas('mata_kuliah', [
            'kode_mk' => 'TIF201',
            'nama_mk' => 'Rekayasa Perangkat Lunak',
            'sks' => 3,
        ]);
    }

    public function test_artisan_command_sync_prodi(): void
    {
        Http::fake([
            'https://bridge.uinssc.ac.id/api/program_studi*' => Http::response([
                'status' => 'success',
                'data' => [
                    [
                        'kode_prodi' => '201',
                        'nama_prodi' => 'S1 Ilmu Komputer',
                        'jenjang' => 'S1',
                    ]
                ]
            ], 200),
        ]);

        $this->artisan('siakad:sync-prodi --fakultas=2')
            ->expectsOutputToContain('Berhasil menyinkronkan 1 Program Studi')
            ->assertSuccessful();

        $this->assertDatabaseHas('prodi', [
            'kode_prodi' => '201',
            'nama_prodi' => 'S1 Ilmu Komputer',
        ]);
    }

    public function test_artisan_command_sync_matakuliah(): void
    {
        Prodi::create([
            'kode_prodi' => '201',
            'nama_prodi' => 'S1 Ilmu Komputer',
            'jenjang' => 'S1',
            'is_active' => true,
        ]);

        Http::fake([
            'https://bridge.uinssc.ac.id/api/matakuliah' => Http::response([
                'status' => 'success',
                'data' => [
                    [
                        'kode_mk' => 'CS101',
                        'nama_mk' => 'Pengantar Ilmu Komputer',
                        'sks' => 2,
                        'semester' => 1,
                    ]
                ]
            ], 200),
        ]);

        $this->artisan('siakad:sync-matakuliah 201')
            ->expectsOutputToContain('Berhasil menyinkronkan 1 Mata Kuliah')
            ->assertSuccessful();

        $this->assertDatabaseHas('mata_kuliah', [
            'kode_mk' => 'CS101',
            'nama_mk' => 'Pengantar Ilmu Komputer',
        ]);
    }
}
