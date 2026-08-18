import React, { useState } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import { UserCheck, Plus, Calendar, CheckCircle2, FileText, Award, Users } from 'lucide-react';
import { AppLayout } from '@/Components/Layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Modal } from '@/Components/UI/Modal';
import { Input } from '@/Components/UI/Input';

export default function PlenoIndex({
    plenoList,
    prodiList,
    gelombangList,
    usersList,
    readyApplicants,
}: {
    plenoList: any;
    prodiList: any[];
    gelombangList: any[];
    usersList: any[];
    readyApplicants: any[];
}) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const plenoForm = useForm({
        gelombang_id: gelombangList[0]?.id || '',
        prodi_id: prodiList[0]?.id || '',
        nomor_berita_acara: `BA-RPL/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 900) + 100)}`,
        tanggal_sidang: new Date().toISOString().substring(0, 10),
        ruangan_media: 'Ruang Rapat Senat / Hybrid Zoom',
        agenda_sidang: 'Penetapan Hasil Rekognisi Pembelajaran Lampau (RPL) Calon Mahasiswa Baru',
        kesimpulan_umum: 'Seluruh berkas asesmen portofolio dan hasil uji petik telah dievaluasi dan disetujui.',
        peserta_ids: usersList.slice(0, 3).map((u) => u.id),
        pendaftar_ids: readyApplicants.map((a) => a.id),
    });

    const handleCreatePleno = (e: React.FormEvent) => {
        e.preventDefault();
        plenoForm.post('/pleno', {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateModalOpen(false);
                plenoForm.reset();
            },
        });
    };

    const handleLegalize = (plenoId: string, nomorBa: string) => {
        if (confirm(`Apakah Anda yakin ingin mengesahkan Berita Acara Sidang Pleno No. ${nomorBa}? Tindakan ini akan mengaktifkan proses penerbitan SK Rekognisi.`)) {
            router.post(`/pleno/${plenoId}/legalize`);
        }
    };

    return (
        <AppLayout title="Sidang Pleno & Berita Acara Penetapan RPL">
            <div className="space-y-6">
                {/* Header Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <Badge variant="blue" size="sm" className="bg-blue-600 text-white border-0 mb-1">
                            Tahap Akhir Penetapan Kelulusan
                        </Badge>
                        <h3 className="text-xl font-bold text-white">Sidang Pleno Rekognisi RPL</h3>
                        <p className="text-xs text-blue-200 mt-0.5">
                            Rapat penetapan hasil asesmen bersama Kaprodi, Asesor, dan Tim Penjaminan Mutu (LPM).
                        </p>
                    </div>

                    <Button variant="primary" onClick={() => setIsCreateModalOpen(true)} className="shadow-md">
                        <Plus className="w-4 h-4 mr-1.5" /> Jadwalkan Sidang Pleno Baru
                    </Button>
                </div>

                {/* Pleno List */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="px-5 py-3">No. Berita Acara</th>
                                    <th className="px-4 py-3">Program Studi</th>
                                    <th className="px-3 py-3">Tanggal Sidang</th>
                                    <th className="px-3 py-3">Media / Tempat</th>
                                    <th className="px-3 py-3">Status</th>
                                    <th className="px-3 py-3">Peserta & Asesi</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {plenoList.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                                            Belum ada agenda Sidang Pleno yang dibuat.
                                        </td>
                                    </tr>
                                ) : (
                                    plenoList.data.map((p: any) => (
                                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-5 py-3.5 font-bold font-mono text-slate-900">{p.nomor_berita_acara}</td>
                                            <td className="px-4 py-3.5 text-slate-700 font-medium">{p.prodi}</td>
                                            <td className="px-3 py-3.5">{p.tanggal_sidang}</td>
                                            <td className="px-3 py-3.5 text-slate-600">{p.ruangan_media}</td>
                                            <td className="px-3 py-3.5">
                                                <Badge variant={p.status_pleno === 'disahkan' ? 'emerald' : 'amber'} size="sm">
                                                    {p.status_pleno === 'disahkan' ? 'Resmi Disahkan' : 'Draft Rapat'}
                                                </Badge>
                                            </td>
                                            <td className="px-3 py-3.5 font-medium text-slate-700">
                                                {p.total_peserta} Dosen &bull; {p.total_keputusan} Asesi
                                            </td>
                                            <td className="px-4 py-3.5 text-right space-x-2">
                                                {p.status_pleno !== 'disahkan' ? (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleLegalize(p.id, p.nomor_berita_acara)}
                                                        className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                                                    >
                                                        <UserCheck className="w-3.5 h-3.5 mr-1" /> Sahkan Berita Acara
                                                    </Button>
                                                ) : (
                                                    <span className="text-xs text-emerald-700 font-bold">Telah Disahkan ({p.disahkan_oleh})</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Modal Create Pleno */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Jadwalkan Sidang Pleno Penetapan Kelulusan RPL"
                size="xl"
            >
                <form onSubmit={handleCreatePleno} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Gelombang Pendaftaran *</label>
                            <select
                                value={plenoForm.data.gelombang_id}
                                onChange={(e) => plenoForm.setData('gelombang_id', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                            >
                                {gelombangList.map((g) => (
                                    <option key={g.id} value={g.id}>{g.nama_gelombang}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Program Studi *</label>
                            <select
                                value={plenoForm.data.prodi_id}
                                onChange={(e) => plenoForm.setData('prodi_id', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                            >
                                {prodiList.map((p) => (
                                    <option key={p.id} value={p.id}>{p.nama_prodi}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Nomor Berita Acara *"
                            required
                            value={plenoForm.data.nomor_berita_acara}
                            onChange={(e) => plenoForm.setData('nomor_berita_acara', e.target.value)}
                        />
                        <Input
                            label="Tanggal Sidang *"
                            type="date"
                            required
                            value={plenoForm.data.tanggal_sidang}
                            onChange={(e) => plenoForm.setData('tanggal_sidang', e.target.value)}
                        />
                    </div>

                    <Input
                        label="Ruangan / Media Sidang *"
                        required
                        value={plenoForm.data.ruangan_media}
                        onChange={(e) => plenoForm.setData('ruangan_media', e.target.value)}
                    />

                    {/* Ready Applicants Checklist */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Pilih Calon Mahasiswa yang Ditetapkan ({readyApplicants.length} Berkas Siap):
                        </label>
                        <div className="space-y-1 max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-xl">
                            {readyApplicants.map((app) => (
                                <label key={app.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 text-xs cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={plenoForm.data.pendaftar_ids.includes(app.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                plenoForm.setData('pendaftar_ids', [...plenoForm.data.pendaftar_ids, app.id]);
                                            } else {
                                                plenoForm.setData('pendaftar_ids', plenoForm.data.pendaftar_ids.filter((id) => id !== app.id));
                                            }
                                        }}
                                        className="rounded border-slate-300 text-blue-600"
                                    />
                                    <span className="font-bold text-slate-900">{app.nama_lengkap}</span>
                                    <span className="text-slate-500 font-mono">({app.nomor_pendaftaran})</span>
                                    <Badge variant="blue" size="sm">{app.prodi}</Badge>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Batal</Button>
                        <Button type="submit" variant="primary" isLoading={plenoForm.processing}>Jadwalkan Sidang Pleno</Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
