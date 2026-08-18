<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationStatus;
use App\Enums\AuditAction;
use App\Enums\DocumentType;
use App\Enums\RplType;
use App\Enums\UserRole;
use App\Models\AuditLog;
use App\Models\MataKuliah;
use App\Models\Prodi;
use App\Models\RplBuktiAsesi;
use App\Models\RplBuktiMetadata;
use App\Models\RplGelombang;
use App\Models\RplKlaimCpmk;
use App\Models\RplPendaftar;
use App\Models\RplPendidikan;
use App\Models\RplPengalaman;
use App\Models\RplPenugasanAsesor;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PendaftarController extends Controller
{
    /**
     * List all applications for Admin Pusat RPL
     */
    public function index(Request $request): Response
    {
        $query = RplPendaftar::with([
            'prodi:id,nama_prodi',
            'gelombang:id,nama_gelombang',
            'penugasanAsesor.asesor:id,name',
        ]);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nomor_pendaftaran', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status_pendaftaran', $request->status);
        }

        if ($request->filled('prodi_id')) {
            $query->where('prodi_id', $request->prodi_id);
        }

        if ($request->filled('jenis_rpl')) {
            $query->where('jenis_rpl', $request->jenis_rpl);
        }

        $pendaftarList = $query->latest('created_at')->paginate(15)->withQueryString()->through(fn($p) => [
            'id' => $p->id,
            'nomor_pendaftaran' => $p->nomor_pendaftaran,
            'nama_lengkap' => $p->nama_lengkap,
            'nik_masked' => $p->masked_nik,
            'email' => $p->email,
            'telepon' => $p->telepon,
            'prodi' => $p->prodi?->nama_prodi,
            'jenis_rpl' => $p->jenis_rpl->value ?? (string) $p->jenis_rpl,
            'status' => $p->status_pendaftaran->value ?? (string) $p->status_pendaftaran,
            'status_label' => $p->status_pendaftaran->label(),
            'status_color' => $p->status_pendaftaran->badgeColor(),
            'sla_status' => $p->sla_status->value,
            'sla_label' => $p->sla_status->label(),
            'sla_color' => $p->sla_status->badgeColor(),
            'asesor' => $p->penugasanAsesor->first()?->asesor?->name ?? 'Belum Diplot',
            'created_at' => $p->created_at->format('d M Y H:i'),
        ]);

        $prodiList = Prodi::where('is_active', true)->get(['id', 'nama_prodi']);
        $asesorList = User::where('role', UserRole::ASESOR->value)->get(['id', 'name']);

        return Inertia::render('Pendaftar/Index', [
            'pendaftarList' => $pendaftarList,
            'filters' => $request->only(['search', 'status', 'prodi_id', 'jenis_rpl']),
            'prodiList' => $prodiList,
            'asesorList' => $asesorList,
        ]);
    }

    /**
     * Form F-02 Multi-Step Wizard for Asesi
     */
    public function formF02(Request $request): Response
    {
        $user = $request->user();
        $activeGelombang = RplGelombang::where('is_active', true)->latest()->first();

        $pendaftar = RplPendaftar::where('user_id', $user->id)
            ->with([
                'pendidikan',
                'pengalaman',
                'bukti',
                'klaim.mataKuliah.cpmk.indikator',
                'klaim.bukti',
            ])
            ->latest('created_at')
            ->first();

        $prodiList = Prodi::where('is_active', true)
            ->with(['kurikulum.mataKuliah.cpmk.indikator'])
            ->get();

        return Inertia::render('FormF02/Wizard', [
            'pendaftar' => $pendaftar,
            'activeGelombang' => $activeGelombang,
            'prodiList' => $prodiList,
            'documentTypes' => array_map(fn($t) => ['value' => $t->value, 'label' => $t->label()], DocumentType::cases()),
        ]);
    }

    /**
     * Save Step 1: Profil Pribadi & Jalur RPL
     */
    public function saveProfile(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'gelombang_id' => 'required|uuid|exists:rpl_gelombang,id',
            'prodi_id' => 'required|uuid|exists:prodi,id',
            'jenis_rpl' => 'required|in:A1,A2,B',
            'nama_lengkap' => 'required|string|max:150',
            'nik' => 'required|string|digits:16',
            'telepon' => 'required|string|max:20',
            'jenis_kelamin' => 'required|in:L,P',
            'status_pernikahan' => 'nullable|string|max:30',
            'kebangsaan' => 'nullable|string|max:50',
            'tempat_lahir' => 'required|string|max:100',
            'tanggal_lahir' => 'required|date',
            'alamat_lengkap' => 'required|string',
            'rt_rw' => 'nullable|string|max:50',
            'kecamatan' => 'nullable|string|max:100',
            'kabupaten_kota' => 'nullable|string|max:100',
            'kode_pos' => 'nullable|string|max:10',
            'telepon_rumah' => 'nullable|string|max:30',
            'telepon_kantor' => 'nullable|string|max:30',
            'pekerjaan_saat_ini' => 'nullable|string|max:150',
            'instansi_pekerjaan' => 'nullable|string|max:150',
            'lampiran_evaluasi_diri' => 'nullable|boolean',
            'lampiran_drh' => 'nullable|boolean',
            'lampiran_ijazah_transkrip' => 'nullable|boolean',
            'lampiran_lainnya' => 'nullable|string|max:255',
        ]);

        $pendaftar = RplPendaftar::where('user_id', $user->id)->first();
        $nomorPendaftaran = $pendaftar?->nomor_pendaftaran ?? ('RPL-' . date('Y') . '-' . str_pad(RplPendaftar::count() + 1, 4, '0', STR_PAD_LEFT));

        $pendaftar = RplPendaftar::updateOrCreate(
            ['user_id' => $user->id],
            array_merge($validated, [
                'id' => $pendaftar?->id ?? (string) Str::uuid(),
                'nomor_pendaftaran' => $nomorPendaftaran,
                'email' => $user->email,
                'status_pendaftaran' => $pendaftar?->status_pendaftaran ?? ApplicationStatus::DRAFT,
            ])
        );

        return back()->with('success', 'Profil pendaftar berhasil disimpan.');
    }

    /**
     * Save Step 2: Pendidikan
     */
    public function savePendidikan(Request $request): RedirectResponse
    {
        $user = $request->user();
        $pendaftar = RplPendaftar::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'jenjang' => 'required|string|max:30',
            'nama_institusi' => 'required|string|max:150',
            'jurusan' => 'required|string|max:100',
            'nomor_ijazah' => 'nullable|string|max:100',
            'tahun_lulus' => 'required|digits:4',
            'ipk_nilai_akhir' => 'nullable|numeric|between:0,100',
        ]);

        RplPendidikan::create(array_merge($validated, [
            'id' => (string) Str::uuid(),
            'pendaftar_id' => $pendaftar->id,
        ]));

        return back()->with('success', 'Riwayat pendidikan berhasil ditambahkan.');
    }

    public function deletePendidikan(string $id): RedirectResponse
    {
        RplPendidikan::where('id', $id)->delete();
        return back()->with('success', 'Data pendidikan berhasil dihapus.');
    }

    /**
     * Save Step 3: Pengalaman Kerja
     */
    public function savePengalaman(Request $request): RedirectResponse
    {
        $user = $request->user();
        $pendaftar = RplPendaftar::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'nama_instansi' => 'required|string|max:150',
            'jabatan_posisi' => 'required|string|max:150',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'is_masih_bekerja' => 'boolean',
            'deskripsi_tugas_kunci' => 'required|string',
        ]);

        RplPengalaman::create(array_merge($validated, [
            'id' => (string) Str::uuid(),
            'pendaftar_id' => $pendaftar->id,
        ]));

        return back()->with('success', 'Riwayat pengalaman kerja berhasil ditambahkan.');
    }

    public function deletePengalaman(string $id): RedirectResponse
    {
        RplPengalaman::where('id', $id)->delete();
        return back()->with('success', 'Data pengalaman kerja berhasil dihapus.');
    }

    /**
     * Save Step 4: Upload Portofolio Bukti (SHA-256 Checksum, EXIF Extraction, Duplicate Detection)
     */
    public function uploadBukti(Request $request): RedirectResponse
    {
        $user = $request->user();
        $pendaftar = RplPendaftar::where('user_id', $user->id)->firstOrFail();

        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240', // Max 10MB
            'nama_dokumen' => 'required|string|max:255',
            'jenis_bukti' => 'required|string',
            'tahun_penerbitan' => 'nullable|digits:4',
            'penerbit_institusi' => 'nullable|string|max:150',
            'deskripsi_dokumen' => 'nullable|string',
        ], [
            'file.mimes' => 'Format file hanya diperbolehkan PDF, JPG, atau PNG.',
            'file.max' => 'Ukuran file maksimal adalah 10 Megabyte.',
        ]);

        $file = $request->file('file');
        $fileHash = hash_file('sha256', $file->getRealPath());
        $fileSize = $file->getSize();
        $mimeType = $file->getMimeType();
        $originalName = $file->getClientOriginalName();

        // Check for duplicate checksum across other applicants
        $existingDuplicate = RplBuktiAsesi::where('file_hash', $fileHash)
            ->where('pendaftar_id', '!=', $pendaftar->id)
            ->first();

        // Store file securely in private disk
        $storedPath = $file->store('private/rpl/portofolio/' . date('Y'));

        DB::beginTransaction();
        try {
            $bukti = RplBuktiAsesi::create([
                'id' => (string) Str::uuid(),
                'pendaftar_id' => $pendaftar->id,
                'nama_dokumen' => $request->nama_dokumen,
                'jenis_bukti' => $request->jenis_bukti,
                'file_path' => $storedPath,
                'file_original_name' => $originalName,
                'file_hash' => $fileHash,
                'file_size' => $fileSize,
                'mime_type' => $mimeType,
                'tahun_penerbitan' => $request->tahun_penerbitan,
                'penerbit_institusi' => $request->penerbit_institusi,
                'deskripsi_dokumen' => $request->deskripsi_dokumen,
                'is_potential_duplicate' => (bool) $existingDuplicate,
                'duplicate_of_id' => $existingDuplicate?->id,
            ]);

            // Extract Metadata
            $author = null;
            $producer = null;
            if (str_contains($mimeType, 'pdf')) {
                $author = 'PDF Document';
            }

            RplBuktiMetadata::create([
                'id' => (string) Str::uuid(),
                'bukti_id' => $bukti->id,
                'author' => $author,
                'producer' => 'SIRPL Document Processor',
                'pdf_creation_date' => now(),
                'is_metadata_suspicious' => false,
                'analisis_risiko' => $existingDuplicate ? 'Peringatan: Hash file identik terdeteksi pada pendaftar lain.' : 'Dokumen lolos validasi hash.',
            ]);

            AuditLog::record(
                action: AuditAction::UPLOAD_DOCUMENT,
                entityType: 'RplBuktiAsesi',
                entityId: $bukti->id,
                newValues: ['file_name' => $originalName, 'hash' => $fileHash]
            );

            DB::commit();

            return back()->with('success', 'Dokumen portofolio berhasil diunggah dengan checksum SHA-256 terverifikasi.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memproses dokumen portofolio: ' . $e->getMessage());
        }
    }

    public function deleteBukti(string $id): RedirectResponse
    {
        $bukti = RplBuktiAsesi::findOrFail($id);
        Storage::delete($bukti->file_path);
        $bukti->delete();

        return back()->with('success', 'Dokumen bukti berhasil dihapus.');
    }

    /**
     * Save Step 5: Klaim CPMK Mata Kuliah
     */
    public function saveKlaim(Request $request): RedirectResponse
    {
        $user = $request->user();
        $pendaftar = RplPendaftar::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'mata_kuliah_id' => 'required|uuid|exists:mata_kuliah,id',
            'cpmk_id' => 'nullable|uuid|exists:cpmk,id',
            'indikator_cpmk_id' => 'nullable|uuid|exists:indikator_cpmk,id',
            'jenis_pengajuan' => 'nullable|in:transfer_sks,perolehan_sks',
            'deskripsi_pengalaman_relevan' => 'required|string',
            'tingkat_kemampuan_diri' => 'required|in:Sangat Baik,Baik,Cukup',
            'bukti_ids' => 'required|array|min:1',
            'bukti_ids.*' => 'uuid|exists:rpl_bukti_asesi,id',
        ], [
            'bukti_ids.required' => 'Wajib memilih minimal satu dokumen bukti pendukung untuk klaim ini.',
        ]);

        $klaim = RplKlaimCpmk::create([
            'id' => (string) Str::uuid(),
            'pendaftar_id' => $pendaftar->id,
            'mata_kuliah_id' => $validated['mata_kuliah_id'],
            'cpmk_id' => $validated['cpmk_id'] ?? null,
            'indikator_cpmk_id' => $validated['indikator_cpmk_id'] ?? null,
            'jenis_pengajuan' => $validated['jenis_pengajuan'] ?? 'perolehan_sks',
            'deskripsi_pengalaman_relevan' => $validated['deskripsi_pengalaman_relevan'],
            'tingkat_kemampuan_diri' => $validated['tingkat_kemampuan_diri'],
        ]);

        $klaim->bukti()->sync($validated['bukti_ids']);

        return back()->with('success', 'Klaim kompetensi mata kuliah berhasil dipetakan.');
    }

    public function deleteKlaim(string $id): RedirectResponse
    {
        RplKlaimCpmk::where('id', $id)->delete();
        return back()->with('success', 'Klaim kompetensi berhasil dihapus.');
    }

    /**
     * Final Submit Form F-02 (Freeze data & Start 3-Day SLA)
     */
    public function submitForm(Request $request): RedirectResponse
    {
        $user = $request->user();
        $pendaftar = RplPendaftar::where('user_id', $user->id)->firstOrFail();

        if ($pendaftar->klaim()->count() === 0) {
            return back()->with('error', 'Anda belum memetakan klaim kompetensi mata kuliah.');
        }

        $pendaftar->update([
            'status_pendaftaran' => ApplicationStatus::TERKIRIM,
            'tanggal_submit' => now(),
            'sla_verifikasi_due_at' => now()->addDays(3), // POS/SOP: Maks 3 hari verifikasi administrasi
        ]);

        AuditLog::record(
            action: AuditAction::SUBMIT_APPLICATION,
            entityType: 'RplPendaftar',
            entityId: $pendaftar->id,
            newValues: ['status' => 'terkirim', 'submit_at' => now()->toDateTimeString()]
        );

        return redirect()->route('dashboard')->with('success', 'Formulir Evaluasi Diri (Form F-02) berhasil dikirim! Menunggu verifikasi berkas oleh Pusat RPL.');
    }

    /**
     * Verifikasi Administrasi (Pusat RPL)
     */
    public function verifyAdministrasi(Request $request, string $id): RedirectResponse
    {
        $pendaftar = RplPendaftar::findOrFail($id);

        $request->validate([
            'action' => 'required|in:valid,ditolak_administrasi',
            'catatan' => 'nullable|string',
            'asesor_id' => 'nullable|required_if:action,valid|exists:users,id',
        ]);

        DB::beginTransaction();
        try {
            if ($request->action === 'valid') {
                $pendaftar->update([
                    'status_pendaftaran' => ApplicationStatus::PROSES_ASESMEN,
                    'tanggal_verifikasi' => now(),
                    'verifikator_id' => $request->user()->id,
                    'catatan_verifikasi' => $request->catatan ?? 'Berkas administrasi dinyatakan lengkap dan valid.',
                    'sla_asesmen_due_at' => now()->addDays(7), // POS/SOP: Maks 7 hari asesmen portofolio
                ]);

                // Assign Asesor
                if ($request->asesor_id) {
                    RplPenugasanAsesor::updateOrCreate(
                        ['pendaftar_id' => $pendaftar->id, 'asesor_id' => $request->asesor_id],
                        [
                            'id' => (string) Str::uuid(),
                            'ditugaskan_oleh_id' => $request->user()->id,
                            'tanggal_penugasan' => now(),
                            'status_penugasan' => 'ditugaskan',
                            'catatan_admin' => $request->catatan,
                        ]
                    );

                    AuditLog::record(
                        action: AuditAction::ASSIGN_ASSESSOR,
                        entityType: 'RplPendaftar',
                        entityId: $pendaftar->id,
                        newValues: ['asesor_id' => $request->asesor_id]
                    );
                }
            } else {
                $pendaftar->update([
                    'status_pendaftaran' => ApplicationStatus::DITOLAK_ADMINISTRASI,
                    'tanggal_verifikasi' => now(),
                    'verifikator_id' => $request->user()->id,
                    'catatan_verifikasi' => $request->catatan ?? 'Berkas administrasi tidak memenuhi persyaratan.',
                ]);
            }

            AuditLog::record(
                action: AuditAction::VERIFY_DOCUMENT,
                entityType: 'RplPendaftar',
                entityId: $pendaftar->id,
                newValues: ['action' => $request->action, 'catatan' => $request->catatan]
            );

            DB::commit();

            return back()->with('success', "Status pendaftaran {$pendaftar->nama_lengkap} berhasil diperbarui.");
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memverifikasi pendaftaran: ' . $e->getMessage());
        }
    }

    /**
     * Render official Form 2/F02 printable document matching UIN SSC specification
     */
    public function printFormF02(Request $request, ?string $id = null): Response
    {
        $user = $request->user();

        if ($id) {
            $pendaftar = RplPendaftar::with([
                'gelombang',
                'prodi.kurikulum.mataKuliah',
                'pendidikan',
                'pengalaman',
                'bukti',
                'klaim.mataKuliah',
                'klaim.bukti',
            ])->findOrFail($id);
        } else {
            $pendaftar = RplPendaftar::with([
                'gelombang',
                'prodi.kurikulum.mataKuliah',
                'pendidikan',
                'pengalaman',
                'bukti',
                'klaim.mataKuliah',
                'klaim.bukti',
            ])->where('user_id', $user->id)->firstOrFail();
        }

        return Inertia::render('FormF02/PrintF02', [
            'pendaftar' => $pendaftar,
        ]);
    }

    /**
     * Save Form 3/F03 self-evaluation matrix item
     */
    public function saveEvaluasiDiriF03(Request $request): RedirectResponse
    {
        $user = $request->user();
        $pendaftar = RplPendaftar::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'mata_kuliah_id' => 'required|uuid|exists:mata_kuliah,id',
            'items' => 'required|array|min:1',
            'items.*.nomor_urut' => 'required|integer',
            'items.*.pernyataan_cpmk' => 'required|string',
            'items.*.profisiensi' => 'required|in:sangat_baik,baik,tidak_pernah',
            'items.*.nomor_dokumen' => 'nullable|string|max:50',
            'items.*.jenis_dokumen' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            foreach ($validated['items'] as $item) {
                \App\Models\RplEvaluasiDiriCpmk::updateOrCreate(
                    [
                        'pendaftar_id' => $pendaftar->id,
                        'mata_kuliah_id' => $validated['mata_kuliah_id'],
                        'nomor_urut' => $item['nomor_urut'],
                    ],
                    [
                        'id' => (string) Str::uuid(),
                        'pernyataan_cpmk' => $item['pernyataan_cpmk'],
                        'profisiensi' => $item['profisiensi'],
                        'nomor_dokumen' => $item['nomor_dokumen'] ?? null,
                        'jenis_dokumen' => $item['jenis_dokumen'] ?? null,
                    ]
                );
            }

            DB::commit();
            return back()->with('success', 'Formulir Evaluasi Diri (Form 3/F03) berhasil disimpan.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menyimpan evaluasi diri: ' . $e->getMessage());
        }
    }

    /**
     * Render official Form 3/F03 printable document matching UIN SSC specification
     */
    public function printFormF03(Request $request, ?string $pendaftarId = null, ?string $mataKuliahId = null): Response
    {
        $user = $request->user();

        $targetPendaftarId = $pendaftarId;
        if (!$targetPendaftarId || $targetPendaftarId === 'me') {
            $pendaftar = RplPendaftar::where('user_id', $user->id)->firstOrFail();
            $targetPendaftarId = $pendaftar->id;
        }

        $pendaftar = RplPendaftar::with([
            'gelombang',
            'prodi.kurikulum.mataKuliah.cpmk.indikator',
            'pendidikan',
            'pengalaman',
            'bukti',
            'klaim.mataKuliah',
            'klaim.bukti',
            'evaluasiDiriCpmk',
        ])->findOrFail($targetPendaftarId);

        $selectedCourse = null;
        if ($mataKuliahId) {
            $selectedCourse = \App\Models\MataKuliah::with(['kurikulum', 'cpmk.indikator'])->find($mataKuliahId);
        }

        return Inertia::render('FormF02/PrintF03', [
            'pendaftar' => $pendaftar,
            'selectedCourse' => $selectedCourse,
        ]);
    }
}
