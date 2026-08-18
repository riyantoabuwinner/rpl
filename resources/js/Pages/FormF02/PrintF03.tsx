import React from 'react';
import { Printer, ArrowLeft, Check, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/Components/UI/Button';
import { Link } from '@inertiajs/react';

export default function PrintF03({
    pendaftar,
    selectedCourse,
}: {
    pendaftar: any;
    selectedCourse?: any;
}) {
    const handlePrint = () => {
        window.print();
    };

    // Filter courses to display: either specific course or all courses with claims/evaluations
    const coursesToRender = selectedCourse
        ? [selectedCourse]
        : pendaftar.prodi?.kurikulum?.flatMap((k: any) => k.mata_kuliah) || [];

    // Map evaluation items by mata_kuliah_id
    const evalMap = new Map<string, any[]>();
    pendaftar.evaluasi_diri_cpmk?.forEach((item: any) => {
        const list = evalMap.get(item.mata_kuliah_id) || [];
        list.push(item);
        evalMap.set(item.mata_kuliah_id, list);
    });

    // Sample default CPMK items if none are seeded for this course
    const getDefaultCpmkItems = (courseName: string) => [
        {
            nomor_urut: 1,
            pernyataan_cpmk: `Mampu menganalisis domain, range, karakteristik, dan konsep fundamental ${courseName} secara mandiri dan sistematis.`,
            profisiensi: 'sangat_baik',
            is_valid: true,
            is_autentik: true,
            is_terkini: true,
            is_memadai: true,
            nomor_dokumen: 'Dok. 1',
            jenis_dokumen: 'Transkrip Akademik / Sertifikat Kompetensi',
        },
        {
            nomor_urut: 2,
            pernyataan_cpmk: `Mampu menentukan keputusan dan menerapkan metode penyelesaian masalah ${courseName} secara analitis maupun berbantuan perangkat lunak.`,
            profisiensi: 'sangat_baik',
            is_valid: true,
            is_autentik: true,
            is_terkini: true,
            is_memadai: true,
            nomor_dokumen: 'Dok. 2',
            jenis_dokumen: 'Logbook Praktik / Portofolio Proyek',
        },
        {
            nomor_urut: 3,
            pernyataan_cpmk: `Mampu mendemonstrasikan implementasi praktis dan studi kasus ${courseName} sesuai standar profesi dan etika keilmuan.`,
            profisiensi: 'baik',
            is_valid: true,
            is_autentik: true,
            is_terkini: true,
            is_memadai: true,
            nomor_dokumen: 'Dok. 3',
            jenis_dokumen: 'Surat Keterangan Kinerja / Surat Verifikasi',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 print:bg-white print:py-0 print:px-0 text-slate-900 font-serif">
            {/* Toolbar (Hidden during Print) */}
            <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between print:hidden font-sans">
                <Link href="/form-f02">
                    <Button variant="ghost" size="sm" className="bg-white border border-slate-300">
                        <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono">Formulir 3 / F03 &bull; Evaluasi Diri UIN SSC</span>
                    <Button variant="primary" size="sm" onClick={handlePrint} className="bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm">
                        <Printer className="w-4 h-4 mr-1.5" /> Cetak / Simpan ke PDF
                    </Button>
                </div>
            </div>

            {/* Document Container A4 */}
            <div className="max-w-5xl mx-auto bg-white p-10 sm:p-14 shadow-xl print:shadow-none border border-slate-300 print:border-0 rounded-none leading-relaxed text-xs sm:text-sm space-y-6">
                {/* Header Title */}
                <div className="text-center space-y-1 border-b-2 border-slate-900 pb-3">
                    <span className="text-xs font-sans font-bold text-slate-500 uppercase tracking-widest block">
                        Contoh Formulir Evaluasi Diri RPL Tipe A (Form 3/F03)
                    </span>
                    <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900">
                        UNIVERSITAS ISLAM NEGERI SIBER SYEKH NURJATI CIREBON
                    </h1>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                        {pendaftar.prodi?.nama_prodi || 'TADRIS MATEMATIKA'}
                    </h2>
                    <h3 className="text-sm font-extrabold uppercase tracking-tight text-emerald-900 pt-1">
                        FORMULIR EVALUASI DIRI CALON MAHASISWA REKOGNISI PEMBELAJARAN LAMPAU (RPL)
                    </h3>
                </div>

                {/* Identity Header */}
                <div className="space-y-1 font-sans text-xs sm:text-sm bg-slate-50 p-4 rounded border border-slate-200">
                    <div className="grid grid-cols-12 gap-1.5">
                        <span className="col-span-4 sm:col-span-3 font-semibold text-slate-700">NAMA PERGURUAN TINGGI</span>
                        <span className="col-span-8 sm:col-span-9 font-bold uppercase">: UIN SIBER SYEKH NURJATI CIREBON</span>
                    </div>
                    <div className="grid grid-cols-12 gap-1.5">
                        <span className="col-span-4 sm:col-span-3 font-semibold text-slate-700">PROGRAM STUDI</span>
                        <span className="col-span-8 sm:col-span-9 font-bold uppercase">: {pendaftar.prodi?.nama_prodi}</span>
                    </div>
                    <div className="grid grid-cols-12 gap-1.5">
                        <span className="col-span-4 sm:col-span-3 font-semibold text-slate-700">Nama Calon</span>
                        <span className="col-span-8 sm:col-span-9 font-bold uppercase">: {pendaftar.nama_lengkap}</span>
                    </div>
                    <div className="grid grid-cols-12 gap-1.5">
                        <span className="col-span-4 sm:col-span-3 font-semibold text-slate-700">Tempat/Tgl lahir</span>
                        <span className="col-span-8 sm:col-span-9 uppercase">
                            : {pendaftar.tempat_lahir} / {pendaftar.tanggal_lahir ? new Date(pendaftar.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase() : '-'}
                        </span>
                    </div>
                    <div className="grid grid-cols-12 gap-1.5">
                        <span className="col-span-4 sm:col-span-3 font-semibold text-slate-700">Alamat</span>
                        <span className="col-span-8 sm:col-span-9 uppercase">: {pendaftar.alamat_lengkap}</span>
                    </div>
                    <div className="grid grid-cols-12 gap-1.5">
                        <span className="col-span-4 sm:col-span-3 font-semibold text-slate-700">Nomor Telpon/HP</span>
                        <span className="col-span-8 sm:col-span-9 font-mono">: {pendaftar.telepon}</span>
                    </div>
                    <div className="grid grid-cols-12 gap-1.5">
                        <span className="col-span-4 sm:col-span-3 font-semibold text-slate-700">Alamat E Mail</span>
                        <span className="col-span-8 sm:col-span-9 font-mono">: {pendaftar.email}</span>
                    </div>
                </div>

                {/* Pengantar & Panduan Profisiensi */}
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed border-t border-slate-300 pt-3">
                    <h4 className="font-bold text-sm text-slate-900 uppercase">Pengantar</h4>
                    <p className="text-slate-800">
                        Tujuan pengisian Formulir Evaluasi Diri ini adalah agar calon dapat secara mandiri menilai tingkat profesiensi dari setiap kriteria unjuk kerja capaian pembelajaran mata kuliah atau modul pembelajaran dan menyampaikan bukti yang diperlukan untuk mendukung klaim tingkat profesiensinya.
                    </p>
                    <p className="text-slate-800 italic">
                        Isilah setiap kriteria unjuk kerja atau capaian pembelajaran pada halaman-halaman berikut sesuai dengan tingkat profesiensi yang saudara miliki. Saudara harus jujur dalam melakukan penilaian ini.
                    </p>

                    {/* Table of 3 Proficiency Levels */}
                    <table className="w-full border-collapse border border-slate-900 text-xs">
                        <thead>
                            <tr className="bg-slate-100 font-bold border border-slate-900">
                                <th className="border border-slate-900 py-1.5 px-3 w-40 text-left">Profisiensi / Kemampuan</th>
                                <th className="border border-slate-900 py-1.5 px-3 text-left">Uraian Kriteria</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-slate-900 py-2 px-3 font-bold align-top">Sangat baik</td>
                                <td className="border border-slate-900 py-2 px-3 space-y-0.5">
                                    <p>&bull; Saya melakukan tugas ini dengan sangat baik, atau</p>
                                    <p>&bull; Saya menguasai bahan kajian ini dengan sangat baik, atau</p>
                                    <p>&bull; Saya memiliki keterampilan ini, selalu digunakan dalam pekerjaan dengan tepat tanpa ada kesalahan.</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-slate-900 py-2 px-3 font-bold align-top">Baik</td>
                                <td className="border border-slate-900 py-2 px-3 space-y-0.5">
                                    <p>&bull; Saya melakukan tugas ini dengan baik, atau</p>
                                    <p>&bull; Saya menguasai bahan kajian ini dengan baik, atau</p>
                                    <p>&bull; Saya memiliki keterampilan ini, dan kadang-kadang digunakan dalam pekerjaan.</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-slate-900 py-2 px-3 font-bold align-top">Tidak pernah</td>
                                <td className="border border-slate-900 py-2 px-3 space-y-0.5">
                                    <p>&bull; Saya tidak pernah melakukan tugas ini, atau</p>
                                    <p>&bull; Saya tidak menguasai bahan kajian ini, atau</p>
                                    <p>&bull; Saya tidak memiliki keterampilan ini.</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Per-Course Evaluation Tables */}
                {coursesToRender.map((course: any) => {
                    const cpmkItems = evalMap.get(course.id) || getDefaultCpmkItems(course.nama_mk);

                    return (
                        <div key={course.id} className="space-y-3 pt-6 border-t-2 border-slate-400 page-break-inside-avoid">
                            <div className="bg-slate-100 p-2.5 rounded border border-slate-300">
                                <h4 className="font-bold text-sm text-slate-900">
                                    Formulir Evaluasi Diri Mata Kuliah: {course.nama_mk} ({course.kode_mk} &bull; {course.sks} SKS)
                                </h4>
                                <p className="text-[11px] text-slate-600">
                                    Pada kolom pertama diisi Pernyataan Kemampuan Akhir yang Diharapkan/Capaian Pembelajaran Mata Kuliah (CPMK).
                                </p>
                            </div>

                            {/* 5-Column Matrix Table */}
                            <table className="w-full border-collapse border border-slate-900 text-xs">
                                <thead>
                                    <tr className="bg-slate-100 text-center font-bold border border-slate-900">
                                        <th rowSpan={2} className="border border-slate-900 py-2 px-2 text-left w-2/5">
                                            Kemampuan Akhir Yang Diharapkan / Capaian Pembelajaran Mata Kuliah (1)
                                        </th>
                                        <th colSpan={3} className="border border-slate-900 py-1 px-1 w-28">
                                            Profisiensi Saat Ini* (2)
                                        </th>
                                        <th colSpan={4} className="border border-slate-900 py-1 px-1 w-24">
                                            Hasil Evaluasi Asesor (3)
                                        </th>
                                        <th colSpan={2} className="border border-slate-900 py-1 px-1">
                                            Bukti yang Disampaikan* (4 & 5)
                                        </th>
                                    </tr>
                                    <tr className="bg-slate-50 text-[10px] font-bold text-center border border-slate-900">
                                        <th className="border border-slate-900 py-1 px-1 w-9">Sangat Baik</th>
                                        <th className="border border-slate-900 py-1 px-1 w-9">Baik</th>
                                        <th className="border border-slate-900 py-1 px-1 w-10">Tidak Pernah</th>
                                        <th className="border border-slate-900 py-1 px-1 w-6">V</th>
                                        <th className="border border-slate-900 py-1 px-1 w-6">A</th>
                                        <th className="border border-slate-900 py-1 px-1 w-6">T</th>
                                        <th className="border border-slate-900 py-1 px-1 w-6">M</th>
                                        <th className="border border-slate-900 py-1 px-1 w-16">No. Dok</th>
                                        <th className="border border-slate-900 py-1 px-2 text-left">Jenis Dokumen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cpmkItems.map((item: any, idx: number) => {
                                        const isSangatBaik = item.profisiensi === 'sangat_baik';
                                        const isBaik = item.profisiensi === 'baik';
                                        const isTidakPernah = item.profisiensi === 'tidak_pernah';

                                        return (
                                            <tr key={idx} className="border border-slate-900">
                                                <td className="border border-slate-900 py-2 px-2.5 align-top leading-relaxed">
                                                    {idx + 1}. {item.pernyataan_cpmk}
                                                </td>
                                                <td className="border border-slate-900 py-2 px-1 text-center align-middle font-bold text-sm">
                                                    {isSangatBaik ? '✓' : ''}
                                                </td>
                                                <td className="border border-slate-900 py-2 px-1 text-center align-middle font-bold text-sm">
                                                    {isBaik ? '✓' : ''}
                                                </td>
                                                <td className="border border-slate-900 py-2 px-1 text-center align-middle font-bold text-sm">
                                                    {isTidakPernah ? '✓' : ''}
                                                </td>
                                                <td className="border border-slate-900 py-2 px-0.5 text-center align-middle text-[11px]">
                                                    {item.is_valid ? '✓' : ''}
                                                </td>
                                                <td className="border border-slate-900 py-2 px-0.5 text-center align-middle text-[11px]">
                                                    {item.is_autentik ? '✓' : ''}
                                                </td>
                                                <td className="border border-slate-900 py-2 px-0.5 text-center align-middle text-[11px]">
                                                    {item.is_terkini ? '✓' : ''}
                                                </td>
                                                <td className="border border-slate-900 py-2 px-0.5 text-center align-middle text-[11px]">
                                                    {item.is_memadai ? '✓' : ''}
                                                </td>
                                                <td className="border border-slate-900 py-2 px-1.5 text-center align-top font-mono text-[11px]">
                                                    {item.nomor_dokumen || `Dok. ${idx + 1}`}
                                                </td>
                                                <td className="border border-slate-900 py-2 px-2 align-top text-xs leading-tight">
                                                    {item.jenis_dokumen || 'Transkrip / Sertifikat Pelatihan'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <p className="text-[10px] text-slate-500 italic">
                                Keterangan: tanda * diisi oleh calon peserta RPL. Kolom V-A-T-M diisi oleh Asesor (V=Valid, A=Autentik, T=Terkini, M=Memadai/Cukup).
                            </p>
                        </div>
                    );
                })}

                {/* Pakta Integritas & Pernyataan Form 3/F03 */}
                <div className="space-y-3 pt-6 border-t-2 border-slate-400">
                    <p className="font-bold text-slate-900 leading-relaxed">
                        Saya telah membaca dan mengisi Formulir Evaluasi Diri ini untuk mengikuti asesmen RPL dan dengan ini saya menyatakan:
                    </p>
                    <ol className="list-decimal pl-5 space-y-1.5 text-slate-800 leading-relaxed">
                        <li>
                            Semua informasi yang saya tuliskan adalah sepenuhnya benar dan saya bertanggung-jawab atas seluruh data dalam formulir ini dan apabila di kemudian hari ternyata informasi yang saya sampaikan tersebut adalah tidak benar, maka saya bersedia menerima sanksi sesuai dengan ketentuan yang berlaku;
                        </li>
                        <li>
                            Saya memberikan izin kepada pihak pengelola program RPL, untuk melakukan pemeriksaan kebenaran informasi yang saya berikan dalam formulir evaluasi diri ini kepada seluruh pihak yang terkait dengan data akademik sebelumnya dan kepada perusahaan tempat saya bekerja sebelumnya dan atau saat ini saya bekerja; dan
                        </li>
                        <li>
                            Saya bersedia untuk mengikuti asesmen lanjutan untuk membuktikan kompetensi saya, sesuai waktu dan tempat/platform daring yang ditentukan oleh unit RPL.
                        </li>
                    </ol>

                    {/* Signature Block */}
                    <div className="pt-6 flex justify-end">
                        <div className="w-64 text-center space-y-1">
                            <p>
                                {pendaftar.tempat_lahir || 'Cirebon'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            <p className="font-semibold pb-14">Tanda tangan Calon peserta:</p>
                            <p className="font-bold underline uppercase font-serif">({pendaftar.nama_lengkap})</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
