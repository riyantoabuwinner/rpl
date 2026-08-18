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
    Printer,
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

    // Profile Form with full Form 2/F02 fields
    const profileForm = useForm({
        gelombang_id: pendaftar?.gelombang_id || activeGelombang?.id || '',
        prodi_id: pendaftar?.prodi_id || (prodiList[0]?.id ?? ''),
        jenis_rpl: pendaftar?.jenis_rpl || 'A2',
        nama_lengkap: pendaftar?.nama_lengkap || '',
        nik: pendaftar?.nik || '',
        telepon: pendaftar?.telepon || '',
        telepon_rumah: pendaftar?.telepon_rumah || '',
        telepon_kantor: pendaftar?.telepon_kantor || '',
        jenis_kelamin: pendaftar?.jenis_kelamin || 'L',
        status_pernikahan: pendaftar?.status_pernikahan || 'Menikah',
        kebangsaan: pendaftar?.kebangsaan || 'INDONESIA',
        tempat_lahir: pendaftar?.tempat_lahir || '',
        tanggal_lahir: pendaftar?.tanggal_lahir ? pendaftar.tanggal_lahir.substring(0, 10) : '',
        alamat_lengkap: pendaftar?.alamat_lengkap || '',
        rt_rw: pendaftar?.rt_rw || '',
        kecamatan: pendaftar?.kecamatan || '',
        kabupaten_kota: pendaftar?.kabupaten_kota || '',
        kode_pos: pendaftar?.kode_pos || '',
        pekerjaan_saat_ini: pendaftar?.pekerjaan_saat_ini || '',
        instansi_pekerjaan: pendaftar?.instansi_pekerjaan || '',
    });

    // Upload Form
    const uploadForm = useForm({
        file: null as File | null,
        nama_dokumen: '',
        jenis_bukti: 'sertifikat_kompetensi',
        tahun_penerbitan: String(new Date().getFullYear()),
        penerbit_institusi: '',
        deskripsi_dokumen: '',
    });

    // Klaim Form with Transfer sks vs Perolehan sks selection
    const klaimForm = useForm({
        mata_kuliah_id: '',
        cpmk_id: '',
        jenis_pengajuan: 'perolehan_sks',
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
        if (confirm('Apakah Anda yakin ingin mengirimkan Formulir Aplikasi Form 2/F02? Berkas akan dikunci untuk proses verifikasi administrasi.')) {
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
        <AppLayout title="Formulir Aplikasi RPL Tipe A (Form 2/F02)">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Info Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#0a2723] to-slate-900 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border border-emerald-800/40">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge variant="emerald" size="sm" className="bg-emerald-600 text-white border-0">
                                Form 2 / F02 Resmi UIN SSC
                            </Badge>
                            <span className="text-xs text-emerald-300 font-mono">Tadris Matematika / BKI / S1</span>
                        </div>
                        <h3 className="text-xl font-black text-white">Formulir Aplikasi Rekognisi Pembelajaran Lampau</h3>
                        <p className="text-xs text-emerald-200/80">
                            Isi formulir aplikasi data diri, riwayat pendidikan, dan daftar mata kuliah yang diajukan untuk Transfer SKS atau Perolehan SKS.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {pendaftar && (
                            <Link href="/form-f02/print" target="_blank">
                                <Button variant="outline" size="sm" className="bg-white/10 text-white border-emerald-400/40 hover:bg-white/20">
                                    <Printer className="w-4 h-4 mr-1.5" /> Cetak Dokumen F-02
                                </Button>
                            </Link>
                        )}
                        {isSubmitted && (
                            <Badge variant="emerald" size="md" className="bg-emerald-500/20 text-emerald-300 border-emerald-400 text-sm px-3.5 py-1.5">
                                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Berkas Terkirim
                            </Badge>
                        )}
                    </div>
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
                                        ? 'bg-[#125c50] text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
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

                {/* Step 1: Profil & Jalur Form 2/F02 */}
                {currentStep === 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Bagian 1.a: Data Pribadi Calon Mahasiswa</CardTitle>
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
                                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 font-medium"
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
                                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 font-bold text-emerald-800"
                                        >
                                            <option value="A2">RPL Tipe A2 (Perolehan SKS - Pengalaman Kerja & Pelatihan)</option>
                                            <option value="A1">RPL Tipe A1 (Transfer SKS - Nilai Kuliah Formal Sebelumnya)</option>
                                            <option value="B">RPL Tipe B (Penyetaraan Kualifikasi KKNI)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Input
                                        label="Nama Lengkap (Sesuai KTP/Ijazah)"
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

                                <div className="grid sm:grid-cols-4 gap-3">
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
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin *</label>
                                        <select
                                            disabled={isSubmitted}
                                            value={profileForm.data.jenis_kelamin}
                                            onChange={(e) => profileForm.setData('jenis_kelamin', e.target.value)}
                                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                                        >
                                            <option value="L">Pria</option>
                                            <option value="P">Wanita</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Status Pernikahan *</label>
                                        <select
                                            disabled={isSubmitted}
                                            value={profileForm.data.status_pernikahan}
                                            onChange={(e) => profileForm.setData('status_pernikahan', e.target.value)}
                                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                                        >
                                            <option value="Menikah">Menikah</option>
                                            <option value="Belum Menikah">Belum Menikah</option>
                                            <option value="Cerai">Cerai</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-4 gap-3">
                                    <div className="sm:col-span-2">
                                        <Input
                                            label="Alamat Rumah (Jalan / Dusun)"
                                            required
                                            disabled={isSubmitted}
                                            value={profileForm.data.alamat_lengkap}
                                            onChange={(e) => profileForm.setData('alamat_lengkap', e.target.value)}
                                            placeholder="Contoh: DS. BALINGBING"
                                        />
                                    </div>
                                    <Input
                                        label="RT / RW"
                                        disabled={isSubmitted}
                                        value={profileForm.data.rt_rw}
                                        onChange={(e) => profileForm.setData('rt_rw', e.target.value)}
                                        placeholder="RT/RW 016/04"
                                    />
                                    <Input
                                        label="Kode Pos"
                                        disabled={isSubmitted}
                                        value={profileForm.data.kode_pos}
                                        onChange={(e) => profileForm.setData('kode_pos', e.target.value)}
                                        placeholder="42152"
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-3">
                                    <Input
                                        label="Kecamatan"
                                        disabled={isSubmitted}
                                        value={profileForm.data.kecamatan}
                                        onChange={(e) => profileForm.setData('kecamatan', e.target.value)}
                                        placeholder="KEC. PAGADEN BARAT"
                                    />
                                    <Input
                                        label="Kabupaten / Kota"
                                        disabled={isSubmitted}
                                        value={profileForm.data.kabupaten_kota}
                                        onChange={(e) => profileForm.setData('kabupaten_kota', e.target.value)}
                                        placeholder="KAB. SUBANG"
                                    />
                                </div>

                                <div className="grid sm:grid-cols-3 gap-3">
                                    <Input
                                        label="No. HP / WhatsApp *"
                                        required
                                        disabled={isSubmitted}
                                        value={profileForm.data.telepon}
                                        onChange={(e) => profileForm.setData('telepon', e.target.value)}
                                        placeholder="081320741803"
                                    />
                                    <Input
                                        label="No. Telepon Rumah"
                                        disabled={isSubmitted}
                                        value={profileForm.data.telepon_rumah}
                                        onChange={(e) => profileForm.setData('telepon_rumah', e.target.value)}
                                    />
                                    <Input
                                        label="No. Telepon Kantor"
                                        disabled={isSubmitted}
                                        value={profileForm.data.telepon_kantor}
                                        onChange={(e) => profileForm.setData('telepon_kantor', e.target.value)}
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
                                <Button type="submit" variant="primary" isLoading={profileForm.processing} disabled={isSubmitted} className="bg-[#125c50] hover:bg-[#187566] text-white">
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
                                <CardTitle>Bagian 1.b: Data Pendidikan Formal Calon Mahasiswa</CardTitle>
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
                                        Belum ada riwayat pendidikan. Klik tombol di atas untuk menambahkan (contoh: SMA/SMK).
                                    </div>
                                ) : (
                                    pendaftar.pendidikan.map((edu: any) => (
                                        <div key={edu.id} className="py-3 flex items-center justify-between">
                                            <div>
                                                <span className="font-bold text-sm text-slate-900">{edu.nama_institusi}</span>
                                                <p className="text-xs text-slate-600">{edu.jenjang} - {edu.jurusan || 'Semua Jurusan'} (Lulus {edu.tahun_lulus})</p>
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
                            <Button variant="primary" size="sm" onClick={() => setCurrentStep(3)} className="bg-[#125c50] hover:bg-[#187566] text-white">
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
                                <p className="text-xs text-slate-500 mt-0.5">Rekam jejak pengalaman profesional yang relevan dengan mata kuliah yang diajukan</p>
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
                                                <p className="text-xs font-semibold text-emerald-800">{exp.nama_instansi}</p>
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
                            <Button variant="primary" size="sm" onClick={() => setCurrentStep(4)} className="bg-[#125c50] hover:bg-[#187566] text-white">
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
                                <CardTitle>Langkah 4: Portofolio Bukti Kompetensi (13 Kategori Resmi)</CardTitle>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Unggah sertifikat, dokumen analisis, logbook, bukti karya (Tervalidasi SHA-256)
                                </p>
                            </div>
                            {!isSubmitted && (
                                <Button size="sm" variant="primary" onClick={() => setIsUploadModalOpen(true)} className="bg-[#125c50] hover:bg-[#187566] text-white">
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
                            <Button variant="primary" size="sm" onClick={() => setCurrentStep(5)} className="bg-[#125c50] hover:bg-[#187566] text-white">
                                Lanjut ke Pemetaan Mata Kuliah <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Step 5: Bagian 2: Daftar Mata Kuliah & Pemetaan CPMK */}
                {currentStep === 5 && (
                    <Card>
                        <CardHeader>
                            <div>
                                <CardTitle>Bagian 2: Daftar Mata Kuliah yang Diajukan untuk RPL</CardTitle>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Pilih mata kuliah dan tentukan apakah melalui <strong>Transfer SKS</strong> (Kuliah Formal) atau <strong>Perolehan SKS</strong> (Pengalaman/Pelatihan).
                                </p>
                            </div>
                            {!isSubmitted && (
                                <Button size="sm" variant="primary" onClick={() => setIsKlaimModalOpen(true)} className="bg-[#125c50] hover:bg-[#187566] text-white">
                                    <Plus className="w-4 h-4 mr-1.5" /> Tambah Mata Kuliah yang Diajukan
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {!pendaftar?.klaim || pendaftar.klaim.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-2xl">
                                        Belum ada mata kuliah yang diajukan. Klik tombol di atas untuk memilih mata kuliah dari kurikulum program studi.
                                    </div>
                                ) : (
                                    pendaftar.klaim.map((k: any) => (
                                        <div key={k.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-bold text-emerald-800">{k.mata_kuliah?.kode_mk}</span>
                                                        <h4 className="font-bold text-sm text-slate-900">{k.mata_kuliah?.nama_mk}</h4>
                                                        <Badge variant="slate" size="sm">{k.mata_kuliah?.sks} SKS</Badge>
                                                        <Badge variant={k.jenis_pengajuan === 'transfer_sks' ? 'blue' : 'amber'} size="sm">
                                                            {k.jenis_pengajuan === 'transfer_sks' ? 'Transfer SKS' : 'Perolehan SKS'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-slate-600 mt-1">{k.deskripsi_pengalaman_relevan}</p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Badge variant="emerald" size="sm">Kemampuan: {k.tingkat_kemampuan_diri}</Badge>
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
                            <Button variant="primary" size="sm" onClick={() => setCurrentStep(6)} className="bg-[#125c50] hover:bg-[#187566] text-white">
                                Lanjut ke Pakta Integritas & Final Submit <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Step 6: Review & Final Submit + 3 Legal Declarations */}
                {currentStep === 6 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Langkah 6: Pakta Integritas & Pernyataan Resmi Pemohon</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-3">
                                <div className="flex items-center gap-2 font-bold text-sm text-emerald-950">
                                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                                    <span>Pernyataan dan Pakta Integritas Calon Mahasiswa (Form 2/F02 UIN SSC)</span>
                                </div>
                                <p className="font-semibold text-slate-800">
                                    Bersama ini saya mengajukan permohonan untuk dapat mengikuti Rekognisi Pembelajaran Lampau (RPL) dan dengan ini saya menyatakan bahwa:
                                </p>
                                <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed text-slate-800">
                                    <li>
                                        Semua informasi yang saya tuliskan adalah sepenuhnya benar dan saya bertanggung-jawab atas seluruh data dalam formulir ini, dan apabila di kemudian hari ternyata informasi yang saya sampaikan tersebut adalah tidak benar, maka saya bersedia menerima sanksi sesuai dengan ketentuan yang berlaku;
                                    </li>
                                    <li>
                                        Saya memberikan izin kepada pihak pengelola program RPL, untuk melakukan pemeriksaan kebenaran informasi yang saya berikan dalam formulir aplikasi ini kepada seluruh pihak yang terkait dengan jenjang akademik sebelumnya dan kepada perusahaan tempat saya bekerja sebelumnya dan atau saat ini saya bekerja; dan
                                    </li>
                                    <li>
                                        Saya akan mengikuti proses asesmen sesuai dengan jadwal/waktu yang ditetapkan oleh Perguruan Tinggi.
                                    </li>
                                </ol>
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
                                    <span className="text-xs text-slate-500 font-semibold">Dokumen Siap Cetak</span>
                                    <Link href="/form-f02/print" target="_blank" className="text-xs font-bold text-emerald-700 hover:underline block mt-2">
                                        Lihat Preview Form 2/F02 &rarr;
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(5)}>
                                <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                            </Button>
                            {!isSubmitted ? (
                                <Button variant="primary" size="lg" onClick={handleSubmitFinal} className="bg-[#125c50] hover:bg-[#187566] text-white shadow-lg shadow-emerald-900/30">
                                    <Send className="w-4 h-4 mr-2" /> Submit Final Form 2/F02
                                </Button>
                            ) : (
                                <Badge variant="emerald" size="md">Formulir Telah Dikirim Resmi</Badge>
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
                            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer"
                        />
                    </div>

                    <Input
                        label="Nama / Judul Dokumen Portofolio"
                        required
                        value={uploadForm.data.nama_dokumen}
                        onChange={(e) => uploadForm.setData('nama_dokumen', e.target.value)}
                        placeholder="Contoh: Sertifikat Guru BK Profesional / BNSP"
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Bukti (13 Kategori) *</label>
                            <select
                                value={uploadForm.data.jenis_bukti}
                                onChange={(e) => uploadForm.setData('jenis_bukti', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-medium"
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
                        placeholder="Contoh: Kemendikbudristek / BNSP / PT Asal"
                    />

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsUploadModalOpen(false)}>Batal</Button>
                        <Button type="submit" variant="primary" isLoading={uploadForm.processing} className="bg-[#125c50] hover:bg-[#187566] text-white">Unggah Berkas</Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Tambah Klaim CPMK */}
            <Modal
                isOpen={isKlaimModalOpen}
                onClose={() => setIsKlaimModalOpen(false)}
                title="Pemetaan Pengajuan Mata Kuliah (Transfer / Perolehan SKS)"
                description="Pilih mata kuliah kurikulum dan tentukan skema rekognisi serta bukti portofolio"
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
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Keterangan Skema Pengajuan *</label>
                        <select
                            value={klaimForm.data.jenis_pengajuan}
                            onChange={(e) => klaimForm.setData('jenis_pengajuan', e.target.value)}
                            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-emerald-800"
                        >
                            <option value="perolehan_sks">Perolehan SKS (Berdasarkan Pengalaman Kerja / Pelatihan / Nonformal)</option>
                            <option value="transfer_sks">Transfer SKS (Berdasarkan Nilai Kuliah Formal Sebelumnya)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Uraian Bukti / Pengalaman Relevan *</label>
                        <textarea
                            rows={3}
                            required
                            value={klaimForm.data.deskripsi_pengalaman_relevan}
                            onChange={(e) => klaimForm.setData('deskripsi_pengalaman_relevan', e.target.value)}
                            placeholder="Jelaskan pengalaman tugas, silabus kuliah sebelumnya, atau sertifikasi yang membuktikan kompetensi mata kuliah ini..."
                            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
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
                                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="font-medium text-slate-800">{b.nama_dokumen}</span>
                                    <Badge variant="slate" size="sm">{b.jenis_bukti}</Badge>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsKlaimModalOpen(false)}>Batal</Button>
                        <Button type="submit" variant="primary" isLoading={klaimForm.processing} className="bg-[#125c50] hover:bg-[#187566] text-white">Simpan Pengajuan MK</Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Tambah Pendidikan */}
            <Modal
                isOpen={isPendidikanModalOpen}
                onClose={() => setIsPendidikanModalOpen(false)}
                title="Tambah Riwayat Pendidikan Formal"
            >
                <form onSubmit={handleSavePendidikan} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Pendidikan Terakhir *</label>
                            <select
                                value={pendidikanForm.data.jenjang}
                                onChange={(e) => pendidikanForm.setData('jenjang', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                            >
                                <option value="SMA">SMA</option>
                                <option value="SMK">SMK</option>
                                <option value="MA">MA</option>
                                <option value="D3">Diploma 3 (D3)</option>
                                <option value="D4/S1">Sarjana (S1 / D4)</option>
                            </select>
                        </div>
                        <Input
                            label="Tahun Kelulusan *"
                            required
                            value={pendidikanForm.data.tahun_lulus}
                            onChange={(e) => pendidikanForm.setData('tahun_lulus', e.target.value)}
                        />
                    </div>
                    <Input
                        label="Nama Perguruan Tinggi / Sekolah *"
                        required
                        value={pendidikanForm.data.nama_institusi}
                        onChange={(e) => pendidikanForm.setData('nama_institusi', e.target.value)}
                        placeholder="Contoh: SMAN 2 CIREBON / Universitas Asal"
                    />
                    <Input
                        label="Program Studi / Jurusan (Dikosongkan jika SMA)"
                        value={pendidikanForm.data.jurusan}
                        onChange={(e) => pendidikanForm.setData('jurusan', e.target.value)}
                    />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsPendidikanModalOpen(false)}>Batal</Button>
                        <Button type="submit" variant="primary" isLoading={pendidikanForm.processing} className="bg-[#125c50] hover:bg-[#187566] text-white">Simpan Data</Button>
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
                        <Button type="submit" variant="primary" isLoading={pengalamanForm.processing} className="bg-[#125c50] hover:bg-[#187566] text-white">Simpan Pengalaman</Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
