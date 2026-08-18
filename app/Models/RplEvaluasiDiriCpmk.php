<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RplEvaluasiDiriCpmk extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rpl_evaluasi_diri_cpmk';

    protected $fillable = [
        'pendaftar_id',
        'mata_kuliah_id',
        'cpmk_id',
        'indikator_cpmk_id',
        'nomor_urut',
        'pernyataan_cpmk',
        'profisiensi',
        'is_valid',
        'is_autentik',
        'is_terkini',
        'is_memadai',
        'nomor_dokumen',
        'jenis_dokumen',
        'catatan_asesor',
    ];

    protected function casts(): array
    {
        return [
            'nomor_urut' => 'integer',
            'is_valid' => 'boolean',
            'is_autentik' => 'boolean',
            'is_terkini' => 'boolean',
            'is_memadai' => 'boolean',
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

    public function cpmk(): BelongsTo
    {
        return $this->belongsTo(Cpmk::class, 'cpmk_id');
    }

    public function indikatorCpmk(): BelongsTo
    {
        return $this->belongsTo(IndikatorCpmk::class, 'indikator_cpmk_id');
    }
}
