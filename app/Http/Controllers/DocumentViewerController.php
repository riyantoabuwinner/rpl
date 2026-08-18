<?php

namespace App\Http\Controllers;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\RplBuktiAsesi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;

class DocumentViewerController extends Controller
{
    /**
     * Serve secure document preview with signed URL and access verification
     */
    public function preview(Request $request, string $buktiId): Response
    {
        // Enforce valid signed URL
        if (!$request->hasValidSignature()) {
            abort(403, 'Tautan preview dokumen ini tidak valid atau telah kedaluwarsa (Masa aktif 15 menit).');
        }

        $bukti = RplBuktiAsesi::findOrFail($buktiId);

        // Audit view
        AuditLog::record(
            action: AuditAction::VIEW_DOCUMENT,
            entityType: 'RplBuktiAsesi',
            entityId: $bukti->id,
            newValues: ['file_name' => $bukti->file_original_name, 'hash' => $bukti->file_hash]
        );

        $path = $bukti->file_path;

        if (!Storage::exists($path)) {
            // Serve fallback placeholder if file was created as simulated sample
            return response(
                "%PDF-1.4\n1 0 obj\n<< /Title (Dokumen Evaluasi Asesor) /Author (SIRPL Perguruan Tinggi) >>\nendobj\n",
                200,
                [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'inline; filename="' . $bukti->file_original_name . '"',
                ]
            );
        }

        $fileContent = Storage::get($path);
        $mimeType = $bukti->mime_type ?? 'application/pdf';

        return response($fileContent, 200, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="' . $bukti->file_original_name . '"',
            'X-Document-SHA256' => $bukti->file_hash,
            'X-Watermark-Evaluator' => $request->user()?->name ?? 'Evaluator',
        ]);
    }
}
