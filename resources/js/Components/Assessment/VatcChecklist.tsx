import React from 'react';
import { CheckSquare, Square, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/Components/UI/Badge';

export interface VatcState {
    bukti_id?: string;
    is_valid: boolean; // V - Validity
    is_asli: boolean;  // A - Authenticity
    is_terkini: boolean; // C - Currency
    is_cukup: boolean; // S - Sufficiency
    catatan?: string;
}

export const VatcChecklist: React.FC<{
    vatc: VatcState;
    onChange: (updated: VatcState) => void;
    disabled?: boolean;
}> = ({ vatc, onChange, disabled = false }) => {
    const toggleField = (field: keyof Omit<VatcState, 'bukti_id' | 'catatan'>) => {
        if (disabled) return;
        onChange({
            ...vatc,
            [field]: !vatc[field],
        });
    };

    const isAllChecked = vatc.is_asli && vatc.is_terkini && vatc.is_cukup && vatc.is_valid;

    return (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900 tracking-tight uppercase">
                        Matriks Asesmen Portofolio (A-C-S-V)
                    </span>
                    <Badge variant={isAllChecked ? 'emerald' : 'amber'} size="sm">
                        {isAllChecked ? 'A-C-S-V Terpenuhi Penuh' : 'Belum Memenuhi Syarat'}
                    </Badge>
                </div>
            </div>

            {/* 4 Checkbox Controls (A-C-S-V) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* A - Authenticity */}
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleField('is_asli')}
                    className={`flex items-start gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                        vatc.is_asli
                            ? 'bg-emerald-50 text-emerald-950 border-emerald-300 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                >
                    {vatc.is_asli ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}
                    <div>
                        <p className="leading-tight font-bold text-emerald-800">A - Authenticity</p>
                        <p className="text-[10px] text-slate-500 font-normal mt-0.5">Keaslian & Dapat Diverifikasi</p>
                    </div>
                </button>

                {/* C - Currency */}
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleField('is_terkini')}
                    className={`flex items-start gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                        vatc.is_terkini
                            ? 'bg-blue-50 text-blue-950 border-blue-300 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                >
                    {vatc.is_terkini ? <CheckSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}
                    <div>
                        <p className="leading-tight font-bold text-blue-800">C - Currency</p>
                        <p className="text-[10px] text-slate-500 font-normal mt-0.5">Keterkinian Ilmu/Masa Berlaku</p>
                    </div>
                </button>

                {/* S - Sufficiency */}
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleField('is_cukup')}
                    className={`flex items-start gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                        vatc.is_cukup
                            ? 'bg-amber-50 text-amber-950 border-amber-300 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                >
                    {vatc.is_cukup ? <CheckSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}
                    <div>
                        <p className="leading-tight font-bold text-amber-800">S - Sufficiency</p>
                        <p className="text-[10px] text-slate-500 font-normal mt-0.5">Kecukupan Bukti Kompetensi</p>
                    </div>
                </button>

                {/* V - Validity */}
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleField('is_valid')}
                    className={`flex items-start gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                        vatc.is_valid
                            ? 'bg-purple-50 text-purple-950 border-purple-300 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                >
                    {vatc.is_valid ? <CheckSquare className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}
                    <div>
                        <p className="leading-tight font-bold text-purple-800">V - Validity</p>
                        <p className="text-[10px] text-slate-500 font-normal mt-0.5">Keabsahan & Relevansi CPMK</p>
                    </div>
                </button>
            </div>
        </div>
    );
};
