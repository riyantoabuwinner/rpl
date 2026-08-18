import React from 'react';
import { Link } from '@inertiajs/react';
import { Users, FileCheck, Award, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';
import { AppLayout } from '@/Components/Layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';

export default function KaprodiDashboard({
    prodi,
    stats,
    pendaftarList,
}: {
    prodi: any;
    stats: any;
    pendaftarList: any[];
}) {
    return (
        <AppLayout title={`Dashboard Pimpinan Prodi ${prodi?.nama_prodi || ''}`}>
            <div className="space-y-6">
                {/* Header Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <Badge variant="blue" size="sm" className="bg-blue-600 text-white border-0 mb-1">
                            Program Studi {prodi?.jenjang || 'S1'}
                        </Badge>
                        <h3 className="text-xl font-bold text-white">{prodi?.nama_prodi || 'Program Studi'}</h3>
                        <p className="text-xs text-slate-300 mt-0.5">Pemantauan kelayakan konversi SKS rekognisi pembelajaran lampau mahasiswa baru</p>
                    </div>

                    <Link href="/pleno">
                        <Button variant="primary" className="bg-blue-600 hover:bg-blue-500 shadow-md">
                            <UserCheck className="w-4 h-4 mr-1.5" /> Pengesahan Sidang Pleno
                        </Button>
                    </Link>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-blue-600">
                        <CardContent className="p-5">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pendaftar Prodi</span>
                            <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{stats.total_pendaftar_prodi}</h3>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-indigo-600">
                        <CardContent className="p-5">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Proses Asesmen</span>
                            <h3 className="text-2xl font-extrabold text-indigo-600 mt-2">{stats.proses_asesmen}</h3>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-purple-600">
                        <CardContent className="p-5">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Menunggu Pleno</span>
                            <h3 className="text-2xl font-extrabold text-purple-600 mt-2">{stats.menunggu_pleno}</h3>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-emerald-600">
                        <CardContent className="p-5">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Selesai / Terbit SK</span>
                            <h3 className="text-2xl font-extrabold text-emerald-600 mt-2">{stats.selesai_sk}</h3>
                        </CardContent>
                    </Card>
                </div>

                {/* Applicants List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Calon Mahasiswa Rekognisi Prodi</CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="px-5 py-3">Nama Asesi</th>
                                    <th className="px-4 py-3">No. Pendaftaran</th>
                                    <th className="px-3 py-3">Jalur</th>
                                    <th className="px-3 py-3">Status</th>
                                    <th className="px-3 py-3">SKS Diakui</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pendaftarList.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-5 py-3.5 font-bold text-slate-900">{p.nama_lengkap}</td>
                                        <td className="px-4 py-3.5 font-mono text-slate-500">{p.nomor_pendaftaran}</td>
                                        <td className="px-3 py-3.5"><Badge variant="blue" size="sm">RPL {p.jenis_rpl}</Badge></td>
                                        <td className="px-3 py-3.5">
                                            <Badge variant={p.status_color === 'emerald' ? 'emerald' : p.status_color === 'blue' ? 'blue' : 'amber'} size="sm">
                                                {p.status_label}
                                            </Badge>
                                        </td>
                                        <td className="px-3 py-3.5 font-bold text-emerald-700">{p.total_sks_diakui || 0} SKS</td>
                                        <td className="px-4 py-3.5 text-right">
                                            <Link href={`/pleno`}>
                                                <Button variant="outline" size="sm" className="h-7 text-xs">
                                                    Lihat Pleno
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
        </AppLayout>
    );
}
