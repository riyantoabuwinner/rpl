<?php

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'nik',
        'phone',
        'role',
        'avatar_path',
        'is_active',
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_confirmed_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'two_factor_confirmed_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'role' => UserRole::class,
        ];
    }

    // Role check helpers
    public function hasRole(UserRole|string $role): bool
    {
        $roleValue = $role instanceof UserRole ? $role->value : $role;
        return $this->role?->value === $roleValue || $this->role === $roleValue;
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRole(UserRole::SUPER_ADMIN);
    }

    public function isAdminRpl(): bool
    {
        return $this->hasRole(UserRole::ADMIN_RPL);
    }

    public function isAsesi(): bool
    {
        return $this->hasRole(UserRole::ASESI);
    }

    public function isAsesor(): bool
    {
        return $this->hasRole(UserRole::ASESOR);
    }

    public function isKaprodi(): bool
    {
        return $this->hasRole(UserRole::KAPRODI);
    }

    public function isLpm(): bool
    {
        return $this->hasRole(UserRole::LPM);
    }

    public function isAdminSiakad(): bool
    {
        return $this->hasRole(UserRole::ADMIN_SIAKAD);
    }

    // NIK Masking helper
    public function getMaskedNikAttribute(): ?string
    {
        if (!$this->nik || strlen($this->nik) < 16) {
            return $this->nik;
        }
        return substr($this->nik, 0, 3) . '**********' . substr($this->nik, 13, 3);
    }

    // Relationships
    public function pendaftar(): HasOne
    {
        return $this->hasOne(RplPendaftar::class, 'user_id');
    }

    public function penugasanAsesor(): HasMany
    {
        return $this->hasMany(RplPenugasanAsesor::class, 'asesor_id');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class, 'user_id');
    }
}
