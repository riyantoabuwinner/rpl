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
    public function authenticate(string $username, string $password): array
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
     * Synchronize or create the local user record
     */
    protected function syncPortalUser(array $userData, string $password, array $rawPortalPayload): ?User
    {
        try {
            return DB::transaction(function () use ($userData, $password, $rawPortalPayload) {
                // Find existing user by username or email
                $user = User::where('username', $userData['username'])
                    ->orWhere('email', $userData['email'])
                    ->first();

                $attributes = [
                    'name' => $userData['name'],
                    'username' => $userData['username'],
                    'email' => $userData['email'],
                    'role' => $userData['role'],
                    'portal_id' => $userData['portal_id'],
                    'portal_data' => $rawPortalPayload,
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
