import React, { useState } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import { Award, Plus, Printer, ShieldCheck, QrCode, ExternalLink } from 'lucide-react';
import { AppLayout } from '@/Components/Layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Modal } from '@/Components/UI/Modal';
import { Input } from '@/Components/UI/Input';

export default function SkRekognisiIndex({
    skList,
    readyApplicants,
}: {
    skList: any;
    readyApplicants: any[];
}) {
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

    const skForm = useForm({
        pendaftar_id: readyApplicants[0]?.id || '',
        nomor_sk: `SK-RPL/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 9000) + 1000)}`,
        tanggal_sk: new Date().toISOString().substring(0, 10),
        pejabat_nama: 'Prof. Dr. H. M. Zainuri, M.Kom.',
        pejabat_jabatan: 'Wakil Rektor Bidang Akademik & Kelembagaan',
        pejabat_nip: '197204151998031002',
    });

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        skForm.post('/sk-rekognisi/generate', {
            preserveScroll: true,
            onSuccess: () => {
                setIsGenerateModalOpen(false);
                skForm.reset();
            },
        });
    };

    return (
        <AppLayout title="Surat Keputusan (SK) Rekognisi RPL">
            <div className="space-y-6">
                {/* Header Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <Badge variant="emerald" size="sm" className="bg-emerald-600 text-white border-0 mb-1">
                            Dokumen Negara & Verifikasi QR Digital
                        </Badge>
                        <h3 className="text-xl font-bold text-white">Penerbitan Surat Keputusan (SK) Rekognisi</h3>
                        <p className="text-xs text-emerald-200 mt-0.5">
                            Dokumen resmi penetapan perolehan/transfer kredit SKS mahasiswa berbasis QR Code publik & SHA-256.
                        </p>
                    </div>

                    {readyApplicants.length > 0 && (
                        <Button variant="primary" onClick={() => setIsGenerateModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 shadow-md">
                            <Plus className="w-4 h-4 mr-1.5" /> Terbitkan SK Rekognisi ({readyApplicants.length} Siap)
                        </Button>
                    )}
                </div>

                {/* SK List */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="px-5 py-3">Nomor SK Resmi</th>
                                    <th className="px-4 py-3">Nama Mahasiswa</th>
                                    <th className="px-4 py-3">Program Studi</th>
                                    <th className="px-3 py-3">SKS Diakui</th>
                                    <th className="px-3 py-3">IPK Konversi</th>
                                    <th className="px-3 py-3">Tanggal Terbit</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {skList.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                                            Belum ada SK Rekognisi yang diterbitkan.
                                        </td>
                                    </tr>
                                ) : (
                                    skList.data.map((sk: any) => (
                                        <tr key={sk.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-5 py-3.5 font-bold font-mono text-slate-900">{sk.nomor_sk}</td>
                                            <td className="px-4 py-3.5">
                                                <p className="font-bold text-slate-900">{sk.nama_mahasiswa}</p>
                                                <p className="text-[11px] text-slate-500 font-mono">NIK: {sk.nik_masked}</p>
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-700 font-medium">{sk.prodi}</td>
                                            <td className="px-3 py-3.5 font-extrabold text-emerald-700 text-sm">{sk.total_sks_diakui} SKS</td>
                                            <td className="px-3 py-3.5 font-bold text-blue-700 text-sm">{sk.ipk_konversi}</td>
                                            <td className="px-3 py-3.5 text-slate-600">{sk.tanggal_sk}</td>
                                            <td className="px-4 py-3.5 text-right space-x-2">
                                                <Link href={`/sk-rekognisi/${sk.id}`}>
                                                    <Button variant="primary" size="sm" className="h-7 text-xs bg-blue-600">
                                                        <Printer className="w-3.5 h-3.5 mr-1" /> Cetak / Lihat SK
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

            {/* Modal Generate SK */}
            <Modal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                title="Terbitkan SK Rekognisi Baru"
                size="lg"
            >
                <form onSubmit={handleGenerate} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Calon Mahasiswa yang Lolos Sidang Pleno *</label>
                        <select
                            required
                            value={skForm.data.pendaftar_id}
                            onChange={(e) => skForm.setData('pendaftar_id', e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl font-bold"
                        >
                            {readyApplicants.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.nama_lengkap} ({a.nomor_pendaftaran}) &bull; Total {a.total_sks} SKS Rekognisi
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Nomor SK Resmi *"
                            required
                            value={skForm.data.nomor_sk}
                            onChange={(e) => skForm.setData('nomor_sk', e.target.value)}
                        />
                        <Input
                            label="Tanggal Penetapan SK *"
                            type="date"
                            required
                            value={skForm.data.tanggal_sk}
                            onChange={(e) => skForm.setData('tanggal_sk', e.target.value)}
                        />
                    </div>

                    <Input
                        label="Nama Pejabat Penandatangan *"
                        required
                        value={skForm.data.pejabat_nama}
                        onChange={(e) => skForm.setData('pejabat_nama', e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Jabatan Pejabat *"
                            required
                            value={skForm.data.pejabat_jabatan}
                            onChange={(e) => skForm.setData('pejabat_jabatan', e.target.value)}
                        />
                        <Input
                            label="NIP Pejabat"
                            value={skForm.data.pejabat_nip}
                            onChange={(e) => skForm.setData('pejabat_nip', e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsGenerateModalOpen(false)}>Batal</Button>
                        <Button type="submit" variant="primary" isLoading={skForm.processing}>
                            Terbitkan SK & Buat Token QR
                        </Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
