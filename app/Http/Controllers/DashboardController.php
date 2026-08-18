<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationStatus;
use App\Enums\RecognitionStatus;
use App\Enums\RplType;
use App\Enums\UserRole;
use App\Models\AuditLog;
use App\Models\IntegrationLog;
use App\Models\MataKuliah;
use App\Models\Prodi;
use App\Models\RplAsesmen;
use App\Models\RplBuktiAsesi;
use App\Models\RplGelombang;
use App\Models\RplKonversiNilai;
use App\Models\RplPendaftar;
use App\Models\RplPenugasanAsesor;
use App\Models\RplPleno;
use App\Models\RplUjiPetik;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $userRole = $user->role instanceof UserRole ? $user->role : UserRole::tryFrom((string) $user->role) ?? UserRole::ASESI;

        return match ($userRole) {
            UserRole::SUPER_ADMIN, UserRole::ADMIN_RPL => $this->adminDashboard($request),
            UserRole::ASESOR => $this->asesorDashboard($request, $user),
            UserRole::ASESI => $this->asesiDashboard($request, $user),
            UserRole::KAPRODI => $this->kaprodiDashboard($request, $user),
            UserRole::LPM => $this->lpmDashboard($request, $user),
            UserRole::ADMIN_SIAKAD => $this->siakadDashboard($request, $user),
        };
    }

    /**
     * Dashboard Admin Pusat RPL & Super Admin
     */
    protected function adminDashboard(Request $request): Response
    {
        $activeGelombang = RplGelombang::where('is_active', true)->latest()->first();

        $stats = [
            'total_pendaftar' => RplPendaftar::count(),
            'baru_terkirim' => RplPendaftar::whereIn('status_pendaftaran', [ApplicationStatus::TERKIRIM, ApplicationStatus::VERIFIKASI_ADMINISTRASI])->count(),
            'sedang_asesmen' => RplPendaftar::where('status_pendaftaran', ApplicationStatus::PROSES_ASESMEN)->count(),
            'menunggu_uji_petik' => RplPendaftar::where('status_pendaftaran', ApplicationStatus::UJI_PETIK)->count(),
            'menunggu_pleno' => RplPendaftar::where('status_pendaftaran', ApplicationStatus::PLENO)->count(),
            'selesai_sk' => RplPendaftar::whereIn('status_pendaftaran', [ApplicationStatus::PENERBITAN_SK, ApplicationStatus::SELESAI, ApplicationStatus::SINKRONISASI])->count(),
            'ditolak' => RplPendaftar::whereIn('status_pendaftaran', [ApplicationStatus::DITOLAK_ADMINISTRASI, ApplicationStatus::DITOLAK])->count(),
            'total_sks_diakui' => (int) RplKonversiNilai::sum('sks_diakui'),
            'total_asesor_aktif' => User::where('role', UserRole::ASESOR->value)->count(),
        ];

        // Distribution by Prodi
        $prodiStats = Prodi::withCount('pendaftar')->get()->map(fn($p) => [
            'id' => $p->id,
            'nama_prodi' => $p->nama_prodi,
            'jenjang' => $p->jenjang,
            'total_pendaftar' => $p->pendaftar_count,
        ]);

        // Distribution by RPL Track
        $jalurStats = [
            'A1' => RplPendaftar::where('jenis_rpl', RplType::A1->value)->count(),
            'A2' => RplPendaftar::where('jenis_rpl', RplType::A2->value)->count(),
            'B' => RplPendaftar::where('jenis_rpl', RplType::B->value)->count(),
        ];

        // Recent Pendaftar
        $recentPendaftar = RplPendaftar::with(['prodi:id,nama_prodi', 'user:id,name,email'])
            ->latest('created_at')
            ->take(8)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'nomor_pendaftaran' => $p->nomor_pendaftaran,
                'nama_lengkap' => $p->nama_lengkap,
                'nik_masked' => $p->masked_nik,
                'prodi' => $p->prodi?->nama_prodi,
                'jenis_rpl' => $p->jenis_rpl->value ?? (string) $p->jenis_rpl,
                'status' => $p->status_pendaftaran->value ?? (string) $p->status_pendaftaran,
                'status_label' => $p->status_pendaftaran->label(),
                'status_color' => $p->status_pendaftaran->badgeColor(),
                'sla_status' => $p->sla_status->value,
                'sla_label' => $p->sla_status->label(),
                'sla_color' => $p->sla_status->badgeColor(),
                'created_at' => $p->created_at->format('d M Y H:i'),
            ]);

        // Recent Audit Logs
        $recentLogs = AuditLog::with('user:id,name,role')
            ->latest('created_at')
            ->take(6)
            ->get()
            ->map(fn($l) => [
                'id' => $l->id,
                'action' => $l->action->value ?? (string) $l->action,
                'user_name' => $l->user?->name ?? 'System',
                'role' => $l->role,
                'ip_address' => $l->ip_address,
                'created_at' => $l->created_at->diffForHumans(),
            ]);

        return Inertia::render('Dashboard/AdminDashboard', [
            'stats' => $stats,
            'prodiStats' => $prodiStats,
            'jalurStats' => $jalurStats,
            'recentPendaftar' => $recentPendaftar,
            'recentLogs' => $recentLogs,
            'activeGelombang' => $activeGelombang ? [
                'id' => $activeGelombang->id,
                'nama' => $activeGelombang->nama_gelombang,
                'tahun' => $activeGelombang->tahun_akademik,
                'semester' => $activeGelombang->semester,
                'tutup' => $activeGelombang->tanggal_tutup->format('d M Y'),
            ] : null,
        ]);
    }

    /**
     * Dashboard Asesor / Dosen Evaluator
     */
    protected function asesorDashboard(Request $request, User $user): Response
    {
        $penugasanQuery = RplPenugasanAsesor::where('asesor_id', $user->id)
            ->with([
                'pendaftar.prodi:id,nama_prodi',
                'pendaftar.user:id,name,email',
                'asesmen',
            ]);

        $totalDitugaskan = (clone $penugasanQuery)->count();
        $menungguAsesmen = (clone $penugasanQuery)->where('status_penugasan', 'ditugaskan')->count();
        $sedangDinilai = (clone $penugasanQuery)->where('status_penugasan', 'sedang_dinilai')->count();
        $selesaiAsesmen = (clone $penugasanQuery)->where('status_penugasan', 'selesai')->count();

        $ujiPetikCount = RplUjiPetik::where('interviewer_id', $user->id)
            ->where('status_uji', 'dijadwalkan')
            ->count();

        // Priority task list for Asesor
        $taskList = $penugasanQuery->latest('tanggal_penugasan')->get()->map(function ($penugasan) {
            $p = $penugasan->pendaftar;
            $totalMatkulKlaim = $p->klaim()->distinct('mata_kuliah_id')->count();
            $totalAssessed = $penugasan->asesmen()->where('is_final', true)->count();

            return [
                'id' => $penugasan->id,
                'pendaftar_id' => $p->id,
                'nomor_pendaftaran' => $p->nomor_pendaftaran,
                'nama_asesi' => $p->nama_lengkap,
                'prodi' => $p->prodi?->nama_prodi,
                'jenis_rpl' => $p->jenis_rpl->value ?? (string) $p->jenis_rpl,
                'status_penugasan' => $penugasan->status_penugasan,
                'progress_assessed' => "{$totalAssessed}/{$totalMatkulKlaim}",
                'sla_due_at' => $p->sla_asesmen_due_at?->format('d M Y H:i') ?? 'N/A',
                'sla_status' => $p->sla_status->value,
                'sla_label' => $p->sla_status->label(),
                'sla_color' => $p->sla_status->badgeColor(),
                'tanggal_penugasan' => $penugasan->tanggal_penugasan->format('d M Y'),
            ];
        });

        // Upcoming Uji Petik schedule
        $upcomingInterviews = RplUjiPetik::where('interviewer_id', $user->id)
            ->where('status_uji', 'dijadwalkan')
            ->with(['pendaftar:id,nama_lengkap,nomor_pendaftaran', 'mataKuliah:id,kode_mk,nama_mk'])
            ->orderBy('jadwal_mulai')
            ->take(5)
            ->get()
            ->map(fn($u) => [
                'id' => $u->id,
                'nama_asesi' => $u->pendaftar?->nama_lengkap,
                'mata_kuliah' => $u->mataKuliah ? "{$u->mataKuliah->kode_mk} - {$u->mataKuliah->nama_mk}" : 'Wawancara Umum',
                'jenis_uji' => $u->jenis_uji->label(),
                'metode' => $u->metode_pelaksanaan,
                'jadwal' => $u->jadwal_mulai->format('d M Y, H:i') . ' WIB',
                'link_meeting' => $u->link_meeting,
                'lokasi' => $u->lokasi_ruangan,
            ]);

        return Inertia::render('Dashboard/AsesorDashboard', [
            'stats' => [
                'total_ditugaskan' => $totalDitugaskan,
                'menunggu_asesmen' => $menungguAsesmen,
                'sedang_dinilai' => $sedangDinilai,
                'selesai_asesmen' => $selesaiAsesmen,
                'uji_petik_aktif' => $ujiPetikCount,
            ],
            'taskList' => $taskList,
            'upcomingInterviews' => $upcomingInterviews,
        ]);
    }

    /**
     * Dashboard Asesi (Calon Mahasiswa)
     */
    protected function asesiDashboard(Request $request, User $user): Response
    {
        $pendaftar = RplPendaftar::where('user_id', $user->id)
            ->with([
                'prodi:id,nama_prodi,jenjang',
                'gelombang:id,nama_gelombang,tahun_akademik,semester,tanggal_tutup',
                'bukti',
                'klaim.mataKuliah',
                'ujiPetik',
                'skRekognisi',
            ])
            ->latest('created_at')
            ->first();

        $activeGelombang = RplGelombang::where('is_active', true)->latest()->first();

        $pendaftarData = null;
        if ($pendaftar) {
            $pendaftarData = [
                'id' => $pendaftar->id,
                'nomor_pendaftaran' => $pendaftar->nomor_pendaftaran,
                'nama_lengkap' => $pendaftar->nama_lengkap,
                'nik_masked' => $pendaftar->masked_nik,
                'prodi' => $pendaftar->prodi?->nama_prodi,
                'jenis_rpl' => $pendaftar->jenis_rpl->value ?? (string) $pendaftar->jenis_rpl,
                'jenis_rpl_label' => $pendaftar->jenis_rpl->label(),
                'status' => $pendaftar->status_pendaftaran->value ?? (string) $pendaftar->status_pendaftaran,
                'status_label' => $pendaftar->status_pendaftaran->label(),
                'status_color' => $pendaftar->status_pendaftaran->badgeColor(),
                'total_bukti' => $pendaftar->bukti->count(),
                'total_klaim_mk' => $pendaftar->klaim->pluck('mata_kuliah_id')->unique()->count(),
                'total_sks_diakui' => $pendaftar->total_sks_diakui,
                'catatan_verifikasi' => $pendaftar->catatan_verifikasi,
                'sk_available' => (bool) $pendaftar->skRekognisi,
                'sk_id' => $pendaftar->skRekognisi?->id,
                'uji_petik' => $pendaftar->ujiPetik->map(fn($u) => [
                    'id' => $u->id,
                    'jenis' => $u->jenis_uji->label(),
                    'metode' => $u->metode_pelaksanaan,
                    'jadwal' => $u->jadwal_mulai->format('d M Y, H:i') . ' WIB',
                    'link_meeting' => $u->link_meeting,
                    'lokasi' => $u->lokasi_ruangan,
                    'status' => $u->status_uji,
                ]),
            ];
        }

        return Inertia::render('Dashboard/AsesiDashboard', [
            'pendaftar' => $pendaftarData,
            'activeGelombang' => $activeGelombang ? [
                'id' => $activeGelombang->id,
                'nama' => $activeGelombang->nama_gelombang,
                'tahun' => $activeGelombang->tahun_akademik,
                'semester' => $activeGelombang->semester,
                'tutup' => $activeGelombang->tanggal_tutup->format('d M Y'),
                'is_open' => $activeGelombang->isOpen(),
            ] : null,
        ]);
    }

    /**
     * Dashboard Kaprodi / Pimpinan
     */
    protected function kaprodiDashboard(Request $request, User $user): Response
    {
        $prodi = Prodi::where('kaprodi_id', $user->id)->first() ?? Prodi::first();

        $stats = [
            'total_pendaftar_prodi' => $prodi ? RplPendaftar::where('prodi_id', $prodi->id)->count() : 0,
            'proses_asesmen' => $prodi ? RplPendaftar::where('prodi_id', $prodi->id)->where('status_pendaftaran', ApplicationStatus::PROSES_ASESMEN)->count() : 0,
            'menunggu_pleno' => $prodi ? RplPendaftar::where('prodi_id', $prodi->id)->where('status_pendaftaran', ApplicationStatus::PLENO)->count() : 0,
            'selesai_sk' => $prodi ? RplPendaftar::where('prodi_id', $prodi->id)->whereIn('status_pendaftaran', [ApplicationStatus::PENERBITAN_SK, ApplicationStatus::SELESAI])->count() : 0,
        ];

        $pendaftarList = $prodi ? RplPendaftar::where('prodi_id', $prodi->id)
            ->with(['user:id,name', 'skRekognisi'])
            ->latest('created_at')
            ->take(10)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'nomor_pendaftaran' => $p->nomor_pendaftaran,
                'nama_lengkap' => $p->nama_lengkap,
                'jenis_rpl' => $p->jenis_rpl->value ?? (string) $p->jenis_rpl,
                'status' => $p->status_pendaftaran->value ?? (string) $p->status_pendaftaran,
                'status_label' => $p->status_pendaftaran->label(),
                'status_color' => $p->status_pendaftaran->badgeColor(),
                'total_sks_diakui' => $p->total_sks_diakui,
                'created_at' => $p->created_at->format('d M Y'),
            ]) : [];

        return Inertia::render('Dashboard/KaprodiDashboard', [
            'prodi' => $prodi ? [
                'id' => $prodi->id,
                'nama_prodi' => $prodi->nama_prodi,
                'jenjang' => $prodi->jenjang,
            ] : null,
            'stats' => $stats,
            'pendaftarList' => $pendaftarList,
        ]);
    }

    /**
     * Dashboard LPM (Penjaminan Mutu)
     */
    protected function lpmDashboard(Request $request, User $user): Response
    {
        $totalPendaftar = RplPendaftar::count();
        $sampleCount = (int) ceil($totalPendaftar * 0.10); // 10% sampling

        $stats = [
            'total_pendaftar' => $totalPendaftar,
            'sample_target_10pct' => $sampleCount,
            'potential_duplicate_docs' => RplBuktiAsesi::where('is_potential_duplicate', true)->count(),
            'sla_overdue_count' => RplPendaftar::where('status_pendaftaran', ApplicationStatus::PROSES_ASESMEN)
                ->where('sla_asesmen_due_at', '<', now())
                ->count(),
            'total_audit_logs' => AuditLog::count(),
        ];

        // 10% Random Sampling Pendaftar for QA Inspection
        $samplePendaftar = RplPendaftar::with(['prodi:id,nama_prodi', 'bukti', 'penugasanAsesor.asesor:id,name'])
            ->inRandomOrder()
            ->take($sampleCount > 0 ? $sampleCount : 5)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'nomor_pendaftaran' => $p->nomor_pendaftaran,
                'nama_lengkap' => $p->nama_lengkap,
                'prodi' => $p->prodi?->nama_prodi,
                'jenis_rpl' => $p->jenis_rpl->value ?? (string) $p->jenis_rpl,
                'status' => $p->status_pendaftaran->label(),
                'total_dokumen' => $p->bukti->count(),
                'asesor' => $p->penugasanAsesor->first()?->asesor?->name ?? 'Belum Diplot',
                'sla_status' => $p->sla_status->label(),
                'sla_color' => $p->sla_status->badgeColor(),
            ]);

        // Recent Audit Logs
        $recentAuditLogs = AuditLog::with('user:id,name,role')
            ->latest('created_at')
            ->take(15)
            ->get()
            ->map(fn($l) => [
                'id' => $l->id,
                'action' => $l->action->value ?? (string) $l->action,
                'user_name' => $l->user?->name ?? 'System',
                'role' => $l->role,
                'entity_type' => $l->entity_type,
                'ip_address' => $l->ip_address,
                'created_at' => $l->created_at->format('d M Y H:i:s'),
            ]);

        return Inertia::render('Dashboard/LpmDashboard', [
            'stats' => $stats,
            'samplePendaftar' => $samplePendaftar,
            'recentAuditLogs' => $recentAuditLogs,
        ]);
    }

    /**
     * Dashboard Admin SIAKAD & Feeder
     */
    protected function siakadDashboard(Request $request, User $user): Response
    {
        $stats = [
            'total_siap_injeksi' => RplKonversiNilai::where('status_sync_siakad', 'pending')->count(),
            'berhasil_siakad' => RplKonversiNilai::where('status_sync_siakad', 'synced')->count(),
            'gagal_siakad' => RplKonversiNilai::where('status_sync_siakad', 'failed')->count(),
            'total_siap_pddikti' => RplKonversiNilai::where('status_sync_pddikti', 'pending')->count(),
            'berhasil_pddikti' => RplKonversiNilai::where('status_sync_pddikti', 'synced')->count(),
            'gagal_pddikti' => RplKonversiNilai::where('status_sync_pddikti', 'failed')->count(),
        ];

        $pendingConversions = RplKonversiNilai::with(['pendaftar.prodi:id,nama_prodi', 'mataKuliah:id,kode_mk,nama_mk'])
            ->latest('created_at')
            ->take(10)
            ->get()
            ->map(fn($k) => [
                'id' => $k->id,
                'nama_mahasiswa' => $k->pendaftar?->nama_lengkap,
                'prodi' => $k->pendaftar?->prodi?->nama_prodi,
                'kode_mk_diakui' => $k->kode_mk_diakui,
                'nama_mk_diakui' => $k->nama_mk_diakui,
                'sks_diakui' => $k->sks_diakui,
                'nilai_huruf' => $k->nilai_huruf,
                'nilai_indeks' => $k->nilai_indeks,
                'status_siakad' => $k->status_sync_siakad,
                'status_pddikti' => $k->status_sync_pddikti,
            ]);

        $recentIntegrationLogs = IntegrationLog::with('actor:id,name')
            ->latest('created_at')
            ->take(10)
            ->get()
            ->map(fn($l) => [
                'id' => $l->id,
                'target' => $l->target_system,
                'action' => $l->action,
                'status' => $l->status->value ?? (string) $l->status,
                'response_code' => $l->response_code,
                'response_message' => $l->response_message,
                'created_at' => $l->created_at->format('d M Y H:i:s'),
            ]);

        return Inertia::render('Dashboard/SiakadDashboard', [
            'stats' => $stats,
            'pendingConversions' => $pendingConversions,
            'recentIntegrationLogs' => $recentIntegrationLogs,
        ]);
    }
}
