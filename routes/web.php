<?php

use App\Http\Controllers\AsesorWorkspaceController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentViewerController;
use App\Http\Controllers\MasterDataController;
use App\Http\Controllers\PanduanController;
use App\Http\Controllers\PendaftarController;
use App\Http\Controllers\PlenoController;
use App\Http\Controllers\PublicVerificationController;
use App\Http\Controllers\SkRekognisiController;
use App\Http\Controllers\UjiPetikController;
use App\Models\RplGelombang;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Landing Page
Route::get('/', function () {
    $activeGelombang = RplGelombang::where('is_active', true)->latest()->first();

    return Inertia::render('Landing', [
        'activeGelombang' => $activeGelombang ? [
            'id' => $activeGelombang->id,
            'nama' => $activeGelombang->nama_gelombang,
            'tahun' => $activeGelombang->tahun_akademik,
            'semester' => $activeGelombang->semester,
            'buka' => $activeGelombang->tanggal_buka->format('d M Y'),
            'tutup' => $activeGelombang->tanggal_tutup->format('d M Y'),
            'kuota' => $activeGelombang->kuota_pendaftar,
            'is_open' => $activeGelombang->isOpen(),
        ] : null,
    ]);
})->name('landing');

// Public Document Verification (QR Scanner)
Route::get('/verify/{qrToken}', [PublicVerificationController::class, 'verify'])->name('public.verify');

// Secure Document Preview (Temporary Signed URL)
Route::get('/documents/preview/{bukti}', [DocumentViewerController::class, 'preview'])->name('documents.preview');

// Guest Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
});

// Authenticated Application Routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Central Role-Based Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Buku Panduan Sistem Pengguna (Semua Role)
    Route::get('/panduan', [PanduanController::class, 'index'])->name('panduan');

    // Form F-02 Multi-Step Wizard (Asesi)
    Route::prefix('form-f02')->name('form-f02.')->group(function () {
        Route::get('/', [PendaftarController::class, 'formF02'])->name('wizard');
        Route::post('/profile', [PendaftarController::class, 'saveProfile'])->name('profile');
        Route::post('/pendidikan', [PendaftarController::class, 'savePendidikan'])->name('pendidikan');
        Route::delete('/pendidikan/{id}', [PendaftarController::class, 'deletePendidikan'])->name('pendidikan.delete');
        Route::post('/pengalaman', [PendaftarController::class, 'savePengalaman'])->name('pengalaman');
        Route::delete('/pengalaman/{id}', [PendaftarController::class, 'deletePengalaman'])->name('pengalaman.delete');
        Route::post('/bukti', [PendaftarController::class, 'uploadBukti'])->name('bukti');
        Route::delete('/bukti/{id}', [PendaftarController::class, 'deleteBukti'])->name('bukti.delete');
        Route::post('/klaim', [PendaftarController::class, 'saveKlaim'])->name('klaim');
        Route::delete('/klaim/{id}', [PendaftarController::class, 'deleteKlaim'])->name('klaim.delete');
        Route::post('/evaluasi-diri-f03', [PendaftarController::class, 'saveEvaluasiDiriF03'])->name('evaluasi_diri_f03.store');
        Route::post('/submit', [PendaftarController::class, 'submitForm'])->name('submit');
        Route::get('/print/{id?}', [PendaftarController::class, 'printFormF02'])->name('print');
    });

    // Form 3/F03 Formulir Evaluasi Diri Calon Mahasiswa Print Route
    Route::get('/form-f03/print/{pendaftarId?}/{mataKuliahId?}', [PendaftarController::class, 'printFormF03'])->name('form-f03.print');

    // Pendaftar Management & Administration (Admin Pusat RPL, Super Admin)
    Route::prefix('admin/pendaftar')->name('admin.pendaftar.')->group(function () {
        Route::get('/', [PendaftarController::class, 'index'])->name('index');
        Route::post('/{id}/verify', [PendaftarController::class, 'verifyAdministrasi'])->name('verify');
    });

    // Asesor Dual-Panel Workspace
    Route::prefix('asesor')->name('asesor.')->group(function () {
        Route::get('/', [AsesorWorkspaceController::class, 'workspace'])->name('index');
        Route::get('/penilaian', [AsesorWorkspaceController::class, 'workspace'])->name('penilaian');
        Route::get('/workspace/{pendaftarId?}', [AsesorWorkspaceController::class, 'workspace'])->name('workspace');
        Route::post('/assessment', [AsesorWorkspaceController::class, 'saveAssessment'])->name('assessment.save');
        Route::post('/finalize/{pendaftarId}', [AsesorWorkspaceController::class, 'finalizeAll'])->name('finalize');
    });

    // Uji Petik & Rubrik Wawancara
    Route::prefix('uji-petik')->name('uji-petik.')->group(function () {
        Route::get('/', [UjiPetikController::class, 'index'])->name('index');
        Route::post('/', [UjiPetikController::class, 'store'])->name('store');
        Route::post('/{id}/score', [UjiPetikController::class, 'submitScore'])->name('score');
    });

    // Sidang Pleno & Berita Acara
    Route::prefix('pleno')->name('pleno.')->group(function () {
        Route::get('/', [PlenoController::class, 'index'])->name('index');
        Route::post('/', [PlenoController::class, 'store'])->name('store');
        Route::post('/{id}/legalize', [PlenoController::class, 'legalize'])->name('legalize');
    });

    // SK Rekognisi
    Route::prefix('sk-rekognisi')->name('sk-rekognisi.')->group(function () {
        Route::get('/', [SkRekognisiController::class, 'index'])->name('index');
        Route::get('/{id}', [SkRekognisiController::class, 'show'])->name('show');
        Route::post('/generate', [SkRekognisiController::class, 'generate'])->name('generate');
    });

    // Master Data Academic Setup
    Route::prefix('master-data')->name('master-data.')->group(function () {
        Route::get('/', [MasterDataController::class, 'index'])->name('index');
        Route::post('/gelombang', [MasterDataController::class, 'storeGelombang'])->name('gelombang.store');
        Route::post('/matakuliah', [MasterDataController::class, 'storeMataKuliah'])->name('matakuliah.store');
        Route::post('/cpmk', [MasterDataController::class, 'storeCpmk'])->name('cpmk.store');
        Route::post('/indikator', [MasterDataController::class, 'storeIndikatorCpmk'])->name('indikator.store');
    });

    // 10. Masa Sanggah / Keberatan (Step 20 Flowchart)
    Route::get('/sanggah', [\App\Http\Controllers\SanggahController::class, 'index'])->name('sanggah.index');
    Route::post('/sanggah', [\App\Http\Controllers\SanggahController::class, 'store'])->name('sanggah.store');
    Route::post('/sanggah/{id}/review', [\App\Http\Controllers\SanggahController::class, 'review'])->name('sanggah.review');
});
