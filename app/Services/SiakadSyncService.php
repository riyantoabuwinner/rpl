<?php

namespace App\Services;

use App\Enums\AuditAction;
use App\Integrations\Siakad\SiakadClient;
use App\Models\AuditLog;
use App\Models\Kurikulum;
use App\Models\MataKuliah;
use App\Models\Prodi;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SiakadSyncService
{
    public function __construct(
        protected SiakadClient $client
    ) {}

    /**
     * Synchronize Program Studi from SIAKAD
     */
    public function syncProgramStudi(?string $fakultas = null, ?int $actorId = null): array
    {
        $response = $this->client->getProgramStudi($fakultas, $actorId);

        if (!$response['success']) {
            return [
                'success' => false,
                'message' => $response['message'],
                'synced_count' => 0,
                'items' => [],
            ];
        }

        $rawData = $response['data'];
        $prodiList = is_array($rawData) && isset($rawData['data']) ? $rawData['data'] : (is_array($rawData) ? $rawData : []);

        $synced = [];
        $createdCount = 0;
        $updatedCount = 0;

        DB::beginTransaction();
        try {
            foreach ($prodiList as $item) {
                // Adapt to multiple common API response field names (kode_prodi/id_prodi/kode, nama_prodi/nama, jenjang, fakultas)
                $kodeProdi = (string) ($item['kode_prodi'] ?? $item['id_prodi'] ?? $item['kode'] ?? '');
                $namaProdi = (string) ($item['nama_prodi'] ?? $item['nama'] ?? $item['program_studi'] ?? '');
                $jenjang = (string) ($item['jenjang'] ?? $item['jenjang_didik'] ?? 'S1');
                $namaFakultas = (string) ($item['fakultas'] ?? $item['nama_fakultas'] ?? ($fakultas ? "Fakultas ID: {$fakultas}" : null));

                if (empty($kodeProdi) || empty($namaProdi)) {
                    continue;
                }

                $existingProdi = Prodi::where('kode_prodi', $kodeProdi)->first();
                $isNew = !$existingProdi;

                $prodi = Prodi::updateOrCreate(
                    ['kode_prodi' => $kodeProdi],
                    [
                        'nama_prodi' => $namaProdi,
                        'jenjang' => $jenjang,
                        'fakultas' => $namaFakultas,
                        'is_active' => true,
                    ]
                );

                // Auto-create default Kurikulum if none exists for this Prodi
                $defaultKurikulum = Kurikulum::firstOrCreate(
                    ['prodi_id' => $prodi->id, 'tahun_mulai' => date('Y')],
                    [
                        'id' => (string) Str::uuid(),
                        'nama_kurikulum' => 'Kurikulum ' . date('Y') . ' ' . $prodi->nama_prodi,
                        'total_sks_lulus' => 144,
                        'is_active' => true,
                    ]
                );

                if ($isNew) {
                    $createdCount++;
                } else {
                    $updatedCount++;
                }

                $synced[] = [
                    'id' => $prodi->id,
                    'kode_prodi' => $prodi->kode_prodi,
                    'nama_prodi' => $prodi->nama_prodi,
                    'jenjang' => $prodi->jenjang,
                    'status' => $isNew ? 'created' : 'updated',
                ];
            }

            AuditLog::record(
                action: AuditAction::SYNC_SIAKAD,
                entityType: 'Prodi',
                entityId: null,
                newValues: [
                    'action' => 'SyncProgramStudi',
                    'fakultas' => $fakultas,
                    'total_synced' => count($synced),
                    'created' => $createdCount,
                    'updated' => $updatedCount,
                ]
            );

            DB::commit();

            return [
                'success' => true,
                'message' => "Berhasil menyinkronkan " . count($synced) . " Program Studi dari SIAKAD ({$createdCount} baru, {$updatedCount} diperbarui).",
                'synced_count' => count($synced),
                'created_count' => $createdCount,
                'updated_count' => $updatedCount,
                'items' => $synced,
            ];
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Failed saving SIAKAD Program Studi: " . $e->getMessage());

            return [
                'success' => false,
                'message' => 'Gagal menyimpan data Program Studi ke database: ' . $e->getMessage(),
                'synced_count' => 0,
                'items' => [],
            ];
        }
    }

    /**
     * Synchronize Mata Kuliah for a given Prodi
     */
    public function syncMataKuliah(string $kodeProdi, ?string $kurikulumId = null, ?int $actorId = null): array
    {
        $prodi = Prodi::where('kode_prodi', $kodeProdi)->first();
        if (!$prodi) {
            return [
                'success' => false,
                'message' => "Program Studi dengan kode '{$kodeProdi}' tidak ditemukan di database SIRPL. Silakan sinkronkan Program Studi terlebih dahulu.",
                'synced_count' => 0,
                'items' => [],
            ];
        }

        // Determine target Kurikulum
        $kurikulum = $kurikulumId ? Kurikulum::find($kurikulumId) : $prodi->kurikulum()->where('is_active', true)->latest()->first();
        if (!$kurikulum) {
            $kurikulum = Kurikulum::create([
                'id' => (string) Str::uuid(),
                'prodi_id' => $prodi->id,
                'nama_kurikulum' => 'Kurikulum ' . date('Y') . ' ' . $prodi->nama_prodi,
                'tahun_mulai' => date('Y'),
                'total_sks_lulus' => 144,
                'is_active' => true,
            ]);
        }

        $response = $this->client->getMataKuliah($kodeProdi, $actorId);

        if (!$response['success']) {
            return [
                'success' => false,
                'message' => $response['message'],
                'synced_count' => 0,
                'items' => [],
            ];
        }

        $rawData = $response['data'];
        $mkList = is_array($rawData) && isset($rawData['data']) ? $rawData['data'] : (is_array($rawData) ? $rawData : []);

        $synced = [];
        $createdCount = 0;
        $updatedCount = 0;

        DB::beginTransaction();
        try {
            foreach ($mkList as $item) {
                // Adapt field names (kode_mk/kode_matakuliah/id_matkul, nama_mk/nama_matakuliah/nama, sks/sks_mk, semester, jenis/kategori)
                $kodeMk = (string) ($item['kode_mk'] ?? $item['kode_matakuliah'] ?? $item['kode'] ?? '');
                $namaMk = (string) ($item['nama_mk'] ?? $item['nama_matakuliah'] ?? $item['nama'] ?? '');
                $sks = (int) ($item['sks'] ?? $item['sks_mk'] ?? $item['sks_tatap_muka'] ?? 3);
                $semester = (int) ($item['semester'] ?? $item['smt'] ?? 1);
                $kategori = (string) ($item['kategori_mk'] ?? $item['jenis_mk'] ?? 'Wajib');
                $deskripsi = (string) ($item['deskripsi'] ?? $item['silabus'] ?? null);

                if (empty($kodeMk) || empty($namaMk)) {
                    continue;
                }

                $existingMk = MataKuliah::where('kurikulum_id', $kurikulum->id)
                    ->where('kode_mk', $kodeMk)
                    ->first();

                $isNew = !$existingMk;

                $mk = MataKuliah::updateOrCreate(
                    [
                        'kurikulum_id' => $kurikulum->id,
                        'kode_mk' => $kodeMk,
                    ],
                    [
                        'nama_mk' => $namaMk,
                        'sks' => $sks > 0 ? $sks : 3,
                        'semester' => $semester > 0 ? $semester : 1,
                        'kategori_mk' => $kategori,
                        'terbuka_rpl' => true,
                        'deskripsi' => $deskripsi,
                    ]
                );

                if ($isNew) {
                    $createdCount++;
                } else {
                    $updatedCount++;
                }

                $synced[] = [
                    'id' => $mk->id,
                    'kode_mk' => $mk->kode_mk,
                    'nama_mk' => $mk->nama_mk,
                    'sks' => $mk->sks,
                    'semester' => $mk->semester,
                    'status' => $isNew ? 'created' : 'updated',
                ];
            }

            AuditLog::record(
                action: AuditAction::SYNC_SIAKAD,
                entityType: 'MataKuliah',
                entityId: $kurikulum->id,
                newValues: [
                    'action' => 'SyncMataKuliah',
                    'kode_prodi' => $kodeProdi,
                    'kurikulum_id' => $kurikulum->id,
                    'total_synced' => count($synced),
                    'created' => $createdCount,
                    'updated' => $updatedCount,
                ]
            );

            DB::commit();

            return [
                'success' => true,
                'message' => "Berhasil menyinkronkan " . count($synced) . " Mata Kuliah untuk Program Studi {$prodi->nama_prodi} ({$createdCount} baru, {$updatedCount} diperbarui).",
                'synced_count' => count($synced),
                'created_count' => $createdCount,
                'updated_count' => $updatedCount,
                'kurikulum_id' => $kurikulum->id,
                'items' => $synced,
            ];
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Failed saving SIAKAD Mata Kuliah: " . $e->getMessage());

            return [
                'success' => false,
                'message' => 'Gagal menyimpan data Mata Kuliah ke database: ' . $e->getMessage(),
                'synced_count' => 0,
                'items' => [],
            ];
        }
    }

    /**
     * Preview Program Studi without persisting to DB
     */
    public function previewProgramStudi(?string $fakultas = null): array
    {
        return $this->client->getProgramStudi($fakultas);
    }

    /**
     * Preview Mata Kuliah without persisting to DB
     */
    public function previewMataKuliah(string $kodeProdi): array
    {
        return $this->client->getMataKuliah($kodeProdi);
    }
}
