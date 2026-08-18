import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { GraduationCap, Lock, Mail, User, Phone, IdCard, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/Components/UI/Button';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        nik: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-blue-600 selection:text-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_10%,rgba(37,99,235,0.2),rgba(255,255,255,0))]" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-2">
                <Link href="/" className="inline-flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-extrabold text-white shadow-xl">
                        <GraduationCap className="w-7 h-7" />
                    </div>
                </Link>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Pendaftaran Akun Asesi RPL</h2>
                <p className="text-xs text-slate-400">Buat akun untuk memulai pengisian Evaluasi Diri (Form F-02)</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4">
                <div className="bg-white/95 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-100 space-y-5">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nama Lengkap */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Nama Lengkap (Sesuai KTP/Ijazah) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ahmad Fauzi"
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-600 font-medium mt-1">{errors.name}</p>}
                        </div>

                        {/* NIK 16 Digit & Phone Grid */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    NIK (16 Digit KTP) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <IdCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                    <input
                                        type="text"
                                        required
                                        maxLength={16}
                                        value={data.nik}
                                        onChange={(e) => setData('nik', e.target.value.replace(/\D/g, ''))}
                                        placeholder="327101xxxxxxxxxx"
                                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-mono"
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    {errors.nik ? (
                                        <p className="text-xs text-red-600 font-medium">{errors.nik}</p>
                                    ) : (
                                        <span className="text-[10px] text-slate-400">{data.nik.length}/16 digit</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    No. WhatsApp / Telepon <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                    <input
                                        type="tel"
                                        required
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="085712345678"
                                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                    />
                                </div>
                                {errors.phone && <p className="text-xs text-red-600 font-medium mt-1">{errors.phone}</p>}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Alamat Email Aktif <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="nama@email.com"
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-600 font-medium mt-1">{errors.email}</p>}
                        </div>

                        {/* Passwords */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Kata Sandi <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                    <input
                                        type="password"
                                        required
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Minimal 8 karakter"
                                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                    />
                                </div>
                                {errors.password && <p className="text-xs text-red-600 font-medium mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Ulangi Kata Sandi <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                    <input
                                        type="password"
                                        required
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi kata sandi"
                                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button type="submit" variant="primary" size="lg" isLoading={processing} className="w-full shadow-lg shadow-blue-600/30">
                                Buat Akun & Lanjut ke Form F-02 <ArrowRight className="w-4 h-4 ml-1.5" />
                            </Button>
                        </div>
                    </form>

                    <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                        Sudah memiliki akun terdaftar?{' '}
                        <Link href="/login" className="font-bold text-blue-600 hover:underline">
                            Masuk Disini
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
