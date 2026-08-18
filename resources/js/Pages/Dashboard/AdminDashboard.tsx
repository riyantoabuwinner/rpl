import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    Users,
    FileCheck,
    Clock,
    Award,
    AlertTriangle,
    ArrowUpRight,
    TrendingUp,
    Activity,
    Layers,
    RefreshCw,
    CheckCircle2,
    Search,
    ChevronRight,
} from 'lucide-react';
import { AppLayout } from '@/Components/Layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { FlowchartTracker } from '@/Components/UI/FlowchartTracker';

export default function AdminDashboard({
    stats,
    prodiStats,
    jalurStats,
    recentPendaftar,
    recentLogs,
    activeGelombang,
}: {
    stats: any;
    prodiStats: any[];
    jalurStats: any;
    recentPendaftar: any[];
    recentLogs: any[];
    activeGelombang: any;
}) {
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSyncProdi = () => {
        setIsSyncing(true);
        fetch('/api/v1/integrations/siakad/sync-prodi', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
                'Accept': 'application/json',
            },
        })
            .then((r) => r.json())
            .then((data) => {
                alert(`Sinkronisasi SIAKAD Berhasil: ${data.message}`);
                router.reload();
            })
            .catch((err) => alert('Gagal sinkronisasi SIAKAD: ' + err))
            .finally(() => setIsSyncing(false));
    };

    return (
        <AppLayout title="Dashboard Pusat RPL & Administrator">
            <div className="space-y-6">
                {/* 5-Swimlane Flowchart Tracker */}
                <FlowchartTracker currentStage="verifikasi_administrasi" />

                {/* Active Period Banner */}
                {activeGelombang && (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-lg flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Badge variant="blue" size="sm" className="bg-blue-600 text-white border-0">
                                    Gelombang Aktif
                                </Badge>
                                <span className="text-xs text-blue-200">T.A. {activeGelombang.tahun} ({activeGelombang.semester})</span>
                            </div>
                            <h3 className="text-lg font-bold text-white">{activeGelombang.nama}</h3>
                            <p className="text-xs text-blue-200">
                                Batas Akhir Pendaftaran & Submit Berkas: <strong>{activeGelombang.tutup}</strong>
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                isLoading={isSyncing}
                                onClick={handleSyncProdi}
                                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                            >
                                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                                Sync Prodi SIAKAD
                            </Button>
                            <Link href="/admin/pendaftar">
                                <Button size="sm" variant="primary" className="bg-blue-600 hover:bg-blue-500 text-white">
                                    Verifikasi Berkas Masuk <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* KPI Metrics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-blue-600">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pendaftar</span>
                                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                    <Users className="w-5 h-5" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{stats.total_pendaftar}</h3>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                <span className="text-emerald-600 font-semibold">{stats.baru_terkirim} Berkas Baru</span> menunggu verifikasi
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-indigo-600">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sedang Asesmen</span>
                                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                                    <FileCheck className="w-5 h-5" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{stats.sedang_asesmen}</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Oleh {stats.total_asesor_aktif} Dosen Asesor aktif
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-600">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Uji Petik & Pleno</span>
                                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                                    <Clock className="w-5 h-5" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                                {stats.menunggu_uji_petik + stats.menunggu_pleno}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                {stats.menunggu_pleno} Siap diajukan ke Sidang Pleno
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-600">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SKS Direkognisi</span>
                                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                                    <Award className="w-5 h-5" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{stats.total_sks_diakui} SKS</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Dari {stats.selesai_sk} SK Rekognisi terbit
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid: Recent Pendaftar + Distribution */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left 2 Cols: Recent Applications Table with SLA */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div>
                                    <CardTitle>Pendaftar & Antrean SLA Terbaru</CardTitle>
                                    <p className="text-xs text-slate-500 mt-0.5">Pemantauan kepatuhan SLA verifikasi berkas administrasi dan asesmen</p>
                                </div>
                                <Link href="/admin/pendaftar">
                                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                                        Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-100">
                                        <tr>
                                            <th className="px-5 py-3">Pendaftar</th>
                                            <th className="px-4 py-3">Program Studi</th>
                                            <th className="px-3 py-3">Jalur</th>
                                            <th className="px-3 py-3">Status</th>
                                            <th className="px-3 py-3">SLA</th>
                                            <th className="px-4 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {recentPendaftar.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <p className="font-bold text-slate-900">{p.nama_lengkap}</p>
                                                    <p className="text-[11px] text-slate-500 font-mono">{p.nomor_pendaftaran} &bull; NIK: {p.nik_masked}</p>
                                                </td>
                                                <td className="px-4 py-3.5 text-slate-700 font-medium">{p.prodi || '-'}</td>
                                                <td className="px-3 py-3.5">
                                                    <Badge variant="blue" size="sm">RPL {p.jenis_rpl}</Badge>
                                                </td>
                                                <td className="px-3 py-3.5">
                                                    <Badge
                                                        variant={p.status_color === 'emerald' ? 'emerald' : p.status_color === 'blue' ? 'blue' : p.status_color === 'amber' ? 'amber' : 'slate'}
                                                        size="sm"
                                                    >
                                                        {p.status_label}
                                                    </Badge>
                                                </td>
                                                <td className="px-3 py-3.5">
                                                    <Badge
                                                        variant={p.sla_color === 'emerald' ? 'emerald' : p.sla_color === 'amber' ? 'amber' : 'red'}
                                                        size="sm"
                                                    >
                                                        {p.sla_label}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3.5 text-right">
                                                    <Link href={`/admin/pendaftar?search=${p.nomor_pendaftaran}`}>
                                                        <Button variant="outline" size="sm" className="h-7 text-xs">
                                                            Detail
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    {/* Right 1 Col: RPL Tracks + Live Audit Trail */}
                    <div className="space-y-6">
                        {/* RPL Track Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribusi Jalur RPL</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                                            A1
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">Transfer Kredit</p>
                                            <p className="text-[10px] text-slate-500">Pindahan / Lanjutan D3</p>
                                        </div>
                                    </div>
                                    <span className="text-base font-extrabold text-slate-900">{jalurStats.A1}</span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                                            A2
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">Perolehan Kredit</p>
                                            <p className="text-[10px] text-slate-500">Pengalaman Kerja & Portofolio</p>
                                        </div>
                                    </div>
                                    <span className="text-base font-extrabold text-blue-700">{jalurStats.A2}</span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                                            B
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">Penyetaraan KKNI</p>
                                            <p className="text-[10px] text-slate-500">Dosen / Tenaga Ahli</p>
                                        </div>
                                    </div>
                                    <span className="text-base font-extrabold text-slate-900">{jalurStats.B}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Audit Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Audit Trail Aktivitas Sistem</CardTitle>
                            </CardHeader>
                            <div className="divide-y divide-slate-100 text-xs">
                                {recentLogs.map((log) => (
                                    <div key={log.id} className="p-3.5 flex items-start gap-2.5">
                                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-800 truncate">
                                                {log.user_name} <span className="text-slate-400 font-normal">({log.role})</span>
                                            </p>
                                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                                                Aksi: <strong>{log.action}</strong> &bull; {log.created_at}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
