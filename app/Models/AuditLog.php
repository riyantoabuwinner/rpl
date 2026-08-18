<?php

namespace App\Models;

use App\Enums\AuditAction;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class AuditLog extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'audit_logs';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'role',
        'action',
        'entity_type',
        'entity_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'request_id',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'action' => AuditAction::class,
            'old_values' => 'array',
            'new_values' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Static Logger helper
    public static function record(
        AuditAction|string $action,
        ?string $entityType = null,
        ?string $entityId = null,
        ?array $oldValues = null,
        ?array $newValues = null
    ): self {
        $user = auth()->user();
        return self::create([
            'id' => (string) Str::uuid(),
            'user_id' => $user?->id,
            'role' => $user?->role?->value ?? ($user?->role ?? 'guest'),
            'action' => $action instanceof AuditAction ? $action : AuditAction::from($action),
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'request_id' => (string) Str::uuid(),
            'created_at' => now(),
        ]);
    }
}
