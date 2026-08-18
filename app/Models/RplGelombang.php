<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class RplGelombang extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'rpl_gelombang';

    protected $fillable = [
        'nama_gelombang',
        'tahun_akademik',
        'semester',
        'tanggal_buka',
        'tanggal_tutup',
        'tanggal_pengumuman',
        'biaya_pendaftaran',
        'biaya_asesmen_per_sks',
        'kuota_pendaftar',
        'is_active',
        'catatan_panduan',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_buka' => 'date',
            'tanggal_tutup' => 'date',
            'tanggal_pengumuman' => 'date',
            'biaya_pendaftaran' => 'decimal:2',
            'biaya_asesmen_per_sks' => 'decimal:2',
            'kuota_pendaftar' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function pendaftar(): HasMany
    {
        return $this->hasMany(RplPendaftar::class, 'gelombang_id');
    }

    public function isOpen(): bool
    {
        $now = now()->toDateString();
        return $this->is_active && $this->tanggal_buka <= $now && $this->tanggal_tutup >= $now;
    }
}
