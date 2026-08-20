<?php

namespace App\Http\Controllers\Auth;

use App\Enums\AuditAction;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use App\Services\PortalAuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function __construct(
        protected PortalAuthService $portalAuthService
    ) {}

    /**
     * Display the login view.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/Login', [
            'status' => session('status'),
            'initialTab' => $request->query('tab', 'login'),
        ]);
    }

    /**
     * Handle an incoming authentication request with Local-First caching and On-Demand Portal API fallback.
     */
    public function store(Request $request): RedirectResponse
    {
        // Support login identifier from field 'email', 'username', or 'login'
        $loginIdentifier = trim((string) ($request->input('email') ?? $request->input('username') ?? $request->input('login')));
        $password = (string) $request->input('password');

        if (empty($loginIdentifier) || empty($password)) {
            throw ValidationException::withMessages([
                'email' => 'Username / email dan kata sandi wajib diisi.',
            ]);
        }

        $throttleKey = Str::transliterate(Str::lower($loginIdentifier) . '|' . $request->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'email' => "Terlalu banyak percobaan login gagal. Silakan coba lagi dalam {$seconds} detik.",
            ]);
        }

        $authenticatedUser = null;
        $authSource = 'local_db';

        // 1. PRIORITAS UTAMA: Cek kredensial di Database Lokal terlebih dahulu (Hemat resource & tanpa selalu hit API Portal)
        $localUser = User::where('username', $loginIdentifier)
            ->orWhere('email', $loginIdentifier)
            ->first();

        if ($localUser && Hash::check($password, $localUser->password)) {
            // Pengguna cocok di database lokal -> Langsung login tanpa panggil API Portal
            $authenticatedUser = $localUser;
            $authSource = 'local_db';
            Auth::login($authenticatedUser, $request->boolean('remember'));
        }

        // 2. JIKA DI DATABASE LOKAL TIDAK COCOK / BELUM ADA / BERUBAH: Panggil API Portal & sinkronkan ulang ke database lokal
        if (!$authenticatedUser) {
            $portalResult = $this->portalAuthService->authenticate($loginIdentifier, $password);
            if ($portalResult['success'] && $portalResult['user']) {
                $authenticatedUser = $portalResult['user'];
                $authSource = 'portal_api_sync';
                Auth::login($authenticatedUser, $request->boolean('remember'));
            }
        }

        if (!$authenticatedUser) {
            RateLimiter::hit($throttleKey);

            $errorMessage = !empty($portalResult['message']) && $portalResult['message'] !== 'Login Portal gagal.'
                ? $portalResult['message']
                : 'Kredensial yang diberikan tidak cocok dengan data Portal maupun Database Lokal SIRPL.';

            throw ValidationException::withMessages([
                'email' => $errorMessage,
            ]);
        }

        RateLimiter::clear($throttleKey);
        $request->session()->regenerate();

        $user = Auth::user();

        AuditLog::record(
            action: AuditAction::LOGIN,
            entityType: 'User',
            entityId: (string) $user->id,
            newValues: [
                'auth_source' => $authSource,
                'email' => $user->email,
                'username' => $user->username,
                'role' => $user->role?->value ?? (string) $user->role,
            ]
        );

        return redirect()->intended(route('dashboard'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();
        if ($user) {
            AuditLog::record(
                action: AuditAction::LOGOUT,
                entityType: 'User',
                entityId: (string) $user->id
            );
        }

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}

