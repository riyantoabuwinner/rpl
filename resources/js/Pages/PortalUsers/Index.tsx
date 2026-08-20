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
    CheckSquare,
    Square,
    DownloadCloud,
    Filter,
    UserX,
    HelpCircle,
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
    role: string | null;
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
        unassigned_count: number;
        asesor_count: number;
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
    const [isBulkSyncModalOpen, setIsBulkSyncModalOpen] = useState(false);
    const [selectedUserJson, setSelectedUserJson] = useState<UserItem | null>(null);
    const [roleEditUser, setRoleEditUser] = useState<UserItem | null>(null);

    // Multi-select for batch role assignment
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [isBatchRoleModalOpen, setIsBatchRoleModalOpen] = useState(false);
    const [batchRole, setBatchRole] = useState('asesor');

    // Sync Single User Form
    const syncForm = useForm({
        username: '',
        password: '',
        target_role: 'asesor',
    });

    // Bulk Sync Form (Default Role: Empty / Unassigned)
    const bulkSyncForm = useForm({
        type: 'all',
        default_role: '', // Kosongkan peran awal
    });

    // Single Role Update Form
    const roleForm = useForm({
        role: 'asesor',
    });

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/portal-users',
            { search: search.trim(), role: roleFilter },
            { preserveState: false, replace: true }
        );
    };

    const handleClearSearch = () => {
        setSearch('');
        router.get(
            '/admin/portal-users',
            { search: '', role: roleFilter },
            { preserveState: false, replace: true }
        );
    };

    const handleResetAllFilters = () => {
        setSearch('');
        setRoleFilter('');
        router.get('/admin/portal-users', {}, { preserveState: false, replace: true });
    };

    const handleFilterRole = (role: string) => {
        setRoleFilter(role);
        router.get(
            '/admin/portal-users',
            { search: '', role },
            { preserveState: false, replace: true }
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

    const handleBulkSyncSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        bulkSyncForm.post('/admin/portal-users/sync-all', {
            preserveScroll: true,
            onSuccess: () => {
                setIsBulkSyncModalOpen(false);
            },
        });
    };

    const handleOpenRoleModal = (user: UserItem) => {
        setRoleEditUser(user);
        roleForm.setData('role', user.role || 'asesor');
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

    // Selection Handling
    const handleSelectAllOnPage = () => {
        if (selectedUserIds.length === users.data.length) {
            setSelectedUserIds([]);
        } else {
            setSelectedUserIds(users.data.map((u) => u.id));
        }
    };

    const handleToggleSelectUser = (id: number) => {
        if (selectedUserIds.includes(id)) {
            setSelectedUserIds(selectedUserIds.filter((item) => item !== id));
        } else {
            setSelectedUserIds([...selectedUserIds, id]);
        }
    };

    const handleBatchAssignSubmit = (targetRole: string = batchRole) => {
        if (selectedUserIds.length === 0) return;

        router.post('/admin/portal-users/batch-assign-role', {
            user_ids: selectedUserIds,
            role: targetRole,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedUserIds([]);
                setIsBatchRoleModalOpen(false);
            },
        });
    };

    const handleTestConnection = () => {
        router.post('/admin/portal-users/test-connection', {}, { preserveScroll: true });
    };

    const getRoleBadgeVariant = (role: string | null) => {
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
                return 'emerald';
            default:
                return 'slate';
        }
    };

    const isAllSelected = users.data.length > 0 && selectedUserIds.length === users.data.length;

    return (
        <AppLayout
            title="Sinkronisasi Pengguna Portal & Penetapan Asesor"
            subtitle="Tarik seluruh data akun dari Portal API dengan peran kosong, lalu tetapkan peran Asesor Evaluator"
        >
            <div className="space-y-6">
                {/* 1. Header Banner & Actions */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#062420] via-[#0b3b34] to-[#125c50] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-800/40 relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="space-y-2 relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Integrasi API Portal Akademik</span>
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-white">
                            Sinkronisasi Pengguna Portal & Penetapan Peran
                        </h2>
                        <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                            Data akun Dosen/Pengguna disinkronkan langsung dari Portal API (<strong>POST /api/v2/portal/login</strong>). Admin/Superadmin dapat menarik data akun portal dengan status awal <strong>Belum Diberi Peran</strong>, lalu menetapkannya sebagai <strong>Asesor Evaluator RPL</strong>.
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
                            onClick={() => handleOpenSyncModal('unassigned')}
                            className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-700 text-slate-950 font-black shadow-lg shadow-emerald-950/30 border-0 py-2.5"
                        >
                            <UserPlus className="w-4 h-4 mr-1.5" />
                            + Tarik & Sinkronkan Akun Portal
                        </Button>
                    </div>
                </div>

                {/* 2. Stat Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className={`border-slate-200/80 shadow-sm hover:shadow transition-shadow ${stats.unassigned_count > 0 ? 'bg-amber-50/50 border-amber-300' : ''}`}>
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${stats.unassigned_count > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                                <UserX className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500">Belum Diberi Peran</p>
                                <h4 className="text-2xl font-black text-amber-950">{stats.unassigned_count}</h4>
                                <span className="text-[11px] text-amber-700 font-bold">Perlu Ditetapkan Role</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200/80 shadow-sm hover:shadow transition-shadow">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500">Asesor Evaluator Aktif</p>
                                <h4 className="text-2xl font-black text-indigo-950">{stats.asesor_count}</h4>
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
                                        {connection.online ? 'Terhubung' : 'Standby'}
                                    </h4>
                                </div>
                                <span className="text-[11px] text-slate-400">
                                    {connection.online ? `${connection.duration_ms} ms` : `HTTP ${connection.status_code}`}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 3. Role Assignment Workflow Guide */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-600 text-white mt-0.5 shadow-sm">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5 text-xs">
                            <p className="font-bold text-slate-900 flex items-center gap-2">
                                <span>Alur Pemberian Peran Asesor:</span>
                                <Badge variant="indigo" size="sm">Admin & Superadmin</Badge>
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                <strong>1. Tarik Data:</strong> Seluruh akun dosen ditarik ke sistem dengan status <em>"Belum Ada Peran"</em>. <br />
                                <strong>2. Tetapkan Asesor:</strong> Centang dosen yang ditugaskan sebagai penilai portofolio, lalu klik <strong>"Tetapkan Sebagai Asesor RPL"</strong>.
                            </p>
                        </div>
                    </div>
                    <div className="text-xs text-slate-500 font-mono bg-white px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
                        Endpoint: <code className="text-emerald-700 font-bold">{connection.endpoint}</code>
                    </div>
                </div>

                {/* 4. Batch Action Toolbar (Muncul saat ada baris yang dicentang) */}
                {selectedUserIds.length > 0 && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border border-indigo-700 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                                {selectedUserIds.length}
                            </div>
                            <div>
                                <span className="font-extrabold text-sm text-white block leading-none">
                                    {selectedUserIds.length} Akun Pengguna Terpilih
                                </span>
                                <span className="text-[11px] text-indigo-200">
                                    Siap untuk diberi peran Asesor atau peran lainnya
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleBatchAssignSubmit('asesor')}
                                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs shadow flex items-center gap-1.5"
                            >
                                <GraduationCap className="w-4 h-4" />
                                <span>Tetapkan Sebagai Asesor RPL ({selectedUserIds.length})</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsBatchRoleModalOpen(true)}
                                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5"
                            >
                                <UserCog className="w-4 h-4" />
                                <span>Pilih Peran Lain...</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedUserIds([])}
                                className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-bold text-xs border border-rose-400/30"
                            >
                                Batal Pilihan
                            </button>
                        </div>
                    </div>
                )}

                {/* 5. Filter & Search Controls */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                if (e.target.value === '' && filters.search) {
                                    handleClearSearch();
                                }
                            }}
                            placeholder="Cari nama dosen, username portal, NIP, atau email..."
                            className="w-full pl-10 pr-9 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 text-xs font-bold"
                                title="Hapus Pencarian"
                            >
                                ✕
                            </button>
                        )}
                    </form>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Filter Peran:</span>
                        {[
                            { key: '', label: `Semua (${stats.total_users})` },
                            { key: 'unassigned', label: `⚠️ BELUM DISET (${stats.unassigned_count})` },
                            { key: 'asesor', label: `🎓 ASESOR (${stats.asesor_count})` },
                            { key: 'admin_rpl', label: 'ADMIN RPL' },
                            { key: 'super_admin', label: 'SUPER ADMIN' },
                            { key: 'kaprodi', label: 'KAPRODI' },
                            { key: 'lpm', label: 'LPM' },
                            { key: 'asesi', label: 'ASESI' },
                        ].map((roleItem) => (
                            <button
                                key={roleItem.key}
                                type="button"
                                onClick={() => handleFilterRole(roleItem.key)}
                                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                                    roleFilter === roleItem.key
                                        ? roleItem.key === 'unassigned'
                                            ? 'bg-amber-600 text-white shadow ring-2 ring-amber-300'
                                            : 'bg-[#125c50] text-white shadow'
                                        : roleItem.key === 'unassigned' && stats.unassigned_count > 0
                                        ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {roleItem.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 6. User Data Table with Multi-Select Checkboxes */}
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <Users className="w-4 h-4 text-emerald-600" />
                                Daftar Pengguna & Dosen Tersimpan di Database
                            </CardTitle>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Menampilkan {users.data.length} dari total {users.total} data akun pengguna {roleFilter ? `(Filter: ${roleFilter})` : ''}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {(roleFilter || search) && (
                                <button
                                    type="button"
                                    onClick={handleResetAllFilters}
                                    className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1"
                                >
                                    <span>Reset Filter</span>
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleSelectAllOnPage}
                                className="px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                            >
                                {isAllSelected ? <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                                <span>{isAllSelected ? 'Batalkan Semua' : 'Pilih Semua di Halaman'}</span>
                            </button>
                        </div>
                    </CardHeader>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-3 w-10 text-center">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={handleSelectAllOnPage}
                                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                    </th>
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
                                        <td colSpan={8} className="py-12 text-center text-slate-400">
                                            <div className="max-w-md mx-auto space-y-3">
                                                <Database className="w-10 h-10 mx-auto text-slate-300" />
                                                <div>
                                                    <p className="font-bold text-slate-700 text-sm">Tidak ada data akun pada filter / pencarian ini.</p>
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        Total <strong>{stats.total_users} akun</strong> tersimpan di database lokal ({stats.unassigned_count} belum diberi peran).
                                                    </p>
                                                </div>
                                                <div className="pt-1 flex justify-center gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={handleResetAllFilters}
                                                        className="bg-[#125c50] hover:bg-[#187566] text-white font-bold"
                                                    >
                                                        Tampilkan Semua Pengguna ({stats.total_users})
                                                    </Button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => {
                                        const isSelected = selectedUserIds.includes(user.id);
                                        const isUnassigned = !user.role;
                                        return (
                                            <tr
                                                key={user.id}
                                                className={`transition-colors ${
                                                    isSelected
                                                        ? 'bg-indigo-50/80 hover:bg-indigo-100/70'
                                                        : isUnassigned
                                                        ? 'bg-amber-50/20 hover:bg-amber-50/50'
                                                        : 'hover:bg-slate-50/70'
                                                }`}
                                            >
                                                <td className="py-3 px-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => handleToggleSelectUser(user.id)}
                                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm text-white ${user.role === 'asesor' ? 'bg-indigo-600' : isUnassigned ? 'bg-amber-500' : 'bg-emerald-700'}`}>
                                                            {user.role === 'asesor' ? <GraduationCap className="w-4 h-4" /> : user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                                                <span>{user.name}</span>
                                                                {user.role === 'asesor' && (
                                                                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-1.5 py-0.2 rounded border border-indigo-200">
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
                                                    {user.role ? (
                                                        <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                                                            {user.role_label}
                                                        </Badge>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-extrabold border border-amber-300">
                                                            <HelpCircle className="w-3 h-3 text-amber-600" />
                                                            Belum Diberi Role
                                                        </span>
                                                    )}
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
                                                        {/* Primary Quick Assign to Asesor */}
                                                        {user.role !== 'asesor' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleQuickAssignAsesor(user)}
                                                                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                                                                    isUnassigned
                                                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                                                                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                                                }`}
                                                                title="Tetapkan Sebagai Asesor RPL"
                                                            >
                                                                <GraduationCap className="w-3.5 h-3.5" />
                                                                <span>Jadikan Asesor</span>
                                                            </button>
                                                        )}

                                                        {/* Change Role Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenRoleModal(user)}
                                                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                                                            title="Ubah / Tetapkan Peran"
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
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
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

                {/* 7. Recent Logs Card */}
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

            {/* MODAL 1: SINKRONKAN AKUN DARI PORTAL (OFFICIAL API) */}
            <Modal
                isOpen={isSyncModalOpen}
                onClose={() => setIsSyncModalOpen(false)}
                title="Tarik & Sinkronkan Akun dari Portal API"
                size="md"
            >
                <form onSubmit={handleSyncSingleSubmit} className="space-y-4">
                    <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            <span>Integrasi Resmi Portal API (POST /api/v2/portal/login)</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            Masukkan Username/NIP dan Password Portal untuk menarik profil pengguna asli dari server Portal API ke database lokal SIRPL.
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Username / NIP Portal:
                        </label>
                        <Input
                            type="text"
                            value={syncForm.data.username}
                            onChange={(e) => syncForm.setData('username', e.target.value)}
                            placeholder="Contoh: adminportal_iain atau NIP Dosen"
                            required
                            className="font-mono text-xs"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Password Portal:
                        </label>
                        <Input
                            type="password"
                            value={syncForm.data.password}
                            onChange={(e) => syncForm.setData('password', e.target.value)}
                            placeholder="Masukkan password akun portal..."
                            required
                            className="text-xs"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Peran Awal di Sistem SIRPL:
                        </label>
                        <select
                            value={syncForm.data.target_role}
                            onChange={(e) => syncForm.setData('target_role', e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-800"
                        >
                            <option value="unassigned">⚠️ Kosongkan Peran (Akan Ditetapkan Asesor Nanti)</option>
                            <option value="asesor">🎓 Asesor Evaluator (Langsung Jadikan Asesor)</option>
                            <option value="admin_rpl">🛡️ Admin Pusat RPL</option>
                            <option value="kaprodi">👔 Ketua Program Studi (Kaprodi)</option>
                            <option value="lpm">🔍 Lembaga Penjaminan Mutu (LPM)</option>
                            <option value="admin_siakad">💻 Administrator SIAKAD & Feeder</option>
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
                            className="bg-[#125c50] hover:bg-[#187566] text-white font-bold"
                        >
                            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                            Koneksikan & Sinkronkan
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* MODAL 2: PENETAPAN PERAN MASSAL (BATCH ROLE ASSIGNMENT) */}
            <Modal
                isOpen={isBatchRoleModalOpen}
                onClose={() => setIsBatchRoleModalOpen(false)}
                title={`Tetapkan Peran untuk ${selectedUserIds.length} Pengguna Terpilih`}
                size="md"
            >
                <div className="space-y-4">
                    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-xs text-indigo-950">
                        Pilih peran sistem SIRPL yang ingin ditetapkan untuk <strong>{selectedUserIds.length} akun dosen</strong> yang telah Anda centang.
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Pilih Peran:
                        </label>
                        <select
                            value={batchRole}
                            onChange={(e) => setBatchRole(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-800"
                        >
                            <option value="asesor">🎓 Asesor Evaluator (Rekomendasi)</option>
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
                            onClick={() => setIsBatchRoleModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            onClick={() => handleBatchAssignSubmit(batchRole)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                        >
                            Terapkan ke {selectedUserIds.length} Pengguna
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* MODAL 3: UBAH PERAN PENGGUNA INDIVIDUAL */}
            <Modal
                isOpen={!!roleEditUser}
                onClose={() => setRoleEditUser(null)}
                title={`Tetapkan / Ubah Peran - ${roleEditUser?.name}`}
                size="md"
            >
                <form onSubmit={handleRoleUpdateSubmit} className="space-y-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                        Pilih peran sistem SIRPL untuk dosen <strong>{roleEditUser?.name}</strong> ({roleEditUser?.username || roleEditUser?.email}).
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Pilih Peran:
                        </label>
                        <select
                            value={roleForm.data.role}
                            onChange={(e) => roleForm.setData('role', e.target.value)}
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

            {/* MODAL 4: DETAIL JSON DATA PORTAL */}
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
