import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    FileText,
    ClipboardCheck,
    Video,
    Award,
    FileCheck,
    BarChart3,
    BookOpen,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    CheckCircle2,
    AlertTriangle,
    Info,
    GraduationCap,
    Clock,
    ChevronRight,
    ExternalLink,
    Scale,
    Briefcase,
    Sparkles,
    Search,
    UserCheck,
    Layers,
} from 'lucide-react';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Modal } from '@/Components/UI/Modal';

interface PageProps {
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
            role: string;
            role_label: string;
            masked_nik?: string;
        };
    };
    flash?: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
    app?: {
        name: string;
        version: string;
    };
}

export const AppLayout: React.FC<{
    title?: string;
    subtitle?: string;
    prodiName?: string;
    children: React.ReactNode;
}> = ({ title, subtitle, prodiName = 'Bimbingan dan Konseling Islam (BKI)', children }) => {
    const { auth, flash, app } = usePage<PageProps>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const currentUrl = window.location.pathname;

    const user = auth?.user;
    const userRole = user?.role || 'asesi';

    const handleLogout = () => {
        router.post('/logout');
    };

    const handleSwitchRole = (email: string) => {
        router.post('/login', {
            email: email,
            password: 'password123',
        });
    };

    // Sidebar menu items exactly matching UIN SSC Design
    const navItems = [
        {
            label: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            active: currentUrl === '/dashboard',
            roles: ['super_admin', 'admin_rpl', 'asesi', 'asesor', 'kaprodi', 'lpm', 'admin_siakad'],
        },
        {
            label: 'Pendaftar RPL',
            href: '/admin/pendaftar',
            icon: Users,
            active: currentUrl.startsWith('/admin/pendaftar'),
            roles: ['super_admin', 'admin_rpl', 'kaprodi', 'lpm'],
        },
        {
            label: 'Portofolio Peserta',
            href: '/form-f02',
            icon: FileText,
            active: currentUrl.startsWith('/form-f02'),
            roles: ['asesi', 'super_admin'],
        },
        {
            label: 'Penilaian Portofolio',
            href: '/asesor/penilaian',
            icon: ClipboardCheck,
            active: currentUrl.startsWith('/asesor'),
            roles: ['super_admin', 'asesor', 'admin_rpl'],
        },
        {
            label: 'Asesmen Lanjutan',
            href: '/uji-petik',
            icon: Video,
            active: currentUrl.startsWith('/uji-petik'),
            roles: ['super_admin', 'admin_rpl', 'asesor', 'lpm'],
        },
        {
            label: 'Rekognisi MK & SKS',
            href: '/sk-rekognisi',
            icon: Award,
            active: currentUrl.startsWith('/sk-rekognisi'),
            roles: ['super_admin', 'admin_rpl', 'kaprodi', 'admin_siakad', 'lpm'],
        },
        {
            label: 'Berita Acara / Pleno',
            href: '/pleno',
            icon: FileCheck,
            active: currentUrl.startsWith('/pleno'),
            roles: ['super_admin', 'admin_rpl', 'kaprodi', 'asesor', 'lpm'],
        },
        {
            label: 'Masa Sanggah',
            href: '/sanggah',
            icon: Scale,
            active: currentUrl.startsWith('/sanggah'),
            roles: ['super_admin', 'admin_rpl', 'asesi', 'kaprodi', 'lpm'],
        },
        {
            label: 'Laporan & Rekap',
            href: '/master-data',
            icon: BarChart3,
            active: currentUrl.startsWith('/master-data'),
            roles: ['super_admin', 'admin_rpl', 'kaprodi', 'lpm'],
        },
    ];

    const filteredNav = navItems.filter((item) => item.roles.includes(userRole));

    const roleDemoUsers = [
        { role: 'Asesor RPL', email: 'asesor1@kampus.ac.id', name: 'Dr. Ahmad Konselor, M.Pd' },
        { role: 'Admin Pusat RPL', email: 'adminrpl@kampus.ac.id', name: 'Admin Pusat RPL' },
        { role: 'Calon Mahasiswa (Asesi)', email: 'asesi.ahmad@example.com', name: 'Nadia Rahmawati' },
        { role: 'Ketua Prodi (Kaprodi)', email: 'kaprodi.ti@kampus.ac.id', name: 'Prof. Bambang Sutrisno' },
        { role: 'Penjaminan Mutu (LPM)', email: 'lpm@kampus.ac.id', name: 'Dr. Hendra Gunawan' },
        { role: 'Admin SIAKAD & Feeder', email: 'siakad@kampus.ac.id', name: 'Admin Biro Akademik' },
    ];

    return (
        <div className="min-h-screen bg-[#f4f7f9] flex flex-col md:flex-row font-sans selection:bg-[#0d6052] selection:text-white">
            {/* Mobile Header Bar */}
            <div className="md:hidden bg-[#0a2723] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-lg">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-900 shadow">
                        SSC
                    </div>
                    <div>
                        <span className="font-extrabold text-sm tracking-tight text-white block leading-none">UIN SSC</span>
                        <span className="text-[10px] text-emerald-300">Sistem Informasi RPL</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-emerald-950"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar Navigation - UIN SSC Emerald Dark */}
            <aside
                className={`
                    fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#0a2723] text-slate-200 flex flex-col justify-between border-r border-[#08201d] transition-transform duration-200 ease-in-out shadow-2xl
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Brand Header */}
                <div className="p-5 border-b border-emerald-900/40">
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        {/* Golden Emblem Icon */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center font-black text-[#0a2723] shadow-md shadow-amber-900/30 group-hover:scale-105 transition-transform">
                            <GraduationCap className="w-6 h-6 text-[#0a2723]" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="font-black text-sm text-white tracking-tight leading-none uppercase">UIN SSC</h1>
                            <p className="text-[10px] text-emerald-300 font-semibold mt-1 leading-tight">UIN Siber Syekh Nurjati Cirebon</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4">
                    <div>
                        <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400/80 mb-2">MENU UTAMA</p>
                        <div className="space-y-1">
                            {filteredNav.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group
                                            ${item.active
                                                ? 'bg-[#125c50] text-white shadow-md shadow-emerald-950 font-bold'
                                                : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/40'
                                            }
                                        `}
                                    >
                                        <Icon className={`w-4 h-4 transition-colors ${item.active ? 'text-amber-300' : 'text-emerald-300 group-hover:text-amber-300'}`} />
                                        <span className="flex-1">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* JALUR RPL SECTION */}
                    <div>
                        <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400/80 mb-2">JALUR RPL</p>
                        <div className="space-y-2 px-1">
                            <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-[#0c332e] flex items-center gap-2.5 text-xs text-emerald-100 hover:border-emerald-400 transition-colors cursor-pointer">
                                <div className="w-6 h-6 rounded-lg bg-emerald-600/30 flex items-center justify-center text-emerald-300">
                                    <GraduationCap className="w-3.5 h-3.5" />
                                </div>
                                <span className="font-bold text-[11px]">RPL Transfer Kredit</span>
                            </div>

                            <div className="p-2.5 rounded-xl border border-amber-500/30 bg-[#0c332e] flex items-center gap-2.5 text-xs text-amber-100 hover:border-amber-400 transition-colors cursor-pointer">
                                <div className="w-6 h-6 rounded-lg bg-amber-600/30 flex items-center justify-center text-amber-300">
                                    <Briefcase className="w-3.5 h-3.5" />
                                </div>
                                <span className="font-bold text-[11px]">RPL Perolehan Kredit</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Role Profile & Quick Switcher Footer */}
                <div className="p-3.5 border-t border-emerald-900/40 bg-[#071f1c]">
                    <div className="p-3 bg-[#0c332e] rounded-xl border border-emerald-800/40 space-y-2">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-400/50 text-emerald-200 flex items-center justify-center font-bold text-xs">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-[10px] text-emerald-300 uppercase font-extrabold tracking-wider block">Peran Aktif</span>
                                <p className="text-xs font-extrabold text-white truncate uppercase">{user?.role_label || 'ASESOR RPL'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 pt-1">
                            <button
                                type="button"
                                onClick={() => setIsRoleModalOpen(true)}
                                className="flex-1 py-1.5 px-2 rounded-lg bg-[#125c50] hover:bg-[#187566] text-white text-[10px] font-bold text-center transition-all"
                            >
                                Ganti Peran
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                title="Keluar"
                                className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-red-900 text-slate-300 hover:text-white transition-colors"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-[10px] text-emerald-400/60 font-medium mt-2">
                        &copy; 2025 UIN SSC. All rights reserved
                    </p>
                </div>
            </aside>

            {/* Main Content Viewport */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Clean Top Header Bar */}
                <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
                    <div>
                        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                            {title || `Sistem RPL – ${prodiName}`}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                            {subtitle || 'Penilaian Portofolio untuk Transfer dan Perolehan SKS'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Live Clock Badge */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-emerald-700" />
                            <span>
                                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })} &bull; 10:45 WIB
                            </span>
                        </div>

                        {/* Notification Bell Badge */}
                        <Link href="/sanggah" className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors">
                            <Bell className="w-4 h-4" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white font-black text-[9px] flex items-center justify-center shadow-sm">
                                6
                            </span>
                        </Link>

                        {/* User Header Profile */}
                        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
                            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="hidden md:block text-left">
                                <span className="block text-xs font-extrabold text-slate-900 leading-tight">{user?.name || 'Dr. Ahmad Konselor, M.Pd'}</span>
                                <span className="block text-[10px] font-semibold text-emerald-700">{user?.role_label || 'Asesor RPL'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Flash Messages */}
                <div className="px-6 pt-4">
                    {flash?.success && (
                        <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm font-medium animate-fade-in">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            <span>{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 text-sm font-medium animate-fade-in">
                            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                            <span>{flash.error}</span>
                        </div>
                    )}
                </div>

                {/* Main Content Body */}
                <main className="flex-1 p-5 md:p-6">
                    {children}
                </main>
            </div>

            {/* Quick Role Switcher Modal */}
            <Modal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                title="Ganti Peran Pengguna (Simulasi Cepat)"
                description="Pilih akun simulasi untuk beralih peran sistem secara instan"
            >
                <div className="space-y-2">
                    {roleDemoUsers.map((r) => (
                        <button
                            key={r.email}
                            type="button"
                            onClick={() => handleSwitchRole(r.email)}
                            className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                                user?.email === r.email
                                    ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                            }`}
                        >
                            <div>
                                <p className="font-extrabold text-xs text-slate-900">{r.name}</p>
                                <p className="text-[11px] text-slate-500">{r.email}</p>
                            </div>
                            <Badge variant={user?.email === r.email ? 'emerald' : 'slate'} size="sm">
                                {r.role}
                            </Badge>
                        </button>
                    ))}
                </div>
            </Modal>
        </div>
    );
};
