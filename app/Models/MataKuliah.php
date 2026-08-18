<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MataKuliah extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'mata_kuliah';

    protected $fillable = [
        'kurikulum_id',
        'kode_mk',
        'nama_mk',
        'sks',
        'semester',
        'kategori_mk',
        'terbuka_rpl',
        'deskripsi',
        'silabus_ringkas',
    ];

    protected function casts(): array
    {
        return [
            'sks' => 'integer',
            'semester' => 'integer',
            'terbuka_rpl' => 'boolean',
        ];
    }

    public function kurikulum(): BelongsTo
    {
        return $this->belongsTo(Kurikulum::class, 'kurikulum_id');
    }

    public function cpmk(): HasMany
    {
        return $this->hasMany(Cpmk::class, 'mata_kuliah_id')->orderBy('urutan');
    }

    public function klaim(): HasMany
    {
        return $this->hasMany(RplKlaimCpmk::class, 'mata_kuliah_id');
    }

    public function asesmen(): HasMany
    {
        return $this->hasMany(RplAsesmen::class, 'mata_kuliah_id');
    }
}
