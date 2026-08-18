<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RplPenugasanAsesor extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rpl_penugasan_asesor';

    protected $fillable = [
        'pendaftar_id',
        'asesor_id',
        'ditugaskan_oleh_id',
        'tanggal_penugasan',
        'tanggal_mulai_asesmen',
        'tanggal_selesai_asesmen',
        'status_penugasan',
        'catatan_admin',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_penugasan' => 'datetime',
            'tanggal_mulai_asesmen' => 'datetime',
            'tanggal_selesai_asesmen' => 'datetime',
        ];
    }

    public function pendaftar(): BelongsTo
    {
        return $this->belongsTo(RplPendaftar::class, 'pendaftar_id');
    }

    public function asesor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'asesor_id');
    }

    public function ditugaskanOleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ditugaskan_oleh_id');
    }

    public function asesmen(): HasMany
    {
        return $this->hasMany(RplAsesmen::class, 'penugasan_id');
    }
}
