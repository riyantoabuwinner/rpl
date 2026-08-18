<?php

namespace App\Models;

use App\Enums\DocumentType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class RplBuktiAsesi extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'rpl_bukti_asesi';

    protected $fillable = [
        'pendaftar_id',
        'nama_dokumen',
        'jenis_bukti',
        'file_path',
        'file_original_name',
        'file_hash',
        'file_size',
        'mime_type',
        'tahun_penerbitan',
        'penerbit_institusi',
        'deskripsi_dokumen',
        'is_potential_duplicate',
        'duplicate_of_id',
    ];

    protected function casts(): array
    {
        return [
            'jenis_bukti' => DocumentType::class,
            'file_size' => 'integer',
            'is_potential_duplicate' => 'boolean',
        ];
    }

    public function pendaftar(): BelongsTo
    {
        return $this->belongsTo(RplPendaftar::class, 'pendaftar_id');
    }

    public function metadata(): HasOne
    {
        return $this->hasOne(RplBuktiMetadata::class, 'bukti_id');
    }

    public function duplicateOf(): BelongsTo
    {
        return $this->belongsTo(RplBuktiAsesi::class, 'duplicate_of_id');
    }

    public function klaim(): BelongsToMany
    {
        return $this->belongsToMany(RplKlaimCpmk::class, 'rpl_klaim_bukti', 'bukti_id', 'klaim_id');
    }

    // Temporary Signed URL Generator (15-Minute TTL)
    public function getTemporaryUrl(int $minutes = 15): string
    {
        return URL::temporarySignedRoute(
            'documents.preview',
            now()->addMinutes($minutes),
            ['bukti' => $this->id]
        );
    }
}
