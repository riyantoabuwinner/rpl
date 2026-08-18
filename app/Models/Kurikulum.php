<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kurikulum extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'kurikulum';

    protected $fillable = [
        'prodi_id',
        'nama_kurikulum',
        'tahun_mulai',
        'tahun_akhir',
        'total_sks_lulus',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'total_sks_lulus' => 'integer',
        ];
    }

    public function prodi(): BelongsTo
    {
        return $this->belongsTo(Prodi::class, 'prodi_id');
    }

    public function mataKuliah(): HasMany
    {
        return $this->hasMany(MataKuliah::class, 'kurikulum_id');
    }
}
