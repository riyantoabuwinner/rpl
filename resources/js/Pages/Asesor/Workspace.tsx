import React, { useState } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import {
    FileText,
    CheckCircle2,
    Clock,
    AlertTriangle,
    ShieldCheck,
    Award,
    ChevronDown,
    ChevronUp,
    Send,
    Save,
    RotateCw,
    User,
    GraduationCap,
    Briefcase,
    Video,
    Sparkles,
    CheckSquare,
    Square,
    Printer,
} from 'lucide-react';
import { AppLayout } from '@/Components/Layout/AppLayout';
import { PdfImageViewer, DocumentItem, WatermarkProps } from '@/Components/DocumentViewer/PdfImageViewer';
import { VatcChecklist, VatcState } from '@/Components/Assessment/VatcChecklist';
import { RubricScoringSheet, RubrikItem, ScoreEntry } from '@/Components/Assessment/RubricScoringSheet';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/UI/Card';

export default function AsesorWorkspace({
    pendaftar,
    matkulList,
    rubrikList,
    watermarkInfo,
}: {
    pendaftar: any;
    matkulList: any[];
    rubrikList: RubrikItem[];
    watermarkInfo: WatermarkProps;
}) {
    const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(pendaftar.bukti[0] || null);
    const [activeTab, setActiveTab] = useState<'evaluasi' | 'uji_petik' | 'profil'>('evaluasi');
    const [selectedMatkulId, setSelectedMatkulId] = useState<string>(matkulList[0]?.id || '');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

    // Current selected course object
    const currentMatkul = matkulList.find((m) => m.id === selectedMatkulId) || matkulList[0];

    // Local form state for selected course evaluation
    const [asesmenForm, setAsesmenForm] = useState<{
        status_rekognisi: string;
        nilai_rekomendasi: string;
        nilai_angka: number;
        sks_rekomendasi: number;
        is_butuh_uji_petik: boolean;
        alasan_uji_petik: string;
        catatan_asesor: string;
        catatan_internal: string;
        is_final: boolean;
        vatc: VatcState;
    }>(() => {
        const initial = currentMatkul?.asesmen;
        const initialVatc = initial?.vatc?.[0];
        return {
            status_rekognisi: initial?.status_rekognisi || 'diakui',
            nilai_rekomendasi: initial?.nilai_rekomendasi || 'A',
            nilai_angka: initial?.nilai_angka || 4.00,
            sks_rekomendasi: initial?.sks_rekomendasi || currentMatkul?.sks || 3,
            is_butuh_uji_petik: initial?.is_butuh_uji_petik || false,
            alasan_uji_petik: initial?.alasan_uji_petik || '',
            catatan_asesor: initial?.catatan_asesor || '',
            catatan_internal: initial?.catatan_internal || '',
            is_final: initial?.is_final || false,
            vatc: initialVatc ? {
                bukti_id: initialVatc.bukti_id,
                is_valid: initialVatc.is_valid,
                is_asli: initialVatc.is_asli,
                is_terkini: initialVatc.is_terkini,
                is_cukup: initialVatc.is_cukup,
            } : {
                is_valid: true,
                is_asli: true,
                is_terkini: true,
                is_cukup: true,
            },
        };
    });

    // Update form when selecting a different course
    const handleSelectCourse = (mkId: string) => {
        setSelectedMatkulId(mkId);
        const targetMk = matkulList.find((m) => m.id === mkId);
        const existingAsesmen = targetMk?.asesmen;
        const existingVatc = existingAsesmen?.vatc?.[0];

        setAsesmenForm({
            status_rekognisi: existingAsesmen?.status_rekognisi || 'diakui',
            nilai_rekomendasi: existingAsesmen?.nilai_rekomendasi || 'A',
            nilai_angka: existingAsesmen?.nilai_angka || 4.00,
            sks_rekomendasi: existingAsesmen?.sks_rekomendasi || targetMk?.sks || 3,
            is_butuh_uji_petik: existingAsesmen?.is_butuh_uji_petik || false,
            alasan_uji_petik: existingAsesmen?.alasan_uji_petik || '',
            catatan_asesor: existingAsesmen?.catatan_asesor || '',
            catatan_internal: existingAsesmen?.catatan_internal || '',
            is_final: existingAsesmen?.is_final || false,
            vatc: existingVatc ? {
                bukti_id: existingVatc.bukti_id,
                is_valid: existingVatc.is_valid,
                is_asli: existingVatc.is_asli,
                is_terkini: existingVatc.is_terkini,
                is_cukup: existingVatc.is_cukup,
            } : {
                is_valid: true,
                is_asli: true,
                is_terkini: true,
                is_cukup: true,
            },
        });
    };

    const handleSaveAssessment = async (isFinalSubmit: boolean = false) => {
        setIsSaving(true);
        setSaveSuccessMsg(null);

        const payload = {
            pendaftar_id: pendaftar.id,
            mata_kuliah_id: currentMatkul.id,
            status_rekognisi: asesmenForm.status_rekognisi,
            nilai_rekomendasi: asesmenForm.nilai_rekomendasi,
            nilai_angka: asesmenForm.nilai_rekomendasi === 'A' ? 4.00 : asesmenForm.nilai_rekomendasi === 'B+' ? 3.50 : 3.00,
            sks_rekomendasi: asesmenForm.sks_rekomendasi,
            is_butuh_uji_petik: asesmenForm.is_butuh_uji_petik,
            alasan_uji_petik: asesmenForm.alasan_uji_petik,
            catatan_asesor: asesmenForm.catatan_asesor,
            catatan_internal: asesmenForm.catatan_internal,
            is_final: isFinalSubmit,
            vatc_list: [
                {
                    bukti_id: selectedDoc?.id || null,
                    is_valid: asesmenForm.vatc.is_valid,
                    is_asli: asesmenForm.vatc.is_asli,
                    is_terkini: asesmenForm.vatc.is_terkini,
                    is_cukup: asesmenForm.vatc.is_cukup,
                },
            ],
        };

        try {
            const res = await fetch('/asesor/assessment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (data.success) {
                setSaveSuccessMsg('Penilaian dan validasi VATC mata kuliah berhasil disimpan!');
                router.reload({ only: ['matkulList'] });
            } else {
                alert('Gagal menyimpan: ' + data.message);
            }
        } catch (err: any) {
            alert('Kesalahan jaringan: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleFinalizeAll = () => {
        if (confirm(`Apakah Anda yakin ingin memfinalisasi seluruh hasil asesmen untuk ${pendaftar.nama_lengkap} dan mengajukannya ke Sidang Pleno?`)) {
            router.post(`/asesor/finalize/${pendaftar.id}`);
        }
    };

    const handleSubmitRubricScore = async (scores: ScoreEntry[], generalNote: string) => {
        if (!pendaftar.uji_petik?.[0]?.id) {
            alert('Jadwal uji petik belum dibuat.');
            return;
        }

        try {
            const res = await fetch(`/uji-petik/${pendaftar.uji_petik[0].id}/score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    scores,
                    catatan_umum: generalNote,
                }),
            });

            const data = await res.json();
            if (data.success) {
                alert(data.message);
                router.reload();
            }
        } catch (err: any) {
            alert('Gagal menyimpan nilai uji petik: ' + err.message);
        }
    };

    return (
        <AppLayout title="Dual-Panel Workspace Asesor">
            <div className="space-y-4">
                {/* Header Summary Banner */}
                <div className="px-6 py-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center font-bold text-xl">
                            {pendaftar.nama_lengkap.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-white leading-none">{pendaftar.nama_lengkap}</h3>
                                <Badge variant="blue" size="sm" className="bg-blue-600 text-white border-0 text-[10px]">
                                    RPL {pendaftar.jenis_rpl}
                                </Badge>
                            </div>
                            <p className="text-xs text-blue-200 mt-1">
                                No. Reg: <span className="font-mono">{pendaftar.nomor_pendaftaran}</span> &bull; Prodi: <strong>{pendaftar.prodi}</strong>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={`/form-f02/print/${pendaftar.id}`} target="_blank">
                            <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs">
                                <Printer className="w-3.5 h-3.5 mr-1" /> Form F-02
                            </Button>
                        </Link>
                        <Link href={`/form-f03/print/${pendaftar.id}`} target="_blank">
                            <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs">
                                <Printer className="w-3.5 h-3.5 mr-1" /> Form F-03 (Evaluasi Diri)
                            </Button>
                        </Link>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={handleFinalizeAll}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950/40 text-xs"
                        >
                            <Award className="w-4 h-4 mr-1.5" /> Finalisasi ke Pleno
                        </Button>
                    </div>
                </div>

                {/* THE DUAL-PANEL WORKSPACE GRID */}
                <div className="grid lg:grid-cols-12 gap-6 min-h-[750px]">
                    {/* LEFT PANEL: Document Viewer & Watermark Canvas (6 Cols) */}
                    <div className="lg:col-span-6 flex flex-col min-h-[600px] lg:min-h-[750px]">
                        <PdfImageViewer document={selectedDoc} watermark={watermarkInfo} />
                    </div>

                    {/* RIGHT PANEL: Evaluation Form & VATC Rubrics (6 Cols) */}
                    <div className="lg:col-span-6 flex flex-col space-y-4">
                        {/* Tabs Header */}
                        <div className="p-1.5 bg-slate-200/80 rounded-2xl flex items-center gap-1 text-xs font-bold text-slate-700">
                            <button
                                type="button"
                                onClick={() => setActiveTab('evaluasi')}
                                className={`flex-1 py-2 rounded-xl transition-all ${
                                    activeTab === 'evaluasi'
                                        ? 'bg-white text-blue-700 shadow-sm'
                                        : 'hover:text-slate-900'
                                }`}
                            >
                                Evaluasi CPMK & VATC
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('uji_petik')}
                                className={`flex-1 py-2 rounded-xl transition-all ${
                                    activeTab === 'uji_petik'
                                        ? 'bg-white text-blue-700 shadow-sm'
                                        : 'hover:text-slate-900'
                                }`}
                            >
                                Rubrik Uji Petik (4 Dimensi)
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('profil')}
                                className={`flex-1 py-2 rounded-xl transition-all ${
                                    activeTab === 'profil'
                                        ? 'bg-white text-blue-700 shadow-sm'
                                        : 'hover:text-slate-900'
                                }`}
                            >
                                Profil & Berkas Portofolio ({pendaftar.bukti.length})
                            </button>
                        </div>

                        {saveSuccessMsg && (
                            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>{saveSuccessMsg}</span>
                            </div>
                        )}

                        {/* TAB 1: Evaluasi CPMK & VATC */}
                        {activeTab === 'evaluasi' && (
                            <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-5 overflow-y-auto max-h-[700px]">
                                {/* Course Selector Dropdown / Pills */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                                        Pilih Mata Kuliah yang Dinilai ({matkulList.length} Mata Kuliah Diklaim):
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {matkulList.map((mk) => {
                                            const isSelected = mk.id === selectedMatkulId;
                                            const isFinal = mk.asesmen?.is_final;
                                            return (
                                                <button
                                                    key={mk.id}
                                                    type="button"
                                                    onClick={() => handleSelectCourse(mk.id)}
                                                    className={`p-3 rounded-xl border text-left transition-all ${
                                                        isSelected
                                                            ? 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-500 text-blue-950'
                                                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-mono font-bold text-xs text-blue-600">{mk.kode_mk}</span>
                                                        {isFinal && (
                                                            <Badge variant="emerald" size="sm">
                                                                Nilai: {mk.asesmen?.nilai_rekomendasi}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="font-bold text-xs text-slate-900 mt-1 truncate">{mk.nama_mk}</p>
                                                    <p className="text-[10px] text-slate-500">{mk.sks} SKS &bull; Semester {mk.semester}</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {currentMatkul && (
                                    <div className="space-y-5 pt-3 border-t border-slate-100">
                                        {/* Applicant Claims Box */}
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-slate-800">Deskripsi Klaim Pengalaman Asesi:</span>
                                                <Badge variant="blue" size="sm">Tingkat: {currentMatkul.claims[0]?.kemampuan || 'Sangat Baik'}</Badge>
                                            </div>
                                            <p className="text-xs text-slate-700 leading-relaxed">
                                                {currentMatkul.claims[0]?.deskripsi || 'Tidak ada deskripsi rinci.'}
                                            </p>

                                            {/* Linked Portfolios button to load in left viewer */}
                                            <div className="pt-2 flex flex-wrap items-center gap-1.5">
                                                <span className="text-[11px] font-semibold text-slate-500">Klik Dokumen untuk Preview:</span>
                                                {currentMatkul.claims[0]?.bukti_list?.map((b: any) => (
                                                    <button
                                                        key={b.id}
                                                        type="button"
                                                        onClick={() => setSelectedDoc(b)}
                                                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                                                            selectedDoc?.id === b.id
                                                                ? 'bg-blue-600 text-white border-blue-600 font-bold'
                                                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        <FileText className="w-3 h-3 inline mr-1" /> {b.nama}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* VATC Checklist Matrix */}
                                        <VatcChecklist
                                            vatc={asesmenForm.vatc}
                                            onChange={(updated) => setAsesmenForm({ ...asesmenForm, vatc: updated })}
                                        />

                                        {/* Assessor Recommendation Controls */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-800 mb-1">Rekomendasi Rekognisi *</label>
                                                <select
                                                    value={asesmenForm.status_rekognisi}
                                                    onChange={(e) => setAsesmenForm({ ...asesmenForm, status_rekognisi: e.target.value })}
                                                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-semibold"
                                                >
                                                    <option value="diakui">Diakui (Lulus SKS)</option>
                                                    <option value="uji_petik">Perlu Uji Petik / Wawancara</option>
                                                    <option value="ditolak">Ditolak (Wajib Kuliah)</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-slate-800 mb-1">Rekomendasi Nilai Huruf *</label>
                                                <select
                                                    value={asesmenForm.nilai_rekomendasi}
                                                    onChange={(e) => setAsesmenForm({ ...asesmenForm, nilai_rekomendasi: e.target.value })}
                                                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-blue-700"
                                                >
                                                    <option value="A">Nilai A (Bobot 4.00 - Sangat Baik)</option>
                                                    <option value="B+">Nilai B+ (Bobot 3.50 - Baik Sekali)</option>
                                                    <option value="B">Nilai B (Bobot 3.00 - Baik)</option>
                                                    <option value="Ditolak">Ditolak (0.00)</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Switch Uji Petik Checkbox */}
                                        <label className="flex items-center gap-2.5 p-3 rounded-xl bg-purple-50 border border-purple-200 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={asesmenForm.is_butuh_uji_petik}
                                                onChange={(e) => setAsesmenForm({ ...asesmenForm, is_butuh_uji_petik: e.target.checked })}
                                                className="rounded border-purple-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                                            />
                                            <div className="text-xs">
                                                <p className="font-bold text-purple-950">Tandai Butuh Uji Petik / Wawancara Lanjutan</p>
                                                <p className="text-[10px] text-purple-700">Aktifkan jika portofolio meragukan atau butuh konfirmasi demonstrasi langsung</p>
                                            </div>
                                        </label>

                                        {asesmenForm.is_butuh_uji_petik && (
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">Alasan Memerlukan Uji Petik *</label>
                                                <input
                                                    type="text"
                                                    value={asesmenForm.alasan_uji_petik}
                                                    onChange={(e) => setAsesmenForm({ ...asesmenForm, alasan_uji_petik: e.target.value })}
                                                    placeholder="Contoh: Butuh verifikasi penguasaan arsitektur basis data relasional..."
                                                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                                                />
                                            </div>
                                        )}

                                        {/* Assessor Feedback & Private Notes */}
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Feedback untuk Asesi</label>
                                                <textarea
                                                    rows={2}
                                                    value={asesmenForm.catatan_asesor}
                                                    onChange={(e) => setAsesmenForm({ ...asesmenForm, catatan_asesor: e.target.value })}
                                                    placeholder="Akan terlihat di lembar rekomendasi asesi..."
                                                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Internal Asesor (Rahasia)</label>
                                                <textarea
                                                    rows={2}
                                                    value={asesmenForm.catatan_internal}
                                                    onChange={(e) => setAsesmenForm({ ...asesmenForm, catatan_internal: e.target.value })}
                                                    placeholder="Hanya dapat dibaca oleh Kaprodi & Tim Pleno..."
                                                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        {/* Save Buttons */}
                                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                isLoading={isSaving}
                                                onClick={() => handleSaveAssessment(false)}
                                            >
                                                <Save className="w-4 h-4 mr-1" /> Simpan Draft Asesmen
                                            </Button>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                isLoading={isSaving}
                                                onClick={() => handleSaveAssessment(true)}
                                                className="shadow-sm"
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-1" /> Simpan & Tetapkan Lulus Mata Kuliah
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: Rubrik Uji Petik (4 Dimensi) */}
                        {activeTab === 'uji_petik' && (
                            <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 overflow-y-auto max-h-[700px]">
                                <RubricScoringSheet
                                    rubrikList={rubrikList}
                                    onSubmit={handleSubmitRubricScore}
                                />
                            </div>
                        )}

                        {/* TAB 3: Profil Asesi & Daftar Seluruh Portofolio */}
                        {activeTab === 'profil' && (
                            <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-6 overflow-y-auto max-h-[700px]">
                                {/* Education */}
                                <div className="space-y-2">
                                    <h4 className="font-bold text-xs text-slate-800 uppercase flex items-center gap-1.5">
                                        <GraduationCap className="w-4 h-4 text-blue-600" /> Riwayat Pendidikan Formal
                                    </h4>
                                    <div className="divide-y divide-slate-100 text-xs">
                                        {pendaftar.pendidikan.map((edu: any) => (
                                            <div key={edu.id} className="py-2">
                                                <p className="font-bold text-slate-900">{edu.nama_institusi}</p>
                                                <p className="text-slate-600">{edu.jenjang} - {edu.jurusan} (Lulus {edu.tahun_lulus})</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Experience */}
                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <h4 className="font-bold text-xs text-slate-800 uppercase flex items-center gap-1.5">
                                        <Briefcase className="w-4 h-4 text-blue-600" /> Pengalaman Kerja Profesional
                                    </h4>
                                    <div className="divide-y divide-slate-100 text-xs">
                                        {pendaftar.pengalaman.map((exp: any) => (
                                            <div key={exp.id} className="py-2.5 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-slate-900">{exp.jabatan_posisi}</span>
                                                    <span className="text-[10px] text-slate-500 font-mono">{exp.tanggal_mulai} s/d {exp.tanggal_selesai || 'Sekarang'}</span>
                                                </div>
                                                <p className="text-blue-600 font-semibold">{exp.nama_instansi}</p>
                                                <p className="text-slate-600">{exp.deskripsi_tugas_kunci}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Portfolios List */}
                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <h4 className="font-bold text-xs text-slate-800 uppercase flex items-center gap-1.5">
                                        <FileText className="w-4 h-4 text-blue-600" /> Seluruh Dokumen Bukti ({pendaftar.bukti.length})
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {pendaftar.bukti.map((b: any) => (
                                            <button
                                                key={b.id}
                                                type="button"
                                                onClick={() => setSelectedDoc(b)}
                                                className={`p-3 rounded-xl border text-left transition-all ${
                                                    selectedDoc?.id === b.id
                                                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 text-blue-950'
                                                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                                }`}
                                            >
                                                <p className="font-bold text-xs truncate">{b.nama_dokumen}</p>
                                                <p className="text-[10px] text-slate-500">{b.penerbit} ({b.tahun_penerbitan || '-'})</p>
                                                <div className="mt-1 flex items-center justify-between text-[10px]">
                                                    <Badge variant="blue" size="sm">{b.jenis_bukti}</Badge>
                                                    <span className="text-blue-600 font-bold">Buka Preview &rarr;</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
