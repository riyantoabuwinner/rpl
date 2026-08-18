<?php

namespace App\Console\Commands;

use App\Services\SiakadSyncService;
use Illuminate\Console\Command;

class SiakadSyncProdiCommand extends Command
{
    protected $signature = 'siakad:sync-prodi {--fakultas= : Filter ID Fakultas (misal: 2)}';
    protected $description = 'Sinkronisasi data Program Studi dari SIAKAD Bridge ke SIRPL';

    public function handle(SiakadSyncService $syncService): int
    {
        $fakultas = $this->option('fakultas');
        $this->info("Menghubungi SIAKAD Bridge: GET /program_studi" . ($fakultas ? "?fakultas={$fakultas}" : "") . "...");

        $result = $syncService->syncProgramStudi($fakultas);

        if (!$result['success']) {
            $this->error("Gagal: " . $result['message']);
            return Command::FAILURE;
        }

        $this->info($result['message']);

        if (!empty($result['items'])) {
            $this->table(
                ['Kode Prodi', 'Nama Program Studi', 'Jenjang', 'Status'],
                array_map(fn($item) => [
                    $item['kode_prodi'],
                    $item['nama_prodi'],
                    $item['jenjang'],
                    $item['status'] === 'created' ? 'BARU' : 'DIPERBARUI',
                ], $result['items'])
            );
        }

        return Command::SUCCESS;
    }
}
