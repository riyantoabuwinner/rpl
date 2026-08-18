<?php

namespace App\Models;

use App\Enums\InterviewType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RplUjiPetik extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rpl_uji_petik';

    protected $fillable = [
        'pendaftar_id',
        'mata_kuliah_id',
        'interviewer_id',
        'jenis_uji',
        'metode_pelaksanaan',
        'jadwal_mulai',
        'jadwal_selesai',
        'link_meeting',
        'lokasi_ruangan',
        'recording_url',
        'skor_akhir',
        'nilai_huruf',
        'nilai_angka',
        'status_kelulusan',
        'catatan_hasil',
        'status_uji',
    ];

    protected function casts(): array
    {
        return [
            'jenis_uji' => InterviewType::class,
            'jadwal_mulai' => 'datetime',
            'jadwal_selesai' => 'datetime',
            'skor_akhir' => 'decimal:2',
            'nilai_angka' => 'decimal:2',
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

    public function interviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'interviewer_id');
    }

    public function nilaiList(): HasMany
    {
        return $this->hasMany(RplUjiPetikNilai::class, 'uji_petik_id');
    }

    // Formula calculation based on 4-dimension rubrics
    public function calculateFinalScore(): array
    {
        $totalScore = 0;
        foreach ($this->nilaiList as $nilai) {
            $totalScore += (float) $nilai->skor_tertimbang;
        }

        // Conversion threshold
        // >= 3.50 -> A (4.00)
        // 3.00 - 3.49 -> B+ (3.50)
        // 2.70 - 2.99 -> B (3.00)
        // < 2.70 -> Ditolak (0.00)
        $scoreRounded = round($totalScore, 2);
        if ($scoreRounded >= 3.50) {
            $nilaiHuruf = 'A';
            $nilaiAngka = 4.00;
            $status = 'Lulus';
        } elseif ($scoreRounded >= 3.00) {
            $nilaiHuruf = 'B+';
            $nilaiAngka = 3.50;
            $status = 'Lulus';
        } elseif ($scoreRounded >= 2.70) {
            $nilaiHuruf = 'B';
            $nilaiAngka = 3.00;
            $status = 'Lulus';
        } else {
            $nilaiHuruf = 'E';
            $nilaiAngka = 0.00;
            $status = 'Ditolak';
        }

        return [
            'skor_akhir' => $scoreRounded,
            'nilai_huruf' => $nilaiHuruf,
            'nilai_angka' => $nilaiAngka,
            'status_kelulusan' => $status,
        ];
    }
}
