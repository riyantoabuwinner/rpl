import React, { useState } from 'react';
import { Database, RefreshCw, CheckCircle2, AlertTriangle, ArrowUpRight, Send, Layers } from 'lucide-react';
import { AppLayout } from '@/Components/Layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';

export default function SiakadDashboard({
    stats,
    pendingConversions,
    recentIntegrationLogs,
}: {
    stats: any;
    pendingConversions: any[];
    recentIntegrationLogs: any[];
}) {
    const [syncing, setSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState<string | null>(null);

    const handleSyncProdi = async () => {
        setSyncing(true);
        setSyncMessage(null);
        try {
            const res = await fetch('/api/v1/integrations/siakad/sync-prodi', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
                    'Accept': 'application/json',
                },
            });
            const data = await res.json();
            setSyncMessage(data.message || 'Sinkronisasi berhasil dijalankan.');
        } catch (err: any) {
            setSyncMessage('Sinkronisasi gagal: ' . concat(err.message));
        } finally {
            setSyncing(false);
        }
    };

    return (
        <AppLayout title="Integrasi SIAKAD & PDDikti Feeder">
            <div className="space-y-6">
                {/* Integration Actions Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge variant="blue" size="sm" className="bg-sky-600 text-white border-0">
                                Bridge API Terhubung
                            </Badge>
                            <span className="text-xs text-sky-200">Endpoint: https://bridge.uinssc.ac.id/api</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">Sinkronisasi Nilai Transfer Matkul RPL</h3>
                        <p className="text-xs text-slate-300">
                            Menginjeksi hasil rekognisi SKS langsung ke KHS Mahasiswa SIAKAD dan Feeder PDDikti (InsertNilaiTransferMatkul).
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="primary"
                            isLoading={syncing}
                            onClick={handleSyncProdi}
                            className="bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-900/30"
                        >
                            <RefreshCw className="w-4 h-4 mr-1.5" />
                            Tarik Master Prodi SIAKAD
                        </Button>
                    </div>
                </div>

                {syncMessage && (
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
                        {syncMessage}
                    </div>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-sky-600">
                        <CardContent className="p-5">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Siap Injeksi SIAKAD</span>
                            <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{stats.total_siap_injeksi} MK</h3>
                            <p className="text-xs text-slate-500 mt-1">Menunggu pengiriman batch</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-600">
                        <CardContent className="p-5">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tersinkron SIAKAD</span>
                            <h3 className="text-2xl font-extrabold text-emerald-600 mt-2">{stats.berhasil_siakad} MK</h3>
                            <p className="text-xs text-slate-500 mt-1">Status: OK</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-indigo-600">
                        <CardContent className="p-5">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Siap Feeder PDDikti</span>
                            <h3 className="text-2xl font-extrabold text-indigo-600 mt-2">{stats.total_siap_pddikti} MK</h3>
                            <p className="text-xs text-slate-500 mt-1">InsertNilaiTransferMatkul</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-600">
                        <CardContent className="p-5">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tersinkron PDDikti</span>
                            <h3 className="text-2xl font-extrabold text-emerald-600 mt-2">{stats.berhasil_pddikti} MK</h3>
                            <p className="text-xs text-slate-500 mt-1">Terdaftar di Forlap Dikti</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Queue Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Antrean Konversi Nilai Rekognisi SKS</CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="px-5 py-3">Nama Mahasiswa</th>
                                    <th className="px-4 py-3">Program Studi</th>
                                    <th className="px-4 py-3">Mata Kuliah Diakui</th>
                                    <th className="px-3 py-3">SKS</th>
                                    <th className="px-3 py-3">Nilai</th>
                                    <th className="px-3 py-3">Status SIAKAD</th>
                                    <th className="px-3 py-3">Status Feeder</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pendingConversions.map((k) => (
                                    <tr key={k.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-5 py-3.5 font-bold text-slate-900">{k.nama_mahasiswa}</td>
                                        <td className="px-4 py-3.5 text-slate-600">{k.prodi}</td>
                                        <td className="px-4 py-3.5 font-medium text-slate-800">
                                            <span className="font-mono text-blue-600 font-bold">{k.kode_mk_diakui}</span> &bull; {k.nama_mk_diakui}
                                        </td>
                                        <td className="px-3 py-3.5 font-bold text-slate-900">{k.sks_diakui} SKS</td>
                                        <td className="px-3 py-3.5 font-bold text-emerald-700">{k.nilai_huruf} ({k.nilai_indeks})</td>
                                        <td className="px-3 py-3.5">
                                            <Badge variant={k.status_siakad === 'synced' ? 'emerald' : 'amber'} size="sm">
                                                {k.status_siakad}
                                            </Badge>
                                        </td>
                                        <td className="px-3 py-3.5">
                                            <Badge variant={k.status_pddikti === 'synced' ? 'emerald' : 'amber'} size="sm">
                                                {k.status_pddikti}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Integration Logs */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Riwayat Komunikasi API SIAKAD & Feeder</CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="px-5 py-2.5">Waktu</th>
                                    <th className="px-3 py-2.5">Target</th>
                                    <th className="px-4 py-2.5">Aksi / Endpoint</th>
                                    <th className="px-3 py-2.5">Status Code</th>
                                    <th className="px-4 py-2.5">Pesan Respon</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentIntegrationLogs.map((l) => (
                                    <tr key={l.id} className="hover:bg-slate-50/80">
                                        <td className="px-5 py-2.5 text-slate-500">{l.created_at}</td>
                                        <td className="px-3 py-2.5 font-bold text-blue-600">{l.target}</td>
                                        <td className="px-4 py-2.5 text-slate-800">{l.action}</td>
                                        <td className="px-3 py-2.5">
                                            <span className={`px-2 py-0.5 rounded font-bold ${l.response_code === 200 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                                {l.response_code || '200'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5 text-slate-600">{l.response_message}</td>
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
