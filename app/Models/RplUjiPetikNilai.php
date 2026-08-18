<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RplUjiPetikNilai extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rpl_uji_petik_nilai';

    protected $fillable = [
        'uji_petik_id',
        'rubrik_id',
        'skor',
        'skor_tertimbang',
        'catatan_evaluasi',
    ];

    protected function casts(): array
    {
        return [
            'skor' => 'integer',
            'skor_tertimbang' => 'decimal:3',
        ];
    }

    public function ujiPetik(): BelongsTo
    {
        return $this->belongsTo(RplUjiPetik::class, 'uji_petik_id');
    }

    public function rubrik(): BelongsTo
    {
        return $this->belongsTo(RplUjiPetikRubrik::class, 'rubrik_id');
    }
}
