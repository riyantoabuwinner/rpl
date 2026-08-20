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
});

