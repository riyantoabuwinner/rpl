<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RplSkRekognisi extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rpl_sk_rekognisi';

    protected $fillable = [
        'pendaftar_id',
        'nomor_sk',
        'tanggal_sk',
        'judul_sk',
        'total_sks_diakui',
        'ipk_konversi',
        'pejabat_nama',
        'pejabat_jabatan',
        'pejabat_nip',
        'file_pdf_path',
        'qr_token',
        'qr_verify_url',
        'document_hash',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_sk' => 'date',
            'total_sks_diakui' => 'integer',
            'ipk_konversi' => 'decimal:2',
        ];
    }

    public function pendaftar(): BelongsTo
    {
        return $this->belongsTo(RplPendaftar::class, 'pendaftar_id');
    }
}
