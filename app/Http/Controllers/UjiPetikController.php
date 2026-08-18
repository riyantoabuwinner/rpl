<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationStatus;
use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\MataKuliah;
use App\Models\RplPendaftar;
use App\Models\RplUjiPetik;
use App\Models\RplUjiPetikNilai;
use App\Models\RplUjiPetikRubrik;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UjiPetikController extends Controller
{
    /**
     * List all Uji Petik for Admin / Asesor
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $query = RplUjiPetik::with([
            'pendaftar.prodi:id,nama_prodi',
            'interviewer:id,name',
            'mataKuliah:id,kode_mk,nama_mk',
            'nilaiList.rubrik',
        ]);

        if ($user->isAsesor()) {
            $query->where('interviewer_id', $user->id);
        }

        $ujiPetikList = $query->latest('jadwal_mulai')->paginate(15)->through(fn($u) => [
            'id' => $u->id,
            'pendaftar_id' => $u->pendaftar_id,
            'nama_asesi' => $u->pendaftar?->nama_lengkap,
            'nomor_pendaftaran' => $u->pendaftar?->nomor_pendaftaran,
            'prodi' => $u->pendaftar?->prodi?->nama_prodi,
            'mata_kuliah' => $u->mataKuliah ? "{$u->mataKuliah->kode_mk} - {$u->mataKuliah->nama_mk}" : 'Wawancara Umum',
            'interviewer' => $u->interviewer?->name,
            'jenis_uji' => $u->jenis_uji->label(),
            'metode' => $u->metode_pelaksanaan,
            'jadwal' => $u->jadwal_mulai->format('d M Y, H:i') . ' WIB',
            'link_meeting' => $u->link_meeting,
            'lokasi' => $u->lokasi_ruangan,
            'status' => $u->status_uji,
            'skor_akhir' => $u->skor_akhir,
            'nilai_huruf' => $u->nilai_huruf,
            'status_kelulusan' => $u->status_kelulusan,
        ]);

        $rubrikList = RplUjiPetikRubrik::where('is_active', true)->orderBy('urutan')->get();

        return Inertia::render('UjiPetik/Index', [
            'ujiPetikList' => $ujiPetikList,
            'rubrikList' => $rubrikList,
        ]);
    }

    /**
     * Schedule a new Uji Petik session
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'pendaftar_id' => 'required|uuid|exists:rpl_pendaftar,id',
            'mata_kuliah_id' => 'nullable|uuid|exists:mata_kuliah,id',
            'interviewer_id' => 'required|exists:users,id',
            'jenis_uji' => 'required|in:wawancara,tes_lisan,praktik,studi_kasus',
            'metode_pelaksanaan' => 'required|in:Online,Offline',
            'jadwal_mulai' => 'required|date|after:now',
            'link_meeting' => 'nullable|url',
            'lokasi_ruangan' => 'nullable|string|max:100',
            'catatan_hasil' => 'nullable|string',
        ]);

        $ujiPetik = RplUjiPetik::create(array_merge($validated, [
            'id' => (string) Str::uuid(),
            'status_uji' => 'dijadwalkan',
        ]));

        $pendaftar = RplPendaftar::find($validated['pendaftar_id']);
        $pendaftar?->update(['status_pendaftaran' => ApplicationStatus::UJI_PETIK]);

        AuditLog::record(
            action: AuditAction::SCHEDULE_INTERVIEW,
            entityType: 'RplUjiPetik',
            entityId: $ujiPetik->id,
            newValues: ['jadwal' => $validated['jadwal_mulai'], 'jenis' => $validated['jenis_uji']]
        );

        return back()->with('success', 'Jadwal uji petik berhasil dibuat.');
    }

    /**
     * Submit Scoring for 4-dimension rubrics
     */
    public function submitScore(Request $request, string $id): JsonResponse
    {
        $ujiPetik = RplUjiPetik::with('nilaiList')->findOrFail($id);

        $validated = $request->validate([
            'scores' => 'required|array|min:1',
            'scores.*.rubrik_id' => 'required|uuid|exists:rpl_uji_petik_rubrik,id',
            'scores.*.skor' => 'required|integer|between:1,4',
            'scores.*.catatan' => 'nullable|string',
            'catatan_umum' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $totalScore = 0.0;

            foreach ($validated['scores'] as $scoreData) {
                $rubrik = RplUjiPetikRubrik::findOrFail($scoreData['rubrik_id']);
                $skorWeighted = (float) $scoreData['skor'] * ((float) $rubrik->bobot_persen / 100.0);
                $totalScore += $skorWeighted;

                RplUjiPetikNilai::updateOrCreate(
                    [
                        'uji_petik_id' => $ujiPetik->id,
                        'rubrik_id' => $rubrik->id,
                    ],
                    [
                        'id' => (string) Str::uuid(),
                        'skor' => $scoreData['skor'],
                        'skor_tertimbang' => round($skorWeighted, 3),
                        'catatan_evaluasi' => $scoreData['catatan'] ?? null,
                    ]
                );
            }

            // Convert to grade based on POS/SOP standard formula
            $scoreRounded = round($totalScore, 2);
            if ($scoreRounded >= 3.50) {
                $nilaiHuruf = 'A';
                $nilaiAngka = 4.00;
                $statusKelulusan = 'Lulus';
            } elseif ($scoreRounded >= 3.00) {
                $nilaiHuruf = 'B+';
                $nilaiAngka = 3.50;
                $statusKelulusan = 'Lulus';
            } elseif ($scoreRounded >= 2.70) {
                $nilaiHuruf = 'B';
                $nilaiAngka = 3.00;
                $statusKelulusan = 'Lulus';
            } else {
                $nilaiHuruf = 'E';
                $nilaiAngka = 0.00;
                $statusKelulusan = 'Ditolak';
            }

            $ujiPetik->update([
                'skor_akhir' => $scoreRounded,
                'nilai_huruf' => $nilaiHuruf,
                'nilai_angka' => $nilaiAngka,
                'status_kelulusan' => $statusKelulusan,
                'catatan_hasil' => $validated['catatan_umum'] ?? $ujiPetik->catatan_hasil,
                'status_uji' => 'selesai',
            ]);

            AuditLog::record(
                action: AuditAction::CHANGE_SCORE,
                entityType: 'RplUjiPetik',
                entityId: $ujiPetik->id,
                newValues: [
                    'skor_akhir' => $scoreRounded,
                    'nilai_huruf' => $nilaiHuruf,
                    'status_kelulusan' => $statusKelulusan,
                ]
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Penilaian Uji Petik berhasil disimpan: Skor Akhir {$scoreRounded} (Nilai {$nilaiHuruf} - {$statusKelulusan}).",
                'data' => [
                    'skor_akhir' => $scoreRounded,
                    'nilai_huruf' => $nilaiHuruf,
                    'status_kelulusan' => $statusKelulusan,
                ],
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan skor uji petik: ' . $e->getMessage(),
            ], 500);
        }
    }
}
