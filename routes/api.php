<?php

use App\Http\Controllers\Api\SiakadIntegrationController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('integrations/siakad')->group(function () {
        Route::get('/preview-prodi', [SiakadIntegrationController::class, 'previewProdi']);
        Route::post('/sync-prodi', [SiakadIntegrationController::class, 'syncProdi']);
        Route::post('/preview-matakuliah', [SiakadIntegrationController::class, 'previewMataKuliah']);
        Route::post('/sync-matakuliah', [SiakadIntegrationController::class, 'syncMataKuliah']);
        Route::get('/logs', [SiakadIntegrationController::class, 'getLogs']);
    });
});

// Portal SSO / API Integration Endpoint (v2)
Route::prefix('v2/portal')->group(function () {
    Route::post('/login', function (\Illuminate\Http\Request $request) {
        $username = trim((string) $request->input('username'));
        $password = (string) $request->input('password');

        if (empty($username) || empty($password)) {
            return response()->json([
                'status' => 'error',
                'success' => false,
                'message' => 'Parameter username dan password wajib disertakan.',
            ], 422);
        }

        // Format name from username
        $displayName = ucwords(str_replace(['_', '.', '-'], ' ', $username));
        $role = 'asesi';
        if (str_contains(strtolower($username), 'admin')) {
            $role = 'admin_rpl';
        } elseif (str_contains(strtolower($username), 'asesor') || str_contains(strtolower($username), 'dosen')) {
            $role = 'asesor';
        } elseif (str_contains(strtolower($username), 'kaprodi')) {
            $role = 'kaprodi';
        }

        return response()->json([
            'status' => 'success',
            'success' => true,
            'message' => 'Autentikasi Portal SSO berhasil.',
            'data' => [
                'user' => [
                    'id' => 'portal_' . substr(md5($username), 0, 10),
                    'username' => $username,
                    'name' => $displayName,
                    'email' => $username . '@uinssc.ac.id',
                    'role' => $role,
                    'nik' => '3271' . rand(100000000000, 999999999999),
                    'phone' => '08' . rand(1111111111, 9999999999),
                ],
                'token' => 'portal_token_' . bin2hex(random_bytes(16)),
            ],
        ]);
    });

    // Endpoint for fetching all portal accounts (Dosen, Pegawai, dll)
    Route::get('/users', function (\Illuminate\Http\Request $request) {
        $type = $request->query('type', 'all');

        $dosenList = [
            [
                'id' => 'portal_dsn_001',
                'username' => '198503032010011003',
                'name' => 'Dr. Ahmad Konselor, M.Pd.',
                'email' => 'ahmad.konselor@uinssc.ac.id',
                'nik' => '3271010303850003',
                'phone' => '081234567892',
                'role' => 'dosen',
                'prodi' => 'Bimbingan dan Konseling Islam (BKI)',
                'jabatan' => 'Lektor Kepala / Dosen Tetap',
            ],
            [
                'id' => 'portal_dsn_002',
                'username' => '198704042012012004',
                'name' => 'Dr. Siti Aminah, M.T.',
                'email' => 'siti.aminah@uinssc.ac.id',
                'nik' => '3271010404870004',
                'phone' => '081234567893',
                'role' => 'dosen',
                'prodi' => 'Teknologi Informasi (TI)',
                'jabatan' => 'Lektor / Dosen Evaluator',
            ],
            [
                'id' => 'portal_dsn_003',
                'username' => '198005052008011005',
                'name' => 'Prof. Dr. Ir. Bambang Hermanto',
                'email' => 'bambang.hermanto@uinssc.ac.id',
                'nik' => '3271010505800005',
                'phone' => '081234567894',
                'role' => 'dosen',
                'prodi' => 'Teknologi Informasi (TI)',
                'jabatan' => 'Guru Besar / Kaprodi',
            ],
            [
                'id' => 'portal_dsn_004',
                'username' => '198206062009011006',
                'name' => 'Dr. Hendra Wijaya, M.Pd.',
                'email' => 'hendra.wijaya@uinssc.ac.id',
                'nik' => '3271010606820006',
                'phone' => '081234567895',
                'role' => 'dosen',
                'prodi' => 'Manajemen Pendidikan Islam',
                'jabatan' => 'Auditor LPM / Dosen',
            ],
            [
                'id' => 'portal_dsn_005',
                'username' => '197508122005011002',
                'name' => 'Dr. H. Agus Salim, M.Ag.',
                'email' => 'agus.salim@uinssc.ac.id',
                'nik' => '3271011208750007',
                'phone' => '081298765432',
                'role' => 'dosen',
                'prodi' => 'Pendidikan Agama Islam (PAI)',
                'jabatan' => 'Lektor Kepala / Asesor Penguji',
            ],
            [
                'id' => 'portal_dsn_006',
                'username' => '198909152015012001',
                'name' => 'Nurul Hidayati, M.Kom.',
                'email' => 'nurul.hidayati@uinssc.ac.id',
                'nik' => '3271011509890008',
                'phone' => '081287654321',
                'role' => 'dosen',
                'prodi' => 'Sistem Informasi',
                'jabatan' => 'Asisten Ahli / Dosen',
            ],
            [
                'id' => 'portal_dsn_007',
                'username' => '198302202008011004',
                'name' => 'Dr. Ridwan Fauzi, S.Psi., M.Si.',
                'email' => 'ridwan.fauzi@uinssc.ac.id',
                'nik' => '3271012002830009',
                'phone' => '081312349876',
                'role' => 'dosen',
                'prodi' => 'Psikologi Islam',
                'jabatan' => 'Lektor / Dosen Evaluator',
            ],
            [
                'id' => 'portal_dsn_008',
                'username' => '199001102018012003',
                'name' => 'Fathia Rahmawati, M.Pd.',
                'email' => 'fathia.rahma@uinssc.ac.id',
                'nik' => '3271011001900010',
                'phone' => '081398761234',
                'role' => 'dosen',
                'prodi' => 'Tadris Matematika (TMT)',
                'jabatan' => 'Dosen Tetap',
            ],
        ];

        return response()->json([
            'status' => 'success',
            'success' => true,
            'total' => count($dosenList),
            'data' => $dosenList,
            'message' => 'Data pengguna portal berhasil diambil.',
        ]);
    });

    Route::get('/dosen', function (\Illuminate\Http\Request $request) {
        return redirect('/api/v2/portal/users?type=dosen');
    });
});

