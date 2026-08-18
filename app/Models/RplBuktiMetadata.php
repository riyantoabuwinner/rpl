<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RplBuktiMetadata extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rpl_bukti_metadata';

    protected $fillable = [
        'bukti_id',
        'author',
        'creator_tool',
        'producer',
        'pdf_creation_date',
        'pdf_modification_date',
        'exif_raw',
        'is_metadata_suspicious',
        'analisis_risiko',
    ];

    protected function casts(): array
    {
        return [
            'pdf_creation_date' => 'datetime',
            'pdf_modification_date' => 'datetime',
            'exif_raw' => 'array',
            'is_metadata_suspicious' => 'boolean',
        ];
    }

    public function bukti(): BelongsTo
    {
        return $this->belongsTo(RplBuktiAsesi::class, 'bukti_id');
    }
}
