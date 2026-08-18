import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { Video, Calendar, Award, CheckCircle2, Plus, Clock } from 'lucide-react';
import { AppLayout } from '@/Components/Layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Modal } from '@/Components/UI/Modal';
import { RubricScoringSheet, RubrikItem, ScoreEntry } from '@/Components/Assessment/RubricScoringSheet';

export default function UjiPetikIndex({
    ujiPetikList,
    rubrikList,
}: {
    ujiPetikList: any;
    rubrikList: RubrikItem[];
}) {
    const [selectedUji, setSelectedUji] = useState<any | null>(null);
    const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const openScoreModal = (uji: any) => {
        setSelectedUji(uji);
        setIsScoreModalOpen(true);
    };

    const handleScoreSubmit = async (scores: ScoreEntry[], generalNote: string) => {
        if (!selectedUji) return;
        setIsSaving(true);

        try {
            const res = await fetch(`/uji-petik/${selectedUji.id}/score`, {
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
                setIsScoreModalOpen(false);
                router.reload();
            } else {
                alert('Gagal: ' + data.message);
            }
        } catch (err: any) {
            alert('Gagal: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AppLayout title="Uji Petik & Wawancara RPL (4 Dimensi Rubrik)">
            <div className="space-y-6">
                {/* Header Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <Badge variant="purple" size="sm" className="bg-purple-600 text-white border-0 mb-1">
                            Permendikbud No. 41/2021 &bull; Rubrik Penilaian
                        </Badge>
                        <h3 className="text-xl font-bold text-white">Uji Petik / Wawancara Pembuktian Kompetensi</h3>
                        <p className="text-xs text-purple-200 mt-0.5">
                            Formula Pembobotan: Autentisitas (25%) + Konsep (35%) + Masalah (25%) + Etika (15%). Lulus jika Skor &ge; 2.70.
                        </p>
                    </div>
                </div>

                {/* Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="px-5 py-3">Nama Asesi</th>
                                    <th className="px-4 py-3">Mata Kuliah Diuji</th>
                                    <th className="px-3 py-3">Metode & Jenis</th>
                                    <th className="px-4 py-3">Jadwal Pelaksanaan</th>
                                    <th className="px-3 py-3">Status</th>
                                    <th className="px-3 py-3">Hasil Skor</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {ujiPetikList.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                                            Belum ada jadwal sesi uji petik aktif.
                                        </td>
                                    </tr>
                                ) : (
                                    ujiPetikList.data.map((u: any) => (
                                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <p className="font-bold text-slate-900">{u.nama_asesi}</p>
                                                <p className="text-[11px] text-slate-500 font-mono">{u.nomor_pendaftaran}</p>
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-700 font-medium">{u.mata_kuliah}</td>
                                            <td className="px-3 py-3.5">
                                                <Badge variant="purple" size="sm">{u.jenis_uji}</Badge>
                                                <span className="block text-[10px] text-slate-500 mt-0.5">{u.metode}</span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                                                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                                    <span>{u.jadwal}</span>
                                                </div>
                                                {u.link_meeting && (
                                                    <a href={u.link_meeting} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 hover:underline">
                                                        Link Video Meeting
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <Badge variant={u.status === 'selesai' ? 'emerald' : 'amber'} size="sm">
                                                    {u.status}
                                                </Badge>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                {u.skor_akhir ? (
                                                    <div>
                                                        <span className="font-bold text-sm text-slate-900">{u.skor_akhir}</span>
                                                        <Badge variant="emerald" size="sm" className="ml-1.5">
                                                            {u.nilai_huruf} ({u.status_kelulusan})
                                                        </Badge>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 text-right space-x-2">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => openScoreModal(u)}
                                                    className="h-7 text-xs"
                                                >
                                                    <Award className="w-3.5 h-3.5 mr-1" />
                                                    {u.status === 'selesai' ? 'Update Nilai' : 'Beri Penilaian Rubrik'}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Rubric Scoring Modal */}
            <Modal
                isOpen={isScoreModalOpen}
                onClose={() => setIsScoreModalOpen(false)}
                title="Lembar Penilaian Uji Petik (Rubrik 4 Dimensi)"
                description={`Asesi: ${selectedUji?.nama_asesi} &bull; MK: ${selectedUji?.mata_kuliah}`}
                size="xl"
            >
                <RubricScoringSheet
                    rubrikList={rubrikList}
                    onSubmit={handleScoreSubmit}
                    isLoading={isSaving}
                />
            </Modal>
        </AppLayout>
    );
}
