<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class RplKlaimCpmk extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rpl_klaim_cpmk';

    protected $fillable = [
        'pendaftar_id',
        'mata_kuliah_id',
        'cpmk_id',
        'indikator_cpmk_id',
        'deskripsi_pengalaman_relevan',
        'tingkat_kemampuan_diri',
    ];

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

    public function bukti(): BelongsToMany
    {
        return $this->belongsToMany(RplBuktiAsesi::class, 'rpl_klaim_bukti', 'klaim_id', 'bukti_id');
    }
}
