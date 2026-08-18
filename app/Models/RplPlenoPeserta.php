<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RplPlenoPeserta extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rpl_pleno_peserta';

    protected $fillable = [
        'pleno_id',
        'user_id',
        'peran_sidang',
        'is_hadir',
        'tanda_tangan_token',
        'signed_at',
    ];

    protected function casts(): array
    {
        return [
            'is_hadir' => 'boolean',
            'signed_at' => 'datetime',
        ];
    }

    public function pleno(): BelongsTo
    {
        return $this->belongsTo(RplPleno::class, 'pleno_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
