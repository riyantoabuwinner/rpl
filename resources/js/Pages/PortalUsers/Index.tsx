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
    GraduationCap,
    Sparkles,
    UserCog,
    ChevronDown,
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

interface RoleOption {
    value: string;
    label: string;
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
    availableRoles?: RoleOption[];
}

export default function PortalUsersIndex({
    users,
    filters,
    stats,
    connection,
    recentLogs,
    availableRoles = [
        { value: 'asesor', label: 'Asesor Evaluator' },
        { value: 'admin_rpl', label: 'Admin Pusat RPL' },
        { value: 'kaprodi', label: 'Ketua Program Studi / Pimpinan' },
        { value: 'lpm', label: 'Lembaga Penjaminan Mutu (LPM)' },
        { value: 'admin_siakad', label: 'Administrator SIAKAD & Feeder' },
        { value: 'asesi', label: 'Asesi / Calon Mahasiswa' },
        { value: 'super_admin', label: 'Super Administrator' },
    ],
}: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
    const [selectedUserJson, setSelectedUserJson] = useState<UserItem | null>(null);
    const [roleEditUser, setRoleEditUser] = useState<UserItem | null>(null);

    // Sync Single User Form (Default Role: Asesor Evaluator for Dosen Portal)
    const syncForm = useForm({
        username: '',
        password: '',
        target_role: 'asesor',
    });

    // Role Update Form
    const roleForm = useForm({
        role: 'asesor',
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

    const handleOpenSyncModal = (defaultRole: string = 'asesor', initialUsername: string = '') => {
        syncForm.setData({
            username: initialUsername,
            password: '',
            target_role: defaultRole,
        });
        setIsSyncModalOpen(true);
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

    const handleOpenRoleModal = (user: UserItem) => {
        setRoleEditUser(user);
        roleForm.setData('role', user.role);
    };

    const handleRoleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roleEditUser) return;

        roleForm.post(`/admin/portal-users/${roleEditUser.id}/update-role`, {
            preserveScroll: true,
            onSuccess: () => {
                setRoleEditUser(null);
            },
        });
    };

    const handleQuickAssignAsesor = (user: UserItem) => {
        router.post(`/admin/portal-users/${user.id}/update-role`, {
            role: 'asesor',
        }, { preserveScroll: true });
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

    // Quick demo Dosen profiles for easy testing
    const sampleDosenPresets = [
        { label: 'Dr. Ahmad Konselor, M.Pd.', username: 'dosen.ahmad', role: 'asesor' },
        { label: 'Dr. Siti Aminah, M.T.', username: 'dosen.siti', role: 'asesor' },
        { label: 'Prof. Dr. Ir. Bambang Hermanto', username: 'dosen.bambang', role: 'asesor' },
    ];

    return (
        <AppLayout
            title="Sinkronisasi Pengguna Portal & Asesor"
            subtitle="Manajemen integrasi akun Portal API Dosen sebagai Asesor Evaluator SIRPL"
        >
            <div className="space-y-6">
                {/* 1. Header Banner & Actions */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#062420] via-[#0b3b34] to-[#125c50] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-800/40 relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="space-y-2 relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>Integrasi Dosen Portal & Asesor RPL</span>
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-white">
                            Sinkronisasi Dosen Portal & Manajemen Pengguna
                        </h2>
                        <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                            Admin & Superadmin dapat menarik data akun <strong>Dosen dari Portal SSO</strong> dan menetapkannya secara langsung sebagai <strong>Asesor Evaluator</strong>. Kredensial tersimpan di database lokal sehingga saat asesor login tidak membebani server Portal API.
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
                            onClick={() => handleOpenSyncModal('asesor')}
                            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-950/20 border-0"
                        >
                            <GraduationCap className="w-4 h-4 mr-1.5" />
                            Sinkronkan Dosen sebagai Asesor
                        </Button>
                    </div>
                </div>

                {/* 2. Stat Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-slate-200/80 shadow-sm hover:shadow transition-shadow">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500">Asesor Evaluator Aktif</p>
                                <h4 className="text-2xl font-black text-indigo-950">
                                    {users.data.filter((u) => u.role === 'asesor').length}
                                </h4>
                                <span className="text-[11px] text-indigo-600 font-medium">Penilai Portofolio RPL</span>
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
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500">Total Akun Pengguna</p>
                                <h4 className="text-2xl font-black text-slate-900">{stats.total_users}</h4>
                                <span className="text-[11px] text-slate-400">{stats.active_users_count} Pengguna Aktif</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 3. Role Assignment Highlight Alert */}
                <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 text-indigo-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-600 text-white mt-0.5 shadow-sm">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5 text-xs">
                            <p className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>Penetapan Role Asesor untuk Dosen Portal:</span>
                                <Badge variant="indigo" size="sm">Fitur Asesor</Badge>
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                Saat menarik data akun dosen dari portal, pilih opsi peran <strong>"Asesor Evaluator"</strong>. Akun tersebut akan otomatis terdaftar sebagai Asesor RPL yang siap ditugaskan pada mata kuliah dan penilaian portofolio asesi (Form F-02 & F-03).
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
                            placeholder="Cari nama dosen, username portal, NIP, atau email..."
                            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                        />
                    </form>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Filter Peran:</span>
                        {[
                            { key: '', label: 'Semua' },
                            { key: 'asesor', label: '🎓 ASESOR' },
                            { key: 'admin_rpl', label: 'ADMIN RPL' },
                            { key: 'super_admin', label: 'SUPER ADMIN' },
                            { key: 'kaprodi', label: 'KAPRODI' },
                            { key: 'lpm', label: 'LPM' },
                            { key: 'admin_siakad', label: 'SIAKAD' },
                            { key: 'asesi', label: 'ASESI' },
                        ].map((roleItem) => (
                            <button
                                key={roleItem.key}
                                type="button"
                                onClick={() => handleFilterRole(roleItem.key)}
                                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                                    roleFilter === roleItem.key
                                        ? 'bg-[#125c50] text-white shadow'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {roleItem.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 5. User Data Table */}
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <Users className="w-4 h-4 text-emerald-600" />
                                Daftar Pengguna & Asesor Tersimpan di Database
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
                                    <th className="py-3 px-4">Pengguna / Dosen</th>
                                    <th className="py-3 px-4">Username Portal</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">Peran Sistem</th>
                                    <th className="py-3 px-4">Status Integrasi</th>
                                    <th className="py-3 px-4">Terakhir Disinkron</th>
                                    <th className="py-3 px-4 text-right">Aksi & Peran</th>
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
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm text-white ${user.role === 'asesor' ? 'bg-indigo-600' : 'bg-emerald-700'}`}>
                                                        {user.role === 'asesor' ? <GraduationCap className="w-4 h-4" /> : user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                                            <span>{user.name}</span>
                                                            {user.role === 'asesor' && (
                                                                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.2 rounded border border-indigo-200">
                                                                    Asesor
                                                                </span>
                                                            )}
                                                        </div>
                                                        {user.nik && (
                                                            <div className="text-[10px] text-slate-400">
                                                                NIK/NIP: {user.nik}
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
                                                    {/* Quick Set Role to Asesor if not yet Asesor */}
                                                    {user.role !== 'asesor' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleQuickAssignAsesor(user)}
                                                            className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-[11px] transition-colors flex items-center gap-1"
                                                            title="Jadikan Asesor RPL"
                                                        >
                                                            <GraduationCap className="w-3 h-3" />
                                                            <span>Jadikan Asesor</span>
                                                        </button>
                                                    )}

                                                    {/* Change Role Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenRoleModal(user)}
                                                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                                                        title="Ubah Peran Pengguna"
                                                    >
                                                        <UserCog className="w-3.5 h-3.5" />
                                                    </button>

                                                    {/* View Portal JSON Payload */}
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

                                                    {/* Re-Sync Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenSyncModal(user.role, user.username || user.email)}
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

            {/* MODAL 1: SINKRONKAN AKUN DOSEN / USER DARI PORTAL */}
            <Modal
                isOpen={isSyncModalOpen}
                onClose={() => setIsSyncModalOpen(false)}
                title="Sinkronkan Akun Dosen / Pengguna Portal"
                size="md"
            >
                <form onSubmit={handleSyncSingleSubmit} className="space-y-4">
                    <div className="p-3.5 bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-2xl border border-indigo-200 text-xs text-indigo-950 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                            <GraduationCap className="w-4 h-4 text-indigo-600" />
                            <span>Penarikan Akun Dosen sebagai Asesor RPL</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            Masukkan Username (NIP/NIDN/Username Portal) dan Password untuk menarik data dari API Portal dan menetapkannya dengan peran yang dipilih.
                        </p>
                    </div>

                    {/* Quick Demo Dosen Picker */}
                    <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            Contoh Akun Dosen Portal:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                            {sampleDosenPresets.map((preset) => (
                                <button
                                    key={preset.username}
                                    type="button"
                                    onClick={() => {
                                        syncForm.setData({
                                            username: preset.username,
                                            password: '123',
                                            target_role: preset.role,
                                        });
                                    }}
                                    className="p-2 rounded-xl text-left border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-xs"
                                >
                                    <div className="font-bold text-slate-800 text-[11px] truncate">{preset.label}</div>
                                    <div className="text-[10px] text-slate-400 font-mono">{preset.username}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Username / NIP Portal Dosen <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={syncForm.data.username}
                            onChange={(e) => syncForm.setData('username', e.target.value)}
                            placeholder="Contoh: dosen.ahmad atau 198503032010011003"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
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
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                        />
                        {syncForm.errors.password && (
                            <p className="text-xs text-red-600 mt-1">{syncForm.errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Tetapkan Peran Sistem RPL <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={syncForm.data.target_role}
                            onChange={(e) => syncForm.setData('target_role', e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-800"
                        >
                            <option value="asesor">🎓 Asesor Evaluator (Rekomendasi Dosen)</option>
                            <option value="admin_rpl">🛡️ Admin Pusat RPL</option>
                            <option value="kaprodi">👔 Ketua Program Studi (Kaprodi)</option>
                            <option value="lpm">🔍 Lembaga Penjaminan Mutu (LPM)</option>
                            <option value="admin_siakad">💻 Administrator SIAKAD & Feeder</option>
                            <option value="asesi">👤 Asesi / Calon Mahasiswa</option>
                            <option value="super_admin">⚡ Super Administrator</option>
                        </select>
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
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                        >
                            <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                            Tarik & Tetapkan Role
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* MODAL 2: UBAH PERAN PENGGUNA LANGSUNG */}
            <Modal
                isOpen={!!roleEditUser}
                onClose={() => setRoleEditUser(null)}
                title={`Ubah Peran Pengguna - ${roleEditUser?.name}`}
                size="md"
            >
                <form onSubmit={handleRoleUpdateSubmit} className="space-y-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                        Pilih peran sistem SIRPL yang ingin ditetapkan untuk pengguna <strong>{roleEditUser?.name}</strong> ({roleEditUser?.username || roleEditUser?.email}).
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Pilih Peran Baru:
                        </label>
                        <select
                            value={roleForm.data.role}
                            onChange={(e) => roleForm.setData('role', e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-800"
                        >
                            <option value="asesor">🎓 Asesor Evaluator</option>
                            <option value="admin_rpl">🛡️ Admin Pusat RPL</option>
                            <option value="kaprodi">👔 Ketua Program Studi (Kaprodi)</option>
                            <option value="lpm">🔍 Lembaga Penjaminan Mutu (LPM)</option>
                            <option value="admin_siakad">💻 Administrator SIAKAD & Feeder</option>
                            <option value="asesi">👤 Asesi / Calon Mahasiswa</option>
                            <option value="super_admin">⚡ Super Administrator</option>
                        </select>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setRoleEditUser(null)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            isLoading={roleForm.processing}
                            className="bg-[#125c50] hover:bg-[#187566] text-white font-bold"
                        >
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* MODAL 3: DETAIL JSON DATA PORTAL */}
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
