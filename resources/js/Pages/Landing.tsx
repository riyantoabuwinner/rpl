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
} from 'lucide-react';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Card } from '@/Components/UI/Card';

export default function Landing({ activeGelombang }: { activeGelombang: any }) {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
            {/* Header / Navbar */}
            <header className="border-b border-slate-800/80 sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-extrabold text-white shadow-lg shadow-blue-900/30">
                            <GraduationCap className="w-7 h-7" />
                        </div>
                        <div>
                            <span className="font-bold text-lg text-white tracking-tight leading-none block">SIRPL Perguruan Tinggi</span>
                            <span className="text-xs text-slate-400 font-medium">Portal Rekognisi Pembelajaran Lampau</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                                Masuk ke Sistem
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button variant="primary" className="shadow-lg shadow-blue-900/40">
                                Daftar Sebagai Asesi <ArrowRight className="w-4 h-4 ml-1.5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-20 pb-28 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.25),rgba(255,255,255,0))]" />
                
                <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-300 text-xs font-semibold shadow-inner">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span>Sesuai Regulasi Permendikbudristek No. 41 Tahun 2021</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                        Raih Gelar Akademik Lebih Cepat Melalui{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
                            Rekognisi Pengalaman Nyata
                        </span>
                    </h1>

                    <p className="text-lg text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
                        Sistem Informasi Rekognisi Pembelajaran Lampau (SIRPL) mengonversi pengalaman kerja, pelatihan profesional, dan riwayat studi Anda menjadi SKS perkuliahan formal secara akuntabel, transparan, dan terintegrasi PDDikti.
                    </p>

                    {activeGelombang && (
                        <div className="inline-block p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-left shadow-xl backdrop-blur-xs">
                            <div className="flex flex-wrap items-center gap-4 text-xs">
                                <Badge variant="emerald" size="md">
                                    <Calendar className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                                    Gelombang Dibuka: {activeGelombang.nama}
                                </Badge>
                                <span className="text-slate-300">
                                    Periode: <strong>{activeGelombang.buka} s/d {activeGelombang.tutup}</strong>
                                </span>
                                <span className="text-slate-300">
                                    Kuota: <strong>{activeGelombang.kuota} Pendaftar</strong>
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <Link href="/register">
                            <Button size="lg" variant="primary" className="text-base px-8 py-3.5 shadow-xl shadow-blue-900/50">
                                Mulai Pendaftaran Form F-02
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="text-base px-8 py-3.5 bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white">
                                Login Akses Asesor & Pengelola
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3 Tracks of RPL */}
            <section className="py-20 px-6 bg-slate-950/60 border-t border-slate-800/80">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-3">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight">3 Jalur Utama Rekognisi RPL</h2>
                        <p className="text-slate-400 text-sm max-w-xl mx-auto">
                            Pilih jalur yang sesuai dengan kualifikasi pendidikan dan portofolio keahlian Anda.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* RPL A1 */}
                        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition-all group shadow-lg">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-lg mb-6 group-hover:scale-110 transition-transform">
                                A1
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">RPL Transfer Kredit</h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                Pengakuan hasil belajar formal yang diperoleh dari perguruan tinggi sebelumnya untuk mahasiswa pindahan atau lanjutan studi dari Diploma ke Sarjana.
                            </p>
                            <ul className="space-y-2 text-xs text-slate-300">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Transkrip nilai resmi PT asal</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Silabus & deskripsi mata kuliah</li>
                            </ul>
                        </div>

                        {/* RPL A2 */}
                        <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-950/50 to-slate-900 border border-blue-600/40 relative group shadow-xl">
                            <div className="absolute -top-3 right-6">
                                <Badge variant="blue" size="sm" className="bg-blue-600 text-white font-bold border-0">
                                    Paling Diminati
                                </Badge>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-bold text-lg mb-6 group-hover:scale-110 transition-transform">
                                A2
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">RPL Perolehan Kredit</h3>
                            <p className="text-sm text-slate-300 leading-relaxed mb-6">
                                Pengakuan capaian pembelajaran dari pendidikan nonformal, informal, serta pengalaman kerja bertahun-tahun untuk melanjutkan studi sarjana.
                            </p>
                            <ul className="space-y-2 text-xs text-slate-300">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sertifikat kompetensi BNSP / LSP</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Bukti karya, proyek & SK jabatan</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Evaluasi VATC & Uji Petik</li>
                            </ul>
                        </div>

                        {/* RPL B */}
                        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition-all group shadow-lg">
                            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-lg mb-6 group-hover:scale-110 transition-transform">
                                B
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Penyetaraan Kualifikasi</h3>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                Pengakuan kualifikasi capaian pembelajaran untuk kesetaraan jenjang Kerangka Kualifikasi Nasional Indonesia (KKNI) bagi dosen atau tenaga profesional.
                            </p>
                            <ul className="space-y-2 text-xs text-slate-300">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Portofolio keahlian tingkat tinggi</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Pemenuhan kualifikasi akademik</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workflow Pipeline */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-3">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight">Alur Proses Rekognisi End-to-End</h2>
                        <p className="text-slate-400 text-sm">Transparan, digital, dan tersertifikasi sejak pendaftaran hingga penetapan SK.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                        {[
                            { step: '01', title: 'Pendaftaran', desc: 'Isi profil & pilih jalur' },
                            { step: '02', title: 'Form F-02', desc: 'Klaim CPMK & upload bukti' },
                            { step: '03', title: 'Asesmen VATC', desc: 'Evaluasi asesor lembar F-03' },
                            { step: '04', title: 'Uji Petik', desc: 'Wawancara & tes praktik' },
                            { step: '05', title: 'Sidang Pleno', desc: 'Pengesahan Berita Acara' },
                            { step: '06', title: 'Penerbitan SK', desc: 'SK Rekognisi & SIAKAD sync' },
                        ].map((s) => (
                            <div key={s.step} className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex flex-col items-center">
                                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-800 mb-3">
                                    {s.step}
                                </span>
                                <h4 className="text-sm font-bold text-white mb-1">{s.title}</h4>
                                <p className="text-[11px] text-slate-400 leading-snug">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-10 px-6 text-center text-xs text-slate-500">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p>&copy; {new Date().getFullYear()} SIRPL Perguruan Tinggi. Terintegrasi SIAKAD & PDDikti Neofeeder.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/login" className="hover:text-slate-300">Login Evaluator</Link>
                        <Link href="/register" className="hover:text-slate-300">Pendaftaran Asesi</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
