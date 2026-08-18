import React from 'react';
import { ShieldCheck, GraduationCap, CheckCircle2, Award, Calendar, ExternalLink } from 'lucide-react';
import { Badge } from '@/Components/UI/Badge';

export default function VerifySuccess({ sk }: { sk: any }) {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">
            <div className="max-w-xl mx-auto w-full space-y-6">
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-extrabold text-white shadow-xl mx-auto">
                        <ShieldCheck className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">Verifikasi Dokumen Resmi Berhasil</h2>
                    <p className="text-xs text-slate-400">Portal Keaslian Dokumen Sistem Informasi RPL Perguruan Tinggi</p>
                </div>

                {/* Certificate Summary Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 border border-slate-100 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                            <span className="text-[10px] text-slate-500 font-mono uppercase">Nomor SK Rekognisi</span>
                            <h4 className="font-bold text-base text-slate-900 font-mono">{sk.nomor_sk}</h4>
                        </div>
                        <Badge variant="emerald" size="md" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Terverifikasi Asli
                        </Badge>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                            <span className="text-slate-500">Nama Penerima Rekognisi:</span>
                            <strong className="text-slate-900 text-right">{sk.nama_mahasiswa}</strong>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                            <span className="text-slate-500">NIK (Masked):</span>
                            <span className="font-mono text-slate-800 font-bold">{sk.nik_masked}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                            <span className="text-slate-500">Program Studi & Jenjang:</span>
                            <strong className="text-blue-700 text-right">{sk.prodi} ({sk.jenjang})</strong>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                            <span className="text-slate-500">Total SKS Diakui:</span>
                            <strong className="text-emerald-700 font-extrabold text-sm">{sk.total_sks_diakui} SKS (IPK {sk.ipk_konversi})</strong>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                            <span className="text-slate-500">Pejabat Pengesah:</span>
                            <span className="text-slate-800 font-medium text-right">{sk.pejabat_nama} ({sk.pejabat_jabatan})</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                            <span className="text-slate-500">Tanggal Ditetapkan:</span>
                            <span className="text-slate-800">{sk.tanggal_sk}</span>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-mono space-y-1">
                        <p className="truncate">Digital SHA-256 Hash: {sk.document_hash}</p>
                        <p>Diverifikasi pada: {sk.verified_at}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
