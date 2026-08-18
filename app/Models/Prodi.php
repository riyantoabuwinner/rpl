<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Prodi extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'prodi';

    protected $fillable = [
        'kode_prodi',
        'nama_prodi',
        'jenjang',
        'fakultas',
        'kaprodi_id',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function kaprodi(): BelongsTo
    {
        return $this->belongsTo(User::class, 'kaprodi_id');
    }

    public function kurikulum(): HasMany
    {
        return $this->hasMany(Kurikulum::class, 'prodi_id');
    }

    public function pendaftar(): HasMany
    {
        return $this->hasMany(RplPendaftar::class, 'prodi_id');
    }
}
