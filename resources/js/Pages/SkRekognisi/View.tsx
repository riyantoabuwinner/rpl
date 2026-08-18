import React from 'react';
import { Link } from '@inertiajs/react';
import { Printer, ArrowLeft, ShieldCheck, QrCode, ExternalLink, GraduationCap } from 'lucide-react';
import { Button } from '@/Components/UI/Button';
import { Badge } from '@/Components/UI/Badge';

export default function SkRekognisiView({ sk }: { sk: any }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 print:p-0 print:bg-white selection:bg-blue-600 selection:text-white">
            {/* Top Bar for non-print view */}
            <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
                <Link href="/sk-rekognisi">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali ke Daftar SK
                    </Button>
                </Link>

                <div className="flex items-center gap-3">
                    <Button variant="primary" size="sm" onClick={handlePrint} className="bg-blue-600 shadow-md">
                        <Printer className="w-4 h-4 mr-1.5" /> Cetak / Unduh Dokumen (PDF)
                    </Button>
                </div>
            </div>

            {/* Official Letter Document Canvas */}
            <div className="max-w-4xl mx-auto bg-white p-12 shadow-2xl rounded-2xl print:shadow-none print:rounded-none print:p-8 border border-slate-200 text-slate-900 font-serif leading-relaxed">
                {/* Official University Letterhead */}
                <div className="border-b-2 border-slate-900 pb-4 mb-8 text-center space-y-1">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-extrabold text-2xl">
                            <GraduationCap className="w-9 h-9" />
                        </div>
                    </div>
                    <h2 className="font-extrabold text-xl tracking-wider uppercase font-sans">KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI</h2>
                    <h3 className="font-bold text-lg tracking-wide uppercase font-sans">UNIVERSITAS ISLAM NEGERI SIBER SYEKH NURJATI CIREBON</h3>
                    <p className="text-xs font-sans text-slate-600">
                        Jl. Perjuangan By Pass Sunyaragi, Kota Cirebon, Jawa Barat 45131 &bull; Website: www.uinssc.ac.id
                    </p>
                </div>

                {/* SK Title */}
                <div className="text-center space-y-2 mb-8">
                    <h4 className="font-bold text-base uppercase underline tracking-wide">
                        SURAT KEPUTUSAN WAKIL REKTOR BIDANG AKADEMIK
                    </h4>
                    <p className="font-sans text-xs font-mono font-semibold">
                        Nomor: {sk.nomor_sk}
                    </p>
                    <p className="font-sans text-xs uppercase tracking-wider font-bold text-slate-700">
                        TENTANG PENETAPAN PEROLEHAN DAN TRANSFER KREDIT REKOGNISI PEMBELAJARAN LAMPAU (RPL)
                    </p>
                </div>

                {/* Body Text */}
                <div className="font-sans text-xs space-y-4 text-justify">
                    <p>
                        Berdasarkan hasil evaluasi portofolio, verifikasi validitas dokumen VATC (Valid, Asli, Terkini, Cukup), serta Berita Acara Sidang Pleno Penetapan Kelulusan RPL sesuai Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Republik Indonesia Nomor 41 Tahun 2021, dengan ini menetapkan:
                    </p>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 my-4 space-y-1.5 font-mono text-xs">
                        <div className="grid grid-cols-3">
                            <span className="text-slate-500">Nama Lengkap</span>
                            <span className="col-span-2 font-bold text-slate-900">: {sk.mahasiswa.nama_lengkap}</span>
                        </div>
                        <div className="grid grid-cols-3">
                            <span className="text-slate-500">Nomor Registrasi RPL</span>
                            <span className="col-span-2 font-bold text-slate-900">: {sk.mahasiswa.nomor_pendaftaran}</span>
                        </div>
                        <div className="grid grid-cols-3">
                            <span className="text-slate-500">Program Studi Pilihan</span>
                            <span className="col-span-2 font-bold text-slate-900">: {sk.mahasiswa.prodi} ({sk.mahasiswa.jenjang})</span>
                        </div>
                        <div className="grid grid-cols-3">
                            <span className="text-slate-500">Jalur Rekognisi</span>
                            <span className="col-span-2 font-bold text-slate-900">: {sk.mahasiswa.jenis_rpl}</span>
                        </div>
                    </div>

                    <p>
                        Telah dinyatakan <strong>LULUS DAN BERHAK MEMPEROLEH PENYETARAAN SKS</strong> pada mata kuliah kurikulum sarjana sebagai berikut:
                    </p>

                    {/* Table Recognized Courses */}
                    <table className="w-full border-collapse border border-slate-300 text-xs font-sans mt-3">
                        <thead className="bg-slate-100 font-bold">
                            <tr>
                                <th className="border border-slate-300 px-3 py-2 text-center w-10">No</th>
                                <th className="border border-slate-300 px-3 py-2 text-center w-24">Kode MK</th>
                                <th className="border border-slate-300 px-3 py-2 text-left">Nama Mata Kuliah</th>
                                <th className="border border-slate-300 px-3 py-2 text-center w-16">Bobot SKS</th>
                                <th className="border border-slate-300 px-3 py-2 text-center w-16">Nilai Huruf</th>
                                <th className="border border-slate-300 px-3 py-2 text-center w-16">Bobot Angka</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sk.matkul_diakui.map((m: any, idx: number) => (
                                <tr key={m.kode_mk}>
                                    <td className="border border-slate-300 px-3 py-2 text-center">{idx + 1}</td>
                                    <td className="border border-slate-300 px-3 py-2 text-center font-mono font-bold">{m.kode_mk}</td>
                                    <td className="border border-slate-300 px-3 py-2 font-semibold">{m.nama_mk}</td>
                                    <td className="border border-slate-300 px-3 py-2 text-center font-bold">{m.sks}</td>
                                    <td className="border border-slate-300 px-3 py-2 text-center font-bold text-emerald-700">{m.nilai_huruf}</td>
                                    <td className="border border-slate-300 px-3 py-2 text-center font-mono">{Number(m.nilai_indeks).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-50 font-bold font-mono">
                            <tr>
                                <td colSpan={3} className="border border-slate-300 px-3 py-2 text-right">TOTAL SKS DIREKOGNISI & INDEKS PRESTASI:</td>
                                <td className="border border-slate-300 px-3 py-2 text-center font-extrabold text-blue-700">{sk.total_sks_diakui} SKS</td>
                                <td colSpan={2} className="border border-slate-300 px-3 py-2 text-center font-extrabold text-emerald-700">IPK: {sk.ipk_konversi}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Signatures & QR Section */}
                <div className="pt-10 flex items-end justify-between font-sans text-xs">
                    {/* QR Code Verification Box */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 max-w-xs">
                        <div className="w-16 h-16 bg-white border border-slate-300 rounded-lg flex items-center justify-center p-1">
                            <QrCode className="w-14 h-14 text-slate-900" />
                        </div>
                        <div className="space-y-0.5 text-[10px]">
                            <p className="font-bold text-slate-900 flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Dokumen Sah Elektronik
                            </p>
                            <p className="text-slate-500 leading-tight">Pindai QR untuk memverifikasi keaslian di portal SIRPL:</p>
                            <a
                                href={sk.qr_verify_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 font-mono font-bold block truncate hover:underline"
                            >
                                /verify/{sk.qr_token.substring(0, 13)}...
                            </a>
                        </div>
                    </div>

                    {/* Official Signature */}
                    <div className="text-center space-y-1">
                        <p>Ditetapkan di Cirebon</p>
                        <p className="font-medium">Pada tanggal {sk.tanggal_sk}</p>
                        <p className="font-bold mt-2">{sk.pejabat_jabatan},</p>
                        <div className="h-16 flex items-center justify-center">
                            <span className="text-[10px] text-slate-400 font-mono italic">[ Ditandatangani Secara Elektronik (TTE) ]</span>
                        </div>
                        <p className="font-bold underline text-sm">{sk.pejabat_nama}</p>
                        {sk.pejabat_nip && <p className="font-mono text-[10px] text-slate-600">NIP. {sk.pejabat_nip}</p>}
                    </div>
                </div>

                {/* Checksum Footer */}
                <div className="mt-8 pt-3 border-t border-slate-200 text-[9px] font-mono text-slate-400 flex justify-between">
                    <span>Dokumen Digital Resmi Sistem Rekognisi Pembelajaran Lampau (SIRPL)</span>
                    <span>SHA-256: {sk.document_hash}</span>
                </div>
            </div>
        </div>
    );
}
