import React, { useState } from 'react';
import {
    ZoomIn,
    ZoomOut,
    RotateCw,
    Maximize2,
    Minimize2,
    ShieldCheck,
    AlertTriangle,
    FileText,
    Copy,
    Check,
    ExternalLink,
} from 'lucide-react';
import { Badge } from '@/Components/UI/Badge';

export interface DocumentItem {
    id: string;
    nama_dokumen: string;
    jenis_bukti: string;
    tahun_penerbitan?: string;
    penerbit?: string;
    hash: string;
    is_duplicate?: boolean;
    url: string;
    metadata?: {
        author?: string;
        producer?: string;
        created_date?: string;
        is_suspicious?: boolean;
        analisis?: string;
    } | null;
}

export interface WatermarkProps {
    asesor_name: string;
    timestamp: string;
    ip_address: string;
}

export const PdfImageViewer: React.FC<{
    document: DocumentItem | null;
    watermark: WatermarkProps;
}> = ({ document, watermark }) => {
    const [zoom, setZoom] = useState<number>(100);
    const [rotation, setRotation] = useState<number>(0);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [copiedHash, setCopiedHash] = useState<boolean>(false);

    if (!document) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-100/70 rounded-2xl border-2 border-dashed border-slate-300">
                <FileText className="w-12 h-12 text-slate-400 mb-3" />
                <h4 className="text-sm font-semibold text-slate-700">Belum Ada Dokumen yang Dipilih</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                    Pilih dokumen bukti portofolio pada panel penilaian di sebelah kanan untuk melihat pratinjau berkas.
                </p>
            </div>
        );
    }

    const handleCopyHash = () => {
        navigator.clipboard.writeText(document.hash);
        setCopiedHash(true);
        setTimeout(() => setCopiedHash(false), 2000);
    };

    const isPdf = document.url.includes('.pdf') || document.nama_dokumen.toLowerCase().endsWith('.pdf');

    return (
        <div className={`flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
            {/* Toolbar Header */}
            <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-white">
                <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-xs font-semibold truncate max-w-xs text-slate-200" title={document.nama_dokumen}>
                        {document.nama_dokumen}
                    </span>
                    <Badge variant="slate" size="sm" className="bg-slate-800 text-slate-300 border-slate-700">
                        {document.jenis_bukti}
                    </Badge>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setZoom(Math.max(50, zoom - 15))}
                        title="Perkecil (-)"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono text-slate-300 min-w-10 text-center">{zoom}%</span>
                    <button
                        onClick={() => setZoom(Math.min(200, zoom + 15))}
                        title="Perbesar (+)"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-slate-800 mx-1" />
                    <button
                        onClick={() => setRotation((rotation + 90) % 360)}
                        title="Rotasi 90 Derajat"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        title={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh'}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Document Integrity Status Bar */}
            <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-2">
                    <span className="text-slate-400">SHA-256:</span>
                    <code className="font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/50 text-[10px]">
                        {document.hash.substring(0, 16)}...{document.hash.substring(document.hash.length - 8)}
                    </code>
                    <button
                        onClick={handleCopyHash}
                        title="Salin Full Hash"
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {document.is_duplicate ? (
                        <Badge variant="red" size="sm" className="bg-red-950 text-red-300 border-red-800">
                            <AlertTriangle className="w-3 h-3 text-red-400 mr-1" />
                            POTENTIAL_DUPLICATE
                        </Badge>
                    ) : (
                        <Badge variant="emerald" size="sm" className="bg-emerald-950 text-emerald-300 border-emerald-800">
                            <ShieldCheck className="w-3 h-3 text-emerald-400 mr-1" />
                            SHA-256 Validated
                        </Badge>
                    )}
                    {document.metadata && (
                        <span className="text-slate-400">
                            Metadata: <strong className="text-slate-200">{document.metadata.author || 'Valid'}</strong>
                        </span>
                    )}
                </div>
            </div>

            {/* Viewer Content Canvas with Watermark */}
            <div className="relative flex-1 bg-slate-950 overflow-auto flex items-center justify-center p-4">
                {/* Dynamic Floating Watermark Layer */}
                <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-around items-center opacity-20 select-none overflow-hidden rotate-[-25deg]">
                    <div className="text-center font-bold tracking-widest text-slate-100 text-sm md:text-base leading-relaxed">
                        <p>DOKUMEN EVALUASI ASESOR RPL</p>
                        <p>Asesor: {watermark.asesor_name} | IP: {watermark.ip_address}</p>
                        <p>{watermark.timestamp}</p>
                    </div>
                    <div className="text-center font-bold tracking-widest text-slate-100 text-sm md:text-base leading-relaxed">
                        <p>DOKUMEN EVALUASI ASESOR RPL</p>
                        <p>Asesor: {watermark.asesor_name} | IP: {watermark.ip_address}</p>
                        <p>{watermark.timestamp}</p>
                    </div>
                    <div className="text-center font-bold tracking-widest text-slate-100 text-sm md:text-base leading-relaxed">
                        <p>DOKUMEN EVALUASI ASESOR RPL</p>
                        <p>Asesor: {watermark.asesor_name} | IP: {watermark.ip_address}</p>
                        <p>{watermark.timestamp}</p>
                    </div>
                </div>

                {/* Render PDF Frame or Image */}
                <div
                    style={{
                        transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.15s ease-out',
                    }}
                    className="relative z-10 w-full h-full max-w-4xl flex items-center justify-center shadow-2xl"
                >
                    {isPdf ? (
                        <iframe
                            src={`${document.url}#toolbar=0&navpanes=0`}
                            className="w-full h-full min-h-[500px] md:min-h-[700px] bg-white rounded-lg shadow-inner border-0"
                            title="PDF Document Viewer"
                        />
                    ) : (
                        <img
                            src={document.url}
                            alt={document.nama_dokumen}
                            className="max-h-full max-w-full object-contain rounded-lg bg-white shadow-2xl"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
