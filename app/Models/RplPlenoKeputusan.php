<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RplPlenoKeputusan extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rpl_pleno_keputusan';

    protected $fillable = [
        'pleno_id',
        'pendaftar_id',
        'status_keputusan',
        'total_sks_diakui',
        'sisa_sks_harus_ditempuh',
        'estimasi_semester',
        'catatan_khusus',
    ];

    protected function casts(): array
    {
        return [
            'total_sks_diakui' => 'integer',
            'sisa_sks_harus_ditempuh' => 'integer',
            'estimasi_semester' => 'integer',
        ];
    }

    public function pleno(): BelongsTo
    {
        return $this->belongsTo(RplPleno::class, 'pleno_id');
    }

    public function pendaftar(): BelongsTo
    {
        return $this->belongsTo(RplPendaftar::class, 'pendaftar_id');
    }
}
