<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationStatus;
use App\Enums\AuditAction;
use App\Enums\UserRole;
use App\Models\AuditLog;
use App\Models\Prodi;
use App\Models\RplGelombang;
use App\Models\RplKonversiNilai;
use App\Models\RplPendaftar;
use App\Models\RplPleno;
use App\Models\RplPlenoKeputusan;
use App\Models\RplPlenoPeserta;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PlenoController extends Controller
{
    /**
     * List all Sidang Pleno
     */
    public function index(Request $request): Response
    {
        $plenoList = RplPleno::with([
            'prodi:id,nama_prodi',
            'gelombang:id,nama_gelombang,tahun_akademik',
            'peserta.user:id,name,role',
            'keputusan.pendaftar:id,nama_lengkap,nomor_pendaftaran',
            'disahkanOleh:id,name',
        ])
        ->latest('tanggal_sidang')
        ->paginate(10)
        ->through(fn($p) => [
            'id' => $p->id,
            'nomor_berita_acara' => $p->nomor_berita_acara,
            'prodi' => $p->prodi?->nama_prodi,
            'gelombang' => $p->gelombang?->nama_gelombang,
            'tanggal_sidang' => $p->tanggal_sidang->format('d M Y'),
            'ruangan_media' => $p->ruangan_media,
            'status_pleno' => $p->status_pleno,
            'total_peserta' => $p->peserta->count(),
            'total_keputusan' => $p->keputusan->count(),
            'disahkan_oleh' => $p->disahkanOleh?->name,
        ]);

        $prodiList = Prodi::where('is_active', true)->get(['id', 'nama_prodi']);
        $gelombangList = RplGelombang::where('is_active', true)->get(['id', 'nama_gelombang']);
        $usersList = User::whereIn('role', [UserRole::KAPRODI->value, UserRole::ASESOR->value, UserRole::LPM->value])->get(['id', 'name', 'role']);

        // Applicants ready for Pleno
        $readyApplicants = RplPendaftar::whereIn('status_pendaftaran', [ApplicationStatus::PLENO, ApplicationStatus::PROSES_ASESMEN])
            ->with(['prodi:id,nama_prodi', 'penugasanAsesor.asesmen'])
            ->get()
            ->map(fn($a) => [
                'id' => $a->id,
                'prodi_id' => $a->prodi_id,
                'nomor_pendaftaran' => $a->nomor_pendaftaran,
                'nama_lengkap' => $a->nama_lengkap,
                'prodi' => $a->prodi?->nama_prodi,
                'status' => $a->status_pendaftaran->label(),
            ]);

        return Inertia::render('Pleno/Index', [
            'plenoList' => $plenoList,
            'prodiList' => $prodiList,
            'gelombangList' => $gelombangList,
            'usersList' => $usersList,
            'readyApplicants' => $readyApplicants,
        ]);
    }

    /**
     * Create new Sidang Pleno session
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'gelombang_id' => 'required|uuid|exists:rpl_gelombang,id',
            'prodi_id' => 'required|uuid|exists:prodi,id',
            'nomor_berita_acara' => 'required|string|max:100|unique:rpl_pleno,nomor_berita_acara',
            'tanggal_sidang' => 'required|date',
            'ruangan_media' => 'required|string|max:100',
            'agenda_sidang' => 'nullable|string',
            'kesimpulan_umum' => 'nullable|string',
            'peserta_ids' => 'required|array|min:1',
            'peserta_ids.*' => 'exists:users,id',
            'pendaftar_ids' => 'required|array|min:1',
            'pendaftar_ids.*' => 'uuid|exists:rpl_pendaftar,id',
        ]);

        DB::beginTransaction();
        try {
            $pleno = RplPleno::create([
                'id' => (string) Str::uuid(),
                'gelombang_id' => $validated['gelombang_id'],
                'prodi_id' => $validated['prodi_id'],
                'nomor_berita_acara' => $validated['nomor_berita_acara'],
                'tanggal_sidang' => $validated['tanggal_sidang'],
                'ruangan_media' => $validated['ruangan_media'],
                'agenda_sidang' => $validated['agenda_sidang'] ?? null,
                'kesimpulan_umum' => $validated['kesimpulan_umum'] ?? null,
                'status_pleno' => 'draft',
            ]);

            // Add attendees
            foreach ($validated['peserta_ids'] as $userId) {
                $u = User::find($userId);
                RplPlenoPeserta::create([
                    'id' => (string) Str::uuid(),
                    'pleno_id' => $pleno->id,
                    'user_id' => $userId,
                    'peran_sidang' => $u?->role?->label() ?? 'Peserta Sidang',
                    'is_hadir' => true,
                ]);
            }

            // Add applicant decisions
            foreach ($validated['pendaftar_ids'] as $pendaftarId) {
                $p = RplPendaftar::with('penugasanAsesor.asesmen.mataKuliah')->find($pendaftarId);

                // Calculate approved SKS from finalized assessments
                $totalSksDiakui = 0;
                if ($p) {
                    foreach ($p->penugasanAsesor as $penugasan) {
                        foreach ($penugasan->asesmen as $asesmen) {
                            if ($asesmen->status_rekognisi === \App\Enums\RecognitionStatus::DIAKUI && $asesmen->is_final) {
                                $totalSksDiakui += (int) ($asesmen->sks_rekomendasi > 0 ? $asesmen->sks_rekomendasi : $asesmen->mataKuliah?->sks ?? 3);
                            }
                        }
                    }
                }

                $totalKurikulum = 144;
                $sisaSks = max(0, $totalKurikulum - $totalSksDiakui);
                $estimasiSemester = (int) ceil($sisaSks / 20);

                RplPlenoKeputusan::create([
                    'id' => (string) Str::uuid(),
                    'pleno_id' => $pleno->id,
                    'pendaftar_id' => $pendaftarId,
                    'status_keputusan' => 'disetujui',
                    'total_sks_diakui' => $totalSksDiakui,
                    'sisa_sks_harus_ditempuh' => $sisaSks,
                    'estimasi_semester' => $estimasiSemester > 0 ? $estimasiSemester : 1,
                ]);
            }

            AuditLog::record(
                action: AuditAction::APPROVE_PLENARY,
                entityType: 'RplPleno',
                entityId: $pleno->id,
                newValues: ['nomor_ba' => $pleno->nomor_berita_acara]
            );

            DB::commit();

            return back()->with('success', 'Sidang Pleno Rekognisi RPL berhasil dijadwalkan.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal membuat Sidang Pleno: ' . $e->getMessage());
        }
    }

    /**
     * Final Approval and Legalization of Sidang Pleno by Kaprodi / Pimpinan
     */
    public function legalize(Request $request, string $id): RedirectResponse
    {
        $pleno = RplPleno::with('keputusan.pendaftar.penugasanAsesor.asesmen.mataKuliah')->findOrFail($id);

        DB::beginTransaction();
        try {
            $pleno->update([
                'status_pleno' => 'disahkan',
                'disahkan_oleh_id' => $request->user()->id,
                'disahkan_at' => now(),
            ]);

            // For each applicant in this Pleno, update status to Penerbitan SK and populate rpl_konversi_nilai
            foreach ($pleno->keputusan as $keputusan) {
                $pendaftar = $keputusan->pendaftar;
                if (!$pendaftar) continue;

                $pendaftar->update([
                    'status_pendaftaran' => ApplicationStatus::PENERBITAN_SK,
                    'total_sks_diakui' => $keputusan->total_sks_diakui,
                ]);

                // Insert into rpl_konversi_nilai for each recognized course
                foreach ($pendaftar->penugasanAsesor as $penugasan) {
                    foreach ($penugasan->asesmen as $asesmen) {
                        if ($asesmen->status_rekognisi === \App\Enums\RecognitionStatus::DIAKUI) {
                            $mk = $asesmen->mataKuliah;
                            if ($mk) {
                                RplKonversiNilai::firstOrCreate(
                                    [
                                        'pendaftar_id' => $pendaftar->id,
                                        'kode_mk_diakui' => $mk->kode_mk,
                                    ],
                                    [
                                        'id' => (string) Str::uuid(),
                                        'mata_kuliah_id' => $mk->id,
                                        'kode_mata_kuliah_asal' => 'RPL-EXP-' . $mk->kode_mk,
                                        'nama_mata_kuliah_asal' => 'Pengalaman Rekognisi ' . $mk->nama_mk,
                                        'sks_mata_kuliah_asal' => $mk->sks,
                                        'nilai_huruf_asal' => $asesmen->nilai_rekomendasi ?? 'A',
                                        'nama_mk_diakui' => $mk->nama_mk,
                                        'sks_diakui' => $asesmen->sks_rekomendasi > 0 ? $asesmen->sks_rekomendasi : $mk->sks,
                                        'nilai_huruf' => $asesmen->nilai_rekomendasi ?? 'A',
                                        'nilai_indeks' => $asesmen->nilai_angka ?? 4.00,
                                        'status_sync_siakad' => 'pending',
                                        'status_sync_pddikti' => 'pending',
                                    ]
                                );
                            }
                        }
                    }
                }
            }

            AuditLog::record(
                action: AuditAction::APPROVE_PLENARY,
                entityType: 'RplPleno',
                entityId: $pleno->id,
                newValues: ['status' => 'disahkan', 'legalized_by' => $request->user()->name]
            );

            DB::commit();

            return back()->with('success', "Berita Acara Sidang Pleno No. {$pleno->nomor_berita_acara} telah resmi disahkan!");
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal mengesahkan Sidang Pleno: ' . $e->getMessage());
        }
    }
}
