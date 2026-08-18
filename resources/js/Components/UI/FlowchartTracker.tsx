import React, { useState } from 'react';
import {
    CheckCircle2,
    Circle,
    Clock,
    HelpCircle,
    ChevronRight,
    UserCheck,
    Shield,
    BookOpen,
    Scale,
    Database,
    Sparkles,
    AlertCircle,
} from 'lucide-react';
import { Badge } from '@/Components/UI/Badge';

interface FlowchartTrackerProps {
    currentStage?: string; // 'draft' | 'terkirim' | 'verifikasi_administrasi' | 'proses_asesmen' | 'uji_petik' | 'pleno' | 'penerbitan_sk' | 'selesai' | string;
    showDetails?: boolean;
}

export function FlowchartTracker({ currentStage = 'draft', showDetails = false }: FlowchartTrackerProps) {
    const [isExpanded, setIsExpanded] = useState(showDetails);

    // Determine which lane/step is active
    const getStageIndex = (stage: string) => {
        switch (stage.toLowerCase()) {
            case 'draft':
                return 1;
            case 'terkirim':
            case 'verifikasi_administrasi':
                return 2;
            case 'valid':
            case 'proses_asesmen':
                return 3;
            case 'uji_petik':
                return 3.5;
            case 'pleno':
            case 'penerbitan_sk':
                return 4;
            case 'sinkronisasi':
            case 'selesai':
                return 5;
            default:
                return 1;
        }
    };

    const activeIndex = getStageIndex(currentStage);

    const swimlanes = [
        {
            laneId: 1,
            title: '1. PESERTA RPL',
            color: 'emerald',
            headerBg: 'bg-emerald-600',
            laneBg: 'bg-emerald-50/60 border-emerald-200',
            badgeBg: 'bg-emerald-100 text-emerald-800',
            icon: UserCheck,
            steps: [
                { id: '1', name: '1. Login Akun Peserta' },
                { id: '2', name: '2. Verifikasi Data (Identitas, Prodi, Jalur)' },
                { id: '3', name: '3. Pilih Jalur (Transfer / Perolehan SKS)' },
                { id: '4', name: '4. Upload Portofolio RPL (13 Jenis Bukti)' },
                { id: '5', name: '5. Cek Kelengkapan & Final Submit' },
            ],
            isActive: activeIndex === 1,
            isPassed: activeIndex > 1,
        },
        {
            laneId: 2,
            title: '2. ADMIN RPL',
            color: 'blue',
            headerBg: 'bg-blue-600',
            laneBg: 'bg-blue-50/60 border-blue-200',
            badgeBg: 'bg-blue-100 text-blue-800',
            icon: Shield,
            steps: [
                { id: '6', name: '6. Validasi Admin & Verifikasi Dokumen' },
                { id: '7', name: '7. Uji Validitas (Klarifikasi / Perbaikan)' },
                { id: '8', name: '8. Pemetaan Evidensi ke MK - CPL - CPMK' },
            ],
            isActive: activeIndex === 2,
            isPassed: activeIndex > 2,
        },
        {
            laneId: 3,
            title: '3. ASESOR',
            color: 'amber',
            headerBg: 'bg-amber-600',
            laneBg: 'bg-amber-50/60 border-amber-200',
            badgeBg: 'bg-amber-100 text-amber-800',
            icon: BookOpen,
            steps: [
                { id: '9', name: '9. Asesmen Portofolio (A-C-S-V Matrix)' },
                { id: '10', name: '10. Cek Kecukupan Bukti & Validitas' },
                { id: '11', name: '11. Penetapan Ketercapaian CPL/CPMK' },
                { id: '13', name: '13. Asesmen Lanjutan (Lisan/Praktik/Wawancara)' },
            ],
            isActive: activeIndex === 3 || activeIndex === 3.5,
            isPassed: activeIndex > 3.5,
        },
        {
            laneId: 4,
            title: '4. TIM RPL / PLENO',
            color: 'purple',
            headerBg: 'bg-purple-600',
            laneBg: 'bg-purple-50/60 border-purple-200',
            badgeBg: 'bg-purple-100 text-purple-800',
            icon: Scale,
            steps: [
                { id: '15', name: '15. Rekap Hasil Penilaian Portofolio' },
                { id: '16', name: '16. Sidang Pleno Tim RPL & Legalitas' },
                { id: '17', name: '17. Penetapan Keputusan (Penuh/Sebagian)' },
                { id: '19', name: '19. Informasi Hasil ke Peserta' },
                { id: '20', name: '20. Masa Sanggah / Keberatan (3 Hari)' },
                { id: '21', name: '21. Penetapan Final & SK Rekognisi' },
            ],
            isActive: activeIndex === 4,
            isPassed: activeIndex > 4,
        },
        {
            laneId: 5,
            title: '5. AKADEMIK / SIAKAD',
            color: 'teal',
            headerBg: 'bg-teal-600',
            laneBg: 'bg-teal-50/60 border-teal-200',
            badgeBg: 'bg-teal-100 text-teal-800',
            icon: Database,
            steps: [
                { id: '22', name: '22. Injeksi Hasil ke SIAKAD & PDDikti' },
                { id: '23', name: '23. Update Transkrip KHS & Konversi SKS' },
                { id: '24', name: 'SELESAI (Kredit Diakui Resmi)' },
            ],
            isActive: activeIndex === 5,
            isPassed: false,
        },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header Banner */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                                Flowchart Resmi Penilaian Portofolio RPL (5 Swimlanes)
                            </h4>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-600 font-mono text-white">UIN SSC</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                            Adopsi Alur Standar Operasional: Integritas &bull; Profesional &bull; Transparan &bull; Akuntabel
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
                    >
                        {isExpanded ? 'Sembunyikan Rincian 23 Langkah' : 'Tampilkan 23 Langkah Lengkap'}
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Swimlanes Overview Tracker Grid */}
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-5 gap-3">
                {swimlanes.map((lane) => {
                    const Icon = lane.icon;
                    return (
                        <div
                            key={lane.laneId}
                            className={`rounded-2xl border transition-all flex flex-col justify-between ${
                                lane.isActive
                                    ? `${lane.laneBg} ring-2 ring-blue-500 shadow-md transform -translate-y-0.5`
                                    : lane.isPassed
                                    ? 'bg-slate-50 border-slate-200'
                                    : 'bg-white border-slate-100 opacity-80'
                            }`}
                        >
                            {/* Column Header */}
                            <div className={`p-3 rounded-t-xl text-white flex items-center justify-between ${lane.headerBg}`}>
                                <div className="flex items-center gap-2">
                                    <Icon className="w-4 h-4" />
                                    <span className="font-extrabold text-xs tracking-tight">{lane.title}</span>
                                </div>
                                {lane.isPassed ? (
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                ) : lane.isActive ? (
                                    <Clock className="w-4 h-4 text-white animate-pulse" />
                                ) : (
                                    <Circle className="w-3.5 h-3.5 text-white/50" />
                                )}
                            </div>

                            {/* Column Body / Steps Summary */}
                            <div className="p-3 space-y-2 flex-1">
                                {isExpanded ? (
                                    <div className="space-y-1.5">
                                        {lane.steps.map((step) => (
                                            <div
                                                key={step.id}
                                                className={`text-[11px] p-1.5 rounded-lg font-medium leading-tight ${
                                                    lane.isActive
                                                        ? 'bg-white shadow-2xs text-slate-900 border border-slate-200/80'
                                                        : 'text-slate-600'
                                                }`}
                                            >
                                                {step.name}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-2 text-center space-y-1">
                                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${lane.badgeBg}`}>
                                            {lane.steps.length} Sub-Proses
                                        </span>
                                        <p className="text-[10px] text-slate-500 leading-tight">
                                            {lane.steps[0].name.split('.')[1] || lane.steps[0].name}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Status Footer */}
                            <div className="p-2 border-t border-slate-200/60 text-center">
                                {lane.isActive ? (
                                    <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider flex items-center justify-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                                        Sedang Berjalan
                                    </span>
                                ) : lane.isPassed ? (
                                    <span className="text-[10px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selesai
                                    </span>
                                ) : (
                                    <span className="text-[10px] text-slate-400 font-medium">Menunggu Antrean</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Principles & Standards Footer Note */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-600">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-800">Prinsip Evaluasi Asesor (A-C-S-V):</span>
                    <span className="inline-flex items-center gap-1"><strong className="text-emerald-700">A</strong>uthenticity (Keaslian)</span>
                    <span className="inline-flex items-center gap-1"><strong className="text-blue-700">C</strong>urrency (Keterkinian)</span>
                    <span className="inline-flex items-center gap-1"><strong className="text-amber-700">S</strong>ufficiency (Kecukupan)</span>
                    <span className="inline-flex items-center gap-1"><strong className="text-purple-700">V</strong>alidity (Keabsahan)</span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
                    <span>13 Kategori Portofolio &bull; Uji Petik Wawancara &bull; Sidang Pleno &bull; Masa Sanggah</span>
                </div>
            </div>
        </div>
    );
}
