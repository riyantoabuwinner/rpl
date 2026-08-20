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
            [
                'id' => 'portal_dsn_009',
                'username' => '198104122007011003',
                'name' => 'Dr. M. Anwar Sanusi, M.Ag.',
                'email' => 'anwar.sanusi@uinssc.ac.id',
                'nik' => '3271011204810011',
                'phone' => '081211223344',
                'role' => 'dosen',
                'prodi' => 'Hukum Ekonomi Syariah (HES)',
                'jabatan' => 'Lektor Kepala',
            ],
            [
                'id' => 'portal_dsn_010',
                'username' => '198605152011012002',
                'name' => 'Dr. Dewi Lestari, S.E., M.Si.',
                'email' => 'dewi.lestari@uinssc.ac.id',
                'nik' => '3271011505860012',
                'phone' => '081222334455',
                'role' => 'dosen',
                'prodi' => 'Perbankan Syariah',
                'jabatan' => 'Lektor / Dosen Evaluator',
            ],
            [
                'id' => 'portal_dsn_011',
                'username' => '197903182006041001',
                'name' => 'Dr. H. Lukman Hakim, M.Hum.',
                'email' => 'lukman.hakim@uinssc.ac.id',
                'nik' => '3271011803790013',
                'phone' => '081233445566',
                'role' => 'dosen',
                'prodi' => 'Komunikasi dan Penyiaran Islam (KPI)',
                'jabatan' => 'Lektor Kepala',
            ],
            [
                'id' => 'portal_dsn_012',
                'username' => '198807202014032001',
                'name' => 'Ratih Kusumaningrum, M.Pd.',
                'email' => 'ratih.kusuma@uinssc.ac.id',
                'nik' => '3271012007880014',
                'phone' => '081244556677',
                'role' => 'dosen',
                'prodi' => 'Pendidikan Bahasa Arab (PBA)',
                'jabatan' => 'Asisten Ahli',
            ],
            [
                'id' => 'portal_dsn_013',
                'username' => '198411252009121002',
                'name' => 'Dr. Zulfikar Ali, S.T., M.Kom.',
                'email' => 'zulfikar.ali@uinssc.ac.id',
                'nik' => '3271012511840015',
                'phone' => '081255667788',
                'role' => 'dosen',
                'prodi' => 'Teknologi Informasi (TI)',
                'jabatan' => 'Lektor / Asesor Penguji',
            ],
            [
                'id' => 'portal_dsn_014',
                'username' => '197809102003121004',
                'name' => 'Prof. Dr. H. Abdurrahman, M.A.',
                'email' => 'abdurrahman@uinssc.ac.id',
                'nik' => '3271011009780016',
                'phone' => '081266778899',
                'role' => 'dosen',
                'prodi' => 'Ilmu Al-Qur\'an dan Tafsir (IAT)',
                'jabatan' => 'Guru Besar',
            ],
            [
                'id' => 'portal_dsn_015',
                'username' => '199102022019032005',
                'name' => 'Intan Permatasari, M.Si.',
                'email' => 'intan.permata@uinssc.ac.id',
                'nik' => '3271010202910017',
                'phone' => '081277889900',
                'role' => 'dosen',
                'prodi' => 'Tadris Matematika (TMT)',
                'jabatan' => 'Asisten Ahli',
            ],
            [
                'id' => 'portal_dsn_016',
                'username' => '198512122010121001',
                'name' => 'Dr. Muhammad Farhan, S.Kom., M.Cs.',
                'email' => 'm.farhan@uinssc.ac.id',
                'nik' => '3271011212850018',
                'phone' => '081288990011',
                'role' => 'dosen',
                'prodi' => 'Sistem Informasi',
                'jabatan' => 'Lektor / Dosen Evaluator',
            ],
            [
                'id' => 'portal_dsn_017',
                'username' => '198306142008122003',
                'name' => 'Dr. Siti Maryam, M.Pd.I.',
                'email' => 'siti.maryam@uinssc.ac.id',
                'nik' => '3271011406830019',
                'phone' => '081299001122',
                'role' => 'dosen',
                'prodi' => 'Pendidikan Islam Anak Usia Dini (PIAUD)',
                'jabatan' => 'Lektor',
            ],
            [
                'id' => 'portal_dsn_018',
                'username' => '198610052014021003',
                'name' => 'Dr. Irfan Maulana, M.Ag.',
                'email' => 'irfan.maulana@uinssc.ac.id',
                'nik' => '3271010510860020',
                'phone' => '081300112233',
                'role' => 'dosen',
                'prodi' => 'Akidah dan Filsafat Islam',
                'jabatan' => 'Lektor',
            ],
            [
                'id' => 'portal_dsn_019',
                'username' => '199208082020122004',
                'name' => 'Nabila Khairunnisa, M.Kom.',
                'email' => 'nabila.k@uinssc.ac.id',
                'nik' => '3271010808920021',
                'phone' => '081311223344',
                'role' => 'dosen',
                'prodi' => 'Teknologi Informasi (TI)',
                'jabatan' => 'Asisten Ahli',
            ],
            [
                'id' => 'portal_dsn_020',
                'username' => '197604192002121002',
                'name' => 'Dr. H. Mansyur, M.Si.',
                'email' => 'mansyur@uinssc.ac.id',
                'nik' => '3271011904760022',
                'phone' => '081322334455',
                'role' => 'dosen',
                'prodi' => 'Sosiologi Agama',
                'jabatan' => 'Lektor Kepala',
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

