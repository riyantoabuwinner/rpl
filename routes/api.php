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
