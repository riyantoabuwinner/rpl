import React, { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '@/Components/UI/Button';
import { Input } from '@/Components/UI/Input';
import { Badge } from '@/Components/UI/Badge';

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: 'adminrpl@kampus.ac.id',
        password: 'password123',
        remember: true,
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    // Quick demo login profiles
    const demoAccounts = [
        { role: 'Admin Pusat RPL', email: 'adminrpl@kampus.ac.id', color: 'blue' },
        { role: 'Asesor 1 (Dr. Ahmad)', email: 'asesor1@kampus.ac.id', color: 'indigo' },
        { role: 'Asesi RPL A2 (Ahmad Fauzi)', email: 'asesi.ahmad@example.com', color: 'emerald' },
        { role: 'Kaprodi (Prof. Bambang)', email: 'kaprodi.ti@kampus.ac.id', color: 'purple' },
        { role: 'LPM (Dr. Hendra)', email: 'lpm@kampus.ac.id', color: 'amber' },
        { role: 'Admin SIAKAD', email: 'siakad@kampus.ac.id', color: 'sky' },
        { role: 'Super Admin', email: 'superadmin@kampus.ac.id', color: 'slate' },
    ];

    const pickAccount = (email: string) => {
        setData({
            ...data,
            email,
            password: 'password123',
        });
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-blue-600 selection:text-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_10%,rgba(37,99,235,0.2),rgba(255,255,255,0))]" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
                <Link href="/" className="inline-flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-extrabold text-white shadow-xl shadow-blue-900/40 group-hover:scale-105 transition-transform">
                        <GraduationCap className="w-7 h-7" />
                    </div>
                </Link>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Masuk ke Portal SIRPL</h2>
                <p className="text-xs text-slate-400">Sistem Informasi Rekognisi Pembelajaran Lampau</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
                <div className="bg-white/95 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-100 space-y-6">
                    {status && (
                        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
                            {status}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="nama@kampus.ac.id"
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-600 font-medium mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-600 font-medium mt-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>Ingat sesi saya</span>
                            </label>
                        </div>

                        <Button type="submit" variant="primary" size="lg" isLoading={processing} className="w-full shadow-lg shadow-blue-600/30">
                            Masuk ke Sistem <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Button>
                    </form>

                    {/* Fast Demo Role Picker */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Pilih Akun Cepat untuk Pengujian (Semua Password: password123):</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            {demoAccounts.map((acc) => (
                                <button
                                    key={acc.email}
                                    type="button"
                                    onClick={() => pickAccount(acc.email)}
                                    className={`p-2 rounded-xl border text-left transition-all ${
                                        data.email === acc.email
                                            ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold ring-1 ring-blue-400'
                                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    <p className="font-bold text-[11px] truncate">{acc.role}</p>
                                    <p className="text-[10px] text-slate-500 font-mono truncate">{acc.email}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="text-center text-xs text-slate-500 pt-2">
                        Belum memiliki akun Asesi?{' '}
                        <Link href="/register" className="font-bold text-blue-600 hover:underline">
                            Daftar Sekarang
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
