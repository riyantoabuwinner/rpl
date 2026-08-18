<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request and check if authenticated user possesses any of the required roles.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        $userRoleValue = $user->role instanceof UserRole ? $user->role->value : (string) $user->role;

        // Super Admin has universal access
        if ($userRoleValue === UserRole::SUPER_ADMIN->value) {
            return $next($request);
        }

        if (empty($roles)) {
            return $next($request);
        }

        if (in_array($userRoleValue, $roles, true)) {
            return $next($request);
        }

        abort(403, 'Akses Ditolak: Anda tidak memiliki izin untuk mengakses halaman atau aksi ini.');
    }
}
