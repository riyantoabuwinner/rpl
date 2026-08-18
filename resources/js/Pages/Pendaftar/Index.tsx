import React, { useState } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import {
    Search,
    Filter,
    FileCheck,
    CheckCircle2,
    XCircle,
    UserCheck,
    Clock,
    Eye,
    ShieldAlert,
} from 'lucide-react';
import { AppLayout } from '@/Components/Layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Modal } from '@/Components/UI/Modal';

export default function PendaftarIndex({
    pendaftarList,
    filters,
    prodiList,
    asesorList,
}: {
    pendaftarList: any;
    filters: any;
    prodiList: any[];
    asesorList: any[];
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedProdi, setSelectedProdi] = useState(filters.prodi_id || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

    // Verification Form
    const verifyForm = useForm({
        action: 'valid',
        catatan: 'Berkas administrasi dan KTP telah terverifikasi valid.',
        asesor_id: asesorList[0]?.id || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/pendaftar', {
            search,
            prodi_id: selectedProdi,
            status: selectedStatus,
        }, { preserveState: true });
    };

    const openVerifyModal = (applicant: any) => {
        setSelectedApplicant(applicant);
        setIsVerifyModalOpen(true);
    };

    const handleVerifySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedApplicant) return;

        verifyForm.post(`/admin/pendaftar/${selectedApplicant.id}/verify`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsVerifyModalOpen(false);
                setSelectedApplicant(null);
            },
        });
    };

    return (
        <AppLayout title="Data & Verifikasi Administrasi Pendaftar RPL">
            <div className="space-y-6">
                {/* Search & Filter Bar */}
                <Card>
                    <CardContent className="p-4">
                        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
                            <div className="flex-1 min-w-[240px] relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama asesi, NIK, email, no. pendaftaran..."
                                    className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <select
                                value={selectedProdi}
                                onChange={(e) => setSelectedProdi(e.target.value)}
                                className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                            >
                                <option value="">Semua Program Studi</option>
                                {prodiList.map((p) => (
                                    <option key={p.id} value={p.id}>{p.nama_prodi}</option>
                                ))}
                            </select>

                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                            >
                                <option value="">Semua Status</option>
                                <option value="terkirim">Baru Terkirim</option>
                                <option value="proses_asesmen">Proses Asesmen</option>
                                <option value="uji_petik">Uji Petik</option>
                                <option value="pleno">Sidang Pleno</option>
                                <option value="selesai">Selesai / Terbit SK</option>
                            </select>

                            <Button type="submit" variant="primary" size="sm">
                                Filter Data
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Main Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="px-5 py-3">Nama & No. Pendaftaran</th>
                                    <th className="px-4 py-3">Program Studi</th>
                                    <th className="px-3 py-3">Jalur</th>
                                    <th className="px-3 py-3">Status</th>
                                    <th className="px-3 py-3">SLA Status</th>
                                    <th className="px-3 py-3">Asesor Ditugaskan</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pendaftarList.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                                            Tidak ada data pendaftar yang cocok dengan kriteria filter.
                                        </td>
                                    </tr>
                                ) : (
                                    pendaftarList.data.map((p: any) => (
                                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <p className="font-bold text-slate-900">{p.nama_lengkap}</p>
                                                <p className="text-[11px] text-slate-500 font-mono">
                                                    {p.nomor_pendaftaran} &bull; NIK: {p.nik_masked}
                                                </p>
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
                                            <td className="px-3 py-3.5 text-slate-700 font-medium">{p.asesor}</td>
                                            <td className="px-4 py-3.5 text-right space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openVerifyModal(p)}
                                                    className="h-7 text-xs"
                                                >
                                                    <FileCheck className="w-3.5 h-3.5 mr-1 text-blue-600" /> Verifikasi / Plot Asesor
                                                </Button>
                                                <Link href={`/asesor/workspace/${p.id}`}>
                                                    <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600">
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Verification & Plotting Modal */}
            <Modal
                isOpen={isVerifyModalOpen}
                onClose={() => setIsVerifyModalOpen(false)}
                title="Verifikasi Administrasi & Penugasan Asesor"
                description={`Pendaftar: ${selectedApplicant?.nama_lengkap} (${selectedApplicant?.nomor_pendaftaran})`}
            >
                <form onSubmit={handleVerifySubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Keputusan Verifikasi Berkas *</label>
                        <select
                            value={verifyForm.data.action}
                            onChange={(e) => verifyForm.setData('action', e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl font-bold"
                        >
                            <option value="valid">Lengkap & Valid &rarr; Teruskan ke Asesmen Portofolio</option>
                            <option value="ditolak_administrasi">Ditolak Administrasi &rarr; Berkas Tidak Sesuai</option>
                        </select>
                    </div>

                    {verifyForm.data.action === 'valid' && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Dosen Asesor Evaluator *</label>
                            <select
                                value={verifyForm.data.asesor_id}
                                onChange={(e) => verifyForm.setData('asesor_id', e.target.value)}
                                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl font-medium text-blue-700"
                            >
                                {asesorList.map((a) => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Verifikasi / Catatan untuk Asesor</label>
                        <textarea
                            rows={3}
                            value={verifyForm.data.catatan}
                            onChange={(e) => verifyForm.setData('catatan', e.target.value)}
                            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsVerifyModalOpen(false)}>Batal</Button>
                        <Button type="submit" variant="primary" isLoading={verifyForm.processing}>
                            Simpan Keputusan & Mulai SLA 7 Hari Asesmen
                        </Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
