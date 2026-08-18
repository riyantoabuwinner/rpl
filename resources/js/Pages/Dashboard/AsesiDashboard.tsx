import React from 'react';
import { Link } from '@inertiajs/react';
import {
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowRight,
    Award,
    Calendar,
    Video,
    Sparkles,
    ShieldCheck,
    Download,
} from 'lucide-react';
import { AppLayout } from '@/Components/Layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { FlowchartTracker } from '@/Components/UI/FlowchartTracker';

export default function AsesiDashboard({
    pendaftar,
    activeGelombang,
}: {
    pendaftar: any;
    activeGelombang: any;
}) {
    const steps = [
        { key: 'draft', label: 'Pengisian F-02' },
        { key: 'terkirim', label: 'Verifikasi Berkas' },
        { key: 'proses_asesmen', label: 'Asesmen Portofolio' },
        { key: 'uji_petik', label: 'Uji Petik / Wawancara' },
        { key: 'pleno', label: 'Sidang Pleno' },
        { key: 'selesai', label: 'SK Rekognisi Terbit' },
    ];

    const getCurrentStepIndex = () => {
        if (!pendaftar) return 0;
        const status = pendaftar.status;
        if (status === 'draft') return 0;
        if (status === 'terkirim' || status === 'verifikasi_administrasi') return 1;
        if (status === 'proses_asesmen') return 2;
        if (status === 'uji_petik') return 3;
        if (status === 'pleno') return 4;
        if (status === 'penerbitan_sk' || status === 'selesai' || status === 'sinkronisasi') return 5;
        return 0;
    };

    const currentStepIndex = getCurrentStepIndex();

    return (
        <AppLayout title="Portal Calon Mahasiswa (Asesi RPL)">
            <div className="space-y-6 max-w-6xl mx-auto">
                {/* 5-Swimlane Flowchart Tracker */}
                <FlowchartTracker currentStage={pendaftar?.status || 'draft'} />

                {/* Status Tracker Card */}
                <Card className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white border-0 shadow-xl overflow-hidden relative">
                    <CardContent className="p-6 md:p-8 space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="blue" size="sm" className="bg-blue-600 text-white border-0">
                                        Status Pendaftaran
                                    </Badge>
                                    {pendaftar && <span className="text-xs text-blue-200 font-mono">{pendaftar.nomor_pendaftaran}</span>}
                                </div>
                                <h3 className="text-xl md:text-2xl font-extrabold text-white">
                                    {pendaftar ? pendaftar.nama_lengkap : 'Selamat Datang di Portal SIRPL'}
                                </h3>
                                <p className="text-xs text-slate-300 mt-1">
                                    {pendaftar
                                        ? `Program Studi Pilihan: ${pendaftar.prodi} (${pendaftar.jenis_rpl_label})`
                                        : 'Silakan mulai pendaftaran untuk mengonversi pengalaman dan portofolio Anda.'}
                                </p>
                            </div>

                            <div>
                                {pendaftar ? (
                                    pendaftar.status === 'draft' ? (
                                        <Link href="/form-f02">
                                            <Button variant="primary" size="lg" className="shadow-lg shadow-blue-600/40">
                                                Lanjutkan Pengisian Form F-02 <ArrowRight className="w-4 h-4 ml-1.5" />
                                            </Button>
                                        </Link>
                                    ) : pendaftar.sk_available ? (
                                        <Link href={`/sk-rekognisi/${pendaftar.sk_id}`}>
                                            <Button variant="success" size="lg" className="shadow-lg shadow-emerald-600/40">
                                                <Award className="w-5 h-5 mr-2" /> Unduh SK Rekognisi Resmi
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Badge variant="blue" size="md" className="bg-blue-500/20 text-blue-200 border-blue-400/40 text-sm px-4 py-1.5">
                                            {pendaftar.status_label}
                                        </Badge>
                                    )
                                ) : (
                                    <Link href="/form-f02">
                                        <Button variant="primary" size="lg" className="shadow-lg shadow-blue-600/40">
                                            Mulai Form F-02 <ArrowRight className="w-4 h-4 ml-1.5" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Visual Step Progress Bar */}
                        <div className="pt-6 border-t border-slate-800/80">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                                {steps.map((step, idx) => {
                                    const isDone = idx < currentStepIndex;
                                    const isCurrent = idx === currentStepIndex;

                                    return (
                                        <div
                                            key={step.key}
                                            className={`p-3 rounded-xl border text-center transition-all ${
                                                isCurrent
                                                    ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400/30'
                                                    : isDone
                                                    ? 'bg-slate-800/80 text-emerald-400 border-slate-700'
                                                    : 'bg-slate-900/40 text-slate-500 border-slate-800'
                                            }`}
                                        >
                                            <div className="flex items-center justify-center mb-1">
                                                {isDone ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                ) : (
                                                    <span className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center border border-current">
                                                        {idx + 1}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] font-bold truncate leading-tight">{step.label}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Information Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Summary Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Ringkasan Berkas Pendaftaran Anda</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {pendaftar ? (
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                                        <span className="text-xs text-slate-500 font-semibold uppercase">Dokumen Bukti</span>
                                        <h4 className="text-2xl font-extrabold text-slate-900 mt-1">{pendaftar.total_bukti} Berkas</h4>
                                        <p className="text-[10px] text-slate-400 mt-0.5">Checksum SHA-256 Valid</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-center">
                                        <span className="text-xs text-blue-700 font-semibold uppercase">Mata Kuliah Diklaim</span>
                                        <h4 className="text-2xl font-extrabold text-blue-900 mt-1">{pendaftar.total_klaim_mk} MK</h4>
                                        <p className="text-[10px] text-blue-600 mt-0.5">Form Evaluasi Diri F-02</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
                                        <span className="text-xs text-emerald-700 font-semibold uppercase">SKS Diakui</span>
                                        <h4 className="text-2xl font-extrabold text-emerald-900 mt-1">{pendaftar.total_sks_diakui || 0} SKS</h4>
                                        <p className="text-[10px] text-emerald-600 mt-0.5">Hasil Rekognisi Resmi</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 text-center text-slate-500 text-xs">
                                    Anda belum mengisi formulir pendaftaran evaluasi diri. Klik tombol di atas untuk memulai.
                                </div>
                            )}

                            {pendaftar?.catatan_verifikasi && (
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                                    <p className="font-bold text-slate-900">Catatan Verifikator Pusat RPL:</p>
                                    <p className="text-slate-600">{pendaftar.catatan_verifikasi}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Uji Petik Notice Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Jadwal Uji Petik / Wawancara</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pendaftar?.uji_petik && pendaftar.uji_petik.length > 0 ? (
                                <div className="space-y-3">
                                    {pendaftar.uji_petik.map((u: any) => (
                                        <div key={u.id} className="p-3 rounded-xl bg-purple-50 border border-purple-100 space-y-1.5 text-xs">
                                            <div className="flex items-center justify-between">
                                                <Badge variant="purple" size="sm">{u.jenis}</Badge>
                                                <span className="text-[10px] text-purple-700 font-semibold">{u.metode}</span>
                                            </div>
                                            <p className="font-bold text-slate-900">{u.jadwal}</p>
                                            {u.link_meeting && (
                                                <a href={u.link_meeting} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline">
                                                    <Video className="w-3 h-3" /> Link Video Conference
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Jadwal wawancara atau uji petik kompetensi akan tampil di sini jika asesor membutuhkan pembuktian langsung.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
