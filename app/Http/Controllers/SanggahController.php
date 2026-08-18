<?php

namespace App\Http\Controllers;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\RplPendaftar;
use App\Models\RplSanggah;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SanggahController extends Controller
{
    /**
     * Display list of appeals for Tim RPL / Admin
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = RplSanggah::with(['pendaftar.prodi', 'mataKuliah', 'reviewer'])->latest();

        if ($user->isAsesi()) {
            $pendaftar = RplPendaftar::where('user_id', $user->id)->first();
            $query->where('pendaftar_id', $pendaftar?->id ?? '');
        }

        $sanggahList = $query->paginate(15);

        return Inertia::render('Sanggah/Index', [
            'sanggahList' => $sanggahList,
        ]);
    }

    /**
     * Asesi submits a new appeal during Masa Sanggah
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $pendaftar = RplPendaftar::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'mata_kuliah_id' => 'nullable|uuid|exists:mata_kuliah,id',
            'alasan_keberatan' => 'required|string|min:20|max:2000',
            'file_bukti' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        $filePath = null;
        $fileName = null;

        if ($request->hasFile('file_bukti')) {
            $file = $request->file('file_bukti');
            $fileName = $file->getClientOriginalName();
            $filePath = $file->store('sanggah_evidence', 'local');
        }

        $nomorSanggah = 'SGH-RPL/' . date('Y') . '/' . str_pad(RplSanggah::count() + 1, 4, '0', STR_PAD_LEFT);

        $sanggah = RplSanggah::create([
            'id' => (string) Str::uuid(),
            'pendaftar_id' => $pendaftar->id,
            'mata_kuliah_id' => $validated['mata_kuliah_id'] ?? null,
            'nomor_sanggah' => $nomorSanggah,
            'alasan_keberatan' => $validated['alasan_keberatan'],
            'bukti_tambahan_path' => $filePath,
            'bukti_tambahan_nama' => $fileName,
            'status_sanggah' => 'diajukan',
        ]);

        AuditLog::record(
            action: AuditAction::SUBMIT_APPLICATION,
            entityType: 'RplSanggah',
            entityId: $sanggah->id,
            newValues: ['nomor_sanggah' => $nomorSanggah, 'pendaftar_id' => $pendaftar->id]
        );

        return back()->with('success', "Permohonan Sanggah No. {$nomorSanggah} berhasil dikirim dan akan ditinjau oleh Tim RPL.");
    }

    /**
     * Tim RPL reviews and decides on the appeal
     */
    public function review(Request $request, string $id): RedirectResponse
    {
        $sanggah = RplSanggah::findOrFail($id);

        $validated = $request->validate([
            'status_sanggah' => 'required|in:diterima,ditolak',
            'tanggapan_tim_rpl' => 'required|string|min:10|max:2000',
        ]);

        $sanggah->update([
            'status_sanggah' => $validated['status_sanggah'],
            'tanggapan_tim_rpl' => $validated['tanggapan_tim_rpl'],
            'ditinjau_oleh_id' => $request->user()->id,
            'ditinjau_at' => now(),
        ]);

        AuditLog::record(
            action: AuditAction::APPROVE_PLENARY,
            entityType: 'RplSanggah',
            entityId: $sanggah->id,
            newValues: ['status' => $validated['status_sanggah'], 'reviewer' => $request->user()->name]
        );

        return back()->with('success', "Sanggahan No. {$sanggah->nomor_sanggah} telah berhasil ditanggapi ({$validated['status_sanggah']}).");
    }
}
