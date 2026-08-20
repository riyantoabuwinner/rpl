import React, { useState } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import {
    RefreshCw,
    Shield,
    Users,
    CheckCircle2,
    AlertCircle,
    Server,
    Zap,
    Search,
    KeyRound,
    UserCheck,
    Eye,
    ArrowUpDown,
    Clock,
    Database,
    Globe,
    Check,
    ExternalLink,
    Code,
    Lock,
} from 'lucide-react';
import { AppLayout } from '@/Components/Layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/UI/Card';
import { Badge } from '@/Components/UI/Badge';
import { Button } from '@/Components/UI/Button';
import { Modal } from '@/Components/UI/Modal';
import { Input } from '@/Components/UI/Input';

interface UserItem {
    id: number;
    name: string;
    username: string | null;
    email: string;
    nik: string | null;
    phone: string | null;
    role: string;
    role_label: string;
    portal_id: string | null;
    is_portal_synced: boolean;
    portal_synced_at: string | null;
    portal_data: Record<string, any> | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface PageProps {
    users: {
        data: UserItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: any[];
    };
    filters: {
        search: string;
        role: string;
    };
    stats: {
        total_users: number;
        synced_portal_count: number;
        local_only_count: number;
        active_users_count: number;
        last_synced_at: string | null;
    };
    connection: {
        online: boolean;
        status_code: number;
        duration_ms: number;
        endpoint: string;
        message: string;
    };
    recentLogs: Array<{
        id: string;
        action: string;
        status: string;
        response_code: number;
        response_message: string;
        created_at: string;
    }>;
}

export default function PortalUsersIndex({
    users,
    filters,
    stats,
    connection,
    recentLogs,
}: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
    const [selectedUserJson, setSelectedUserJson] = useState<UserItem | null>(null);

    // Sync Single User Form
    const syncForm = useForm({
        username: '',
        password: '',
    });

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/portal-users',
            { search, role: roleFilter },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterRole = (role: string) => {
        setRoleFilter(role);
        router.get(
            '/admin/portal-users',
            { search, role },
            { preserveState: true, replace: true }
        );
    };

    const handleSyncSingleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        syncForm.post('/admin/portal-users/sync-single', {
            preserveScroll: true,
            onSuccess: () => {
                setIsSyncModalOpen(false);
                syncForm.reset();
            },
        });
    };

    const handleTestConnection = () => {
        router.post('/admin/portal-users/test-connection', {}, { preserveScroll: true });
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'super_admin':
                return 'purple';
            case 'admin_rpl':
                return 'blue';
            case 'asesor':
                return 'indigo';
            case 'kaprodi':
                return 'amber';
            case 'lpm':
                return 'cyan';
            case 'admin_siakad':
                return 'teal';
            case 'asesi':
            default:
                return 'emerald';
        }
    };

    return (
        <AppLayout
            title="Sinkronisasi Pengguna Portal"
            subtitle="Manajemen integrasi akun Portal API dengan database lokal SIRPL"
        >
            <div className="space-y-6">
                {/* 1. Header Banner & Action */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#062420] via-[#0b3b34] to-[#125c50] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-800/40 relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="space-y-2 relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                            <Database className="w-3.5 h-3.5" />
                            <span>Arsitektur Local-First Caching</span>
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-white">
                            Integrasi & Sinkronisasi Akun Portal
                        </h2>
                        <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                            Pengguna login menggunakan <strong>Username & Password Portal</strong>. Kredensial disimpan di database lokal agar login berikutnya instan tanpa selalu menghubungkan API Portal. Jika data berubah di portal, sistem otomatis menarik pembaruan terbaru.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 relative z-10 w-full md:w-auto">
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={handleTestConnection}
                            className="bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-sm"
                        >
                            <Server className="w-4 h-4 mr-1.5" />
                            Uji Koneksi API
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => setIsSyncModalOpen(true)}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-950/20"
                        >
                            <RefreshCw className="w-4 h-4 mr-1.5" />
                            Sinkron Akun Portal
                        </Button>
                    </div>
                </div>

                {/* 2. Stat Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-slate-200/80 shadow-sm hover:shadow transition-shadow">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500">Total Akun Pengguna</p>
                                <h4 className="text-2xl font-black text-slate-900">{stats.total_users}</h4>
                                <span className="text-[11px] text-slate-400">{stats.active_users_count} Aktif</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200/80 shadow-sm hover:shadow transition-shadow">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                <Database className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500">Tersinkron Portal</p>
                                <h4 className="text-2xl font-black text-blue-900">{stats.synced_portal_count}</h4>
                                <span className="text-[11px] text-blue-600 font-medium">Tersimpan di DB lokal</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200/80 shadow-sm hover:shadow transition-shadow">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${connection.online ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                <Globe className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500">Status Server Portal</p>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-lg font-black text-slate-900">
                                        {connection.online ? 'Terhubung' : 'Standby / Error'}
                                    </h4>
                                </div>
                                <span className="text-[11px] text-slate-400">
                                    {connection.online ? `${connection.duration_ms} ms` : `HTTP ${connection.status_code}`}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200/80 shadow-sm hover:shadow transition-shadow">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500">Mode Sinkronisasi</p>
                                <h4 className="text-sm font-black text-slate-900">On-Demand Cache</h4>
                                <span className="text-[11px] text-slate-400 truncate block">
                                    {stats.last_synced_at ? `Update: ${stats.last_synced_at}` : 'Otomatis saat login'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 3. Logic Explanation Alert */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-emerald-600 text-white mt-0.5">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5 text-xs">
                            <p className="font-bold text-slate-900">
                                Alur Otomatisasi Sinkronisasi Kredensial Portal:
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                <strong>1. Login Cepat:</strong> Sistem mengecek database lokal terlebih dahulu. Jika cocok, user langsung masuk tanpa menghubungi API Portal. <br />
                                <strong>2. Pembaruan Otomatis:</strong> Jika password diubah di portal atau data akun belum ada di database lokal, sistem baru menghubungi API Portal, menyinkronkan data terbaru, dan memperbarui cache password lokal.
                            </p>
                        </div>
                    </div>
                    <div className="text-xs text-slate-500 font-mono bg-white px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
                        Endpoint: <code className="text-emerald-700 font-bold">{connection.endpoint}</code>
                    </div>
                </div>

                {/* 4. Filter & Search Controls */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama, username portal, email, atau NIK..."
                            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                        />
                    </form>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Filter Peran:</span>
                        {['', 'super_admin', 'admin_rpl', 'asesor', 'asesi', 'kaprodi', 'lpm', 'admin_siakad'].map((roleKey) => (
                            <button
                                key={roleKey}
                                type="button"
                                onClick={() => handleFilterRole(roleKey)}
                                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                                    roleFilter === roleKey
                                        ? 'bg-[#125c50] text-white shadow'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {roleKey === '' ? 'Semua' : roleKey.replace('_', ' ').toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 5. User Data Table */}
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-bold text-slate-900">
                                Daftar Pengguna Tersimpan di Database
                            </CardTitle>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Menampilkan {users.data.length} dari total {users.total} data akun pengguna
                            </p>
                        </div>
                    </CardHeader>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Pengguna</th>
                                    <th className="py-3 px-4">Username Portal</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">Peran Sistem</th>
                                    <th className="py-3 px-4">Status Integrasi</th>
                                    <th className="py-3 px-4">Terakhir Disinkron</th>
                                    <th className="py-3 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-slate-400">
                                            Tidak ditemukan data akun pengguna.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{user.name}</div>
                                                        {user.nik && (
                                                            <div className="text-[10px] text-slate-400">
                                                                NIK: {user.nik}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                                                    {user.username || '-'}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-slate-600">{user.email}</td>
                                            <td className="py-3 px-4">
                                                <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                                                    {user.role_label}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                {user.is_portal_synced ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                                        <Check className="w-3 h-3" /> Tersinkron Portal
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                                                        <Database className="w-3 h-3" /> Database Lokal
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-slate-500 text-[11px]">
                                                {user.portal_synced_at || user.updated_at || '-'}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {user.portal_data && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedUserJson(user)}
                                                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                                                            title="Lihat Data JSON Portal"
                                                        >
                                                            <Code className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            syncForm.setData({
                                                                username: user.username || user.email,
                                                                password: '',
                                                            });
                                                            setIsSyncModalOpen(true);
                                                        }}
                                                        className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-[11px] transition-colors"
                                                    >
                                                        Sinkron Ulang
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                            <div className="text-xs text-slate-500">
                                Halaman {users.current_page} dari {users.last_page}
                            </div>
                            <div className="flex gap-1">
                                {users.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                            link.active
                                                ? 'bg-[#125c50] text-white'
                                                : link.url
                                                ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                                : 'text-slate-300 pointer-events-none'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </Card>

                {/* 6. Recent Logs Card */}
                {recentLogs && recentLogs.length > 0 && (
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="px-6 py-4 border-b border-slate-200">
                            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-emerald-600" />
                                Riwayat Panggilan Integrasi API Portal Terakhir
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100 text-xs">
                                {recentLogs.map((log) => (
                                    <div key={log.id} className="p-4 flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="font-bold text-slate-800 flex items-center gap-2">
                                                <span>{log.action}</span>
                                                <Badge
                                                    variant={log.status === 'success' ? 'emerald' : 'rose'}
                                                    size="sm"
                                                >
                                                    {log.status.toUpperCase()}
                                                </Badge>
                                            </div>
                                            <div className="text-slate-500 text-[11px] truncate max-w-xl">
                                                {log.response_message || 'OK'}
                                            </div>
                                        </div>
                                        <div className="text-right text-[11px] text-slate-400">
                                            <div>HTTP {log.response_code || 200}</div>
                                            <div>{log.created_at}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* MODAL 1: SINKRONKAN AKUN DARI PORTAL */}
            <Modal
                isOpen={isSyncModalOpen}
                onClose={() => setIsSyncModalOpen(false)}
                title="Tarik & Sinkronkan Akun dari API Portal"
                size="md"
            >
                <form onSubmit={handleSyncSingleSubmit} className="space-y-4">
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 leading-relaxed">
                        Masukkan <strong>Username</strong> dan <strong>Password</strong> Portal untuk memverifikasi akun ke API Portal dan memperbarui data akun di database lokal SIRPL.
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Username Portal <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={syncForm.data.username}
                            onChange={(e) => syncForm.setData('username', e.target.value)}
                            placeholder="Contoh: adminportal_iain"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                        />
                        {syncForm.errors.username && (
                            <p className="text-xs text-red-600 mt-1">{syncForm.errors.username}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Password Portal <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            required
                            value={syncForm.data.password}
                            onChange={(e) => syncForm.setData('password', e.target.value)}
                            placeholder="Masukkan password portal"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                        />
                        {syncForm.errors.password && (
                            <p className="text-xs text-red-600 mt-1">{syncForm.errors.password}</p>
                        )}
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setIsSyncModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            isLoading={syncForm.processing}
                            className="bg-[#125c50] hover:bg-[#187566] text-white font-bold"
                        >
                            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                            Tarik & Sinkronkan
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* MODAL 2: DETAIL JSON DATA PORTAL */}
            <Modal
                isOpen={!!selectedUserJson}
                onClose={() => setSelectedUserJson(null)}
                title={`Data Payload Portal - ${selectedUserJson?.name}`}
                size="lg"
            >
                <div className="space-y-3">
                    <div className="text-xs text-slate-500">
                        Payload data asli yang diterima dari response API Portal:
                    </div>
                    <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-96">
                        {JSON.stringify(selectedUserJson?.portal_data, null, 2)}
                    </pre>
                    <div className="flex justify-end pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedUserJson(null)}
                        >
                            Tutup
                        </Button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}
