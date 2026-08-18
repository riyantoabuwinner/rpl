<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IndikatorCpmk extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'indikator_cpmk';

    protected $fillable = [
        'cpmk_id',
        'kode_indikator',
        'deskripsi_indikator',
        'urutan',
    ];

    protected function casts(): array
    {
        return [
            'urutan' => 'integer',
        ];
    }

    public function cpmk(): BelongsTo
    {
        return $this->belongsTo(Cpmk::class, 'cpmk_id');
    }
}
