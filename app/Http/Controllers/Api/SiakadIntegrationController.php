<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IntegrationLog;
use App\Services\SiakadSyncService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiakadIntegrationController extends Controller
{
    public function __construct(
        protected SiakadSyncService $syncService
    ) {}

    /**
     * Preview Program Studi directly from SIAKAD without saving
     */
    public function previewProdi(Request $request): JsonResponse
    {
        $fakultas = $request->query('fakultas');
        $result = $this->syncService->previewProgramStudi($fakultas);

        return response()->json($result, $result['success'] ? 200 : ($result['status_code'] ?? 500));
    }

    /**
     * Sync and Save Program Studi from SIAKAD
     */
    public function syncProdi(Request $request): JsonResponse
    {
        $fakultas = $request->input('fakultas');
        $result = $this->syncService->syncProgramStudi($fakultas, $request->user()?->id);

        return response()->json($result, $result['success'] ? 200 : 422);
    }

    /**
     * Preview Mata Kuliah directly from SIAKAD without saving
     */
    public function previewMataKuliah(Request $request): JsonResponse
    {
        $request->validate([
            'kode_prodi' => 'required|string|max:50',
        ]);

        $kodeProdi = $request->input('kode_prodi');
        $result = $this->syncService->previewMataKuliah($kodeProdi);

        return response()->json($result, $result['success'] ? 200 : ($result['status_code'] ?? 500));
    }

    /**
     * Sync and Save Mata Kuliah from SIAKAD
     */
    public function syncMataKuliah(Request $request): JsonResponse
    {
        $request->validate([
            'kode_prodi' => 'required|string|max:50',
            'kurikulum_id' => 'nullable|uuid|exists:kurikulum,id',
        ]);

        $kodeProdi = $request->input('kode_prodi');
        $kurikulumId = $request->input('kurikulum_id');

        $result = $this->syncService->syncMataKuliah($kodeProdi, $kurikulumId, $request->user()?->id);

        return response()->json($result, $result['success'] ? 200 : 422);
    }

    /**
     * Get SIAKAD Integration Activity Logs
     */
    public function getLogs(Request $request): JsonResponse
    {
        $logs = IntegrationLog::where('target_system', 'SIAKAD')
            ->with('actor:id,name,email')
            ->latest('created_at')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $logs,
        ]);
    }
}
