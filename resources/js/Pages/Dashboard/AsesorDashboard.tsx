import React from 'react';
import { Link } from '@inertiajs/react';
import {
    ClipboardList,
    FileCheck,
    Clock,
    AlertCircle,
    ArrowRight,
    Video,
    MapPin,
    Calendar,
    ChevronRight,
    CheckCircle2,
    Sparkles,
} from 'lucide-react';
import { AppLayout } from '@/Components/Layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { UinSscDashboardView } from '@/Components/Dashboard/UinSscDashboardView';

export default function AsesorDashboard({
    stats,
    taskList,
    upcomingInterviews,
}: {
    stats: any;
    taskList: any[];
    upcomingInterviews: any[];
}) {
    return (
        <AppLayout
            title="Sistem RPL – Bimbingan dan Konseling Islam (BKI)"
            subtitle="Penilaian Portofolio untuk Transfer dan Perolehan SKS"
            prodiName="Bimbingan dan Konseling Islam (BKI)"
        >
            <div className="space-y-6">
                {/* UIN SSC Main Visual Dashboard Layout */}
                <UinSscDashboardView />

                {/* Specific Live Assessment Queue */}
                <div className="grid lg:grid-cols-3 gap-6 pt-2">
                    {/* Left 2 Cols: Assessor Work Queue */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div>
                                    <CardTitle>Antrean Evaluasi Berkas & Portofolio Asesi</CardTitle>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Klik tombol "Buka Dual-Panel Workspace" untuk mengevaluasi berkas portofolio dengan validasi A-C-S-V.
                                    </p>
                                </div>
                            </CardHeader>
                            <div className="divide-y divide-slate-100">
                                {taskList.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400 text-xs">
                                        Tidak ada penugasan evaluasi aktif saat ini.
                                    </div>
                                ) : (
                                    taskList.map((task) => (
                                        <div key={task.id} className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                                            <div className="space-y-1.5 min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-slate-900">{task.nama_asesi}</span>
                                                    <Badge variant="blue" size="sm">RPL {task.jenis_rpl}</Badge>
                                                    <Badge
                                                        variant={task.sla_color === 'emerald' ? 'emerald' : task.sla_color === 'amber' ? 'amber' : 'red'}
                                                        size="sm"
                                                    >
                                                        SLA: {task.sla_label}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-slate-600">
                                                    Program Studi: <strong>{task.prodi}</strong> &bull; No: <span className="font-mono text-slate-500">{task.nomor_pendaftaran}</span>
                                                </p>
                                                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                                                    <span>Kemajuan Asesmen: <strong className="text-emerald-700">{task.progress_assessed} Mata Kuliah</strong></span>
                                                    <span>&bull;</span>
                                                    <span>Batas Waktu: <strong>{task.sla_due_at}</strong></span>
                                                </div>
                                            </div>

                                            <div className="shrink-0">
                                                <Link href={`/asesor/workspace/${task.pendaftar_id}`}>
                                                    <Button variant="primary" size="sm" className="bg-[#125c50] hover:bg-[#187566] text-white shadow-sm">
                                                        Buka Dual-Panel Workspace <ArrowRight className="w-4 h-4 ml-1.5" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right 1 Col: Upcoming Interviews */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Video className="w-4 h-4 text-purple-600" />
                                    <CardTitle className="text-sm">Jadwal Uji Petik / Wawancara</CardTitle>
                                </div>
                                <Link href="/uji-petik">
                                    <Button variant="ghost" size="sm" className="text-xs text-emerald-700">
                                        Kelola
                                    </Button>
                                </Link>
                            </CardHeader>
                            <div className="divide-y divide-slate-100">
                                {upcomingInterviews.length === 0 ? (
                                    <div className="p-6 text-center text-slate-400 text-xs">
                                        Belum ada jadwal uji petik yang ditugaskan.
                                    </div>
                                ) : (
                                    upcomingInterviews.map((u) => (
                                        <div key={u.id} className="p-4 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-xs text-slate-900">{u.nama_asesi}</span>
                                                <Badge variant="purple" size="sm">{u.jenis_uji}</Badge>
                                            </div>
                                            <p className="text-xs text-slate-600 font-medium">{u.mata_kuliah}</p>
                                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                                                <span>{u.jadwal}</span>
                                            </div>
                                            {u.link_meeting && (
                                                <a
                                                    href={u.link_meeting}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline pt-1"
                                                >
                                                    <Video className="w-3.5 h-3.5" /> Buka Zoom / Link Meeting
                                                </a>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
