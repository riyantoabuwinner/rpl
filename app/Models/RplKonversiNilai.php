<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RplKonversiNilai extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rpl_konversi_nilai';

    protected $fillable = [
        'pendaftar_id',
        'mata_kuliah_id',
        'kode_mata_kuliah_asal',
        'nama_mata_kuliah_asal',
        'sks_mata_kuliah_asal',
        'nilai_huruf_asal',
        'kode_mk_diakui',
        'nama_mk_diakui',
        'sks_diakui',
        'nilai_huruf',
        'nilai_indeks',
        'status_sync_siakad',
        'synced_siakad_at',
        'status_sync_pddikti',
        'synced_pddikti_at',
        'pddikti_id_transfer',
    ];

    protected function casts(): array
    {
        return [
            'sks_mata_kuliah_asal' => 'integer',
            'sks_diakui' => 'integer',
            'nilai_indeks' => 'decimal:2',
            'synced_siakad_at' => 'datetime',
            'synced_pddikti_at' => 'datetime',
        ];
    }

    public function pendaftar(): BelongsTo
    {
        return $this->belongsTo(RplPendaftar::class, 'pendaftar_id');
    }

    public function mataKuliah(): BelongsTo
    {
        return $this->belongsTo(MataKuliah::class, 'mata_kuliah_id');
    }

    // Helper to generate official PDDikti Feeder payload according to PDF Spec
    public function toPddiktiPayload(string $feederToken, string $idRegistrasiMahasiswa, string $idMatkul): array
    {
        return [
            'act' => 'InsertNilaiTransferMatkul',
            'token' => $feederToken,
            'record' => [
                'id_registrasi_mahasiswa' => $idRegistrasiMahasiswa,
                'id_matkul' => $idMatkul,
                'kode_mata_kuliah_asal' => $this->kode_mata_kuliah_asal,
                'nama_mata_kuliah_asal' => $this->nama_mata_kuliah_asal,
                'sks_mata_kuliah_asal' => (int) $this->sks_mata_kuliah_asal,
                'sks_mata_kuliah_diakui' => (int) $this->sks_diakui,
                'nilai_huruf_asal' => $this->nilai_huruf_asal,
                'nilai_angka_diakui' => (float) $this->nilai_indeks,
                'nilai_huruf_diakui' => $this->nilai_huruf,
            ],
        ];
    }
}
