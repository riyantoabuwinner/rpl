import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    HelpCircle,
    Plus,
    Scale,
    Send,
    ShieldAlert,
    XCircle,
} from 'lucide-react';
import { AppLayout } from '@/Components/Layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Modal } from '@/Components/UI/Modal';
import { FlowchartTracker } from '@/Components/UI/FlowchartTracker';

export default function SanggahIndex({
    sanggahList,
    auth,
}: {
    sanggahList: any;
    auth: any;
}) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedSanggah, setSelectedSanggah] = useState<any>(null);

    // Create Form for Asesi
    const createForm = useForm({
        mata_kuliah_id: '',
        alasan_keberatan: '',
        file_bukti: null as File | null,
    });

    // Review Form for Tim RPL
    const reviewForm = useForm({
        status_sanggah: 'diterima',
        tanggapan_tim_rpl: '',
    });

    const isAsesi = auth.user?.role === 'asesi';
    const isTimRpl = auth.user?.role === 'admin_rpl' || auth.user?.role === 'kaprodi' || auth.user?.role === 'super_admin';

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/sanggah', {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSanggah) return;
        reviewForm.post(`/sanggah/${selectedSanggah.id}/review`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsReviewModalOpen(false);
                reviewForm.reset();
                setSelectedSanggah(null);
            },
        });
    };

    return (
        <AppLayout title="Masa Sanggah & Keberatan Hasil RPL">
            <div className="space-y-6">
                {/* Visual Flowchart Tracker */}
                <FlowchartTracker currentStage="pleno" />

                {/* Banner Header */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge variant="purple" size="sm" className="bg-purple-600 text-white border-0">
                                Langkah 20 Flowchart UIN SSC
                            </Badge>
                            <span className="text-xs text-purple-200">Hak Klarifikasi Calon Mahasiswa</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">Masa Sanggah & Keberatan Hasil Penilaian RPL</h3>
                        <p className="text-xs text-purple-200">
                            Peserta RPL dapat mengajukan sanggahan/klarifikasi atas keputusan asesmen portofolio dalam masa tenggang 3 hari kalender.
                        </p>
                    </div>

                    {isAsesi && (
                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30"
                        >
                            <Plus className="w-4 h-4 mr-1.5" /> Ajukan Sanggahan Baru
                        </Button>
                    )}
                </div>

                {/* Sanggahan List Table */}
                <Card>
                    <CardHeader>
                        <div>
                            <CardTitle>Daftar Pengajuan Sanggah / Keberatan</CardTitle>
                            <p className="text-xs text-slate-500 mt-0.5">Status evaluasi sanggahan oleh Tim RPL dan Pimpinan Sidang</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                                    <tr>
                                        <th className="py-3 px-4">No. Sanggah</th>
                                        <th className="py-3 px-4">Pemohon (Asesi)</th>
                                        <th className="py-3 px-4">Mata Kuliah Disanggah</th>
                                        <th className="py-3 px-4">Alasan & Evidensi Tambahan</th>
                                        <th className="py-3 px-4">Status & Tanggapan Tim RPL</th>
                                        <th className="py-3 px-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {sanggahList?.data?.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-10 text-center text-slate-400 text-xs">
                                                Belum ada pengajuan sanggah atau keberatan yang tercatat.
                                            </td>
                                        </tr>
                                    ) : (
                                        sanggahList?.data?.map((s: any) => (
                                            <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="py-3 px-4 font-mono font-bold text-blue-700">
                                                    {s.nomor_sanggah}
                                                    <p className="text-[10px] text-slate-400 font-normal">
                                                        {new Date(s.created_at).toLocaleDateString('id-ID')}
                                                    </p>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <strong className="text-slate-900">{s.pendaftar?.nama_lengkap}</strong>
                                                    <p className="text-[10px] text-slate-500">{s.pendaftar?.prodi?.nama_prodi}</p>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {s.mata_kuliah ? (
                                                        <div>
                                                            <span className="font-mono text-blue-600 font-semibold">{s.mata_kuliah.kode_mk}</span>
                                                            <p className="text-slate-800">{s.mata_kuliah.nama_mk}</p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-500 italic">Keseluruhan Keputusan</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 max-w-xs">
                                                    <p className="text-slate-700 line-clamp-2 leading-relaxed">{s.alasan_keberatan}</p>
                                                    {s.bukti_tambahan_nama && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 mt-1 font-semibold">
                                                            <FileText className="w-3 h-3" /> {s.bukti_tambahan_nama}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="space-y-1">
                                                        <Badge
                                                            variant={
                                                                s.status_sanggah === 'diterima'
                                                                    ? 'emerald'
                                                                    : s.status_sanggah === 'ditolak'
                                                                    ? 'red'
                                                                    : 'amber'
                                                            }
                                                            size="sm"
                                                        >
                                                            {s.status_sanggah === 'diterima'
                                                                ? 'Sanggah Diterima'
                                                                : s.status_sanggah === 'ditolak'
                                                                ? 'Sanggah Ditolak'
                                                                : 'Sedang Ditinjau'}
                                                        </Badge>
                                                        {s.tanggapan_tim_rpl && (
                                                            <p className="text-[11px] text-slate-600 italic bg-slate-50 p-1.5 rounded border border-slate-200">
                                                                "{s.tanggapan_tim_rpl}"
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    {isTimRpl && s.status_sanggah === 'diajukan' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setSelectedSanggah(s);
                                                                setIsReviewModalOpen(true);
                                                            }}
                                                        >
                                                            Tinjau Sanggah
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Ajukan Sanggah (Asesi) */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Formulir Pengajuan Masa Sanggah / Keberatan"
                description="Sampaikan sanggahan Anda dengan alasan substantif dan bukti otentik tambahan."
                size="lg"
            >
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <strong>Ketentuan Sanggahan:</strong> Sanggahan hanya dapat diajukan satu kali. Pastikan Anda melampirkan bukti tambahan yang memperkuat klaim kompetensi CPMK yang belum terpenuhi.
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Uraian Alasan Sanggahan & Argumentasi Substantif *
                        </label>
                        <textarea
                            rows={4}
                            required
                            value={createForm.data.alasan_keberatan}
                            onChange={(e) => createForm.setData('alasan_keberatan', e.target.value)}
                            placeholder="Jelaskan secara rinci mengapa kompetensi pada mata kuliah tersebut layak direkognisi..."
                            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Unggah Bukti / Portofolio Tambahan (Opsional, PDF/JPG/PNG Max 10MB)
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => createForm.setData('file_bukti', e.target.files?.[0] || null)}
                            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                        <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
                            Batal
                        </Button>
                        <Button type="submit" variant="primary" isLoading={createForm.processing} className="bg-purple-600 hover:bg-purple-500 text-white">
                            <Send className="w-4 h-4 mr-1.5" /> Kirim Sanggahan Resmi
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Tinjau Sanggah (Tim RPL) */}
            <Modal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                title={`Tinjauan Sanggahan: ${selectedSanggah?.nomor_sanggah || ''}`}
                description="Tetapkan keputusan atas permohonan keberatan asesi."
            >
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                        <p className="text-slate-500 font-semibold">Alasan Pemohon ({selectedSanggah?.pendaftar?.nama_lengkap}):</p>
                        <p className="text-slate-800 leading-relaxed font-medium">"{selectedSanggah?.alasan_keberatan}"</p>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Keputusan Tim RPL *</label>
                        <select
                            value={reviewForm.data.status_sanggah}
                            onChange={(e) => reviewForm.setData('status_sanggah', e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                        >
                            <option value="diterima">DITERIMA (Direkognisi Tambahan / Revisi Nilai)</option>
                            <option value="ditolak">DITOLAK (Keputusan Asesmen Tetap Berlaku)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggapan & Dasar Keputusan Resmi *</label>
                        <textarea
                            rows={3}
                            required
                            value={reviewForm.data.tanggapan_tim_rpl}
                            onChange={(e) => reviewForm.setData('tanggapan_tim_rpl', e.target.value)}
                            placeholder="Tuliskan pertimbangan Tim RPL atas keputusan ini..."
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <Button type="button" variant="ghost" onClick={() => setIsReviewModalOpen(false)}>
                            Batal
                        </Button>
                        <Button type="submit" variant="primary" isLoading={reviewForm.processing}>
                            Simpan Tanggapan Sanggah
                        </Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
