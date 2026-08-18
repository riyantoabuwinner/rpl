import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/UI/Button';

export default function VerifyInvalid({ token }: { token: string }) {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto w-full text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-extrabold text-white">Dokumen Tidak Ditemukan / Tidak Sah</h2>
                    <p className="text-xs text-slate-400">
                        Token verifikasi QR Code tidak cocok dengan rekaman Surat Keputusan resmi pada basis data SIRPL.
                    </p>
                    <p className="text-[11px] font-mono text-red-400 bg-red-950/40 p-2 rounded-xl border border-red-900/60 mt-2">
                        Token: {token}
                    </p>
                </div>

                <div>
                    <Link href="/">
                        <Button variant="outline" size="sm" className="bg-slate-800 text-slate-200 border-slate-700">
                            Kembali ke Halaman Utama
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
