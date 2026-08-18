import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import {
    Users,
    FileText,
    Clock,
    UserCheck,
    CheckCircle2,
    XCircle,
    Search,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    Award,
    BookOpen,
    ClipboardCheck,
    Video,
    FileCheck,
    BarChart3,
    Sparkles,
} from 'lucide-react';
import { Badge } from '@/Components/UI/Badge';

export function UinSscDashboardView() {
    // State for interactive left selector
    const [selectedProdi, setSelectedProdi] = useState('bki');
    const [jenisRpl, setJenisRpl] = useState('perolehan');
    const [searchCourse, setSearchCourse] = useState('');
    const [selectedCourses, setSelectedCourses] = useState<string[]>(['BKI101', 'BKI102', 'BKI103']);

    const coursesData = [
        { kode: 'BKI101', nama: 'Pengantar Bimbingan dan Konseling Islam', sks: 3 },
        { kode: 'BKI102', nama: 'Teori dan Teknik Konseling Islam', sks: 3 },
        { kode: 'BKI103', nama: 'Asesmen dalam Bimbingan dan Konseling', sks: 3 },
        { kode: 'BKI104', nama: 'Bimbingan Pribadi Sosial', sks: 3 },
        { kode: 'BKI105', nama: 'Bimbingan Belajar', sks: 3 },
        { kode: 'BKI106', nama: 'Konseling Kelompok', sks: 3 },
        { kode: 'BKI107', nama: 'Etika Profesi Bimbingan dan Konseling', sks: 2 },
    ];

    const filteredCourses = useMemo(() => {
        return coursesData.filter(
            (c) =>
                c.nama.toLowerCase().includes(searchCourse.toLowerCase()) ||
                c.kode.toLowerCase().includes(searchCourse.toLowerCase())
        );
    }, [searchCourse]);

    const totalSksSelected = useMemo(() => {
        return coursesData
            .filter((c) => selectedCourses.includes(c.kode))
            .reduce((sum, c) => sum + c.sks, 0);
    }, [selectedCourses]);

    const toggleCourse = (kode: string) => {
        if (selectedCourses.includes(kode)) {
            setSelectedCourses(selectedCourses.filter((k) => k !== kode));
        } else {
            setSelectedCourses([...selectedCourses, kode]);
        }
    };

    return (
        <div className="space-y-5">
            {/* 1. TOP 6 HORIZONTAL KPI METRIC CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {/* Total Pendaftar */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600">Total Pendaftar</span>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-extrabold text-slate-900">128</span>
                            <span className="text-xs text-slate-500 font-medium">Orang</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-0.5">
                            <TrendingUp className="w-3 h-3" />
                            <span>18% dari bulan lalu</span>
                        </div>
                    </div>
                </div>

                {/* Portofolio Masuk */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                            <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600">Portofolio Masuk</span>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-extrabold text-slate-900">97</span>
                            <span className="text-xs text-slate-500 font-medium">Berkas</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 mt-0.5">
                            <TrendingUp className="w-3 h-3" />
                            <span>15% dari bulan lalu</span>
                        </div>
                    </div>
                </div>

                {/* Menunggu Penilaian */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600">Menunggu Penilaian</span>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-extrabold text-slate-900">26</span>
                            <span className="text-xs text-slate-500 font-medium">Berkas</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 mt-0.5">
                            <TrendingDown className="w-3 h-3" />
                            <span>5% dari bulan lalu</span>
                        </div>
                    </div>
                </div>

                {/* Dalam Asesmen Lanjutan */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                            <UserCheck className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 truncate">Dalam Asesmen Lanjutan</span>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-extrabold text-slate-900">12</span>
                            <span className="text-xs text-slate-500 font-medium">Peserta</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-purple-600 mt-0.5">
                            <TrendingDown className="w-3 h-3" />
                            <span>2% dari bulan lalu</span>
                        </div>
                    </div>
                </div>

                {/* Direkognisi (Penuh/Sebagian) */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 truncate">Direkognisi (Penuh/Sebagian)</span>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-extrabold text-slate-900">52</span>
                            <span className="text-xs text-slate-500 font-medium">Peserta</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-0.5">
                            <TrendingUp className="w-3 h-3" />
                            <span>12% dari bulan lalu</span>
                        </div>
                    </div>
                </div>

                {/* Tidak Direkognisi */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-red-100 text-red-800 flex items-center justify-center">
                            <XCircle className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600">Tidak Direkognisi</span>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-extrabold text-slate-900">8</span>
                            <span className="text-xs text-slate-500 font-medium">Peserta</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 mt-0.5">
                            <TrendingDown className="w-3 h-3" />
                            <span>1% dari bulan lalu</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MAIN 3-COLUMN DASHBOARD GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* LEFT COLUMN: PILIH PRODI & MATA KULIAH (Col-span 4) */}
                <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                        <h3 className="font-extrabold text-xs tracking-tight text-slate-900 uppercase">
                            PILIH PRODI & MATA KULIAH YANG AKAN DIREKOGNISI
                        </h3>

                        {/* 1. Pilih Program Studi */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700">1. Pilih Program Studi</label>
                            <select
                                value={selectedProdi}
                                onChange={(e) => setSelectedProdi(e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="bki">Bimbingan dan Konseling Islam (BKI)</option>
                                <option value="ti">Teknik Informatika (TI)</option>
                                <option value="si">Sistem Informasi (SI)</option>
                                <option value="pai">Pendidikan Agama Islam (PAI)</option>
                            </select>
                        </div>

                        {/* 2. Pilih Jenis RPL */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700">2. Pilih Jenis RPL</label>
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="jenis_rpl"
                                        value="transfer"
                                        checked={jenisRpl === 'transfer'}
                                        onChange={() => setJenisRpl('transfer')}
                                        className="text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span>RPL Transfer Kredit</span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="jenis_rpl"
                                        value="perolehan"
                                        checked={jenisRpl === 'perolehan'}
                                        onChange={() => setJenisRpl('perolehan')}
                                        className="text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span>RPL Perolehan Kredit</span>
                                </label>
                            </div>
                        </div>

                        {/* 3. Pilih Mata Kuliah */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-700">
                                3. Pilih Mata Kuliah <span className="font-normal text-slate-500">(dapat memilih lebih dari satu)</span>
                            </label>

                            {/* Search box */}
                            <div className="relative">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                                <input
                                    type="text"
                                    placeholder="Cari mata kuliah..."
                                    value={searchCourse}
                                    onChange={(e) => setSearchCourse(e.target.value)}
                                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Table */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-[10px] text-slate-600 font-bold border-b border-slate-200">
                                        <tr>
                                            <th className="py-2 px-2.5 w-8 text-center"></th>
                                            <th className="py-2 px-2 w-16">Kode MK</th>
                                            <th className="py-2 px-2">Nama Mata Kuliah</th>
                                            <th className="py-2 px-2.5 text-right w-12">SKS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredCourses.map((c) => {
                                            const isChecked = selectedCourses.includes(c.kode);
                                            return (
                                                <tr
                                                    key={c.kode}
                                                    onClick={() => toggleCourse(c.kode)}
                                                    className={`cursor-pointer hover:bg-emerald-50/50 transition-colors ${
                                                        isChecked ? 'bg-emerald-50/70 font-semibold' : ''
                                                    }`}
                                                >
                                                    <td className="py-2 px-2.5 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => {}}
                                                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 pointer-events-none"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-2 font-mono text-[11px] text-slate-600">{c.kode}</td>
                                                    <td className="py-2 px-2 text-slate-800 text-[11px] leading-tight">{c.nama}</td>
                                                    <td className="py-2 px-2.5 text-right text-slate-600 font-bold">{c.sks}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Bottom SKS Pill */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Total SKS Dipilih</span>
                        <Badge variant="emerald" size="md" className="bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold px-3 py-1">
                            {totalSksSelected} SKS
                        </Badge>
                    </div>
                </div>

                {/* MIDDLE COLUMN (Col-span 4): STATUS DONUT & DAFTAR PENDAFTAR */}
                <div className="lg:col-span-4 space-y-5">
                    {/* Status Proses Penilaian Portofolio (Donut Chart) */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                        <h3 className="font-extrabold text-xs tracking-tight text-slate-900 uppercase">
                            STATUS PROSES PENILAIAN PORTOFOLIO
                        </h3>

                        <div className="flex items-center gap-4">
                            {/* SVG Donut Chart */}
                            <div className="relative w-32 h-32 shrink-0">
                                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                    {/* Slices calculated for 128 total: Blue 97 (75.8%), Amber 26, Purple 12, Green 52, Red 8 */}
                                    <circle cx="18" cy="18" r="14" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" strokeDasharray="40 100" strokeDashoffset="0" />
                                    <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray="20 100" strokeDashoffset="-40" />
                                    <circle cx="18" cy="18" r="14" fill="transparent" stroke="#8b5cf6" strokeWidth="4.5" strokeDasharray="15 100" strokeDashoffset="-60" />
                                    <circle cx="18" cy="18" r="14" fill="transparent" stroke="#10b981" strokeWidth="4.5" strokeDasharray="18 100" strokeDashoffset="-75" />
                                    <circle cx="18" cy="18" r="14" fill="transparent" stroke="#ef4444" strokeWidth="4.5" strokeDasharray="7 100" strokeDashoffset="-93" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-base font-black text-slate-900 leading-none">128</span>
                                    <span className="text-[9px] text-slate-500 font-semibold uppercase">Total</span>
                                </div>
                            </div>

                            {/* Legend with exact % */}
                            <div className="space-y-1.5 text-[10px] font-semibold text-slate-700 flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 truncate">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                        Portofolio Masuk
                                    </span>
                                    <span className="font-bold">97 (75.78%)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 truncate">
                                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                                        Menunggu Penilaian
                                    </span>
                                    <span className="font-bold">26 (20.31%)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 truncate">
                                        <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                                        Asesmen Lanjutan
                                    </span>
                                    <span className="font-bold">12 (9.38%)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 truncate">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                        Selesai / Keputusan
                                    </span>
                                    <span className="font-bold">52 (40.63%)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 truncate">
                                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                                        Tidak Direkognisi
                                    </span>
                                    <span className="font-bold">8 (6.25%)</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center pt-2 border-t border-slate-100">
                            <Link href="/admin/pendaftar" className="text-xs font-bold text-blue-600 hover:underline">
                                Lihat Detail
                            </Link>
                        </div>
                    </div>

                    {/* Daftar Pendaftar Terbaru */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-extrabold text-xs tracking-tight text-slate-900 uppercase">
                                DAFTAR PENDAFTAR TERBARU
                            </h3>
                            <Link href="/admin/pendaftar" className="text-[11px] font-bold text-blue-600 hover:underline">
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {/* 1. Nadia Rahmawati */}
                            <div className="py-2.5 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                                        NR
                                    </div>
                                    <div className="min-w-0">
                                        <h5 className="font-bold text-xs text-slate-900 truncate">Nadia Rahmawati</h5>
                                        <p className="text-[10px] text-slate-500 truncate">RPL Perolehan Kredit &bull; Guru BK SMA / 6 Tahun</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <Badge variant="amber" size="sm" className="text-[9px] px-1.5 py-0.5">Menunggu Penilaian</Badge>
                                    <span className="block text-[9px] text-slate-400 mt-0.5">Verifikasi Admin</span>
                                </div>
                            </div>

                            {/* 2. Muhammad Rizky */}
                            <div className="py-2.5 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                                        MR
                                    </div>
                                    <div className="min-w-0">
                                        <h5 className="font-bold text-xs text-slate-900 truncate">Muhammad Rizky</h5>
                                        <p className="text-[10px] text-slate-500 truncate">RPL Transfer Kredit &bull; UIN Sunan Gunung Djati</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <Badge variant="blue" size="sm" className="text-[9px] px-1.5 py-0.5">Portofolio Masuk</Badge>
                                    <span className="block text-[9px] text-slate-400 mt-0.5">Verifikasi Admin</span>
                                </div>
                            </div>

                            {/* 3. Siti Aisyah */}
                            <div className="py-2.5 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                                        SA
                                    </div>
                                    <div className="min-w-0">
                                        <h5 className="font-bold text-xs text-slate-900 truncate">Siti Aisyah</h5>
                                        <p className="text-[10px] text-slate-500 truncate">RPL Perolehan Kredit &bull; Konselor Pesantren / 4 Tahun</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <Badge variant="purple" size="sm" className="text-[9px] px-1.5 py-0.5">Dalam Asesmen</Badge>
                                    <span className="block text-[9px] text-slate-400 mt-0.5">Asesmen Lanjutan</span>
                                </div>
                            </div>

                            {/* 4. Ahmad Farhan */}
                            <div className="py-2.5 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded-full bg-amber-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                                        AF
                                    </div>
                                    <div className="min-w-0">
                                        <h5 className="font-bold text-xs text-slate-900 truncate">Ahmad Farhan</h5>
                                        <p className="text-[10px] text-slate-500 truncate">RPL Transfer Kredit &bull; IAIN Pekalongan</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <Badge variant="emerald" size="sm" className="text-[9px] px-1.5 py-0.5">Selesai (Sebagian)</Badge>
                                    <span className="block text-[9px] text-slate-400 mt-0.5">Selesai</span>
                                </div>
                            </div>

                            {/* 5. Yuni Nurhaliza */}
                            <div className="py-2.5 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded-full bg-slate-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                                        YN
                                    </div>
                                    <div className="min-w-0">
                                        <h5 className="font-bold text-xs text-slate-900 truncate">Yuni Nurhaliza</h5>
                                        <p className="text-[10px] text-slate-500 truncate">RPL Perolehan Kredit &bull; Pendamping PKH / 5 Tahun</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <Badge variant="red" size="sm" className="text-[9px] px-1.5 py-0.5">Tidak Direkognisi</Badge>
                                    <span className="block text-[9px] text-slate-400 mt-0.5">Selesai</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center pt-2 border-t border-slate-100">
                            <Link href="/admin/pendaftar" className="text-xs font-bold text-blue-600 hover:underline">
                                Lihat Semua
                            </Link>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN (Col-span 4): TREND CHART & REKAP SKS */}
                <div className="lg:col-span-4 space-y-5">
                    {/* Trend Pendaftar & Keputusan (6 Bulan Terakhir) */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-extrabold text-xs tracking-tight text-slate-900 uppercase">
                                TREND PENDAFTAR & KEPUTUSAN (6 BULAN TERAKHIR)
                            </h3>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-center gap-6 text-[11px] font-semibold text-slate-600">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-0.5 bg-emerald-600 rounded-full" />
                                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                                Pendaftar
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-0.5 bg-blue-600 rounded-full" />
                                <span className="w-2 h-2 rounded-full bg-blue-600" />
                                Direkognisi
                            </span>
                        </div>

                        {/* SVG Line Chart */}
                        <div className="h-36 w-full pt-2">
                            <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
                                {/* Grid Lines */}
                                <line x1="20" y1="20" x2="290" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="20" y1="50" x2="290" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="20" y1="80" x2="290" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                                <line x1="20" y1="110" x2="290" y2="110" stroke="#e2e8f0" strokeWidth="1" />

                                {/* Green Line (Pendaftar) */}
                                <polyline
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="2"
                                    points="30,85 80,75 130,65 180,50 230,40 280,30"
                                />
                                {[
                                    [30, 85],
                                    [80, 75],
                                    [130, 65],
                                    [180, 50],
                                    [230, 40],
                                    [280, 30],
                                ].map(([cx, cy], i) => (
                                    <circle key={i} cx={cx} cy={cy} r="3.5" fill="#10b981" />
                                ))}

                                {/* Blue Line (Direkognisi) */}
                                <polyline
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                    points="30,105 80,98 130,90 180,82 230,70 280,58"
                                />
                                {[
                                    [30, 105],
                                    [80, 98],
                                    [130, 90],
                                    [180, 82],
                                    [230, 70],
                                    [280, 58],
                                ].map(([cx, cy], i) => (
                                    <circle key={i} cx={cx} cy={cy} r="3.5" fill="#3b82f6" />
                                ))}

                                {/* X-Axis Labels */}
                                <text x="20" y="125" fontSize="8" fill="#94a3b8">Des 2024</text>
                                <text x="70" y="125" fontSize="8" fill="#94a3b8">Jan 2025</text>
                                <text x="120" y="125" fontSize="8" fill="#94a3b8">Feb 2025</text>
                                <text x="170" y="125" fontSize="8" fill="#94a3b8">Mar 2025</text>
                                <text x="220" y="125" fontSize="8" fill="#94a3b8">Apr 2025</text>
                                <text x="270" y="125" fontSize="8" fill="#94a3b8">Mei 2025</text>
                            </svg>
                        </div>

                        <div className="text-center pt-2 border-t border-slate-100">
                            <Link href="/master-data" className="text-xs font-bold text-blue-600 hover:underline">
                                Lihat Detail
                            </Link>
                        </div>
                    </div>

                    {/* Rekap Rekognisi Mata Kuliah & SKS */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-extrabold text-xs tracking-tight text-slate-900 uppercase">
                                REKAP REKOGNISI MATA KULIAH & SKS
                            </h3>
                            <select className="text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                                <option>Bulan Ini</option>
                                <option>Tahun Akademik 2025/2026</option>
                            </select>
                        </div>

                        {/* 3 mini cards */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-center">
                                <span className="text-[9px] font-bold text-emerald-800 uppercase block">Direkognisi Penuh</span>
                                <div className="mt-1">
                                    <strong className="text-sm text-emerald-900 font-black">28</strong>
                                    <span className="text-[10px] text-emerald-700 font-medium"> Peserta</span>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-700 block">78 SKS</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-center">
                                <span className="text-[9px] font-bold text-amber-800 uppercase block truncate">Direkognisi Sebagian</span>
                                <div className="mt-1">
                                    <strong className="text-sm text-amber-900 font-black">24</strong>
                                    <span className="text-[10px] text-amber-700 font-medium"> Peserta</span>
                                </div>
                                <span className="text-[10px] font-bold text-amber-700 block">56 SKS</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-center">
                                <span className="text-[9px] font-bold text-blue-800 uppercase block">Total SKS Diakui</span>
                                <div className="mt-1 flex items-center justify-center gap-1">
                                    <strong className="text-sm text-blue-900 font-black">134</strong>
                                    <span className="text-[10px] text-blue-700 font-bold">SKS</span>
                                </div>
                                <BookOpen className="w-3.5 h-3.5 text-blue-600 mx-auto mt-0.5" />
                            </div>
                        </div>

                        {/* Top 5 Recognized Courses */}
                        <div className="space-y-2 pt-1">
                            <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                                MATA KULIAH PALING BANYAK DIREKOGNISI
                            </h4>
                            <div className="space-y-1.5 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-800 font-medium truncate">1. <strong className="font-mono text-blue-600">BKI103</strong> Asesmen dalam Bimbingan</span>
                                    <strong className="text-slate-900 font-bold text-right ml-2 shrink-0">32 SKS</strong>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-800 font-medium truncate">2. <strong className="font-mono text-blue-600">BKI104</strong> Bimbingan Pribadi Sosial</span>
                                    <strong className="text-slate-900 font-bold text-right ml-2 shrink-0">28 SKS</strong>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-800 font-medium truncate">3. <strong className="font-mono text-blue-600">BKI105</strong> Bimbingan Belajar</span>
                                    <strong className="text-slate-900 font-bold text-right ml-2 shrink-0">24 SKS</strong>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-800 font-medium truncate">4. <strong className="font-mono text-blue-600">BKI102</strong> Teori dan Teknik Konseling</span>
                                    <strong className="text-slate-900 font-bold text-right ml-2 shrink-0">21 SKS</strong>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-800 font-medium truncate">5. <strong className="font-mono text-blue-600">BKI106</strong> Konseling Kelompok</span>
                                    <strong className="text-slate-900 font-bold text-right ml-2 shrink-0">18 SKS</strong>
                                </div>
                            </div>
                        </div>

                        <div className="text-center pt-2 border-t border-slate-100">
                            <Link href="/sk-rekognisi" className="text-xs font-bold text-blue-600 hover:underline">
                                Lihat Detail
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. BOTTOM ROW: AKSI CEPAT & NOTIFIKASI TERBARU */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* AKSI CEPAT (Col-span 7) */}
                <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
                    <h3 className="font-extrabold text-xs tracking-tight text-slate-900 uppercase">
                        AKSI CEPAT
                    </h3>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                        {/* 1. Verifikasi Portofolio */}
                        <Link
                            href="/admin/pendaftar"
                            className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-center transition-all flex flex-col items-center gap-2 group shadow-2xs"
                        >
                            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                                <ClipboardCheck className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-extrabold text-emerald-950 leading-tight">Verifikasi Portofolio</span>
                        </Link>

                        {/* 2. Penilaian Portofolio */}
                        <Link
                            href="/asesor/penilaian"
                            className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-center transition-all flex flex-col items-center gap-2 group shadow-2xs"
                        >
                            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                                <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-extrabold text-blue-950 leading-tight">Penilaian Portofolio</span>
                        </Link>

                        {/* 3. Asesmen Lanjutan */}
                        <Link
                            href="/uji-petik"
                            className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-center transition-all flex flex-col items-center gap-2 group shadow-2xs"
                        >
                            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                                <Video className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-extrabold text-purple-950 leading-tight">Asesmen Lanjutan</span>
                        </Link>

                        {/* 4. Rekognisi MK & SKS */}
                        <Link
                            href="/sk-rekognisi"
                            className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-center transition-all flex flex-col items-center gap-2 group shadow-2xs"
                        >
                            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                                <Award className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-extrabold text-amber-950 leading-tight">Rekognisi MK & SKS</span>
                        </Link>

                        {/* 5. Berita Acara / Pleno */}
                        <Link
                            href="/pleno"
                            className="p-3 rounded-2xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-center transition-all flex flex-col items-center gap-2 group shadow-2xs"
                        >
                            <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                                <FileCheck className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-extrabold text-cyan-950 leading-tight">Berita Acara / Pleno</span>
                        </Link>

                        {/* 6. Laporan & Rekap */}
                        <Link
                            href="/master-data"
                            className="p-3 rounded-2xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-center transition-all flex flex-col items-center gap-2 group shadow-2xs"
                        >
                            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-extrabold text-teal-950 leading-tight">Laporan & Rekap</span>
                        </Link>
                    </div>
                </div>

                {/* NOTIFIKASI TERBARU (Col-span 5) */}
                <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-xs tracking-tight text-slate-900 uppercase">
                            NOTIFIKASI TERBARU
                        </h3>
                        <Link href="/sanggah" className="text-[11px] font-bold text-blue-600 hover:underline">
                            Lihat Semua
                        </Link>
                    </div>

                    <div className="space-y-2.5 text-xs">
                        <div className="flex items-start justify-between gap-3 p-2 rounded-xl hover:bg-slate-50">
                            <div className="flex items-start gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                <p className="text-slate-700 leading-tight font-medium">
                                    Portofolio baru dari <strong className="text-slate-900">Nadia Rahmawati</strong>
                                </p>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0 font-medium">5 menit yang lalu</span>
                        </div>

                        <div className="flex items-start justify-between gap-3 p-2 rounded-xl hover:bg-slate-50">
                            <div className="flex items-start gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                <p className="text-slate-700 leading-tight font-medium">
                                    Asesmen lanjutan dijadwalkan untuk <strong className="text-slate-900">Siti Aisyah</strong>
                                </p>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0 font-medium">1 jam yang lalu</span>
                        </div>

                        <div className="flex items-start justify-between gap-3 p-2 rounded-xl hover:bg-slate-50">
                            <div className="flex items-start gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                <p className="text-slate-700 leading-tight font-medium">
                                    Keputusan pleno telah ditetapkan untuk <strong className="text-slate-900">7 peserta</strong>
                                </p>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0 font-medium">3 jam yang lalu</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
