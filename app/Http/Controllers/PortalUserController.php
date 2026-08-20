<?php

namespace App\Http\Controllers;

use App\Models\IntegrationLog;
use App\Models\User;
use App\Services\PortalAuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalUserController extends Controller
{
    public function __construct(
        protected PortalAuthService $portalAuthService
    ) {}

    /**
     * Display Portal Users Synchronization Page & List
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $roleFilter = $request->query('role');

        $usersQuery = User::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('nik', 'like', "%{$search}%");
                });
            })
            ->when($roleFilter, function ($query, $roleFilter) {
                if ($roleFilter === 'unassigned' || $roleFilter === 'null') {
                    $query->whereNull('role');
                } else {
                    $query->where('role', $roleFilter);
                }
            })
            ->latest('updated_at');

        $users = $usersQuery->paginate(15)->withQueryString()->through(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'nik' => $user->masked_nik,
                'phone' => $user->phone,
                'role' => $user->role?->value ?? null,
                'role_label' => $user->role?->label() ?? 'Belum Ditetapkan',
                'portal_id' => $user->portal_id,
                'is_portal_synced' => !empty($user->portal_id) || !empty($user->portal_data),
                'portal_synced_at' => $user->portal_synced_at ? $user->portal_synced_at->format('d M Y H:i:s') : ($user->portal_data ? $user->updated_at->format('d M Y H:i:s') : null),
                'portal_data' => $user->portal_data,
                'is_active' => (bool) $user->is_active,
                'created_at' => $user->created_at?->format('d M Y H:i'),
                'updated_at' => $user->updated_at?->format('d M Y H:i'),
            ];
        });

        // Summary Statistics
        $totalUsers = User::count();
        $syncedUsersCount = User::whereNotNull('portal_id')->orWhereNotNull('portal_data')->count();
        $activeUsersCount = User::where('is_active', true)->count();
        $unassignedCount = User::whereNull('role')->count();
        $asesorCount = User::where('role', 'asesor')->count();
        $lastSyncedUser = User::whereNotNull('portal_synced_at')->latest('portal_synced_at')->first();

        // Check Portal API Connectivity Status
        $connectionStatus = $this->portalAuthService->testConnection();

        // Recent Portal Integration Activity Logs
        $recentLogs = IntegrationLog::where('target_system', 'PORTAL')
            ->latest('created_at')
            ->take(5)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'status' => $log->status?->value ?? (string) $log->status,
                    'response_code' => $log->response_code,
                    'response_message' => $log->response_message,
                    'created_at' => $log->created_at?->format('d M Y H:i:s'),
                ];
            });

        $availableRoles = collect(\App\Enums\UserRole::cases())->map(fn ($r) => [
            'value' => $r->value,
            'label' => $r->label(),
        ]);

        return Inertia::render('PortalUsers/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search ?? '',
                'role' => $roleFilter ?? '',
            ],
            'stats' => [
                'total_users' => $totalUsers,
                'synced_portal_count' => $syncedUsersCount,
                'local_only_count' => max(0, $totalUsers - $syncedUsersCount),
                'active_users_count' => $activeUsersCount,
                'unassigned_count' => $unassignedCount,
                'asesor_count' => $asesorCount,
                'last_synced_at' => $lastSyncedUser?->portal_synced_at?->format('d M Y H:i:s'),
            ],
            'connection' => $connectionStatus,
            'recentLogs' => $recentLogs,
            'availableRoles' => $availableRoles,
        ]);
    }

    /**
     * Synchronize a specific user account from Portal API with selectable role
     */
    public function syncSingle(Request $request): RedirectResponse
    {
        $request->validate([
            'username' => 'required|string|max:100',
            'password' => 'required|string',
            'target_role' => 'nullable|string|in:super_admin,admin_rpl,asesi,asesor,kaprodi,lpm,admin_siakad',
        ]);

        $username = trim($request->input('username'));
        $password = (string) $request->input('password');
        $targetRoleStr = $request->input('target_role', 'asesor');
        $overrideRole = \App\Enums\UserRole::tryFrom($targetRoleStr) ?? \App\Enums\UserRole::ASESOR;

        $result = $this->portalAuthService->authenticate($username, $password, $overrideRole);

        if ($result['success'] && $result['user']) {
            $user = $result['user'];
            return back()->with('success', "Akun Dosen/Pengguna [{$username}] berhasil divalidasi dan disinkronkan ke database lokal sebagai [{$user->role?->label()}].");
        }

        return back()->with('error', 'Gagal sinkronisasi: ' . ($result['message'] ?? 'Kredensial portal tidak valid atau server tidak merespons.'));
    }

    /**
     * Update user role directly
     */
    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'role' => 'required|string|in:super_admin,admin_rpl,asesi,asesor,kaprodi,lpm,admin_siakad',
        ]);

        $newRole = \App\Enums\UserRole::from($request->role);
        $user->update(['role' => $newRole]);

        return back()->with('success', "Peran pengguna [{$user->name}] berhasil diubah menjadi [{$newRole->label()}].");
    }

    /**
     * Synchronize ALL portal user accounts (Dosen, Pegawai, dll) into local database
     */
    public function syncAll(Request $request): RedirectResponse
    {
        $type = $request->input('type', 'all');
        $defaultRoleStr = $request->input('default_role');
        $defaultRole = (!empty($defaultRoleStr) && $defaultRoleStr !== 'none') ? \App\Enums\UserRole::tryFrom($defaultRoleStr) : null;

        // Perform synchronization
        $result = $this->portalAuthService->syncAllUsersFromPortal($type, $defaultRole);

        if ($result['success']) {
            return back()->with('success', "✓ {$result['message']}");
        }

        return back()->with('error', 'Gagal menarik data dari Portal API: ' . ($result['message'] ?? 'Server portal tidak merespons.'));
    }

    /**
     * Batch assign role to multiple selected users
     */
    public function batchAssignRole(Request $request): RedirectResponse
    {
        $request->validate([
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'required|integer|exists:users,id',
            'role' => 'required|string|in:super_admin,admin_rpl,asesi,asesor,kaprodi,lpm,admin_siakad',
        ]);

        $userIds = $request->input('user_ids');
        $newRole = \App\Enums\UserRole::from($request->input('role'));

        User::whereIn('id', $userIds)->update(['role' => $newRole]);

        $count = count($userIds);
        return back()->with('success', "Berhasil menetapkan peran [{$newRole->label()}] untuk {$count} akun pengguna terpilih.");
    }

    /**
     * Test connection to Portal API server
     */
    public function testConnection(): RedirectResponse
    {
        $result = $this->portalAuthService->testConnection();

        if ($result['online']) {
            return back()->with('success', "Koneksi ke Portal API berhasil ({$result['duration_ms']} ms) - {$result['endpoint']}");
        }

        return back()->with('error', "Gagal terhubung ke Portal API: {$result['message']}");
    }
}
