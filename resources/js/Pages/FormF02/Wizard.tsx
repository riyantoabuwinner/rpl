import React, { useState } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import {
    User,
    GraduationCap,
    Briefcase,
    UploadCloud,
    FileCheck,
    Send,
    Plus,
    Trash2,
    CheckCircle2,
    ShieldCheck,
    FileText,
    ArrowRight,
    ArrowLeft,
} from 'lucide-react';
import { AppLayout } from '@/Components/Layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Modal } from '@/Components/UI/Modal';

export default function FormF02Wizard({
    pendaftar,
    activeGelombang,
    prodiList,
    documentTypes,
}: {
    pendaftar: any;
    activeGelombang: any;
    prodiList: any[];
    documentTypes: any[];
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isKlaimModalOpen, setIsKlaimModalOpen] = useState(false);
    const [isPendidikanModalOpen, setIsPendidikanModalOpen] = useState(false);
    const [isPengalamanModalOpen, setIsPengalamanModalOpen] = useState(false);

    // Profile Form
    const profileForm = useForm({
        gelombang_id: pendaftar?.gelombang_id || activeGelombang?.id || '',
        prodi_id: pendaftar?.prodi_id || (prodiList[0]?.id ?? ''),
        jenis_rpl: pendaftar?.jenis_rpl || 'A2',
        nama_lengkap: pendaftar?.nama_lengkap || '',
        nik: pendaftar?.nik || '',
        telepon: pendaftar?.telepon || '',
        jenis_kelamin: pendaftar?.jenis_kelamin || 'L',
        tempat_lahir: pendaftar?.tempat_lahir || '',
        tanggal_lahir: pendaftar?.tanggal_lahir ? pendaftar.tanggal_lahir.substring(0, 10) : '',
        alamat_lengkap: pendaftar?.alamat_lengkap || '',
        pekerjaan_saat_ini: pendaftar?.pekerjaan_saat_ini || '',
        instansi_pekerjaan: pendaftar?.instansi_pekerjaan || '',
    });

    // Upload Form
    const uploadForm = useForm({
        file: null as File | null,
        nama_dokumen: '',
        jenis_bukti: 'sertifikat_pelatihan',
        tahun_penerbitan: String(new Date().getFullYear()),
        penerbit_institusi: '',
        deskripsi_dokumen: '',
    });

    // Klaim Form
    const klaimForm = useForm({
        mata_kuliah_id: '',
        cpmk_id: '',
        deskripsi_pengalaman_relevan: '',
        tingkat_kemampuan_diri: 'Sangat Baik',
        bukti_ids: [] as string[],
    });

    // Pendidikan Form
    const pendidikanForm = useForm({
        jenjang: 'SMA/SMK',
        nama_institusi: '',
        jurusan: '',
        nomor_ijazah: '',
        tahun_lulus: '2020',
        ipk_nilai_akhir: '',
    });

    // Pengalaman Form
    const pengalamanForm = useForm({
        nama_instansi: '',
        jabatan_posisi: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        is_masih_bekerja: false,
        deskripsi_tugas_kunci: '',
    });

    const isSubmitted = pendaftar && pendaftar.status_pendaftaran !== 'draft';

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post('/form-f02/profile', {
            preserveScroll: true,
            onSuccess: () => setCurrentStep(2),
        });
    };

    const handleUploadBukti = (e: React.FormEvent) => {
        e.preventDefault();
        uploadForm.post('/form-f02/bukti', {
            preserveScroll: true,
            onSuccess: () => {
                setIsUploadModalOpen(false);
                uploadForm.reset();
            },
        });
    };

    const handleSaveKlaim = (e: React.FormEvent) => {
        e.preventDefault();
        klaimForm.post('/form-f02/klaim', {
            preserveScroll: true,
            onSuccess: () => {
                setIsKlaimModalOpen(false);
                klaimForm.reset();
            },
        });
    };

    const handleSavePendidikan = (e: React.FormEvent) => {
        e.preventDefault();
        pendidikanForm.post('/form-f02/pendidikan', {
            preserveScroll: true,
            onSuccess: () => {
                setIsPendidikanModalOpen(false);
                pendidikanForm.reset();
            },
        });
    };

    const handleSavePengalaman = (e: React.FormEvent) => {
        e.preventDefault();
        pengalamanForm.post('/form-f02/pengalaman', {
            preserveScroll: true,
            onSuccess: () => {
                setIsPengalamanModalOpen(false);
                pengalamanForm.reset();
            },
        });
    };

    const handleSubmitFinal = () => {
        if (confirm('Apakah Anda yakin ingin mengirimkan Formulir Evaluasi Diri (Form F-02)? Berkas akan dikunci untuk proses verifikasi.')) {
            router.post('/form-f02/submit');
        }
    };

    const selectedProdiId = profileForm.data.prodi_id || pendaftar?.prodi_id;
    const selectedProdiObj = prodiList.find((p) => p.id === selectedProdiId);
    const availableCourses = selectedProdiObj?.kurikulum?.flatMap((k: any) => k.mata_kuliah) || [];

    const steps = [
        { num: 1, title: 'Data Diri & Jalur', icon: User },
        { num: 2, title: 'Riwayat Pendidikan', icon: GraduationCap },
        { num: 3, title: 'Pengalaman Kerja', icon: Briefcase },
        { num: 4, title: 'Unggah Portofolio', icon: UploadCloud },
        { num: 5, title: 'Pemetaan CPMK', icon: FileCheck },
        { num: 6, title: 'Review & Submit', icon: Send },
    ];

    return (
        <AppLayout title="Formulir Evaluasi Diri (Form F-02)">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Info */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <Badge variant="blue" size="sm" className="bg-blue-600 text-white border-0 mb-1">
                            Buku Panduan RPL &bull; Form F-02
                        </Badge>
                        <h3 className="text-xl font-bold text-white">Evaluasi Diri Capaian Pembelajaran Calon Mahasiswa</h3>
                        <p className="text-xs text-blue-200 mt-0.5">
                            Isi formulir portofolio dan petakan pengalaman Anda terhadap Capaian Pembelajaran Mata Kuliah (CPMK).
                        </p>
                    </div>

                    {isSubmitted && (
                        <Badge variant="emerald" size="md" className="bg-emerald-500/20 text-emerald-300 border-emerald-400 text-sm px-4 py-2">
                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Berkas Terkirim ({pendaftar.status_pendaftaran})
                        </Badge>
                    )}
                </div>

                {/* Step Indicators */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {steps.map((s) => {
                        const Icon = s.icon;
                        const isCurrent = currentStep === s.num;
                        const isPassed = currentStep > s.num;

                        return (
                            <button
                                key={s.num}
                                type="button"
                                onClick={() => setCurrentStep(s.num)}
                                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                                    isCurrent
                                        ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-500/30'
                                        : isPassed
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-[11px] font-bold leading-tight">{s.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Step 1: Profil & Jalur */}
                {currentStep === 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Langkah 1: Identitas Pribadi & Pilihan Jalur RPL</CardTitle>
                        </CardHeader>
                        <form onSubmit={handleSaveProfile}>
                            <CardContent className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Pilihan Program Studi *</label>
                                        <select
                                            disabled={isSubmitted}
                                            value={profileForm.data.prodi_id}
                                            onChange={(e) => profileForm.setData('prodi_id', e.target.value)}
                                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                        >
                                            {prodiList.map((p) => (
                                                <option key={p.id} value={p.id}>{p.nama_prodi} ({p.jenjang})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Jalur Rekognisi RPL *</label>
                                        <select
                                            disabled={isSubmitted}
                                            value={profileForm.data.jenis_rpl}
                                            onChange={(e) => profileForm.setData('jenis_rpl', e.target.value)}
                                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-semibold text-blue-700"
                                        >
                                            <option value="A2">RPL Tipe A2 (Perolehan Kredit - Pengalaman Kerja & Pelatihan)</option>
                                            <option value="A1">RPL Tipe A1 (Transfer Kredit - Nilai Kuliah Formal Sebelumnya)</option>
                                            <option value="B">RPL Tipe B (Penyetaraan Kualifikasi KKNI)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Input
                                        label="Nama Lengkap (Sesuai KTP)"
                                        required
                                        disabled={isSubmitted}
                                        value={profileForm.data.nama_lengkap}
                                        onChange={(e) => profileForm.setData('nama_lengkap', e.target.value)}
                                    />
                                    <Input
                                        label="Nomor Induk Kependudukan (NIK 16 Digit)"
                                        required
                                        maxLength={16}
                                        disabled={isSubmitted}
                                        value={profileForm.data.nik}
                                        onChange={(e) => profileForm.setData('nik', e.target.value.replace(/\D/g, ''))}
                                    />
                                </div>

                                <div className="grid sm:grid-cols-3 gap-4">
                                    <Input
                                        label="No. WhatsApp / Telepon"
                                        required
                                        disabled={isSubmitted}
                                        value={profileForm.data.telepon}
                                        onChange={(e) => profileForm.setData('telepon', e.target.value)}
                                    />
                                    <Input
                                        label="Tempat Lahir"
                                        required
                                        disabled={isSubmitted}
                                        value={profileForm.data.tempat_lahir}
                                        onChange={(e) => profileForm.setData('tempat_lahir', e.target.value)}
                                    />
                                    <Input
                                        label="Tanggal Lahir"
                                        type="date"
                                        required
                                        disabled={isSubmitted}
                                        value={profileForm.data.tanggal_lahir}
                                        onChange={(e) => profileForm.setData('tanggal_lahir', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Lengkap Domisili *</label>
                                    <textarea
                                        rows={2}
                                        required
                                        disabled={isSubmitted}
                                        value={profileForm.data.alamat_lengkap}
                                        onChange={(e) => profileForm.setData('alamat_lengkap', e.target.value)}
                                        className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Input
                                        label="Pekerjaan / Jabatan Saat Ini"
                                        disabled={isSubmitted}
                                        value={profileForm.data.pekerjaan_saat_ini}
                                        onChange={(e) => profileForm.setData('pekerjaan_saat_ini', e.target.value)}
                                    />
                                    <Input
                                        label="Nama Instansi / Tempat Bekerja"
                                        disabled={isSubmitted}
                                        value={profileForm.data.instansi_pekerjaan}
                                        onChange={(e) => profileForm.setData('instansi_pekerjaan', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" variant="primary" isLoading={profileForm.processing} disabled={isSubmitted}>
                                    Simpan & Lanjut ke Riwayat Pendidikan <ArrowRight className="w-4 h-4 ml-1.5" />
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                )}

                {/* Step 2: Pendidikan */}
                {currentStep === 2 && (
                    <Card>
                        <CardHeader>
                            <div>
                                <CardTitle>Langkah 2: Riwayat Pendidikan Formal</CardTitle>
                                <p className="text-xs text-slate-500 mt-0.5">Cantumkan riwayat pendidikan formal yang telah diselesaikan</p>
                            </div>
                            {!isSubmitted && (
                                <Button size="sm" variant="outline" onClick={() => setIsPendidikanModalOpen(true)}>
                                    <Plus className="w-4 h-4 mr-1" /> Tambah Pendidikan
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y divide-slate-100">
                                {!pendaftar?.pendidikan || pendaftar.pendidikan.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400 text-xs">
                                        Belum ada riwayat pendidikan. Klik tombol di atas untuk menambahkan.
                                    </div>
                                ) : (
                                    pendaftar.pendidikan.map((edu: any) => (
                                        <div key={edu.id} className="py-3 flex items-center justify-between">
                                            <div>
                                                <span className="font-bold text-sm text-slate-900">{edu.nama_institusi}</span>
                                                <p className="text-xs text-slate-600">{edu.jenjang} - Jurusan {edu.jurusan} (Lulus {edu.tahun_lulus})</p>
                                                {edu.nomor_ijazah && <p className="text-[11px] font-mono text-slate-400">No. Ijazah: {edu.nomor_ijazah}</p>}
                                            </div>
                                            {!isSubmitted && (
                                                <button
                                                    type="button"
                                                    onClick={() => router.delete(`/form-f02/pendidikan/${edu.id}`)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                                <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                            </Button>
                            <Button variant="primary" size="sm" onClick={() => setCurrentStep(3)}>
                                Lanjut ke Pengalaman Kerja <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Step 3: Pengalaman Kerja */}
                {currentStep === 3 && (
                    <Card>
                        <CardHeader>
                            <div>
                                <CardTitle>Langkah 3: Riwayat Pengalaman Kerja & Pelatihan</CardTitle>
                                <p className="text-xs text-slate-500 mt-0.5">Rekam jejak pengalaman profesional yang relevan</p>
                            </div>
                            {!isSubmitted && (
                                <Button size="sm" variant="outline" onClick={() => setIsPengalamanModalOpen(true)}>
                                    <Plus className="w-4 h-4 mr-1" /> Tambah Pengalaman
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y divide-slate-100">
                                {!pendaftar?.pengalaman || pendaftar.pengalaman.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400 text-xs">
                                        Belum ada data pengalaman kerja. Klik tombol di atas untuk menambahkan.
                                    </div>
                                ) : (
                                    pendaftar.pengalaman.map((exp: any) => (
                                        <div key={exp.id} className="py-3.5 flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <span className="font-bold text-sm text-slate-900">{exp.jabatan_posisi}</span>
                                                <p className="text-xs font-semibold text-blue-600">{exp.nama_instansi}</p>
                                                <p className="text-xs text-slate-600 leading-relaxed">{exp.deskripsi_tugas_kunci}</p>
                                            </div>
                                            {!isSubmitted && (
                                                <button
                                                    type="button"
                                                    onClick={() => router.delete(`/form-f02/pengalaman/${exp.id}`)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
                                <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                            </Button>
                            <Button variant="primary" size="sm" onClick={() => setCurrentStep(4)}>
                                Lanjut ke Unggah Portofolio <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Step 4: Unggah Portofolio */}
                {currentStep === 4 && (
                    <Card>
                        <CardHeader>
                            <div>
                                <CardTitle>Langkah 4: Portofolio Bukti Kompetensi</CardTitle>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Unggah sertifikat, SK jabatan, portofolio proyek (Tervalidasi SHA-256)
                                </p>
                            </div>
                            {!isSubmitted && (
                                <Button size="sm" variant="primary" onClick={() => setIsUploadModalOpen(true)}>
                                    <UploadCloud className="w-4 h-4 mr-1.5" /> Unggah Dokumen Baru
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {!pendaftar?.bukti || pendaftar.bukti.length === 0 ? (
                                    <div className="sm:col-span-2 p-10 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-2xl">
                                        <UploadCloud className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                                        Belum ada dokumen bukti yang diunggah.
                                    </div>
                                ) : (
                                    pendaftar.bukti.map((b: any) => (
                                        <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h5 className="font-bold text-xs text-slate-900 truncate" title={b.nama_dokumen}>
                                                        {b.nama_dokumen}
                                                    </h5>
                                                    <p className="text-[10px] text-slate-500">{b.penerbit_institusi} ({b.tahun_penerbitan || '-'})</p>
                                                </div>
                                                <Badge variant="blue" size="sm">{b.jenis_bukti}</Badge>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                <span className="truncate">SHA-256: {b.file_hash?.substring(0, 16)}...</span>
                                            </div>

                                            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                                                <span className="text-[10px] text-slate-400">{(b.file_size / 1024).toFixed(0)} KB</span>
                                                {!isSubmitted && (
                                                    <button
                                                        type="button"
                                                        onClick={() => router.delete(`/form-f02/bukti/${b.id}`)}
                                                        className="text-xs text-red-600 hover:underline"
                                                    >
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)}>
                                <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                            </Button>
                            <Button variant="primary" size="sm" onClick={() => setCurrentStep(5)}>
                                Lanjut ke Pemetaan CPMK <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Step 5: Pemetaan CPMK */}
                {currentStep === 5 && (
                    <Card>
                        <CardHeader>
                            <div>
                                <CardTitle>Langkah 5: Pemetaan Capaian Pembelajaran (CPMK)</CardTitle>
                                <p className="text-xs text-slate-500 mt-0.5">Petakan mata kuliah yang ingin direkognisi</p>
                            </div>
                            {!isSubmitted && (
                                <Button size="sm" variant="primary" onClick={() => setIsKlaimModalOpen(true)}>
                                    <Plus className="w-4 h-4 mr-1.5" /> Tambah Klaim Mata Kuliah
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {!pendaftar?.klaim || pendaftar.klaim.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-2xl">
                                        Belum ada klaim kompetensi mata kuliah. Klik tombol di atas untuk memilih mata kuliah kurikulum.
                                    </div>
                                ) : (
                                    pendaftar.klaim.map((k: any) => (
                                        <div key={k.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-bold text-blue-600">{k.mata_kuliah?.kode_mk}</span>
                                                        <h4 className="font-bold text-sm text-slate-900">{k.mata_kuliah?.nama_mk}</h4>
                                                        <Badge variant="slate" size="sm">{k.mata_kuliah?.sks} SKS</Badge>
                                                    </div>
                                                    <p className="text-xs text-slate-600 mt-1">{k.deskripsi_pengalaman_relevan}</p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Badge variant="emerald" size="sm">Tingkat: {k.tingkat_kemampuan_diri}</Badge>
                                                    {!isSubmitted && (
                                                        <button
                                                            type="button"
                                                            onClick={() => router.delete(`/form-f02/klaim/${k.id}`)}
                                                            className="p-1 text-slate-400 hover:text-red-600"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Attached Documents */}
                                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                                                <span className="text-[11px] font-semibold text-slate-500">Bukti Portofolio Ditautkan:</span>
                                                {k.bukti?.map((b: any) => (
                                                    <Badge key={b.id} variant="blue" size="sm">
                                                        <FileText className="w-3 h-3 mr-1" /> {b.nama_dokumen}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(4)}>
                                <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                            </Button>
                            <Button variant="primary" size="sm" onClick={() => setCurrentStep(6)}>
                                Lanjut ke Final Review & Submit <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Step 6: Review & Final Submit */}
                {currentStep === 6 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Langkah 6: Pernyataan & Final Submit Berkas RPL</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-2">
                                <div className="flex items-center gap-2 font-bold text-sm text-blue-950">
                                    <ShieldCheck className="w-5 h-5 text-blue-700" />
                                    <span>Pernyataan Keaslian dan Kebenaran Dokumen</span>
                                </div>
                                <p className="leading-relaxed">
                                    Dengan ini saya menyatakan bahwa seluruh data, riwayat pengalaman kerja, serta berkas portofolio yang saya unggah pada Formulir Evaluasi Diri (Form F-02) ini adalah benar, sah, dan dibuat dengan itikad baik. Apabila di kemudian hari ditemukan pemalsuan berkas, saya bersedia menerima sanksi pembatalan rekognisi sesuai peraturan perundang-undangan.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4 text-center">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs text-slate-500 font-semibold">Total Portofolio Bukti</span>
                                    <h4 className="text-xl font-bold text-slate-900 mt-1">{pendaftar?.bukti?.length || 0} Berkas</h4>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs text-slate-500 font-semibold">Mata Kuliah Diajukan</span>
                                    <h4 className="text-xl font-bold text-slate-900 mt-1">{pendaftar?.klaim?.length || 0} MK</h4>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs text-slate-500 font-semibold">SLA Verifikasi Admin</span>
                                    <h4 className="text-xl font-bold text-blue-600 mt-1">3 Hari Kerja</h4>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(5)}>
                                <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                            </Button>
                            {!isSubmitted ? (
                                <Button variant="primary" size="lg" onClick={handleSubmitFinal} className="shadow-lg shadow-blue-600/40">
                                    <Send className="w-4 h-4 mr-2" /> Submit Final Form F-02
                                </Button>
                            ) : (
                                <Badge variant="emerald" size="md">Berkas Telah Dikirim</Badge>
                            )}
                        </CardFooter>
                    </Card>
                )}
            </div>

            {/* Modal Upload Bukti */}
            <Modal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                title="Unggah Dokumen Bukti Portofolio"
                description="Format yang didukung: PDF, JPG, PNG (Maks. 10MB)"
            >
                <form onSubmit={handleUploadBukti} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">File Dokumen *</label>
                        <input
                            type="file"
                            required
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => uploadForm.setData('file', e.target.files?.[0] || null)}
                            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                    </div>

                    <Input
                        label="Nama / Judul Dokumen Portofolio"
                        required
                        value={uploadForm.data.nama_dokumen}
                        onChange={(e) => uploadForm.setData('nama_dokumen', e.target.value)}
                        placeholder="Contoh: Sertifikat Certified Ethical Hacker (CEH)"
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Bukti *</label>
                            <select
                                value={uploadForm.data.jenis_bukti}
                                onChange={(e) => uploadForm.setData('jenis_bukti', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                            >
                                {documentTypes.map((dt) => (
                                    <option key={dt.value} value={dt.value}>{dt.label}</option>
                                ))}
                            </select>
                        </div>

                        <Input
                            label="Tahun Penerbitan"
                            value={uploadForm.data.tahun_penerbitan}
                            onChange={(e) => uploadForm.setData('tahun_penerbitan', e.target.value)}
                        />
                    </div>

                    <Input
                        label="Lembaga / Institusi Penerbit"
                        value={uploadForm.data.penerbit_institusi}
                        onChange={(e) => uploadForm.setData('penerbit_institusi', e.target.value)}
                        placeholder="Contoh: EC-Council / BNSP / PT Asal"
                    />

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsUploadModalOpen(false)}>Batal</Button>
                        <Button type="submit" variant="primary" isLoading={uploadForm.processing}>Unggah Berkas</Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Tambah Klaim CPMK */}
            <Modal
                isOpen={isKlaimModalOpen}
                onClose={() => setIsKlaimModalOpen(false)}
                title="Pemetaan Klaim Kompetensi Mata Kuliah"
                description="Pilih mata kuliah dan tautkan dokumen portofolio pendukung"
                size="lg"
            >
                <form onSubmit={handleSaveKlaim} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Mata Kuliah Kurikulum *</label>
                        <select
                            required
                            value={klaimForm.data.mata_kuliah_id}
                            onChange={(e) => klaimForm.setData('mata_kuliah_id', e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl font-medium"
                        >
                            <option value="">-- Pilih Mata Kuliah --</option>
                            {availableCourses.map((mk: any) => (
                                <option key={mk.id} value={mk.id}>
                                    {mk.kode_mk} - {mk.nama_mk} ({mk.sks} SKS, Sem {mk.semester})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Pengalaman & Penguasaan Relevan *</label>
                        <textarea
                            rows={3}
                            required
                            value={klaimForm.data.deskripsi_pengalaman_relevan}
                            onChange={(e) => klaimForm.setData('deskripsi_pengalaman_relevan', e.target.value)}
                            placeholder="Jelaskan proyek, tugas kunci, atau pelatihan yang membuktikan Anda telah menguasai materi mata kuliah ini..."
                            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Dokumen Bukti Portofolio Pendukung *</label>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-xl">
                            {pendaftar?.bukti?.map((b: any) => (
                                <label key={b.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs">
                                    <input
                                        type="checkbox"
                                        checked={klaimForm.data.bukti_ids.includes(b.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                klaimForm.setData('bukti_ids', [...klaimForm.data.bukti_ids, b.id]);
                                            } else {
                                                klaimForm.setData('bukti_ids', klaimForm.data.bukti_ids.filter((id) => id !== b.id));
                                            }
                                        }}
                                        className="rounded border-slate-300 text-blue-600"
                                    />
                                    <span className="font-medium text-slate-800">{b.nama_dokumen}</span>
                                    <Badge variant="slate" size="sm">{b.jenis_bukti}</Badge>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsKlaimModalOpen(false)}>Batal</Button>
                        <Button type="submit" variant="primary" isLoading={klaimForm.processing}>Simpan Pemetaan Klaim</Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Tambah Pendidikan */}
            <Modal
                isOpen={isPendidikanModalOpen}
                onClose={() => setIsPendidikanModalOpen(false)}
                title="Tambah Riwayat Pendidikan"
            >
                <form onSubmit={handleSavePendidikan} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Jenjang Pendidikan"
                            required
                            value={pendidikanForm.data.jenjang}
                            onChange={(e) => pendidikanForm.setData('jenjang', e.target.value)}
                        />
                        <Input
                            label="Tahun Kelulusan"
                            required
                            value={pendidikanForm.data.tahun_lulus}
                            onChange={(e) => pendidikanForm.setData('tahun_lulus', e.target.value)}
                        />
                    </div>
                    <Input
                        label="Nama Sekolah / Perguruan Tinggi"
                        required
                        value={pendidikanForm.data.nama_institusi}
                        onChange={(e) => pendidikanForm.setData('nama_institusi', e.target.value)}
                    />
                    <Input
                        label="Jurusan / Program Studi"
                        required
                        value={pendidikanForm.data.jurusan}
                        onChange={(e) => pendidikanForm.setData('jurusan', e.target.value)}
                    />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsPendidikanModalOpen(false)}>Batal</Button>
                        <Button type="submit" variant="primary" isLoading={pendidikanForm.processing}>Simpan Data</Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Tambah Pengalaman */}
            <Modal
                isOpen={isPengalamanModalOpen}
                onClose={() => setIsPengalamanModalOpen(false)}
                title="Tambah Riwayat Pengalaman Kerja"
            >
                <form onSubmit={handleSavePengalaman} className="space-y-4">
                    <Input
                        label="Nama Perusahaan / Organisasi"
                        required
                        value={pengalamanForm.data.nama_instansi}
                        onChange={(e) => pengalamanForm.setData('nama_instansi', e.target.value)}
                    />
                    <Input
                        label="Jabatan / Posisi"
                        required
                        value={pengalamanForm.data.jabatan_posisi}
                        onChange={(e) => pengalamanForm.setData('jabatan_posisi', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Tanggal Mulai"
                            type="date"
                            required
                            value={pengalamanForm.data.tanggal_mulai}
                            onChange={(e) => pengalamanForm.setData('tanggal_mulai', e.target.value)}
                        />
                        <Input
                            label="Tanggal Selesai"
                            type="date"
                            value={pengalamanForm.data.tanggal_selesai}
                            onChange={(e) => pengalamanForm.setData('tanggal_selesai', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Tugas Kunci & Tanggung Jawab *</label>
                        <textarea
                            rows={3}
                            required
                            value={pengalamanForm.data.deskripsi_tugas_kunci}
                            onChange={(e) => pengalamanForm.setData('deskripsi_tugas_kunci', e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsPengalamanModalOpen(false)}>Batal</Button>
                        <Button type="submit" variant="primary" isLoading={pengalamanForm.processing}>Simpan Pengalaman</Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
