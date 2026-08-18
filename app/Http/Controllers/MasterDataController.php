<?php

namespace App\Http\Controllers;

use App\Models\Cpmk;
use App\Models\IndikatorCpmk;
use App\Models\Kurikulum;
use App\Models\MataKuliah;
use App\Models\Prodi;
use App\Models\RplGelombang;
use App\Models\RplUjiPetikRubrik;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MasterDataController extends Controller
{
    /**
     * Master Data Index & Overview
     */
    public function index(): Response
    {
        $gelombangList = RplGelombang::latest('tanggal_buka')->get();
        $prodiList = Prodi::with(['kurikulum.mataKuliah.cpmk.indikator'])->get();
        $rubrikList = RplUjiPetikRubrik::orderBy('urutan')->get();

        return Inertia::render('MasterData/Index', [
            'gelombangList' => $gelombangList,
            'prodiList' => $prodiList,
            'rubrikList' => $rubrikList,
        ]);
    }

    /**
     * Store or update Gelombang
     */
    public function storeGelombang(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_gelombang' => 'required|string|max:100',
            'tahun_akademik' => 'required|string|max:10',
            'semester' => 'required|in:Ganjil,Genap',
            'tanggal_buka' => 'required|date',
            'tanggal_tutup' => 'required|date|after_or_equal:tanggal_buka',
            'tanggal_pengumuman' => 'nullable|date',
            'biaya_pendaftaran' => 'required|numeric|min:0',
            'biaya_asesmen_per_sks' => 'required|numeric|min:0',
            'kuota_pendaftar' => 'required|integer|min:1',
            'is_active' => 'boolean',
            'catatan_panduan' => 'nullable|string',
        ]);

        RplGelombang::create(array_merge($validated, [
            'id' => (string) Str::uuid(),
        ]));

        return back()->with('success', 'Gelombang pendaftaran RPL baru berhasil dibuat.');
    }

    /**
     * Store Mata Kuliah & CPMK
     */
    public function storeMataKuliah(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kurikulum_id' => 'required|uuid|exists:kurikulum,id',
            'kode_mk' => 'required|string|max:20',
            'nama_mk' => 'required|string|max:150',
            'sks' => 'required|integer|min:1|max:6',
            'semester' => 'required|integer|min:1|max:8',
            'kategori_mk' => 'required|string|max:50',
            'terbuka_rpl' => 'boolean',
            'deskripsi' => 'nullable|string',
        ]);

        MataKuliah::create(array_merge($validated, [
            'id' => (string) Str::uuid(),
            'terbuka_rpl' => $validated['terbuka_rpl'] ?? true,
        ]));

        return back()->with('success', 'Mata kuliah baru berhasil ditambahkan.');
    }

    /**
     * Store CPMK
     */
    public function storeCpmk(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'mata_kuliah_id' => 'required|uuid|exists:mata_kuliah,id',
            'kode_cpmk' => 'required|string|max:30',
            'deskripsi_cpmk' => 'required|string',
            'urutan' => 'required|integer|min:1',
        ]);

        Cpmk::create(array_merge($validated, [
            'id' => (string) Str::uuid(),
        ]));

        return back()->with('success', 'CPMK berhasil ditambahkan ke mata kuliah.');
    }

    /**
     * Store Indikator CPMK
     */
    public function storeIndikatorCpmk(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'cpmk_id' => 'required|uuid|exists:cpmk,id',
            'kode_indikator' => 'required|string|max:30',
            'deskripsi_indikator' => 'required|string',
            'urutan' => 'required|integer|min:1',
        ]);

        IndikatorCpmk::create(array_merge($validated, [
            'id' => (string) Str::uuid(),
        ]));

        return back()->with('success', 'Indikator CPMK berhasil ditambahkan.');
    }
}
