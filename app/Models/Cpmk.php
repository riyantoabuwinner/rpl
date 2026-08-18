<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cpmk extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'cpmk';

    protected $fillable = [
        'mata_kuliah_id',
        'kode_cpmk',
        'deskripsi_cpmk',
        'urutan',
    ];

    protected function casts(): array
    {
        return [
            'urutan' => 'integer',
        ];
    }

    public function mataKuliah(): BelongsTo
    {
        return $this->belongsTo(MataKuliah::class, 'mata_kuliah_id');
    }

    public function indikator(): HasMany
    {
        return $this->hasMany(IndikatorCpmk::class, 'cpmk_id')->orderBy('urutan');
    }
}
