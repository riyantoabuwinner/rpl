import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import {
    GraduationCap,
    Lock,
    Mail,
    Eye,
    EyeOff,
    ArrowRight,
    Shield,
    Users,
    KeyRound,
    Sparkles,
    UserPlus,
    LogIn,
    Phone,
    IdCard,
    CheckCircle2,
    ShieldCheck,
    HelpCircle,
    BookOpen,
} from 'lucide-react';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Badge } from '@/Components/UI/Badge';

export default function UnifiedAuth({
    status,
    initialTab = 'login',
}: {
    status?: string;
    initialTab?: 'login' | 'register';
}) {
    const [tab, setTab] = useState<'login' | 'register'>(initialTab);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

    useEffect(() => {
        if (initialTab) {
            setTab(initialTab);
        }
    }, [initialTab]);

    // 1. Login Form
    const loginForm = useForm({
        email: 'adminrpl@kampus.ac.id',
        password: 'password123',
        remember: true,
    });

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginForm.post('/login');
    };

    // 2. Register Form (Asesi Baru)
    const registerForm = useForm({
        name: '',
        email: '',
        nik: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        registerForm.post('/register');
    };

    // Quick demo login profiles
    const demoAccounts = [
        { role: 'Admin Pusat RPL', email: 'adminrpl@kampus.ac.id', name: 'Pengelola RPL', color: 'blue' },
        { role: 'Asesor 1 (Dr. Ahmad)', email: 'asesor1@kampus.ac.id', name: 'Dosen Evaluator', color: 'indigo' },
        { role: 'Asesi (Toheri - TMT)', email: 'toheri@uinssc.ac.id', name: 'Asesi Tadris MTK', color: 'emerald' },
        { role: 'Asesi (Ahmad - TI)', email: 'asesi.ahmad@example.com', name: 'Asesi RPL A2', color: 'teal' },
        { role: 'Kaprodi (Prof. Bambang)', email: 'kaprodi.ti@kampus.ac.id', name: 'Ketua Prodi', color: 'purple' },
        { role: 'Penjaminan Mutu (LPM)', email: 'lpm@kampus.ac.id', name: 'Auditor Mutu', color: 'amber' },
        { role: 'Admin SIAKAD', email: 'siakad@kampus.ac.id', name: 'Biro Akademik', color: 'sky' },
        { role: 'Super Administrator', email: 'superadmin@kampus.ac.id', name: 'Super Admin', color: 'slate' },
    ];

    const pickAccount = (email: string) => {
        setTab('login');
        loginForm.setData({
            ...loginForm.data,
            email,
            password: 'password123',
        });
    };

    return (
        <div className="min-h-screen bg-[#071f1c] flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative selection:bg-emerald-600 selection:text-white font-sans">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_10%,rgba(18,92,80,0.4),rgba(0,0,0,0))]" />

            {/* Top Brand Header */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-2">
                <Link href="/" className="inline-flex items-center gap-3 group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center font-extrabold text-slate-950 shadow-xl shadow-amber-900/30 group-hover:scale-105 transition-transform p-2">
                        <GraduationCap className="w-9 h-9" />
                    </div>
                </Link>
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        UIN SIBER SYEKH NURJATI CIREBON
                    </h1>
                    <p className="text-xs font-semibold text-emerald-300/90 tracking-wide uppercase mt-0.5">
                        Sistem Informasi Rekognisi Pembelajaran Lampau (SIRPL)
                    </p>
                </div>
            </div>

            {/* Main Unified Auth Card */}
            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
                <div className="bg-white/98 backdrop-blur-md shadow-2xl rounded-3xl border border-emerald-800/30 overflow-hidden">
                    {/* Switcher Tabs (Login vs Register) */}
                    <div className="grid grid-cols-2 p-1.5 bg-slate-100/90 border-b border-slate-200">
                        <button
                            type="button"
                            onClick={() => setTab('login')}
                            className={`py-3 text-xs font-extrabold rounded-2xl transition-all flex items-center justify-center gap-2 ${
                                tab === 'login'
                                    ? 'bg-[#125c50] text-white shadow-md'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Masuk ke Akun</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab('register')}
                            className={`py-3 text-xs font-extrabold rounded-2xl transition-all flex items-center justify-center gap-2 ${
                                tab === 'register'
                                    ? 'bg-[#125c50] text-white shadow-md'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>Daftar Akun Baru</span>
                        </button>
                    </div>

                    {status && (
                        <div className="m-5 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                            {status}
                        </div>
                    )}

                    {/* TAB 1: LOGIN FORM */}
                    {tab === 'login' && (
                        <div className="p-6 sm:p-8 space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-slate-900">Masuk ke Portal SIRPL</h3>
                                <p className="text-xs text-slate-500">
                                    Silakan masukkan email dan kata sandi yang telah terdaftar
                                </p>
                            </div>

                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Alamat Email <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                        <input
                                            type="email"
                                            required
                                            value={loginForm.data.email}
                                            onChange={(e) => loginForm.setData('email', e.target.value)}
                                            placeholder="nama@kampus.ac.id"
                                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 font-medium"
                                        />
                                    </div>
                                    {loginForm.errors.email && (
                                        <p className="text-xs text-red-600 font-medium mt-1">{loginForm.errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="text-xs font-semibold text-slate-700">
                                            Kata Sandi <span className="text-red-500">*</span>
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                        <input
                                            type={showLoginPassword ? 'text' : 'password'}
                                            required
                                            value={loginForm.data.password}
                                            onChange={(e) => loginForm.setData('password', e.target.value)}
                                            className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                                            className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                                        >
                                            {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {loginForm.errors.password && (
                                        <p className="text-xs text-red-600 font-medium mt-1">{loginForm.errors.password}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-xs pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                                        <input
                                            type="checkbox"
                                            checked={loginForm.data.remember}
                                            onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <span>Ingat sesi saya</span>
                                    </label>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    isLoading={loginForm.processing}
                                    className="w-full bg-[#125c50] hover:bg-[#187566] text-white shadow-lg shadow-emerald-950/20 py-2.5"
                                >
                                    Masuk ke Sistem <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </form>

                            {/* Quick Demo Role Picker */}
                            <div className="pt-4 border-t border-slate-100 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                        Masuk Cepat Demo Peran:
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-1.5">
                                    {demoAccounts.map((acc) => (
                                        <button
                                            key={acc.email}
                                            type="button"
                                            onClick={() => pickAccount(acc.email)}
                                            className="p-2 rounded-xl text-left border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-xs group"
                                        >
                                            <div className="font-bold text-slate-800 group-hover:text-emerald-800 text-[11px] truncate">
                                                {acc.role}
                                            </div>
                                            <div className="text-[10px] text-slate-400 truncate">{acc.name}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: REGISTER FORM (ASESI BARU) */}
                    {tab === 'register' && (
                        <div className="p-6 sm:p-8 space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-slate-900">Pendaftaran Akun Asesi Baru</h3>
                                <p className="text-xs text-slate-500">
                                    Buat akun untuk memulai pengajuan Rekognisi Pembelajaran Lampau (Form 2/F02)
                                </p>
                            </div>

                            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Nama Lengkap (Sesuai KTP/Ijazah) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={registerForm.data.name}
                                        onChange={(e) => registerForm.setData('name', e.target.value)}
                                        placeholder="Contoh: TOHERI"
                                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 font-medium"
                                    />
                                    {registerForm.errors.name && (
                                        <p className="text-xs text-red-600 font-medium mt-1">{registerForm.errors.name}</p>
                                    )}
                                </div>

                                <div className="grid sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            NIK (16 Digit KTP) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            maxLength={16}
                                            value={registerForm.data.nik}
                                            onChange={(e) => registerForm.setData('nik', e.target.value.replace(/\D/g, ''))}
                                            placeholder="3213011607730001"
                                            className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 font-mono"
                                        />
                                        {registerForm.errors.nik && (
                                            <p className="text-xs text-red-600 font-medium mt-1">{registerForm.errors.nik}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            No. HP / WhatsApp <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={registerForm.data.phone}
                                            onChange={(e) => registerForm.setData('phone', e.target.value)}
                                            placeholder="081320741803"
                                            className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                                        />
                                        {registerForm.errors.phone && (
                                            <p className="text-xs text-red-600 font-medium mt-1">{registerForm.errors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Alamat Email Aktif <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={registerForm.data.email}
                                        onChange={(e) => registerForm.setData('email', e.target.value)}
                                        placeholder="nama@email.com"
                                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                                    />
                                    {registerForm.errors.email && (
                                        <p className="text-xs text-red-600 font-medium mt-1">{registerForm.errors.email}</p>
                                    )}
                                </div>

                                <div className="grid sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Kata Sandi <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showRegisterPassword ? 'text' : 'password'}
                                                required
                                                value={registerForm.data.password}
                                                onChange={(e) => registerForm.setData('password', e.target.value)}
                                                className="w-full pl-3.5 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                                            >
                                                {showRegisterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                        {registerForm.errors.password && (
                                            <p className="text-xs text-red-600 font-medium mt-1">{registerForm.errors.password}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Konfirmasi Sandi <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showRegisterConfirmPassword ? 'text' : 'password'}
                                                required
                                                value={registerForm.data.password_confirmation}
                                                onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                                className="w-full pl-3.5 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                                                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                                            >
                                                {showRegisterConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                                        <span>Perlindungan Data Pribadi</span>
                                    </div>
                                    <p>
                                        Data NIK dan dokumen portofolio Anda dienkripsi secara aman sesuai regulasi Permendikbudristek No. 41 Tahun 2021.
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    isLoading={registerForm.processing}
                                    className="w-full bg-[#125c50] hover:bg-[#187566] text-white shadow-lg shadow-emerald-950/20 py-2.5"
                                >
                                    Daftar Sekarang <UserPlus className="w-4 h-4 ml-2" />
                                </Button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Footer Information Links */}
                <div className="mt-6 text-center space-y-2">
                    <div className="flex items-center justify-center gap-4 text-xs text-emerald-200/70">
                        <Link href="/" className="hover:text-white transition-colors">
                            &larr; Halaman Utama
                        </Link>
                        <span>&bull;</span>
                        <Link href="/panduan" className="hover:text-white transition-colors flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" /> Panduan Sistem
                        </Link>
                    </div>
                    <p className="text-[11px] text-emerald-300/50 font-mono">
                        SIRPL v2.0 &bull; UIN Siber Syekh Nurjati Cirebon &bull; Standar SN-Dikti
                    </p>
                </div>
            </div>
        </div>
    );
}
