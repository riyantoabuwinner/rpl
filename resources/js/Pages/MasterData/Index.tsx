import React, { useState } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import { Layers, Plus, Calendar, RefreshCw, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';
import { AppLayout } from '@/Components/Layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Modal } from '@/Components/UI/Modal';
import { Input } from '@/Components/UI/Input';

export default function MasterDataIndex({
    gelombangList,
    prodiList,
    rubrikList,
}: {
    gelombangList: any[];
    prodiList: any[];
    rubrikList: any[];
}) {
    const [isGelombangModalOpen, setIsGelombangModalOpen] = useState(false);
    const [isMatkulModalOpen, setIsMatkulModalOpen] = useState(false);
    const [selectedProdi, setSelectedProdi] = useState<any>(prodiList[0] || null);

    const gelombangForm = useForm({
        nama_gelombang: 'Gelombang Genap 2026/2027',
        tahun_akademik: '2026/2027',
        semester: 'Genap',
        tanggal_buka: new Date().toISOString().substring(0, 10),
        tanggal_tutup: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10),
        tanggal_pengumuman: new Date(Date.now() + 45 * 86400000).toISOString().substring(0, 10),
        biaya_pendaftaran: 500000,
        biaya_asesmen_per_sks: 150000,
        kuota_pendaftar: 100,
        is_active: true,
        catatan_panduan: 'Pendaftaran RPL Semester Genap.',
    });

    const matkulForm = useForm({
        kurikulum_id: selectedProdi?.kurikulum?.[0]?.id || '',
        kode_mk: '',
        nama_mk: '',
        sks: 3,
        semester: 1,
        kategori_mk: 'Wajib Prodi',
        terbuka_rpl: true,
        deskripsi: '',
    });

    const handleCreateGelombang = (e: React.FormEvent) => {
        e.preventDefault();
        gelombangForm.post('/master-data/gelombang', {
            preserveScroll: true,
            onSuccess: () => {
                setIsGelombangModalOpen(false);
                gelombangForm.reset();
            },
        });
    };

    const handleCreateMatkul = (e: React.FormEvent) => {
        e.preventDefault();
        matkulForm.post('/master-data/matakuliah', {
            preserveScroll: true,
            onSuccess: () => {
                setIsMatkulModalOpen(false);
                matkulForm.reset();
            },
        });
    };

    return (
        <AppLayout title="Master Data Akademik & Gelombang RPL">
            <div className="space-y-6">
                {/* Header Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <Badge variant="blue" size="sm" className="bg-blue-600 text-white border-0 mb-1">
                            Konfigurasi Akademik
                        </Badge>
                        <h3 className="text-xl font-bold text-white">Master Program Studi, Kurikulum, & Gelombang</h3>
                        <p className="text-xs text-blue-200 mt-0.5">
                            Sinkronisasi kurikulum dari SIAKAD dan penetapan periode penerimaan asesi RPL.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={() => setIsGelombangModalOpen(true)} className="bg-white/10 text-white border-white/20">
                            <Calendar className="w-4 h-4 mr-1.5" /> Buka Gelombang Baru
                        </Button>
                    </div>
                </div>

                {/* Gelombang Cards */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Periode Gelombang Pendaftaran Aktif</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {gelombangList.map((g) => (
                            <Card key={g.id} className={g.is_active ? 'border-blue-500 ring-1 ring-blue-500/20' : ''}>
                                <CardHeader className="pb-3">
                                    <div>
                                        <Badge variant={g.is_active ? 'emerald' : 'slate'} size="sm">
                                            {g.is_active ? 'Aktif Menerima Pendaftar' : 'Ditutup'}
                                        </Badge>
                                        <CardTitle className="text-base mt-1">{g.nama_gelombang}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="text-xs space-y-1.5 text-slate-600 pt-0">
                                    <p>Tahun Akademik: <strong>{g.tahun_akademik} ({g.semester})</strong></p>
                                    <p>Periode: <strong>{new Date(g.tanggal_buka).toLocaleDateString('id-ID')} s/d {new Date(g.tanggal_tutup).toLocaleDateString('id-ID')}</strong></p>
                                    <p>Kuota: <strong>{g.kuota_pendaftar} Asesi</strong></p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Prodi & Mata Kuliah Explorer */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Prodi List (Left 1 Col) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Pilih Program Studi</CardTitle>
                        </CardHeader>
                        <div className="divide-y divide-slate-100">
                            {prodiList.map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedProdi(p);
                                        matkulForm.setData('kurikulum_id', p.kurikulum?.[0]?.id || '');
                                    }}
                                    className={`w-full p-4 text-left flex items-center justify-between transition-colors ${
                                        selectedProdi?.id === p.id
                                            ? 'bg-blue-50/80 text-blue-900 font-bold border-l-4 border-l-blue-600'
                                            : 'hover:bg-slate-50 text-slate-700'
                                    }`}
                                >
                                    <div>
                                        <p className="text-xs font-bold">{p.nama_prodi}</p>
                                        <p className="text-[10px] text-slate-500 font-normal">{p.jenjang} &bull; Kode: {p.kode_prodi}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Courses & CPMK List (Right 2 Cols) */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card>
                            <CardHeader>
                                <div>
                                    <CardTitle>Mata Kuliah & CPMK: {selectedProdi?.nama_prodi}</CardTitle>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Kurikulum: {selectedProdi?.kurikulum?.[0]?.nama_kurikulum || 'Kurikulum Merdeka 2024'}
                                    </p>
                                </div>
                                <Button size="sm" variant="primary" onClick={() => setIsMatkulModalOpen(true)}>
                                    <Plus className="w-4 h-4 mr-1" /> Tambah Mata Kuliah
                                </Button>
                            </CardHeader>
                            <div className="divide-y divide-slate-100">
                                {selectedProdi?.kurikulum?.[0]?.mata_kuliah?.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400 text-xs">
                                        Belum ada mata kuliah terdaftar pada prodi ini.
                                    </div>
                                ) : (
                                    selectedProdi?.kurikulum?.[0]?.mata_kuliah?.map((mk: any) => (
                                        <div key={mk.id} className="p-4 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-blue-600">{mk.kode_mk}</span>
                                                    <h5 className="font-bold text-xs text-slate-900">{mk.nama_mk}</h5>
                                                </div>
                                                <Badge variant="slate" size="sm">{mk.sks} SKS &bull; Semester {mk.semester}</Badge>
                                            </div>

                                            {/* CPMK items */}
                                            {mk.cpmk && mk.cpmk.length > 0 && (
                                                <div className="pl-4 space-y-1 border-l-2 border-slate-200">
                                                    {mk.cpmk.map((c: any) => (
                                                        <div key={c.id} className="text-[11px] text-slate-600">
                                                            <strong className="text-slate-800">{c.kode_cpmk}:</strong> {c.deskripsi_cpmk}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modal Add Gelombang */}
            <Modal
                isOpen={isGelombangModalOpen}
                onClose={() => setIsGelombangModalOpen(false)}
                title="Buka Periode Gelombang RPL Baru"
            >
                <form onSubmit={handleCreateGelombang} className="space-y-4">
                    <Input
                        label="Nama Gelombang *"
                        required
                        value={gelombangForm.data.nama_gelombang}
                        onChange={(e) => gelombangForm.setData('nama_gelombang', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Tahun Akademik *"
                            required
                            value={gelombangForm.data.tahun_akademik}
                            onChange={(e) => gelombangForm.setData('tahun_akademik', e.target.value)}
                        />
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Semester *</label>
                            <select
                                value={gelombangForm.data.semester}
                                onChange={(e) => gelombangForm.setData('semester', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                            >
                                <option value="Ganjil">Ganjil</option>
                                <option value="Genap">Genap</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Tanggal Buka *"
                            type="date"
                            required
                            value={gelombangForm.data.tanggal_buka}
                            onChange={(e) => gelombangForm.setData('tanggal_buka', e.target.value)}
                        />
                        <Input
                            label="Tanggal Tutup *"
                            type="date"
                            required
                            value={gelombangForm.data.tanggal_tutup}
                            onChange={(e) => gelombangForm.setData('tanggal_tutup', e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsGelombangModalOpen(false)}>Batal</Button>
                        <Button type="submit" variant="primary" isLoading={gelombangForm.processing}>Simpan Gelombang</Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Add Matkul */}
            <Modal
                isOpen={isMatkulModalOpen}
                onClose={() => setIsMatkulModalOpen(false)}
                title="Tambah Mata Kuliah Kurikulum"
            >
                <form onSubmit={handleCreateMatkul} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Kode Mata Kuliah *"
                            required
                            value={matkulForm.data.kode_mk}
                            onChange={(e) => matkulForm.setData('kode_mk', e.target.value)}
                            placeholder="TIS-301"
                        />
                        <Input
                            label="Bobot SKS *"
                            type="number"
                            required
                            min={1}
                            max={6}
                            value={matkulForm.data.sks}
                            onChange={(e) => matkulForm.setData('sks', parseInt(e.target.value))}
                        />
                    </div>
                    <Input
                        label="Nama Mata Kuliah *"
                        required
                        value={matkulForm.data.nama_mk}
                        onChange={(e) => matkulForm.setData('nama_mk', e.target.value)}
                        placeholder="Arsitektur Aplikasi Enterprise"
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Semester *"
                            type="number"
                            min={1}
                            max={8}
                            value={matkulForm.data.semester}
                            onChange={(e) => matkulForm.setData('semester', parseInt(e.target.value))}
                        />
                        <Input
                            label="Kategori MK *"
                            value={matkulForm.data.kategori_mk}
                            onChange={(e) => matkulForm.setData('kategori_mk', e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsMatkulModalOpen(false)}>Batal</Button>
                        <Button type="submit" variant="primary" isLoading={matkulForm.processing}>Simpan Mata Kuliah</Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
