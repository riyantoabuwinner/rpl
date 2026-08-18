<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationStatus;
use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\RplKonversiNilai;
use App\Models\RplPendaftar;
use App\Models\RplSkRekognisi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SkRekognisiController extends Controller
{
    /**
     * List all issued SK Rekognisi
     */
    public function index(Request $request): Response
    {
        $skList = RplSkRekognisi::with(['pendaftar.prodi:id,nama_prodi'])
            ->latest('tanggal_sk')
            ->paginate(15)
            ->through(fn($sk) => [
                'id' => $sk->id,
                'nomor_sk' => $sk->nomor_sk,
                'nama_mahasiswa' => $sk->pendaftar?->nama_lengkap,
                'nik_masked' => $sk->pendaftar?->masked_nik,
                'nomor_pendaftaran' => $sk->pendaftar?->nomor_pendaftaran,
                'prodi' => $sk->pendaftar?->prodi?->nama_prodi,
                'tanggal_sk' => $sk->tanggal_sk->format('d M Y'),
                'total_sks_diakui' => $sk->total_sks_diakui,
                'ipk_konversi' => $sk->ipk_konversi,
                'pejabat' => "{$sk->pejabat_nama} ({$sk->pejabat_jabatan})",
                'qr_verify_url' => $sk->qr_verify_url,
                'document_hash' => $sk->document_hash,
            ]);

        // Applicants in PENERBITAN_SK status ready for SK generation
        $readyApplicants = RplPendaftar::whereIn('status_pendaftaran', [ApplicationStatus::PENERBITAN_SK, ApplicationStatus::SELESAI])
            ->with(['prodi:id,nama_prodi', 'konversiNilai', 'skRekognisi'])
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'nomor_pendaftaran' => $p->nomor_pendaftaran,
                'nama_lengkap' => $p->nama_lengkap,
                'prodi' => $p->prodi?->nama_prodi,
                'total_sks' => $p->konversiNilai->sum('sks_diakui'),
                'has_sk' => (bool) $p->skRekognisi,
                'sk_id' => $p->skRekognisi?->id,
            ]);

        return Inertia::render('SkRekognisi/Index', [
            'skList' => $skList,
            'readyApplicants' => $readyApplicants,
        ]);
    }

    /**
     * Show preview / printable view of SK Rekognisi
     */
    public function show(string $id): Response
    {
        $sk = RplSkRekognisi::with([
            'pendaftar.prodi:id,nama_prodi,jenjang,fakultas',
            'pendaftar.gelombang:id,nama_gelombang,tahun_akademik,semester',
            'pendaftar.konversiNilai',
        ])->findOrFail($id);

        $konversi = $sk->pendaftar->konversiNilai;
        $totalSks = $konversi->sum('sks_diakui');
        $totalBobot = $konversi->sum(fn($k) => $k->sks_diakui * (float)$k->nilai_indeks);
        $calculatedIpk = $totalSks > 0 ? round($totalBobot / $totalSks, 2) : 0.00;

        return Inertia::render('SkRekognisi/View', [
            'sk' => [
                'id' => $sk->id,
                'nomor_sk' => $sk->nomor_sk,
                'tanggal_sk' => $sk->tanggal_sk->format('d F Y'),
                'judul_sk' => $sk->judul_sk,
                'total_sks_diakui' => $sk->total_sks_diakui,
                'ipk_konversi' => $sk->ipk_konversi,
                'pejabat_nama' => $sk->pejabat_nama,
                'pejabat_jabatan' => $sk->pejabat_jabatan,
                'pejabat_nip' => $sk->pejabat_nip,
                'qr_token' => $sk->qr_token,
                'qr_verify_url' => $sk->qr_verify_url,
                'document_hash' => $sk->document_hash,
                'mahasiswa' => [
                    'nama_lengkap' => $sk->pendaftar->nama_lengkap,
                    'nik' => $sk->pendaftar->nik,
                    'nomor_pendaftaran' => $sk->pendaftar->nomor_pendaftaran,
                    'prodi' => $sk->pendaftar->prodi?->nama_prodi,
                    'jenjang' => $sk->pendaftar->prodi?->jenjang,
                    'fakultas' => $sk->pendaftar->prodi?->fakultas,
                    'jenis_rpl' => $sk->pendaftar->jenis_rpl->label(),
                ],
                'matkul_diakui' => $konversi->map(fn($k) => [
                    'kode_mk' => $k->kode_mk_diakui,
                    'nama_mk' => $k->nama_mk_diakui,
                    'sks' => $k->sks_diakui,
                    'nilai_huruf' => $k->nilai_huruf,
                    'nilai_indeks' => $k->nilai_indeks,
                ]),
            ],
        ]);
    }

    /**
     * Generate SK Rekognisi
     */
    public function generate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'pendaftar_id' => 'required|uuid|exists:rpl_pendaftar,id',
            'nomor_sk' => 'required|string|max:100|unique:rpl_sk_rekognisi,nomor_sk',
            'tanggal_sk' => 'required|date',
            'pejabat_nama' => 'required|string|max:150',
            'pejabat_jabatan' => 'required|string|max:100',
            'pejabat_nip' => 'nullable|string|max:50',
        ]);

        $pendaftar = RplPendaftar::with('konversiNilai')->findOrFail($validated['pendaftar_id']);
        $totalSks = $pendaftar->konversiNilai->sum('sks_diakui');
        $totalBobot = $pendaftar->konversiNilai->sum(fn($k) => $k->sks_diakui * (float)$k->nilai_indeks);
        $ipk = $totalSks > 0 ? round($totalBobot / $totalSks, 2) : 4.00;

        $qrToken = (string) Str::uuid();
        $qrVerifyUrl = url("/verify/{$qrToken}");
        $docHash = hash('sha256', $validated['nomor_sk'] . $pendaftar->id . $totalSks . $ipk . now()->toIso8601String());

        DB::beginTransaction();
        try {
            $sk = RplSkRekognisi::create([
                'id' => (string) Str::uuid(),
                'pendaftar_id' => $pendaftar->id,
                'nomor_sk' => $validated['nomor_sk'],
                'tanggal_sk' => $validated['tanggal_sk'],
                'total_sks_diakui' => $totalSks,
                'ipk_konversi' => $ipk,
                'pejabat_nama' => $validated['pejabat_nama'],
                'pejabat_jabatan' => $validated['pejabat_jabatan'],
                'pejabat_nip' => $validated['pejabat_nip'],
                'qr_token' => $qrToken,
                'qr_verify_url' => $qrVerifyUrl,
                'document_hash' => $docHash,
            ]);

            $pendaftar->update([
                'status_pendaftaran' => ApplicationStatus::SELESAI,
                'total_sks_diakui' => $totalSks,
                'ipk_rekognisi' => $ipk,
            ]);

            AuditLog::record(
                action: AuditAction::GENERATE_SK,
                entityType: 'RplSkRekognisi',
                entityId: $sk->id,
                newValues: ['nomor_sk' => $sk->nomor_sk, 'total_sks' => $totalSks, 'ipk' => $ipk]
            );

            DB::commit();

            return back()->with('success', "Surat Keputusan (SK) Rekognisi No. {$sk->nomor_sk} berhasil diterbitkan!");
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menerbitkan SK: ' . $e->getMessage());
        }
    }
}
