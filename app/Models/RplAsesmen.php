<?php

namespace App\Models;

use App\Enums\RecognitionStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RplAsesmen extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rpl_asesmen';

    protected $fillable = [
        'penugasan_id',
        'pendaftar_id',
        'mata_kuliah_id',
        'asesor_id',
        'status_rekognisi',
        'nilai_rekomendasi',
        'nilai_angka',
        'sks_rekomendasi',
        'is_butuh_uji_petik',
        'alasan_uji_petik',
        'catatan_asesor',
        'catatan_internal',
        'is_final',
        'finalized_at',
    ];

    protected function casts(): array
    {
        return [
            'status_rekognisi' => RecognitionStatus::class,
            'nilai_angka' => 'decimal:2',
            'sks_rekomendasi' => 'integer',
            'is_butuh_uji_petik' => 'boolean',
            'is_final' => 'boolean',
            'finalized_at' => 'datetime',
        ];
    }

    public function penugasan(): BelongsTo
    {
        return $this->belongsTo(RplPenugasanAsesor::class, 'penugasan_id');
    }

    public function pendaftar(): BelongsTo
    {
        return $this->belongsTo(RplPendaftar::class, 'pendaftar_id');
    }

    public function mataKuliah(): BelongsTo
    {
        return $this->belongsTo(MataKuliah::class, 'mata_kuliah_id');
    }

    public function asesor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'asesor_id');
    }

    public function vatcList(): HasMany
    {
        return $this->hasMany(RplAsesmenVatc::class, 'asesmen_id');
    }

    // Helper to evaluate overall VATC
    public function isVatcComplete(): bool
    {
        if ($this->vatcList->isEmpty()) {
            return false;
        }
        foreach ($this->vatcList as $vatc) {
            if (!$vatc->is_valid || !$vatc->is_asli || !$vatc->is_terkini || !$vatc->is_cukup) {
                return false;
            }
        }
        return true;
    }
}
