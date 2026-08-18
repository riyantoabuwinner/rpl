<?php

namespace App\Models;

use App\Enums\ApplicationStatus;
use App\Enums\RplType;
use App\Enums\SlaStatus;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class RplPendaftar extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'rpl_pendaftar';

    protected $fillable = [
        'user_id',
        'gelombang_id',
        'prodi_id',
        'nomor_pendaftaran',
        'nama_lengkap',
        'nik',
        'email',
        'telepon',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'alamat_lengkap',
        'pekerjaan_saat_ini',
        'instansi_pekerjaan',
        'status_pernikahan',
        'kebangsaan',
        'rt_rw',
        'kecamatan',
        'kabupaten_kota',
        'kode_pos',
        'telepon_rumah',
        'telepon_kantor',
        'lampiran_evaluasi_diri',
        'lampiran_drh',
        'lampiran_ijazah_transkrip',
        'lampiran_lainnya',
        'jenis_rpl',
        'status_pendaftaran',
        'tanggal_submit',
        'sla_verifikasi_due_at',
        'sla_asesmen_due_at',
        'tanggal_verifikasi',
        'verifikator_id',
        'catatan_verifikasi',
        'total_sks_diakui',
        'total_nilai_angka',
        'ipk_rekognisi',
    ];

    protected function casts(): array
    {
        return [
            'jenis_rpl' => RplType::class,
            'status_pendaftaran' => ApplicationStatus::class,
            'tanggal_lahir' => 'date',
            'tanggal_submit' => 'datetime',
            'sla_verifikasi_due_at' => 'datetime',
            'sla_asesmen_due_at' => 'datetime',
            'tanggal_verifikasi' => 'datetime',
            'total_sks_diakui' => 'integer',
            'total_nilai_angka' => 'decimal:2',
            'ipk_rekognisi' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function gelombang(): BelongsTo
    {
        return $this->belongsTo(RplGelombang::class, 'gelombang_id');
    }

    public function prodi(): BelongsTo
    {
        return $this->belongsTo(Prodi::class, 'prodi_id');
    }

    public function verifikator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verifikator_id');
    }

    public function pendidikan(): HasMany
    {
        return $this->hasMany(RplPendidikan::class, 'pendaftar_id');
    }

    public function pengalaman(): HasMany
    {
        return $this->hasMany(RplPengalaman::class, 'pendaftar_id');
    }

    public function bukti(): HasMany
    {
        return $this->hasMany(RplBuktiAsesi::class, 'pendaftar_id');
    }

    public function klaim(): HasMany
    {
        return $this->hasMany(RplKlaimCpmk::class, 'pendaftar_id');
    }

    public function penugasanAsesor(): HasMany
    {
        return $this->hasMany(RplPenugasanAsesor::class, 'pendaftar_id');
    }

    public function ujiPetik(): HasMany
    {
        return $this->hasMany(RplUjiPetik::class, 'pendaftar_id');
    }

    public function konversiNilai(): HasMany
    {
        return $this->hasMany(RplKonversiNilai::class, 'pendaftar_id');
    }

    public function skRekognisi(): HasOne
    {
        return $this->hasOne(RplSkRekognisi::class, 'pendaftar_id');
    }

    public function sanggah(): HasMany
    {
        return $this->hasMany(RplSanggah::class, 'pendaftar_id');
    }

    public function evaluasiDiriCpmk(): HasMany
    {
        return $this->hasMany(RplEvaluasiDiriCpmk::class, 'pendaftar_id');
    }

    // Masked NIK Attribute
    public function getMaskedNikAttribute(): string
    {
        if (!$this->nik || strlen($this->nik) < 16) {
            return $this->nik ?? '';
        }
        return substr($this->nik, 0, 3) . '**********' . substr($this->nik, 13, 3);
    }

    // SLA Evaluation Helper
    public function getSlaStatusAttribute(): SlaStatus
    {
        if (in_array($this->status_pendaftaran, [ApplicationStatus::SELESAI, ApplicationStatus::SINKRONISASI, ApplicationStatus::DISETUJUI])) {
            return SlaStatus::COMPLETED;
        }

        $dueDate = match ($this->status_pendaftaran) {
            ApplicationStatus::TERKIRIM, ApplicationStatus::VERIFIKASI_ADMINISTRASI => $this->sla_verifikasi_due_at,
            ApplicationStatus::VALID, ApplicationStatus::PROSES_ASESMEN, ApplicationStatus::UJI_PETIK => $this->sla_asesmen_due_at,
            default => null,
        };

        if (!$dueDate) {
            return SlaStatus::ON_TRACK;
        }

        $now = Carbon::now();
        if ($now->greaterThan($dueDate)) {
            return SlaStatus::OVERDUE;
        }

        // Within 24 hours of deadline
        if ($now->diffInHours($dueDate, false) <= 24) {
            return SlaStatus::WARNING;
        }

        return SlaStatus::ON_TRACK;
    }
}
