<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RplPengalaman extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rpl_pengalaman';

    protected $fillable = [
        'pendaftar_id',
        'nama_instansi',
        'jabatan_posisi',
        'tanggal_mulai',
        'tanggal_selesai',
        'is_masih_bekerja',
        'deskripsi_tugas_kunci',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
            'is_masih_bekerja' => 'boolean',
        ];
    }

    public function pendaftar(): BelongsTo
    {
        return $this->belongsTo(RplPendaftar::class, 'pendaftar_id');
    }
}
