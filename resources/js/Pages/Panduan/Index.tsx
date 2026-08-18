import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    User,
    Users,
    ClipboardCheck,
    Award,
    FileCheck,
    ShieldCheck,
    Database,
    FileText,
    Video,
    CheckCircle2,
    ArrowRight,
    Printer,
    HelpCircle,
    Info,
    Layers,
    Clock,
    Scale,
    ExternalLink,
    Sparkles,
} from 'lucide-react';
import { AppLayout } from '@/Components/Layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';

export default function PanduanIndex({
    currentUserRole,
    userName,
}: {
    currentUserRole: string;
    userName: string;
}) {
    const roleTabs = [
        { id: 'asesi', label: 'Asesi / Calon Mahasiswa', icon: User, color: 'emerald' },
        { id: 'admin_rpl', label: 'Admin Pusat RPL', icon: Users, color: 'blue' },
        { id: 'asesor', label: 'Dosen Asesor Evaluator', icon: ClipboardCheck, color: 'purple' },
        { id: 'kaprodi', label: 'Ketua Program Studi (Kaprodi)', icon: Award, color: 'amber' },
        { id: 'lpm', label: 'Penjaminan Mutu (LPM)', icon: ShieldCheck, color: 'cyan' },
        { id: 'admin_siakad', label: 'Admin Data SIAKAD', icon: Database, color: 'teal' },
        { id: 'super_admin', label: 'Super Administrator', icon: Layers, color: 'indigo' },
    ];

    // Default to the user's active role tab if found
    const [activeTab, setActiveTab] = useState(() => {
        const found = roleTabs.find((t) => t.id === currentUserRole);
        return found ? found.id : 'asesi';
    });

    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <AppLayout
            title="Buku Panduan Pengguna Sistem (User Manual)"
            subtitle="Panduan Operasional SIRPL UIN Siber Syekh Nurjati Cirebon"
        >
            <div className="space-y-6">
                {/* Hero Header Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#0a2723] to-slate-900 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border border-emerald-800/40">
                    <div className="space-y-1.5 max-w-2xl">
                        <div className="flex items-center gap-2">
                            <Badge variant="emerald" size="sm" className="bg-emerald-600 text-white border-0">
                                Buku Panduan Resmi &bull; Permendikbudristek 41/2021
                            </Badge>
                            <span className="text-xs text-emerald-300 font-mono">UIN SSC SIRPL Manual</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white">
                            Panduan Lengkap Operasional Sistem RPL
                        </h2>
                        <p className="text-xs text-emerald-100/80 leading-relaxed">
                            Panduan interaktif langkah demi langkah untuk seluruh aktor yang terlibat: Calon Asesi, Pengelola RPL, Asesor, Kaprodi, LPM, dan Tim Akademik SIAKAD.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href="/form-f02/print" target="_blank">
                            <Button variant="outline" size="sm" className="bg-white/10 text-white border-emerald-400/30 hover:bg-white/20 text-xs">
                                <Printer className="w-4 h-4 mr-1.5" /> Contoh Form F-02
                            </Button>
                        </Link>
                        <Link href="/form-f03/print" target="_blank">
                            <Button variant="outline" size="sm" className="bg-white/10 text-white border-emerald-400/30 hover:bg-white/20 text-xs">
                                <Printer className="w-4 h-4 mr-1.5" /> Contoh Form F-03
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Role Tabs Navigation */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {roleTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        const isUserRole = currentUserRole === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                                    isActive
                                        ? 'bg-[#125c50] text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                                {isUserRole && (
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Peran Anda saat ini" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* TAB CONTENT: ASESI */}
                {activeTab === 'asesi' && (
                    <div className="space-y-6">
                        <Card className="border-l-4 border-l-emerald-600">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-emerald-700" />
                                    <CardTitle>Alur Kerja Calon Mahasiswa (Asesi RPL)</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                                            1
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Pengisian Data Diri & Pendidikan</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Lengkapi formulir identitas (Form 2/F02), nomor KTP, riwayat pendidikan formal terakhir, serta riwayat pengalaman kerja dan pelatihan relevan.
                                        </p>
                                        <Link href="/form-f02" className="inline-flex items-center text-xs font-bold text-emerald-700 hover:underline pt-1">
                                            Buka Form F-02 &rarr;
                                        </Link>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                                            2
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Unggah Portofolio (13 Kategori)</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Unggah berkas bukti kompetensi (Sertifikat BNSP, Lisensi, Logbook, Karya, SK) dalam format PDF/JPG. Sistem akan memvalidasi *checksum* SHA-256 secara otomatis.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                                            3
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Evaluasi Diri CPMK (Form 3/F03)</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Pilih mata kuliah yang diajukan (Transfer SKS / Perolehan SKS) dan isi penilaian mandiri (*Sangat Baik / Baik / Tidak Pernah*) per butir capaian pembelajaran.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                                    <div className="flex items-center gap-2 font-bold text-sm text-emerald-950">
                                        <Scale className="w-4 h-4 text-emerald-700" />
                                        <span>Hak Masa Sanggah / Keberatan (3 Hari Kerja)</span>
                                    </div>
                                    <p className="leading-relaxed text-slate-700">
                                        Jika hasil rekomendasi asesmen atau sidang pleno dirasa kurang sesuai, asesi memiliki hak resmi untuk mengajukan sanggahan disertai dokumen bukti tambahan melalui menu <strong>Masa Sanggah</strong> dalam kurun waktu 3 hari kerja pasca pengumuman.
                                    </p>
                                    <Link href="/sanggah" className="inline-flex items-center text-xs font-bold text-emerald-800 hover:underline pt-1">
                                        Buka Menu Masa Sanggah &rarr;
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* TAB CONTENT: ADMIN PUSAT RPL */}
                {activeTab === 'admin_rpl' && (
                    <div className="space-y-6">
                        <Card className="border-l-4 border-l-blue-600">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-700" />
                                    <CardTitle>Panduan Pengelola / Admin Pusat RPL</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                                            1
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Verifikasi Berkas Administrasi</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Periksa kelengkapan berkas pendaftar (KTP, Ijazah, Transkrip asal) pada menu Pendaftar RPL dalam batas SLA 3 hari kerja.
                                        </p>
                                        <Link href="/admin/pendaftar" className="inline-flex items-center text-xs font-bold text-blue-700 hover:underline pt-1">
                                            Kelola Pendaftar &rarr;
                                        </Link>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                                            2
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Penugasan Dosen Asesor</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Tugaskan Dosen Asesor penilai sesuai kepakaran program studi pendaftar. Sistem otomatis mengaktifkan SLA Asesmen 7 hari kerja.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                                            3
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Manajemen Gelombang Pendaftaran</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Buka atau tutup gelombang pendaftaran RPL, tentukan kuota pendaftar, dan atur tarif biaya asesmen per SKS di menu Master Data.
                                        </p>
                                        <Link href="/master-data" className="inline-flex items-center text-xs font-bold text-blue-700 hover:underline pt-1">
                                            Master Data &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* TAB CONTENT: ASESOR */}
                {activeTab === 'asesor' && (
                    <div className="space-y-6">
                        <Card className="border-l-4 border-l-purple-600">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <ClipboardCheck className="w-5 h-5 text-purple-700" />
                                    <CardTitle>Panduan Dosen Asesor Evaluator Portofolio</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                                            1
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Dual-Panel Workspace</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Buka workspace evaluasi. Panel kiri menampilkan dokumen portofolio ber-watermark dinamis, panel kanan menyediakan lembar validasi per mata kuliah.
                                        </p>
                                        <Link href="/asesor/penilaian" className="inline-flex items-center text-xs font-bold text-purple-700 hover:underline pt-1">
                                            Buka Workspace Asesor &rarr;
                                        </Link>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                                            2
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Validasi Prinsip V-A-T-M</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Evaluasi berkas bukti berdasarkan 4 pilar: <strong>V</strong>alid (Sahih), <strong>A</strong>utentik (Asli), <strong>T</strong>erkini (Mutakhir), dan <strong>M</strong>emadai (Cukup). Berikan rekomendasi SKS dan grade nilai.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                                            3
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Pelaksanaan Uji Petik & Pleno</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Jika bukti meragukan, jadwalkan wawancara/uji petik di menu Asesmen Lanjutan, isi rubrik 4 dimensi, dan finalisasi berkas untuk diajukan ke Sidang Pleno.
                                        </p>
                                        <Link href="/uji-petik" className="inline-flex items-center text-xs font-bold text-purple-700 hover:underline pt-1">
                                            Asesmen Lanjutan &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* TAB CONTENT: KAPRODI */}
                {activeTab === 'kaprodi' && (
                    <div className="space-y-6">
                        <Card className="border-l-4 border-l-amber-600">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-amber-700" />
                                    <CardTitle>Panduan Ketua Program Studi (Kaprodi)</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center">
                                            1
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Penyelenggaraan Sidang Pleno</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Buka menu Berita Acara / Pleno, buat agenda sidang pleno, dan masukkan daftar asesi yang telah selesai dievaluasi oleh asesor.
                                        </p>
                                        <Link href="/pleno" className="inline-flex items-center text-xs font-bold text-amber-700 hover:underline pt-1">
                                            Sidang Pleno &rarr;
                                        </Link>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center">
                                            2
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Legalisasi Berita Acara</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Tinjau rekapitulasi SKS yang diakui dan konversi nilai huruf/angka. Sahkan Berita Acara untuk menerbitkan keputusan pleno resmi.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center">
                                            3
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Penerbitan SK Rekognisi Rektor</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Masuk ke menu Rekognisi MK & SKS untuk membuat SK Rekognisi ber-QR Code SHA-256 yang siap diverifikasi keabsahannya oleh publik.
                                        </p>
                                        <Link href="/sk-rekognisi" className="inline-flex items-center text-xs font-bold text-amber-700 hover:underline pt-1">
                                            SK Rekognisi &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* TAB CONTENT: LPM */}
                {activeTab === 'lpm' && (
                    <div className="space-y-6">
                        <Card className="border-l-4 border-l-cyan-600">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-cyan-700" />
                                    <CardTitle>Panduan Lembaga Penjaminan Mutu (LPM)</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white font-black text-xs flex items-center justify-center">
                                            1
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Monitoring Kepatuhan SLA</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Pantau batas waktu verifikasi administrasi (3 hari kerja) dan asesmen portofolio (7 hari kerja) agar mutu pelayanan tetap terjaga.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white font-black text-xs flex items-center justify-center">
                                            2
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Audit Konsistensi Rubrik</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Pastikan penilaian asesor konsisten menerapkan rubrik 4 dimensi kompetensi dan bebas dari anomali inflasi nilai (*grade inflation*).
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white font-black text-xs flex items-center justify-center">
                                            3
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Penelusuran Audit Trail</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Tinjau riwayat log audit untuk setiap perubahan nilai, pembatalan berkas, atau keputusan sidang pleno guna kepentingan akreditasi BAN-PT/LAM.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* TAB CONTENT: SIAKAD */}
                {activeTab === 'admin_siakad' && (
                    <div className="space-y-6">
                        <Card className="border-l-4 border-l-teal-600">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Database className="w-5 h-5 text-teal-700" />
                                    <CardTitle>Panduan Admin SIAKAD & Integrasi Feeder</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black text-xs flex items-center justify-center">
                                            1
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Sync API Program Studi</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Sinkronkan data master prodi dari bridge SIAKAD UIN SSC endpoint <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded">/api/program_studi</code>.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black text-xs flex items-center justify-center">
                                            2
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Sync Mata Kuliah Kurikulum</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Tarik data mata kuliah dan bobot SKS via endpoint <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded">/api/matakuliah</code> untuk sinkronisasi kurikulum aktif.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black text-xs flex items-center justify-center">
                                            3
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Ekspor Transkrip ke KHS</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Catatkan transkrip perolehan SKS hasil rekognisi resmi ke Kartu Hasil Studi (KHS) mahasiswa baru di SIAKAD kampus.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* TAB CONTENT: SUPER ADMIN */}
                {activeTab === 'super_admin' && (
                    <div className="space-y-6">
                        <Card className="border-l-4 border-l-indigo-600">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-indigo-700" />
                                    <CardTitle>Panduan Super Administrator</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                                            1
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Manajemen Akun & Hak Akses</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Kelola pengguna, penetapan peran Dosen Asesor, Kaprodi, Admin RPL, dan reset kredensial pengguna institusi.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                                            2
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Pemeliharaan Basis Data MySQL</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Pastikan integritas database <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded">sirpl_db</code>, backup berkala, dan monitoring migrasi skema tabel.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                                            3
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-900">Audit Keamanan & Integritas</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Awasi verifikasi token QR code, validasi hash SHA-256 berkas portofolio, dan deteksi potensi duplikasi berkas antar pendaftar.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* FAQ SECTION */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-emerald-700" />
                            <CardTitle>Pertanyaan yang Sering Diajukan (FAQ)</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {[
                            {
                                q: 'Apa perbedaan antara RPL Tipe A1 (Transfer SKS) dan Tipe A2 (Perolehan SKS)?',
                                a: 'RPL Tipe A1 diperuntukkan bagi mahasiswa pindahan/lanjutan studi dari pendidikan tinggi formal sebelumnya dengan menyertakan Ijazah dan Transkrip Nilai. Sedangkan RPL Tipe A2 diperuntukkan bagi calon mahasiswa yang mengajukan pengakuan dari pengalaman kerja, pelatihan bersertifikat, atau pembelajaran nonformal/informal.',
                            },
                            {
                                q: 'Berapa batas maksimal SKS yang dapat direkognisi melalui program RPL?',
                                a: 'Berdasarkan Permendikbudristek No. 41 Tahun 2021 dan standar kurikulum perguruan tinggi, maksimal SKS yang dapat diakui adalah hingga 70% dari total SKS kelulusan program studi (umumnya maksimal 100 SKS untuk program Sarjana S1).',
                            },
                            {
                                q: 'Bagaimana cara memverifikasi keaslian SK Rekognisi atau dokumen yang diterbitkan sistem?',
                                a: 'Setiap SK Rekognisi yang diterbitkan dilengkapi dengan QR Code digital bersertifikat SHA-256. Pengguna atau pihak eksternal cukup memindai QR Code tersebut untuk membuka portal verifikasi publik resmi pada alamat URL /verify/{token}.',
                            },
                            {
                                q: 'Berapa lama batas waktu penyelesaian asesmen oleh Dosen Asesor?',
                                a: 'Standar Operasional Prosedur (SLA) menetapkan waktu penilaian portofolio maksimal 7 hari kerja sejak tanggal penugasan oleh Admin Pusat RPL.',
                            },
                        ].map((faq, idx) => (
                            <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <span className="text-emerald-700 text-base">{openFaq === idx ? '−' : '+'}</span>
                                </button>
                                {openFaq === idx && (
                                    <div className="p-4 text-xs text-slate-600 bg-white border-t border-slate-200 leading-relaxed">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
