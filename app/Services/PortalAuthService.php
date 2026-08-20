<?php

namespace App\Services;

use App\Enums\AuditAction;
use App\Enums\UserRole;
use App\Integrations\Portal\PortalClient;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PortalAuthService
{
    public function __construct(
        protected PortalClient $client
    ) {}

    /**
     * Authenticate with Portal API and synchronize local User
     */
    public function authenticate(string $username, string $password, ?UserRole $overrideRole = null): array
    {
        $apiResult = $this->client->login($username, $password);

        if (!$apiResult['success']) {
            return [
                'success' => false,
                'message' => $apiResult['message'] ?? 'Login Portal gagal.',
                'user' => null,
            ];
        }

        $portalData = $apiResult['data'] ?? [];
        $userData = $this->extractUserData($portalData, $username);

        // Allow explicit role assignment (e.g. Dosen Portal -> Asesor RPL)
        if ($overrideRole) {
            $userData['role'] = $overrideRole;
        }

        // Sync or Create user locally
        $user = $this->syncPortalUser($userData, $password, $portalData);

        if (!$user) {
            return [
                'success' => false,
                'message' => 'Gagal memproses data akun pengguna dari Portal.',
                'user' => null,
            ];
        }

        AuditLog::record(
            action: AuditAction::LOGIN,
            entityType: 'User',
            entityId: (string) $user->id,
            newValues: [
                'auth_method' => 'portal_api',
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role?->value ?? (string) $user->role,
            ]
        );

        return [
            'success' => true,
            'message' => 'Autentikasi Portal berhasil.',
            'user' => $user,
        ];
    }

    /**
     * Extract user fields from various JSON payload structures
     */
    protected function extractUserData(array $payload, string $fallbackUsername): array
    {
        // Check nesting candidates: data.user, data, user, or root payload
        $raw = $payload['data']['user'] ?? ($payload['user'] ?? ($payload['data'] ?? $payload));

        $username = (string) ($raw['username'] ?? $raw['user_name'] ?? $raw['nim'] ?? $raw['nip'] ?? $raw['id_user'] ?? $fallbackUsername);
        $name = (string) ($raw['name'] ?? $raw['nama'] ?? $raw['nama_lengkap'] ?? $raw['display_name'] ?? $username);
        $email = (string) ($raw['email'] ?? $raw['mail'] ?? ($username . '@portal.uinssc.ac.id'));
        $nik = isset($raw['nik']) ? (string) $raw['nik'] : (isset($raw['ktp']) ? (string) $raw['ktp'] : null);
        $phone = isset($raw['phone']) ? (string) $raw['phone'] : (isset($raw['no_hp']) ? (string) $raw['no_hp'] : (isset($raw['telepon']) ? (string) $raw['telepon'] : null));
        $portalId = (string) ($raw['id'] ?? $raw['user_id'] ?? $raw['portal_id'] ?? $username);
        $roleStr = (string) ($raw['role'] ?? $raw['user_role'] ?? $raw['level'] ?? $raw['jenis_pengguna'] ?? '');

        $role = $this->mapPortalRole($roleStr, $username);

        return [
            'username' => $username,
            'name' => $name,
            'email' => $email,
            'nik' => $nik,
            'phone' => $phone,
            'role' => $role,
            'portal_id' => $portalId,
        ];
    }

    /**
     * Map portal role or username to SIRPL UserRole enum
     */
    protected function mapPortalRole(string $roleStr, string $username): UserRole
    {
        $normalized = strtolower(trim($roleStr . ' ' . $username));

        if (str_contains($normalized, 'superadmin') || str_contains($normalized, 'super_admin')) {
            return UserRole::SUPER_ADMIN;
        }

        if (
            str_contains($normalized, 'adminportal') ||
            str_contains($normalized, 'admin_rpl') ||
            str_contains($normalized, 'admin_portal') ||
            str_contains($normalized, 'pengelola') ||
            str_contains($normalized, 'admin')
        ) {
            return UserRole::ADMIN_RPL;
        }

        if (
            str_contains($normalized, 'asesor') ||
            str_contains($normalized, 'evaluator') ||
            str_contains($normalized, 'dosen')
        ) {
            return UserRole::ASESOR;
        }

        if (
            str_contains($normalized, 'kaprodi') ||
            str_contains($normalized, 'kajur') ||
            str_contains($normalized, 'pimpinan')
        ) {
            return UserRole::KAPRODI;
        }

        if (
            str_contains($normalized, 'lpm') ||
            str_contains($normalized, 'mutu') ||
            str_contains($normalized, 'auditor')
        ) {
            return UserRole::LPM;
        }

        if (
            str_contains($normalized, 'siakad') ||
            str_contains($normalized, 'akademik') ||
            str_contains($normalized, 'feeder')
        ) {
            return UserRole::ADMIN_SIAKAD;
        }

        // Default for student / applicant / public portal users
        return UserRole::ASESI;
    }

    /**
     * Test connection to Portal API server
     */
    public function testConnection(): array
    {
        return $this->client->testConnection();
    }

    /**
     * Synchronize all portal users (Dosen / Pegawai) into local database
     */
    public function syncAllUsersFromPortal(?string $type = 'all', ?UserRole $defaultRole = null): array
    {
        $response = $this->client->fetchPortalUsers($type);

        if (!$response['success']) {
            return [
                'success' => false,
                'message' => $response['message'] ?? 'Gagal mengambil data pengguna dari Portal API.',
                'synced_count' => 0,
                'users' => [],
            ];
        }

        $portalUsers = $response['data']['data'] ?? ($response['data'] ?? []);
        if (!is_array($portalUsers)) {
            $portalUsers = [];
        }

        $syncedCount = 0;
        $syncedUsers = [];

        DB::beginTransaction();
        try {
            foreach ($portalUsers as $raw) {
                $username = (string) ($raw['username'] ?? $raw['user_name'] ?? $raw['nim'] ?? $raw['nip'] ?? $raw['id_user'] ?? '');
                if (empty($username)) {
                    continue;
                }

                $name = (string) ($raw['name'] ?? $raw['nama'] ?? $raw['nama_lengkap'] ?? $raw['display_name'] ?? $username);
                $email = (string) ($raw['email'] ?? $raw['mail'] ?? ($username . '@uinssc.ac.id'));
                $nik = isset($raw['nik']) ? (string) $raw['nik'] : (isset($raw['ktp']) ? (string) $raw['ktp'] : null);
                $phone = isset($raw['phone']) ? (string) $raw['phone'] : (isset($raw['no_hp']) ? (string) $raw['no_hp'] : (isset($raw['telepon']) ? (string) $raw['telepon'] : null));
                $portalId = (string) ($raw['id'] ?? $raw['user_id'] ?? $raw['portal_id'] ?? $username);
                // Protected system accounts that keep their admin role
                $protectedUsernames = ['superadmin', 'adminrpl', 'adminportal_iain', 'siakad'];

                // Find existing user by username, email, or nik
                $existingUser = User::where('username', $username)
                    ->orWhere('email', $email)
                    ->when(!empty($nik), fn ($q) => $q->orWhere('nik', $nik))
                    ->first();

                // If protected account, keep existing role. Otherwise use $defaultRole (null = belum diset)
                if (in_array($username, $protectedUsernames)) {
                    $assignedRole = $existingUser?->role ?? UserRole::ADMIN_RPL;
                } else {
                    $assignedRole = $defaultRole;
                }

                $attributes = [
                    'name' => $name,
                    'username' => $username,
                    'email' => $email,
                    'role' => $assignedRole,
                    'portal_id' => $portalId,
                    'portal_data' => $raw,
                    'portal_synced_at' => now(),
                    'is_active' => true,
                ];

                if (!empty($nik)) {
                    $attributes['nik'] = $nik;
                }

                if (!empty($phone)) {
                    $attributes['phone'] = $phone;
                }

                if ($existingUser) {
                    $existingUser->update($attributes);
                    $syncedUsers[] = $existingUser;
                } else {
                    $attributes['password'] = Hash::make('password123');
                    $attributes['email_verified_at'] = now();
                    $syncedUsers[] = User::create($attributes);
                }

                $syncedCount++;
            }

            DB::commit();

            AuditLog::record(
                action: AuditAction::SYNC_PORTAL,
                entityType: 'UserCatalog',
                entityId: 'portal_bulk_sync',
                newValues: [
                    'type' => $type,
                    'synced_count' => $syncedCount,
                ]
            );

            return [
                'success' => true,
                'message' => "Berhasil menarik dan menyinkronkan {$syncedCount} data akun Dosen/Pengguna dari Portal API ke database lokal.",
                'synced_count' => $syncedCount,
                'users' => $syncedUsers,
            ];
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Bulk Sync Portal Users Error: ' . $e->getMessage());

            return [
                'success' => false,
                'message' => 'Gagal menyinkronkan data pengguna: ' . $e->getMessage(),
                'synced_count' => 0,
                'users' => [],
            ];
        }
    }

    /**
     * Synchronize or create the local user record
     */
    protected function syncPortalUser(array $userData, string $password, array $rawPortalPayload): ?User
    {
        try {
            return DB::transaction(function () use ($userData, $password, $rawPortalPayload) {
                // Find existing user by username, email, or NIK
                $user = User::where('username', $userData['username'])
                    ->orWhere('email', $userData['email'])
                    ->when(!empty($userData['nik']), fn ($q) => $q->orWhere('nik', $userData['nik']))
                    ->first();

                $attributes = [
                    'name' => $userData['name'],
                    'username' => $userData['username'],
                    'email' => $userData['email'],
                    'role' => $userData['role'],
                    'portal_id' => $userData['portal_id'],
                    'portal_data' => $rawPortalPayload,
                    'portal_synced_at' => now(),
                    'password' => Hash::make($password),
                    'is_active' => true,
                ];

                if (!empty($userData['nik'])) {
                    $attributes['nik'] = $userData['nik'];
                }

                if (!empty($userData['phone'])) {
                    $attributes['phone'] = $userData['phone'];
                }

                if ($user) {
                    $user->update($attributes);
                    return $user;
                }

                $attributes['email_verified_at'] = now();
                return User::create($attributes);
            });
        } catch (\Throwable $e) {
            Log::error('Gagal sinkronisasi data user dari Portal: ' . $e->getMessage());
            return null;
        }
    }
}
