<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RplSanggah extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rpl_sanggah';

    protected $fillable = [
        'pendaftar_id',
        'mata_kuliah_id',
        'nomor_sanggah',
        'alasan_keberatan',
        'bukti_tambahan_path',
        'bukti_tambahan_nama',
        'status_sanggah',
        'tanggapan_tim_rpl',
        'ditinjau_oleh_id',
        'ditinjau_at',
    ];

    protected function casts(): array
    {
        return [
            'ditinjau_at' => 'datetime',
        ];
    }

    public function pendaftar(): BelongsTo
    {
        return $this->belongsTo(RplPendaftar::class, 'pendaftar_id');
    }

    public function mataKuliah(): BelongsTo
    {
        return $this->belongsTo(MataKuliah::class, 'mata_kuliah_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ditinjau_oleh_id');
    }
}
