<?php

namespace App\Console\Commands;

use App\Jobs\SyncPortalUsersJob;
use App\Services\PortalAuthService;
use Illuminate\Console\Command;

class SyncPortalUsersCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'portal:sync-users {--type=all : Kategori pengguna portal (all|dosen)} {--role= : Role default untuk pengguna baru (opsional)} {--async : Jalankan secara asynchronous di latar belakang via Queue Job}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Tarik dan sinkronkan data pengguna / dosen dari Portal API ke database lokal SIRPL di latar belakang';

    /**
     * Execute the console command.
     */
    public function handle(PortalAuthService $portalAuthService): int
    {
        $type = $this->option('type') ?? 'all';
        $role = $this->option('role');
        $isAsync = (bool) $this->option('async');

        $this->info("Menghubungi Portal API untuk sinkronisasi akun (Type: {$type})...");

        if ($isAsync) {
            SyncPortalUsersJob::dispatch($type, $role, null);
            $this->info("Job sinkronisasi telah dijadwalkan dan berjalan di latar belakang.");
            return Command::SUCCESS;
        }

        $roleEnum = $role ? \App\Enums\UserRole::tryFrom($role) : null;
        $result = $portalAuthService->syncAllUsersFromPortal($type, $roleEnum);

        if ($result['success']) {
            $this->info("✓ " . $result['message']);
            $this->table(
                ['ID', 'Nama', 'Username', 'Role', 'Status'],
                collect($result['users'])->map(fn ($u) => [
                    $u->id,
                    $u->name,
                    $u->username,
                    $u->role?->label() ?? 'Belum Ada Peran',
                    'Tersinkron',
                ])
            );
            return Command::SUCCESS;
        }

        $this->error("✗ " . $result['message']);
        return Command::FAILURE;
    }
}
