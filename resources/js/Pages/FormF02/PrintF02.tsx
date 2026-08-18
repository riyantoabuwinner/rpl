import React from 'react';
import { Printer, ArrowLeft, CheckSquare, Square, ShieldCheck, Check } from 'lucide-react';
import { Button } from '@/Components/UI/Button';
import { Link } from '@inertiajs/react';

export default function PrintF02({ pendaftar }: { pendaftar: any }) {
    const handlePrint = () => {
        window.print();
    };

    const lastEducation = pendaftar.pendidikan?.[pendaftar.pendidikan.length - 1];
    const kurikulumCourses = pendaftar.prodi?.kurikulum?.flatMap((k: any) => k.mata_kuliah) || [];
    const klaimMap = new Map();
    pendaftar.klaim?.forEach((k: any) => {
        klaimMap.set(k.mata_kuliah_id, k);
    });

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 print:bg-white print:py-0 print:px-0 text-slate-900 font-serif">
            {/* Top Toolbar (Hidden during Print) */}
            <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden font-sans">
                <Link href="/form-f02">
                    <Button variant="ghost" size="sm" className="bg-white border border-slate-300">
                        <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali ke Form F-02
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono">Formulir 2 / F02 &bull; Dokumen Resmi UIN SSC</span>
                    <Button variant="primary" size="sm" onClick={handlePrint} className="bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm">
                        <Printer className="w-4 h-4 mr-1.5" /> Cetak / Simpan ke PDF
                    </Button>
                </div>
            </div>

            {/* Official Paper Document (A4 Container) */}
            <div className="max-w-4xl mx-auto bg-white p-10 sm:p-14 shadow-xl print:shadow-none border border-slate-300 print:border-0 rounded-none leading-relaxed text-sm space-y-8">
                {/* Header Title */}
                <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-4">
                    <span className="text-xs font-sans font-bold text-slate-500 uppercase tracking-widest block">
                        Contoh Formulir Aplikasi RPL Tipe A (Form 2/F02)
                    </span>
                    <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900">
                        UNIVERSITAS ISLAM NEGERI SIBER SYEKH NURJATI CIREBON
                    </h1>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                        {pendaftar.prodi?.nama_prodi || 'TADRIS MATEMATIKA'}
                    </h2>
                    <h3 className="text-sm font-extrabold uppercase tracking-tight text-emerald-900 pt-1">
                        FORMULIR APLIKASI REKOGNISI PEMBELAJARAN LAMPAU (RPL)
                    </h3>
                </div>

                {/* Identity Header Grid */}
                <div className="space-y-1 text-xs sm:text-sm font-sans">
                    <div className="grid grid-cols-12 gap-2">
                        <span className="col-span-4 sm:col-span-3 font-semibold text-slate-700">Program Studi</span>
                        <span className="col-span-8 sm:col-span-9 font-bold uppercase">: {pendaftar.prodi?.nama_prodi}</span>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                        <span className="col-span-4 sm:col-span-3 font-semibold text-slate-700">Jenjang</span>
                        <span className="col-span-8 sm:col-span-9 font-bold uppercase">: {pendaftar.prodi?.jenjang || 'S1'}</span>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                        <span className="col-span-4 sm:col-span-3 font-semibold text-slate-700">Nama Perguruan Tinggi</span>
                        <span className="col-span-8 sm:col-span-9 font-bold uppercase">: UIN SIBER SYEKH NURJATI CIREBON</span>
                    </div>
                </div>

                {/* Bagian 1: Rincian Data Calon Mahasiswa */}
                <div className="space-y-4">
                    <div className="border-b border-slate-400 pb-1">
                        <h4 className="font-bold text-sm sm:text-base text-slate-900">
                            Bagian 1: Rincian Data Calon Mahasiswa
                        </h4>
                        <p className="text-xs text-slate-600 italic">
                            Pada bagian ini, cantumkan data pribadi, data pendidikan formal serta data pekerjaan saudara pada saat ini.
                        </p>
                    </div>

                    {/* a. Data Pribadi */}
                    <div className="space-y-2">
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900">a. Data Pribadi</h5>
                        <div className="space-y-1.5 text-xs sm:text-sm pl-4">
                            <div className="grid grid-cols-12 gap-2">
                                <span className="col-span-4 sm:col-span-3 text-slate-700">Nama lengkap</span>
                                <span className="col-span-8 sm:col-span-9 font-bold uppercase">: {pendaftar.nama_lengkap}</span>
                            </div>
                            <div className="grid grid-cols-12 gap-2">
                                <span className="col-span-4 sm:col-span-3 text-slate-700">Tempat / tgl. lahir</span>
                                <span className="col-span-8 sm:col-span-9 uppercase">
                                    : {pendaftar.tempat_lahir} / {pendaftar.tanggal_lahir ? new Date(pendaftar.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase() : '-'}
                                </span>
                            </div>
                            <div className="grid grid-cols-12 gap-2">
                                <span className="col-span-4 sm:col-span-3 text-slate-700">Jenis kelamin</span>
                                <span className="col-span-8 sm:col-span-9">: {pendaftar.jenis_kelamin === 'L' ? 'Pria' : 'Wanita'}</span>
                            </div>
                            <div className="grid grid-cols-12 gap-2">
                                <span className="col-span-4 sm:col-span-3 text-slate-700">Status</span>
                                <span className="col-span-8 sm:col-span-9">: {pendaftar.status_pernikahan || 'Menikah'}</span>
                            </div>
                            <div className="grid grid-cols-12 gap-2">
                                <span className="col-span-4 sm:col-span-3 text-slate-700">Kebangsaan</span>
                                <span className="col-span-8 sm:col-span-9 uppercase">: {pendaftar.kebangsaan || 'INDONESIA'}</span>
                            </div>
                            <div className="grid grid-cols-12 gap-2">
                                <span className="col-span-4 sm:col-span-3 text-slate-700">Alamat rumah</span>
                                <span className="col-span-8 sm:col-span-9 uppercase">
                                    : {pendaftar.alamat_lengkap}
                                    {pendaftar.rt_rw ? ` RT/RW ${pendaftar.rt_rw}` : ''}
                                    {pendaftar.kecamatan ? ` KEC. ${pendaftar.kecamatan}` : ''}
                                    {pendaftar.kabupaten_kota ? `, ${pendaftar.kabupaten_kota}` : ''}
                                </span>
                            </div>
                            <div className="grid grid-cols-12 gap-2">
                                <span className="col-span-4 sm:col-span-3 text-slate-700">Kode pos</span>
                                <span className="col-span-8 sm:col-span-9">: {pendaftar.kode_pos || '42152'}</span>
                            </div>
                            <div className="grid grid-cols-12 gap-2">
                                <span className="col-span-4 sm:col-span-3 text-slate-700">No. Telepon/E-mail</span>
                                <div className="col-span-8 sm:col-span-9 space-y-0.5">
                                    <p>Rumah : {pendaftar.telepon_rumah || '____________________________________'}</p>
                                    <p>Kantor : {pendaftar.telepon_kantor || '____________________________________'}</p>
                                    <p>HP : {pendaftar.telepon}</p>
                                    <p>e-mail : {pendaftar.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* b. Data Pendidikan */}
                    <div className="space-y-2 pt-2">
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900">b. Data Pendidikan</h5>
                        <div className="space-y-1.5 text-xs sm:text-sm pl-4">
                            <div className="grid grid-cols-12 gap-2">
                                <span className="col-span-4 sm:col-span-3 text-slate-700">Pendidikan terakhir</span>
                                <span className="col-span-8 sm:col-span-9 font-semibold">: {lastEducation?.jenjang || 'SMA'}</span>
                            </div>
                            <div className="grid grid-cols-12 gap-2">
                                <span className="col-span-4 sm:col-span-3 text-slate-700">Nama Perguruan Tinggi/Sekolah</span>
                                <span className="col-span-8 sm:col-span-9 uppercase font-bold">: {lastEducation?.nama_institusi || 'SMAN 2 CIREBON'}</span>
                            </div>
                            <div className="grid grid-cols-12 gap-2">
                                <span className="col-span-4 sm:col-span-3 text-slate-700">Program Studi</span>
                                <span className="col-span-8 sm:col-span-9">: {lastEducation?.jurusan || '….'}</span>
                            </div>
                            <div className="grid grid-cols-12 gap-2">
                                <span className="col-span-4 sm:col-span-3 text-slate-700">Tahun lulus</span>
                                <span className="col-span-8 sm:col-span-9">: {lastEducation?.tahun_lulus || '1992'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bagian 2: Daftar Mata Kuliah */}
                <div className="space-y-4 pt-4 border-t border-slate-300">
                    <div className="border-b border-slate-400 pb-1">
                        <h4 className="font-bold text-sm sm:text-base text-slate-900">
                            Bagian 2: Daftar Mata Kuliah
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Pada bagian 2 ini, cantumkan Daftar Mata Kuliah pada Program Studi yang saudara ajukan untuk memperoleh pengakuan berdasarkan kompetensi yang sudah saudara peroleh dari pendidikan formal sebelumnya (melalui <strong>Transfer sks</strong>), dan dari pendidikan nonformal, informal atau pengalaman kerja (melalui asesmen untuk <strong>Perolehan sks</strong>), dengan cara memberi tanda pada pilihan Ya atau Tidak.
                        </p>
                    </div>

                    <p className="text-xs font-semibold text-slate-800">
                        Daftar Mata Kuliah Program Studi : {pendaftar.prodi?.nama_prodi}
                    </p>

                    {/* Courses Table */}
                    <table className="w-full border-collapse border border-slate-900 text-xs sm:text-sm">
                        <thead>
                            <tr className="bg-slate-100 border border-slate-900 text-center font-bold">
                                <th className="border border-slate-900 py-2 px-2 w-10">No</th>
                                <th className="border border-slate-900 py-2 px-3 w-28">Kode Mata Kuliah</th>
                                <th className="border border-slate-900 py-2 px-3 text-left">Nama Mata Kuliah</th>
                                <th className="border border-slate-900 py-2 px-2 w-12">sks</th>
                                <th className="border border-slate-900 py-2 px-3 w-36">Mengajukan RPL</th>
                                <th className="border border-slate-900 py-2 px-3 w-36">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kurikulumCourses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="border border-slate-900 py-4 text-center text-slate-500">
                                        Mata kuliah kurikulum belum terdaftar.
                                    </td>
                                </tr>
                            ) : (
                                kurikulumCourses.map((mk: any, index: number) => {
                                    const klaim = klaimMap.get(mk.id);
                                    const isClaimed = !!klaim;
                                    const isTransfer = klaim?.jenis_pengajuan === 'transfer_sks';

                                    return (
                                        <tr key={mk.id} className="border border-slate-900">
                                            <td className="border border-slate-900 py-1.5 px-2 text-center">{index + 1}</td>
                                            <td className="border border-slate-900 py-1.5 px-3 font-mono font-bold text-center">{mk.kode_mk}</td>
                                            <td className="border border-slate-900 py-1.5 px-3 font-semibold">{mk.nama_mk}</td>
                                            <td className="border border-slate-900 py-1.5 px-2 text-center">{mk.sks}</td>
                                            <td className="border border-slate-900 py-1.5 px-3 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <span className="inline-flex items-center gap-1">
                                                        {isClaimed ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />} Ya
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        {!isClaimed ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />} Tidak
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="border border-slate-900 py-1.5 px-3 text-center text-xs">
                                                {isClaimed ? (isTransfer ? 'Transfer' : 'Perolehan SKS') : '-'}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>

                    {/* Legal Declaration / Pakta Integritas */}
                    <div className="space-y-2 text-xs sm:text-sm leading-relaxed pt-3">
                        <p className="font-semibold">
                            Bersama ini saya mengajukan permohonan untuk dapat mengikuti Rekognisi Pembelajaran Lampau (RPL) dan dengan ini saya menyatakan bahwa:
                        </p>
                        <ol className="list-decimal list-outside pl-5 space-y-1.5 text-slate-800">
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

                    {/* Signature Block */}
                    <div className="pt-6 flex justify-end">
                        <div className="w-64 text-center space-y-1 text-xs sm:text-sm">
                            <p>
                                {pendaftar.tempat_lahir || 'Cirebon'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            <p className="font-semibold pb-14">Tanda tangan Pemohon:</p>
                            <p className="font-bold underline uppercase font-serif">({pendaftar.nama_lengkap})</p>
                        </div>
                    </div>

                    {/* Checklist of Attachments */}
                    <div className="pt-4 border-t border-slate-300 space-y-2 text-xs sm:text-sm">
                        <span className="font-bold block">Lampiran yang disertakan:</span>
                        <div className="space-y-1 pl-2">
                            <div className="flex items-center gap-2">
                                <CheckSquare className="w-4 h-4 text-slate-800" />
                                <span>1. Formulir Evaluasi Diri sesuai dengan Daftar Mata Kuliah yang diajukan untuk RPL disertai dengan bukti pendukung pemenuhan Capaian Pembelajarannya.</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckSquare className="w-4 h-4 text-slate-800" />
                                <span>2. Daftar Riwayat Hidup (lihat Form 7/F07)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckSquare className="w-4 h-4 text-slate-800" />
                                <span>3. Ijazah dan Transkrip Nilai</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Square className="w-4 h-4 text-slate-400" />
                                <span>4. lainnya/sebutkan...................................</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
