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
                $query->where('role', $roleFilter);
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
                'role' => $user->role?->value ?? (string) $user->role,
                'role_label' => $user->role?->label() ?? (string) $user->role,
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
                'last_synced_at' => $lastSyncedUser?->portal_synced_at?->format('d M Y H:i:s'),
            ],
            'connection' => $connectionStatus,
            'recentLogs' => $recentLogs,
        ]);
    }

    /**
     * Synchronize a specific user account from Portal API
     */
    public function syncSingle(Request $request): RedirectResponse
    {
        $request->validate([
            'username' => 'required|string|max:100',
            'password' => 'required|string',
        ]);

        $username = trim($request->input('username'));
        $password = (string) $request->input('password');

        $result = $this->portalAuthService->authenticate($username, $password);

        if ($result['success'] && $result['user']) {
            return back()->with('success', "Akun pengguna [{$username}] berhasil divalidasi dan disinkronkan ke database lokal.");
        }

        return back()->with('error', 'Gagal sinkronisasi: ' . ($result['message'] ?? 'Kredensial portal tidak valid atau server tidak merespons.'));
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
