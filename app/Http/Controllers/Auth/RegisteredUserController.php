<?php

namespace App\Http\Controllers\Auth;

use App\Enums\AuditAction;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'initialTab' => 'register',
        ]);
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'nik' => ['required', 'string', 'digits:16', 'unique:'.User::class],
            'phone' => ['required', 'string', 'max:20'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'nik.digits' => 'Nomor Induk Kependudukan (NIK) wajib 16 digit.',
            'nik.unique' => 'NIK ini sudah terdaftar dalam sistem.',
            'email.unique' => 'Alamat email ini sudah terdaftar.',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'nik' => $request->nik,
            'phone' => $request->phone,
            'role' => UserRole::ASESI,
            'password' => Hash::make($request->password),
            'is_active' => true,
        ]);

        event(new Registered($user));

        Auth::login($user);

        AuditLog::record(
            action: AuditAction::LOGIN,
            entityType: 'User',
            entityId: (string) $user->id,
            newValues: ['name' => $user->name, 'email' => $user->email, 'role' => 'asesi']
        );

        return redirect()->route('dashboard')->with('success', 'Akun pendaftaran berhasil dibuat! Silakan lanjutkan pengisian formulir evaluasi diri.');
    }
}
