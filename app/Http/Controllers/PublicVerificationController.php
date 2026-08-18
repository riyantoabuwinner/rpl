<?php

namespace App\Http\Controllers;

use App\Models\RplSkRekognisi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicVerificationController extends Controller
{
    /**
     * Public QR Code Document Verification Endpoint
     * Route: /verify/{qrToken}
     */
    public function verify(string $qrToken): Response
    {
        $sk = RplSkRekognisi::where('qr_token', $qrToken)
            ->with([
                'pendaftar.prodi:id,nama_prodi,jenjang,fakultas',
                'pendaftar.konversiNilai',
            ])
            ->first();

        if (!$sk) {
            return Inertia::render('Public/VerifyInvalid', [
                'token' => $qrToken,
            ]);
        }

        return Inertia::render('Public/VerifySuccess', [
            'sk' => [
                'nomor_sk' => $sk->nomor_sk,
                'tanggal_sk' => $sk->tanggal_sk->format('d F Y'),
                'nama_mahasiswa' => $sk->pendaftar->nama_lengkap,
                'nik_masked' => $sk->pendaftar->masked_nik,
                'prodi' => $sk->pendaftar->prodi?->nama_prodi,
                'jenjang' => $sk->pendaftar->prodi?->jenjang,
                'fakultas' => $sk->pendaftar->prodi?->fakultas,
                'total_sks_diakui' => $sk->total_sks_diakui,
                'ipk_konversi' => $sk->ipk_konversi,
                'pejabat_nama' => $sk->pejabat_nama,
                'pejabat_jabatan' => $sk->pejabat_jabatan,
                'document_hash' => $sk->document_hash,
                'is_valid' => true,
                'verified_at' => now()->format('d M Y, H:i:s') . ' WIB',
            ],
        ]);
    }
}
