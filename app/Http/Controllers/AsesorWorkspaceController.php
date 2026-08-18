<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationStatus;
use App\Enums\AuditAction;
use App\Enums\RecognitionStatus;
use App\Enums\UserRole;
use App\Models\AuditLog;
use App\Models\MataKuliah;
use App\Models\RplAsesmen;
use App\Models\RplAsesmenVatc;
use App\Models\RplBuktiAsesi;
use App\Models\RplKlaimCpmk;
use App\Models\RplPendaftar;
use App\Models\RplPenugasanAsesor;
use App\Models\RplUjiPetik;
use App\Models\RplUjiPetikRubrik;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AsesorWorkspaceController extends Controller
{
    /**
     * Display Dual-Panel Assessor Workspace (Form F-03 / Form F-04)
     */
    public function workspace(Request $request, ?string $pendaftarId = null): Response|RedirectResponse
    {
        $user = $request->user();

        // If pendaftarId is omitted, 'demo', or not found, find the best match for this assessor
        $targetPendaftar = null;
        if ($pendaftarId && $pendaftarId !== 'demo') {
            $targetPendaftar = RplPendaftar::find($pendaftarId);
        }

        if (!$targetPendaftar) {
            // Find applicant assigned to this assessor
            $assigned = RplPenugasanAsesor::where('asesor_id', $user->id)->first();
            if ($assigned) {
                $targetPendaftar = RplPendaftar::find($assigned->pendaftar_id);
            }
        }

        if (!$targetPendaftar) {
            // Fallback to any active applicant with claims
            $targetPendaftar = RplPendaftar::has('klaim')->first() ?? RplPendaftar::first();
        }

        if (!$targetPendaftar) {
            return redirect()->route('dashboard')->with('error', 'Belum ada data pendaftar untuk dinilai.');
        }

        // Auto-assign this assessor if not assigned (so evaluator can immediately evaluate)
        $isSuperAdmin = $user->role === UserRole::SUPER_ADMIN || $user->role?->value === UserRole::SUPER_ADMIN->value;
        $penugasan = RplPenugasanAsesor::where('pendaftar_id', $targetPendaftar->id)
            ->where('asesor_id', $user->id)
            ->first();

        if (!$penugasan && ($user->role === UserRole::ASESOR || $user->role?->value === UserRole::ASESOR->value || $isSuperAdmin)) {
            RplPenugasanAsesor::create([
                'id' => (string) Str::uuid(),
                'pendaftar_id' => $targetPendaftar->id,
                'asesor_id' => $user->id,
                'ditugaskan_oleh_id' => $user->id,
                'tanggal_penugasan' => now(),
                'status_penugasan' => 'ditugaskan',
            ]);
        }

        $pendaftar = RplPendaftar::where('id', $targetPendaftar->id)
            ->with([
                'prodi:id,nama_prodi,jenjang',
                'gelombang:id,nama_gelombang,tahun_akademik',
                'bukti.metadata',
                'klaim.mataKuliah.cpmk.indikator',
                'klaim.bukti',
                'pendidikan',
                'pengalaman',
                'ujiPetik.nilaiList.rubrik',
            ])
            ->firstOrFail();

        // Fetch all assessments by this asesor for this pendaftar
        $asesmenList = RplAsesmen::where('pendaftar_id', $pendaftar->id)
            ->where('asesor_id', $user->id)
            ->with(['vatcList', 'mataKuliah'])
            ->get()
            ->keyBy('mata_kuliah_id');

        // Extract distinct mata kuliah claimed by Asesi
        $claimedMatkulIds = $pendaftar->klaim->pluck('mata_kuliah_id')->unique();
        $matkulList = MataKuliah::whereIn('id', $claimedMatkulIds)
            ->with(['cpmk.indikator'])
            ->get()
            ->map(function ($mk) use ($pendaftar, $asesmenList) {
                $claims = $pendaftar->klaim->where('mata_kuliah_id', $mk->id);
                $asesmen = $asesmenList->get($mk->id);

                return [
                    'id' => $mk->id,
                    'kode_mk' => $mk->kode_mk,
                    'nama_mk' => $mk->nama_mk,
                    'sks' => $mk->sks,
                    'semester' => $mk->semester,
                    'kategori_mk' => $mk->kategori_mk,
                    'claims' => $claims->values()->map(fn($c) => [
                        'id' => $c->id,
                        'cpmk' => $c->cpmk?->kode_cpmk . ' - ' . $c->cpmk?->deskripsi_cpmk,
                        'deskripsi' => $c->deskripsi_pengalaman_relevan,
                        'kemampuan' => $c->tingkat_kemampuan_diri,
                        'bukti_list' => $c->bukti->map(fn($b) => [
                            'id' => $b->id,
                            'nama' => $b->nama_dokumen,
                            'hash' => $b->file_hash,
                            'url' => $b->getTemporaryUrl(15),
                        ]),
                    ]),
                    'asesmen' => $asesmen ? [
                        'id' => $asesmen->id,
                        'status_rekognisi' => $asesmen->status_rekognisi->value ?? (string) $asesmen->status_rekognisi,
                        'nilai_rekomendasi' => $asesmen->nilai_rekomendasi,
                        'nilai_angka' => $asesmen->nilai_angka,
                        'sks_rekomendasi' => $asesmen->sks_rekomendasi,
                        'is_butuh_uji_petik' => (bool) $asesmen->is_butuh_uji_petik,
                        'alasan_uji_petik' => $asesmen->alasan_uji_petik,
                        'catatan_asesor' => $asesmen->catatan_asesor,
                        'catatan_internal' => $asesmen->catatan_internal,
                        'is_final' => (bool) $asesmen->is_final,
                        'vatc' => $asesmen->vatcList->map(fn($v) => [
                            'id' => $v->id,
                            'bukti_id' => $v->bukti_id,
                            'is_valid' => (bool) $v->is_valid,
                            'is_asli' => (bool) $v->is_asli,
                            'is_terkini' => (bool) $v->is_terkini,
                            'is_cukup' => (bool) $v->is_cukup,
                            'catatan' => $v->catatan_evaluasi,
                        ]),
                    ] : null,
                ];
            });

        // 4-Dimension Rubrics
        $rubrikList = RplUjiPetikRubrik::where('is_active', true)->orderBy('urutan')->get();

        // Watermark payload for front-end viewer
        $watermarkInfo = [
            'asesor_name' => $user->name,
            'timestamp' => now()->format('d/m/Y H:i:s'),
            'ip_address' => $request->ip(),
        ];

        return Inertia::render('Asesor/Workspace', [
            'pendaftar' => [
                'id' => $pendaftar->id,
                'nomor_pendaftaran' => $pendaftar->nomor_pendaftaran,
                'nama_lengkap' => $pendaftar->nama_lengkap,
                'nik_masked' => $pendaftar->masked_nik,
                'email' => $pendaftar->email,
                'telepon' => $pendaftar->telepon,
                'prodi' => $pendaftar->prodi?->nama_prodi,
                'jenis_rpl' => $pendaftar->jenis_rpl->value ?? (string) $pendaftar->jenis_rpl,
                'status' => $pendaftar->status_pendaftaran->value ?? (string) $pendaftar->status_pendaftaran,
                'status_label' => $pendaftar->status_pendaftaran->label(),
                'pendidikan' => $pendaftar->pendidikan,
                'pengalaman' => $pendaftar->pengalaman,
                'bukti' => $pendaftar->bukti->map(fn($b) => [
                    'id' => $b->id,
                    'nama_dokumen' => $b->nama_dokumen,
                    'jenis_bukti' => $b->jenis_bukti->label(),
                    'tahun_penerbitan' => $b->tahun_penerbitan,
                    'penerbit' => $b->penerbit_institusi,
                    'hash' => $b->file_hash,
                    'is_duplicate' => $b->is_potential_duplicate,
                    'url' => $b->getTemporaryUrl(15),
                    'metadata' => $b->metadata ? [
                        'author' => $b->metadata->author,
                        'producer' => $b->metadata->producer,
                        'created_date' => $b->metadata->pdf_creation_date?->format('d M Y H:i'),
                        'is_suspicious' => $b->metadata->is_metadata_suspicious,
                        'analisis' => $b->metadata->analisis_risiko,
                    ] : null,
                ]),
                'uji_petik' => $pendaftar->ujiPetik,
            ],
            'matkulList' => $matkulList,
            'rubrikList' => $rubrikList,
            'watermarkInfo' => $watermarkInfo,
        ]);
    }

    /**
     * Save Assessment Draft or Final Recommendation for a Course (Form F-03 / VATC)
     */
    public function saveAssessment(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'pendaftar_id' => 'required|uuid|exists:rpl_pendaftar,id',
            'mata_kuliah_id' => 'required|uuid|exists:mata_kuliah,id',
            'status_rekognisi' => 'required|in:diakui,ditolak,uji_petik',
            'nilai_rekomendasi' => 'nullable|in:A,B+,B,Ditolak',
            'nilai_angka' => 'nullable|numeric|between:0,4',
            'sks_rekomendasi' => 'required|integer|min:0',
            'is_butuh_uji_petik' => 'boolean',
            'alasan_uji_petik' => 'nullable|string',
            'catatan_asesor' => 'nullable|string',
            'catatan_internal' => 'nullable|string',
            'is_final' => 'boolean',
            'vatc_list' => 'nullable|array',
            'vatc_list.*.bukti_id' => 'nullable|uuid|exists:rpl_bukti_asesi,id',
            'vatc_list.*.is_valid' => 'boolean',
            'vatc_list.*.is_asli' => 'boolean',
            'vatc_list.*.is_terkini' => 'boolean',
            'vatc_list.*.is_cukup' => 'boolean',
            'vatc_list.*.catatan' => 'nullable|string',
        ]);

        $penugasan = RplPenugasanAsesor::where('pendaftar_id', $validated['pendaftar_id'])
            ->where('asesor_id', $user->id)
            ->first();

        $isSuperAdmin = $user->role === UserRole::SUPER_ADMIN || $user->role?->value === UserRole::SUPER_ADMIN->value;
        if (!$isSuperAdmin && !$penugasan) {
            return response()->json(['success' => false, 'message' => 'Anda tidak memiliki otorisasi untuk menilai berkas ini.'], 403);
        }

        DB::beginTransaction();
        try {
            $asesmen = RplAsesmen::updateOrCreate(
                [
                    'penugasan_id' => $penugasan?->id ?? (string) Str::uuid(),
                    'mata_kuliah_id' => $validated['mata_kuliah_id'],
                ],
                [
                    'id' => (string) Str::uuid(),
                    'pendaftar_id' => $validated['pendaftar_id'],
                    'asesor_id' => $user->id,
                    'status_rekognisi' => $validated['status_rekognisi'],
                    'nilai_rekomendasi' => $validated['nilai_rekomendasi'],
                    'nilai_angka' => $validated['nilai_angka'],
                    'sks_rekomendasi' => $validated['sks_rekomendasi'],
                    'is_butuh_uji_petik' => $validated['is_butuh_uji_petik'] ?? false,
                    'alasan_uji_petik' => $validated['alasan_uji_petik'] ?? null,
                    'catatan_asesor' => $validated['catatan_asesor'] ?? null,
                    'catatan_internal' => $validated['catatan_internal'] ?? null,
                    'is_final' => $validated['is_final'] ?? false,
                    'finalized_at' => ($validated['is_final'] ?? false) ? now() : null,
                ]
            );

            // Save VATC items
            if (!empty($validated['vatc_list'])) {
                foreach ($validated['vatc_list'] as $vatc) {
                    RplAsesmenVatc::updateOrCreate(
                        [
                            'asesmen_id' => $asesmen->id,
                            'bukti_id' => $vatc['bukti_id'] ?? null,
                        ],
                        [
                            'id' => (string) Str::uuid(),
                            'is_valid' => $vatc['is_valid'] ?? false,
                            'is_asli' => $vatc['is_asli'] ?? false,
                            'is_terkini' => $vatc['is_terkini'] ?? false,
                            'is_cukup' => $vatc['is_cukup'] ?? false,
                            'catatan_evaluasi' => $vatc['catatan'] ?? null,
                        ]
                    );
                }
            }

            // If marked as Uji Petik, auto-create task in Uji Petik table if not exists
            if ($validated['is_butuh_uji_petik'] || $validated['status_rekognisi'] === 'uji_petik') {
                RplUjiPetik::firstOrCreate(
                    [
                        'pendaftar_id' => $validated['pendaftar_id'],
                        'mata_kuliah_id' => $validated['mata_kuliah_id'],
                    ],
                    [
                        'id' => (string) Str::uuid(),
                        'interviewer_id' => $user->id,
                        'jenis_uji' => 'wawancara',
                        'metode_pelaksanaan' => 'Online',
                        'jadwal_mulai' => now()->addDays(2),
                        'status_uji' => 'dijadwalkan',
                        'catatan_hasil' => 'Uji petik dipicu oleh asesmen portofolio: ' . ($validated['alasan_uji_petik'] ?? 'Verifikasi kompetensi praktis'),
                    ]
                );

                $pendaftar = RplPendaftar::find($validated['pendaftar_id']);
                $pendaftar?->update(['status_pendaftaran' => ApplicationStatus::UJI_PETIK]);
            }

            AuditLog::record(
                action: AuditAction::ASSESS_CPMK,
                entityType: 'RplAsesmen',
                entityId: $asesmen->id,
                newValues: [
                    'status' => $validated['status_rekognisi'],
                    'nilai' => $validated['nilai_rekomendasi'],
                    'is_final' => $validated['is_final'] ?? false,
                ]
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Penilaian dan validasi VATC mata kuliah berhasil disimpan.',
                'asesmen_id' => $asesmen->id,
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan asesmen: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Submit All Final Assessments by Asesor -> Advance to Pleno
     */
    public function finalizeAll(Request $request, string $pendaftarId): RedirectResponse
    {
        $user = $request->user();
        $pendaftar = RplPendaftar::findOrFail($pendaftarId);

        $penugasan = RplPenugasanAsesor::where('pendaftar_id', $pendaftar->id)
            ->where('asesor_id', $user->id)
            ->firstOrFail();

        // Mark penugasan as selesai
        $penugasan->update([
            'status_penugasan' => 'selesai',
            'tanggal_selesai_asesmen' => now(),
        ]);

        // If no more pending uji petik, advance applicant to PLENO
        if ($pendaftar->status_pendaftaran !== ApplicationStatus::UJI_PETIK) {
            $pendaftar->update([
                'status_pendaftaran' => ApplicationStatus::PLENO,
            ]);
        }

        AuditLog::record(
            action: AuditAction::ASSESS_CPMK,
            entityType: 'RplPendaftar',
            entityId: $pendaftar->id,
            newValues: ['status' => 'pleno', 'action' => 'finalize_asesmen_all']
        );

        return redirect()->route('dashboard')->with('success', "Seluruh rangkaian asesmen untuk {$pendaftar->nama_lengkap} berhasil difinalisasi dan diajukan ke Sidang Pleno!");
    }
}
