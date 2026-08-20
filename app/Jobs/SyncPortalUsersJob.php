<?php

namespace App\Jobs;

use App\Enums\AuditAction;
use App\Enums\IntegrationStatus;
use App\Enums\UserRole;
use App\Models\AuditLog;
use App\Models\IntegrationLog;
use App\Services\PortalAuthService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SyncPortalUsersJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 120;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $type = 'all',
        public ?string $defaultRole = null,
        public ?int $actorId = null
    ) {}

    /**
     * Execute the job.
     */
    public function handle(PortalAuthService $portalAuthService): void
    {
        $jobLogId = (string) Str::uuid();
        $targetRoleEnum = $this->defaultRole ? UserRole::tryFrom($this->defaultRole) : null;

        Log::info("Memulai Background Job Sinkronisasi Akun Portal (Type: {$this->type}) [{$jobLogId}]");

        $integrationLog = IntegrationLog::create([
            'id' => $jobLogId,
            'target_system' => 'PORTAL',
            'action' => 'BackgroundSyncPortalUsers',
            'request_id' => $jobLogId,
            'payload_hash' => hash('sha256', json_encode(['type' => $this->type, 'default_role' => $this->defaultRole])),
            'payload_sanitized' => ['type' => $this->type, 'default_role' => $this->defaultRole],
            'status' => IntegrationStatus::PROCESSING,
            'retry_count' => 0,
            'actor_id' => $this->actorId,
        ]);

        try {
            $result = $portalAuthService->syncAllUsersFromPortal($this->type, $targetRoleEnum);

            if ($result['success']) {
                $integrationLog->update([
                    'status' => IntegrationStatus::SUCCESS,
                    'response_code' => 200,
                    'response_message' => "Sukses sinkronisasi latar belakang: {$result['synced_count']} pengguna tersinkron.",
                    'response_body' => [
                        'synced_count' => $result['synced_count'],
                        'message' => $result['message'],
                    ],
                ]);

                Log::info("Background Job Sinkronisasi Portal Selesai: {$result['synced_count']} pengguna berhasil disinkron.");
            } else {
                $integrationLog->update([
                    'status' => IntegrationStatus::FAILED,
                    'response_code' => 500,
                    'response_message' => $result['message'] ?? 'Gagal sinkronisasi dari Portal API.',
                    'response_body' => ['error' => $result['message']],
                ]);

                Log::error("Background Job Sinkronisasi Portal Gagal: " . ($result['message'] ?? 'Unknown error'));
            }
        } catch (\Throwable $e) {
            $integrationLog->update([
                'status' => IntegrationStatus::FAILED,
                'response_code' => 500,
                'response_message' => $e->getMessage(),
                'response_body' => ['exception' => $e->getMessage()],
            ]);

            Log::error("Exception saat Background Job Sinkronisasi Portal: " . $e->getMessage());
            throw $e;
        }
    }
}
