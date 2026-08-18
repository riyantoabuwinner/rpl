<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RplPendidikan extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rpl_pendidikan';

    protected $fillable = [
        'pendaftar_id',
        'jenjang',
        'nama_institusi',
        'jurusan',
        'nomor_ijazah',
        'tahun_lulus',
        'ipk_nilai_akhir',
    ];

    protected function casts(): array
    {
        return [
            'ipk_nilai_akhir' => 'decimal:2',
        ];
    }

    public function pendaftar(): BelongsTo
    {
        return $this->belongsTo(RplPendaftar::class, 'pendaftar_id');
    }
}
