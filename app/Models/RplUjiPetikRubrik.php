<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RplUjiPetikRubrik extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rpl_uji_petik_rubrik';

    protected $fillable = [
        'nama_dimensi',
        'deskripsi_indikator',
        'bobot_persen',
        'urutan',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'bobot_persen' => 'decimal:2',
            'urutan' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function nilai(): HasMany
    {
        return $this->hasMany(RplUjiPetikNilai::class, 'rubrik_id');
    }
}
