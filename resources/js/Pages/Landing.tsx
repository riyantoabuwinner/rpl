import React from 'react';
import { Link } from '@inertiajs/react';
import {
    GraduationCap,
    Award,
    CheckCircle2,
    ArrowRight,
    FileCheck,
    Users,
    Layers,
    ShieldCheck,
    Calendar,
    Sparkles,
    ChevronRight,
    BookOpen,
    LogIn,
    UserPlus,
    Clock,
    Laptop,
    CheckSquare,
    MapPin,
    Phone,
    Mail,
    Globe,
    Building2,
    FileText,
} from 'lucide-react';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';

export default function Landing({ activeGelombang }: { activeGelombang: any }) {
    const prodiPilihan = [
        {
            kode: 'TMT',
            nama: 'S1 Tadris Matematika',
            fakultas: 'Fakultas Tarbiyah dan Keguruan',
            desc: 'Pengakuan kompetensi guru matematika, tutor kalkulus, dan pengajar sains.',
            color: 'emerald',
        },
        {
            kode: 'BKI',
            nama: 'S1 Bimbingan dan Konseling Islam',
            fakultas: 'Fakultas Dakwah dan Komunikasi Islam',
            desc: 'Pengakuan pengalaman konselor, guru BK, pendamping sosial, dan praktisi dakwah.',
            color: 'blue',
        },
        {
            kode: 'TI',
            nama: 'S1 Teknik Informatika',
            fakultas: 'Fakultas Sains & Teknologi Informasi',
            desc: 'Pengakuan pengalaman software engineer, network administrator, dan praktisi IT.',
            color: 'purple',
        },
        {
            kode: 'SI',
            nama: 'S1 Sistem Informasi',
            fakultas: 'Fakultas Sains & Teknologi Informasi',
            desc: 'Pengakuan analis data, sistem enterprise, dan manajer proyek teknologi.',
            color: 'amber',
        },
    ];

    const keunggulanRpl = [
        {
            icon: Award,
            title: 'Pengakuan Hingga 100 SKS',
            desc: 'Konversi pengalaman kerja, portofolio profesi, dan sertifikasi BNSP langsung menjadi SKS resmi.',
            tag: 'Hemat Waktu & Biaya',
        },
        {
            icon: Laptop,
            title: 'Sistem Kuliah Siber (Full Daring)',
            desc: 'Belajar fleksibel kapan saja dan dari mana saja tanpa meninggalkan pekerjaan Anda saat ini.',
            tag: 'Fleksibilitas Penuh',
        },
        {
            icon: ShieldCheck,
            title: 'Legalitas Permendikbudristek 41/2021',
            desc: 'Ijazah dan transkrip resmi terdaftar di PDDikti Kemendikbudristek dan SIAKAD UIN SSC.',
            tag: 'Terakreditasi Resmi',
        },
        {
            icon: FileCheck,
            title: 'Sertifikat SK Ber-QR Code Digital',
            desc: 'Keaslian SK Rekognisi dapat diverifikasi secara publik via portal QR Scanner bersertifikat SHA-256.',
            tag: 'Aman & Anti-Pemalsuan',
        },
    ];

    const tahapanProses = [
        {
            step: '01',
            title: 'Pendaftaran & Isi Form F-02',
            desc: 'Lengkapi data diri, riwayat pendidikan, pengalaman kerja, dan tentukan pilihan mata kuliah.',
        },
        {
            step: '02',
            title: 'Unggah Bukti Portofolio',
            desc: 'Unggah berkas sertifikat, lisensi, logbook, dan karya kerja dari 13 kategori resmi.',
        },
        {
            step: '03',
            title: 'Evaluasi Diri (Form F-03)',
            desc: 'Lakukan penilaian mandiri per butir Capaian Pembelajaran Mata Kuliah (CPMK).',
        },
        {
            step: '04',
            title: 'Asesmen & Validasi Asesor',
            desc: 'Dosen Asesor mengevaluasi berkas dengan validasi V-A-T-M dan uji petik jika diperlukan.',
        },
        {
            step: '05',
            title: 'Sidang Pleno & Terbit SK',
            desc: 'Penetapan perolehan SKS diakui oleh Kaprodi dan penerbitan SK Rektor resmi ber-QR Code.',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
            {/* Top Bar Announcement */}
            <div className="bg-[#0a2723] text-white text-xs py-2 px-4 border-b border-emerald-800/40">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-semibold">Penerimaan Mahasiswa Baru Jalur RPL 2026/2027</span>
                        <span className="hidden sm:inline text-emerald-300/80">&bull; Transfer SKS (Tipe A1) & Perolehan SKS (Tipe A2)</span>
                    </div>
                    <div className="flex items-center gap-4 text-emerald-200">
                        <Link href="/verify/check" className="hover:text-white flex items-center gap-1 transition-colors">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verifikasi SK Rekognisi
                        </Link>
                        <span className="text-emerald-700">|</span>
                        <Link href="/panduan" className="hover:text-white flex items-center gap-1 transition-colors">
                            <BookOpen className="w-3.5 h-3.5" /> Panduan Sistem
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Navigation Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3.5 group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md p-2 group-hover:scale-105 transition-transform">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                            <span className="font-black text-sm sm:text-base text-slate-900 leading-tight block uppercase tracking-tight">
                                UIN SIBER SYEKH NURJATI CIREBON
                            </span>
                            <span className="text-[11px] font-bold text-emerald-800 tracking-wider uppercase block">
                                Portal Rekognisi Pembelajaran Lampau (SIRPL)
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2.5">
                        <Link href="/panduan">
                            <Button variant="ghost" size="sm" className="text-slate-700 hover:text-emerald-800 text-xs hidden sm:inline-flex">
                                <BookOpen className="w-4 h-4 mr-1.5" /> Panduan
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="sm" className="border-emerald-700 text-emerald-800 hover:bg-emerald-50 text-xs">
                                <LogIn className="w-3.5 h-3.5 mr-1" /> Masuk
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button variant="primary" size="sm" className="bg-[#125c50] hover:bg-[#187566] text-white shadow-sm text-xs font-bold">
                                <UserPlus className="w-3.5 h-3.5 mr-1" /> Daftar Asesi Baru
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="relative bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
                    {/* Left 7 Cols: Text & Call-To-Action */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-extrabold shadow-2xs">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Universitas Islam Negeri Siber Pertama di Indonesia</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                            Ubah Pengalaman Kerja & Studi Masa Lalu Menjadi{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#125c50] via-emerald-700 to-teal-700">
                                Gelar Sarjana Resmi
                            </span>
                        </h1>

                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
                            Sistem Rekognisi Pembelajaran Lampau (SIRPL) UIN Siber Syekh Nurjati Cirebon mengonversi pengalaman kerja, pelatihan profesi, dan riwayat kuliah Anda menjadi pengakuan SKS resmi berdasarkan <strong>Permendikbudristek No. 41 Tahun 2021</strong>.
                        </p>

                        {/* Gelombang Active Info Card */}
                        {activeGelombang && (
                            <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                    <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wide block">
                                        Gelombang Pendaftaran Terbuka
                                    </span>
                                    <h4 className="font-bold text-sm text-slate-900">
                                        {activeGelombang.nama} &bull; TA {activeGelombang.tahun}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {activeGelombang.buka} s/d {activeGelombang.tutup}
                                        </span>
                                        <span>&bull;</span>
                                        <span>Kuota: <strong className="text-emerald-700">{activeGelombang.kuota} Peserta</strong></span>
                                    </div>
                                </div>

                                <Link href="/register">
                                    <Button variant="primary" size="sm" className="bg-[#125c50] hover:bg-[#187566] text-white shadow-sm font-bold">
                                        Daftar Sekarang <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <Link href="/register">
                                <Button size="lg" className="bg-[#125c50] hover:bg-[#187566] text-white shadow-md font-bold px-6">
                                    Mulai Pendaftaran RPL <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/panduan">
                                <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-white bg-white font-semibold">
                                    <BookOpen className="w-4 h-4 mr-2 text-emerald-700" /> Pelajari Panduan Lengkap
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right 5 Cols: Campus Identity Image */}
                    <div className="lg:col-span-5">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
                            <img
                                src="/images/uin_ssc_campus.jpg"
                                alt="Gedung Kampus UIN Siber Syekh Nurjati Cirebon"
                                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
                                    Kampus Utama
                                </span>
                                <h3 className="font-bold text-base text-white leading-tight">
                                    Gedung Rektorat & Pusat Siber UIN SSC
                                </h3>
                                <p className="text-xs text-slate-200 mt-0.5">
                                    Jl. Perjuangan, Sunyaragi, Kesambi, Kota Cirebon, Jawa Barat
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4 KEUNGGULAN UTAMA RPL SECTION */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto space-y-10">
                    <div className="text-center space-y-2 max-w-3xl mx-auto">
                        <Badge variant="emerald" size="sm" className="bg-emerald-100 text-emerald-900 border-emerald-300">
                            Keunggulan Program RPL
                        </Badge>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Mengapa Memilih Program RPL di UIN SSC?
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Dirancang khusus untuk profesional, guru, konselor, praktisi, dan alumni yang ingin melanjutkan studi tinggi tanpa harus mengulang mata kuliah yang sudah dikuasai.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {keunggulanRpl.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={idx}
                                    className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all space-y-3 group shadow-2xs"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-emerald-700 flex items-center justify-center group-hover:bg-[#125c50] group-hover:text-white transition-colors shadow-2xs">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                                        {item.tag}
                                    </span>
                                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* PROGRAM STUDI PILIHAN */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto space-y-10">
                    <div className="text-center space-y-2 max-w-2xl mx-auto">
                        <Badge variant="blue" size="sm" className="bg-blue-100 text-blue-900 border-blue-300">
                            Program Studi Terbuka RPL
                        </Badge>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Pilihan Jurusan Unggulan S1
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600">
                            Kurikulum Berbasis Outcome-Based Education (OBE) yang terintegrasi penuh dengan SIAKAD dan Feeder PDDikti.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {prodiPilihan.map((p) => (
                            <div
                                key={p.kode}
                                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="emerald" size="sm" className="font-mono">{p.kode}</Badge>
                                        <span className="text-[10px] font-bold text-slate-400">Jenjang S1</span>
                                    </div>
                                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                                        {p.nama}
                                    </h3>
                                    <span className="text-[11px] font-semibold text-emerald-800 block">
                                        {p.fakultas}
                                    </span>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        {p.desc}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-[11px] text-slate-400">Terbuka RPL A1 & A2</span>
                                    <Link href="/register" className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center">
                                        Daftar &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CYBER COLLABORATIVE LEARNING ECOSYSTEM (STUDENTS IMAGE) */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
                            <img
                                src="/images/uin_ssc_students.jpg"
                                alt="Mahasiswa Pembelajaran Kolaboratif UIN SSC"
                                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
                                    Cyber Learning Hub
                                </span>
                                <h3 className="font-bold text-base text-white leading-tight">
                                    Pusat Pembelajaran Kolaboratif Digital UIN SSC
                                </h3>
                                <p className="text-xs text-slate-200 mt-0.5">
                                    Interaksi intensif antara asesi, dosen pembimbing, dan praktisi industri
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
                        <Badge variant="emerald" size="sm" className="bg-emerald-100 text-emerald-900 border-emerald-300">
                            Ekosistem Digital Cyber University
                        </Badge>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                            Pengalaman Kuliah Modern yang Menyesuaikan Jadwal Kerja Anda
                        </h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Di UIN Siber Syekh Nurjati Cirebon, proses pembelajaran dilakukan melalui platform digital mutakhir dengan kurikulum terstruktur. Anda tidak perlu hadir secara fisik setiap hari di kampus, namun mutu capaian pembelajaran tetap terjaga dengan standar akreditasi unggul.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-3 pt-2">
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-xs text-slate-900 block">Asesmen Portofolio Transparan</span>
                                    <p className="text-[11px] text-slate-500">Evaluasi dengan rubrik A-C-S-V dan SHA-256 integrity check.</p>
                                </div>
                            </div>
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-xs text-slate-900 block">Bimbingan Asesor Terakreditasi</span>
                                    <p className="text-[11px] text-slate-500">Didampingi Dosen Penilai yang tersertifikasi di bidangnya.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5 TAHAPAN ALUR RPL (FLOWCHART RESMI) */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto space-y-10">
                    <div className="text-center space-y-2 max-w-2xl mx-auto">
                        <Badge variant="blue" size="sm" className="bg-blue-100 text-blue-900 border-blue-300">
                            Alur & Prosedur Pendaftaran
                        </Badge>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            5 Langkah Mudah Mengikuti Program RPL
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600">
                            Alur resmi berbasis Standar Operasional Prosedur (SOP) UIN Siber Syekh Nurjati Cirebon.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {tahapanProses.map((t, idx) => (
                            <div
                                key={idx}
                                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 relative"
                            >
                                <span className="font-mono text-2xl font-black text-emerald-600 block">
                                    {t.step}
                                </span>
                                <h3 className="font-bold text-sm text-slate-900 leading-snug">
                                    {t.title}
                                </h3>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    {t.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA BOTTOM BANNER */}
            <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[#0a2723] text-white">
                <div className="max-w-5xl mx-auto text-center space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black mx-auto shadow-lg shadow-amber-500/20 p-2">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black text-white">
                            Siap Memulai Langkah Menuju Gelar Sarjana Anda?
                        </h2>
                        <p className="text-xs sm:text-sm text-emerald-200/80 max-w-2xl mx-auto leading-relaxed">
                            Daftarkan diri Anda sekarang pada gelombang pendaftaran aktif dan dapatkan pengakuan atas seluruh pengalaman kerja berharga Anda.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Link href="/register">
                            <Button size="lg" className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-8 shadow-md">
                                Daftar Sebagai Asesi Baru <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-semibold">
                                Masuk ke Portal Akun
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-slate-900 text-slate-400 text-xs pt-12 pb-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
                <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                    <div className="space-y-3 sm:col-span-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black p-1.5">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="font-extrabold text-white text-sm block">UIN SIBER SYEKH NURJATI CIREBON</span>
                                <span className="text-[10px] text-emerald-400 font-semibold">Portal Sistem Informasi Rekognisi Pembelajaran Lampau</span>
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                            Lembaga pendidikan tinggi Islam berbasis siber pertama di Indonesia yang menyelenggarakan program pengakuan kredit akademik (RPL) terakreditasi dan berstandar nasional.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Kontak Kampus</h4>
                        <div className="space-y-1.5 text-xs text-slate-400">
                            <p className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span>Jl. Perjuangan, Sunyaragi, Kec. Kesambi, Kota Cirebon, Jawa Barat 45132</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>(0231) 481264 / 081320741803</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>info@uinssc.ac.id / rpl@uinssc.ac.id</span>
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Tautan Cepat</h4>
                        <div className="space-y-1.5 text-xs">
                            <p><Link href="/login" className="hover:text-white transition-colors">Portal Masuk</Link></p>
                            <p><Link href="/register" className="hover:text-white transition-colors">Pendaftaran Asesi</Link></p>
                            <p><Link href="/panduan" className="hover:text-white transition-colors">Buku Panduan Sistem</Link></p>
                            <p><Link href="/verify/check" className="hover:text-white transition-colors">Verifikasi QR SK</Link></p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <p>&copy; 2026 UIN Siber Syekh Nurjati Cirebon (UIN SSC). All rights reserved.</p>
                    <p className="font-mono text-slate-500">SIRPL v2.0 &bull; Permendikbudristek No. 41 Tahun 2021</p>
                </div>
            </footer>
        </div>
    );
}
