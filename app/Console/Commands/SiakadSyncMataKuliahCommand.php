<?php

namespace App\Console\Commands;

use App\Services\SiakadSyncService;
use Illuminate\Console\Command;

class SiakadSyncMataKuliahCommand extends Command
{
    protected $signature = 'siakad:sync-matakuliah {kode_prodi : Kode Program Studi (misal: 101 atau 55201)} {--kurikulum= : ID Kurikulum spesifik}';
    protected $description = 'Sinkronisasi data Mata Kuliah dari SIAKAD Bridge untuk Program Studi tertentu';

    public function handle(SiakadSyncService $syncService): int
    {
        $kodeProdi = $this->argument('kode_prodi');
        $kurikulumId = $this->option('kurikulum');

        $this->info("Menghubungi SIAKAD Bridge: POST /matakuliah with kode_prodi={$kodeProdi}...");

        $result = $syncService->syncMataKuliah($kodeProdi, $kurikulumId);

        if (!$result['success']) {
            $this->error("Gagal: " . $result['message']);
            return Command::FAILURE;
        }

        $this->info($result['message']);

        if (!empty($result['items'])) {
            $this->table(
                ['Kode MK', 'Nama Mata Kuliah', 'SKS', 'Semester', 'Status'],
                array_map(fn($item) => [
                    $item['kode_mk'],
                    $item['nama_mk'],
                    $item['sks'],
                    $item['semester'],
                    $item['status'] === 'created' ? 'BARU' : 'DIPERBARUI',
                ], $result['items'])
            );
        }

        return Command::SUCCESS;
    }
}
