<?php

namespace App\Models;

use App\Enums\IntegrationStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IntegrationLog extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'integration_logs';

    protected $fillable = [
        'target_system',
        'action',
        'request_id',
        'payload_hash',
        'payload_sanitized',
        'status',
        'response_code',
        'response_message',
        'response_body',
        'retry_count',
        'actor_id',
    ];

    protected function casts(): array
    {
        return [
            'payload_sanitized' => 'array',
            'response_body' => 'array',
            'status' => IntegrationStatus::class,
            'retry_count' => 'integer',
            'response_code' => 'integer',
        ];
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
