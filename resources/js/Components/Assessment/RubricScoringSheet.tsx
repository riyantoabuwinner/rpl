import React, { useState, useEffect } from 'react';
import { Award, Calculator, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';

export interface RubrikItem {
    id: string;
    nama_dimensi: string;
    deskripsi_indikator: string;
    bobot_persen: number;
    urutan: number;
}

export interface ScoreEntry {
    rubrik_id: string;
    skor: number;
    catatan?: string;
}

export const RubricScoringSheet: React.FC<{
    rubrikList: RubrikItem[];
    initialScores?: ScoreEntry[];
    onSubmit: (scores: ScoreEntry[], generalNote: string) => void;
    isLoading?: boolean;
}> = ({ rubrikList, initialScores = [], onSubmit, isLoading = false }) => {
    const [scores, setScores] = useState<Record<string, number>>(() => {
        const map: Record<string, number> = {};
        rubrikList.forEach((r) => {
            const found = initialScores.find((s) => s.rubrik_id === r.id);
            map[r.id] = found ? found.skor : 3; // Default 3
        });
        return map;
    });

    const [generalNote, setGeneralNote] = useState<string>('');

    // Calculate final weighted score
    const calculateTotal = () => {
        let total = 0;
        rubrikList.forEach((r) => {
            const skor = scores[r.id] || 0;
            total += skor * (Number(r.bobot_persen) / 100);
        });
        return Math.round(total * 100) / 100;
    };

    const finalScore = calculateTotal();

    // Grade conversion
    let gradeLabel = 'A';
    let gradeBobot = 4.0;
    let gradeStatus = 'Lulus';
    let gradeColor: 'emerald' | 'blue' | 'amber' | 'red' = 'emerald';

    if (finalScore >= 3.50) {
        gradeLabel = 'A (Sangat Baik)';
        gradeBobot = 4.00;
        gradeStatus = 'Direkomendasikan Lulus';
        gradeColor = 'emerald';
    } else if (finalScore >= 3.00) {
        gradeLabel = 'B+ (Baik Sekali)';
        gradeBobot = 3.50;
        gradeStatus = 'Direkomendasikan Lulus';
        gradeColor = 'blue';
    } else if (finalScore >= 2.70) {
        gradeLabel = 'B (Baik)';
        gradeBobot = 3.00;
        gradeStatus = 'Direkomendasikan Lulus';
        gradeColor = 'amber';
    } else {
        gradeLabel = 'Ditolak (Kurang)';
        gradeBobot = 0.00;
        gradeStatus = 'Wajib Menempuh Kuliah Reguler';
        gradeColor = 'red';
    }

    const handleScoreChange = (rubrikId: string, value: number) => {
        setScores((prev) => ({
            ...prev,
            [rubrikId]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const scorePayload: ScoreEntry[] = Object.entries(scores).map(([rubrik_id, skor]) => ({
            rubrik_id,
            skor,
        }));
        onSubmit(scorePayload, generalNote);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Score Simulation Summary Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-lg border border-blue-900/40 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center font-bold text-xl text-blue-300">
                        {finalScore.toFixed(2)}
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Kalkulasi Skor Akhir Uji Petik</p>
                        <h4 className="text-lg font-bold text-white mt-0.5">{gradeLabel}</h4>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Badge variant={gradeColor === 'emerald' ? 'emerald' : gradeColor === 'blue' ? 'blue' : gradeColor === 'amber' ? 'amber' : 'red'} size="md">
                        {gradeStatus}
                    </Badge>
                </div>
            </div>

            {/* Rubric Criteria Rows */}
            <div className="space-y-3.5">
                {rubrikList.map((r, index) => {
                    const currentSkor = scores[r.id] || 3;
                    const weighted = (currentSkor * (Number(r.bobot_persen) / 100)).toFixed(2);

                    return (
                        <div key={r.id} className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-blue-300 transition-all">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                                            {index + 1}
                                        </span>
                                        <h5 className="text-sm font-bold text-slate-900">{r.nama_dimensi}</h5>
                                        <Badge variant="slate" size="sm">
                                            Bobot {r.bobot_persen}%
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-slate-600 pl-7">{r.deskripsi_indikator}</p>
                                </div>

                                <div className="text-right shrink-0">
                                    <span className="text-xs text-slate-500 font-mono">Tertimbang:</span>
                                    <span className="ml-1 text-sm font-bold text-blue-600 font-mono">+{weighted}</span>
                                </div>
                            </div>

                            {/* 1 to 4 Radio Buttons */}
                            <div className="mt-3 pl-7 flex items-center gap-2">
                                {[1, 2, 3, 4].map((val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => handleScoreChange(r.id, val)}
                                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                                            currentSkor === val
                                                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        Skor {val} {val === 4 ? '(Sangat Baik)' : val === 3 ? '(Baik)' : val === 2 ? '(Cukup)' : '(Kurang)'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* General Note */}
            <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Evaluator & Kesimpulan Wawancara</label>
                <textarea
                    rows={3}
                    value={generalNote}
                    onChange={(e) => setGeneralNote(e.target.value)}
                    placeholder="Tuliskan catatan teknis penguasaan konsep atau pembuktian kompetensi asesi..."
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="submit" variant="primary" isLoading={isLoading}>
                    Simpan Nilai & Selesaikan Uji Petik
                </Button>
            </div>
        </form>
    );
};
