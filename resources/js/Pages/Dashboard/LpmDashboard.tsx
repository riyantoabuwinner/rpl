import React from 'react';
import { Link } from '@inertiajs/react';
import { ShieldCheck, AlertTriangle, Clock, FileSearch, CheckCircle2, Search } from 'lucide-react';
import { AppLayout } from '@/Components/Layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';

export default function LpmDashboard({
    stats,
    samplePendaftar,
    recentAuditLogs,
}: {
    stats: any;
    samplePendaftar: any[];
    recentAuditLogs: any[];
}) {
    return (
        <AppLayout title="Dashboard Lembaga Penjaminan Mutu (LPM)">
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-blue-600">
                        <CardContent className="p-5">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Uji Petik 10%</span>
                            <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{stats.sample_target_10pct} Sampel</h3>
                            <p className="text-xs text-slate-500 mt-1">Dari {stats.total_pendaftar} total berkas</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500">
                        <CardContent className="p-5">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Potensi Dokumen Duplikat</span>
                            <h3 className="text-2xl font-extrabold text-red-600 mt-2">{stats.potential_duplicate_docs} Berkas</h3>
                            <p className="text-xs text-slate-500 mt-1">SHA-256 hash collision alert</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-amber-500">
                        <CardContent className="p-5">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pelanggaran SLA Asesmen</span>
                            <h3 className="text-2xl font-extrabold text-amber-600 mt-2">{stats.sla_overdue_count} Berkas</h3>
                            <p className="text-xs text-slate-500 mt-1">Melebihi batas waktu 7 hari kerja</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-600">
                        <CardContent className="p-5">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Audit Trail Log</span>
                            <h3 className="text-2xl font-extrabold text-emerald-600 mt-2">{stats.total_audit_logs}</h3>
                            <p className="text-xs text-slate-500 mt-1">Immutable security event record</p>
                        </CardContent>
                    </Card>
                </div>

                {/* 10% Random Sampling Table */}
                <Card>
                    <CardHeader>
                        <div>
                            <CardTitle>Sampling Acak Audit Kepatuhan Rekognisi (10% Target Mutu)</CardTitle>
                            <p className="text-xs text-slate-500 mt-0.5">Evaluasi kesesuaian bukti portofolio terhadap standar rubrik Permendikbudristek No. 41/2021</p>
                        </div>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="px-5 py-3">Nama Asesi & No. Pendaftaran</th>
                                    <th className="px-4 py-3">Program Studi</th>
                                    <th className="px-3 py-3">Jalur</th>
                                    <th className="px-3 py-3">Asesor Bertugas</th>
                                    <th className="px-3 py-3">Dokumen</th>
                                    <th className="px-3 py-3">Status Kepatuhan SLA</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {samplePendaftar.map((s) => (
                                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <p className="font-bold text-slate-900">{s.nama_lengkap}</p>
                                            <p className="text-[11px] text-slate-500 font-mono">{s.nomor_pendaftaran}</p>
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-700 font-medium">{s.prodi}</td>
                                        <td className="px-3 py-3.5"><Badge variant="blue" size="sm">RPL {s.jenis_rpl}</Badge></td>
                                        <td className="px-3 py-3.5 font-medium text-slate-800">{s.asesor}</td>
                                        <td className="px-3 py-3.5 font-bold text-slate-700">{s.total_dokumen} Berkas</td>
                                        <td className="px-3 py-3.5">
                                            <Badge variant={s.sla_color === 'emerald' ? 'emerald' : s.sla_color === 'amber' ? 'amber' : 'red'} size="sm">
                                                {s.sla_status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Audit Logs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Log Audit Keamanan & Jejak Aktivitas Terakhir</CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="px-5 py-2.5">Waktu</th>
                                    <th className="px-4 py-2.5">Pengguna</th>
                                    <th className="px-3 py-2.5">Peran</th>
                                    <th className="px-3 py-2.5">Aksi</th>
                                    <th className="px-3 py-2.5">Entitas</th>
                                    <th className="px-4 py-2.5">IP Address</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentAuditLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/80">
                                        <td className="px-5 py-2.5 text-slate-500">{log.created_at}</td>
                                        <td className="px-4 py-2.5 font-bold text-slate-900">{log.user_name}</td>
                                        <td className="px-3 py-2.5 text-blue-600 font-semibold">{log.role}</td>
                                        <td className="px-3 py-2.5 font-bold text-slate-800">{log.action}</td>
                                        <td className="px-3 py-2.5 text-slate-500">{log.entity_type}</td>
                                        <td className="px-4 py-2.5 text-slate-500">{log.ip_address}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
