<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RplAsesmenVatc extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rpl_asesmen_vatc';

    protected $fillable = [
        'asesmen_id',
        'bukti_id',
        'is_valid',
        'is_asli',
        'is_terkini',
        'is_cukup',
        'catatan_evaluasi',
    ];

    protected function casts(): array
    {
        return [
            'is_valid' => 'boolean',
            'is_asli' => 'boolean',
            'is_terkini' => 'boolean',
            'is_cukup' => 'boolean',
        ];
    }

    public function asesmen(): BelongsTo
    {
        return $this->belongsTo(RplAsesmen::class, 'asesmen_id');
    }

    public function bukti(): BelongsTo
    {
        return $this->belongsTo(RplBuktiAsesi::class, 'bukti_id');
    }
}
