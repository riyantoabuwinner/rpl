<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RplPleno extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rpl_pleno';

    protected $fillable = [
        'gelombang_id',
        'prodi_id',
        'nomor_berita_acara',
        'tanggal_sidang',
        'ruangan_media',
        'agenda_sidang',
        'kesimpulan_umum',
        'file_berita_acara_pdf',
        'status_pleno',
        'disahkan_oleh_id',
        'disahkan_at',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_sidang' => 'date',
            'disahkan_at' => 'datetime',
        ];
    }

    public function gelombang(): BelongsTo
    {
        return $this->belongsTo(RplGelombang::class, 'gelombang_id');
    }

    public function prodi(): BelongsTo
    {
        return $this->belongsTo(Prodi::class, 'prodi_id');
    }

    public function disahkanOleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'disahkan_oleh_id');
    }

    public function peserta(): HasMany
    {
        return $this->hasMany(RplPlenoPeserta::class, 'pleno_id');
    }

    public function keputusan(): HasMany
    {
        return $this->hasMany(RplPlenoKeputusan::class, 'pleno_id');
    }
}
