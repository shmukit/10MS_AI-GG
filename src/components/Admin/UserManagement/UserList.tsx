import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../lib/supabase';
import { USER_PUBLIC_COLUMNS } from '../../../lib/userColumns';
import { AddUserModal } from './AddUserModal';
import { IssueCertificateModal } from '../Certificates/IssueCertificateModal';
import { ManageCertificatesModal } from '../Certificates/ManageCertificatesModal';
import { Search, MoreVertical, Shield, User, GraduationCap, CheckCircle, XCircle, Trash2, Power, Award, FileText } from 'lucide-react';
import { Skeleton } from '../../ui/Skeleton';
import { useConfirm } from '../../ui/ConfirmProvider';
import { useToast } from '../../ui/ToastProvider';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

interface UserData {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'student' | 'mentor' | 'admin';
    is_active: boolean;
    created_at: string;
}

interface EnrollmentInfo {
    batches: string[];
    roadmaps: string[];
    batchIds: string[];
    roadmapIds: string[];
}

export const UserList: React.FC = () => {
    const { confirm } = useConfirm();
    const { success, error: toastError } = useToast();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'mentor' | 'admin'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [roadmapFilter, setRoadmapFilter] = useState<string>('all');
    const [batchFilter, setBatchFilter] = useState<string>('all');
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [issueCertUser, setIssueCertUser] = useState<UserData | null>(null);
    const [manageCertUser, setManageCertUser] = useState<UserData | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [certifiedStudents, setCertifiedStudents] = useState<Record<string, any>>({});
    const [enrollmentsByUser, setEnrollmentsByUser] = useState<Record<string, EnrollmentInfo>>({});
    const [roadmapOptions, setRoadmapOptions] = useState<{ id: string; title: string }[]>([]);
    const [batchOptions, setBatchOptions] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeMenuId && !(event.target as Element).closest('.action-menu-container')) {
                setActiveMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeMenuId]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('users')
                .select(USER_PUBLIC_COLUMNS)
                .order('created_at', { ascending: false });

            if (roleFilter !== 'all') {
                query = query.eq('role', roleFilter);
            }

            if (statusFilter === 'active') {
                query = query.eq('is_active', true);
            } else if (statusFilter === 'inactive') {
                query = query.eq('is_active', false);
            }

            if (debouncedSearch) {
                query = query.or(`first_name.ilike.%${debouncedSearch}%,last_name.ilike.%${debouncedSearch}%,email.ilike.%${debouncedSearch}%`);
            }

            const { data, error } = await query;

            if (error) throw error;
            setUsers(data || []);

            const [
                { data: certData },
                { data: batchData },
                { data: roadmaps },
                { data: batches },
            ] = await Promise.all([
                supabase.from('student_certificates').select('student_id, certificate_type, issued_at'),
                supabase.from('student_batch_assignments').select(`
                    student_id,
                    batch_id,
                    batches (
                        id,
                        name,
                        roadmap_id,
                        roadmaps ( id, title )
                    )
                `),
                supabase.from('roadmaps').select('id, title').order('title'),
                supabase.from('batches').select('id, name').order('name'),
            ]);

            setRoadmapOptions((roadmaps as any[]) || []);
            setBatchOptions((batches as any[]) || []);

            const enrollmentMap: Record<string, EnrollmentInfo> = {};
            const batchNameByStudent: Record<string, string> = {};

            (batchData || []).forEach((row: any) => {
                const studentId = row.student_id as string;
                if (!studentId) return;

                const batch = Array.isArray(row.batches) ? row.batches[0] : row.batches;
                const roadmapRaw = batch?.roadmaps;
                const roadmap = Array.isArray(roadmapRaw) ? roadmapRaw[0] : roadmapRaw;

                if (!enrollmentMap[studentId]) {
                    enrollmentMap[studentId] = {
                        batches: [],
                        roadmaps: [],
                        batchIds: [],
                        roadmapIds: [],
                    };
                }

                const info = enrollmentMap[studentId];
                if (batch?.name && !info.batches.includes(batch.name)) {
                    info.batches.push(batch.name);
                }
                if (batch?.id && !info.batchIds.includes(batch.id)) {
                    info.batchIds.push(batch.id);
                }
                if (roadmap?.title && !info.roadmaps.includes(roadmap.title)) {
                    info.roadmaps.push(roadmap.title);
                }
                if (roadmap?.id && !info.roadmapIds.includes(roadmap.id)) {
                    info.roadmapIds.push(roadmap.id);
                }
                if (batch?.name) {
                    batchNameByStudent[studentId] = batch.name;
                }
            });

            setEnrollmentsByUser(enrollmentMap);

            if (certData) {
                const certMap: Record<string, any> = {};
                certData.forEach((c: any) => {
                    certMap[c.student_id] = {
                        ...c,
                        batch_name: batchNameByStudent[c.student_id] || 'SheSTEM Mentorship Program'
                    };
                });
                setCertifiedStudents(certMap);
            }
        } catch (err: any) {
            console.error('Error fetching users:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [roleFilter, statusFilter, debouncedSearch]);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const enrollment = enrollmentsByUser[user.id];
            if (batchFilter !== 'all') {
                if (!enrollment?.batchIds.includes(batchFilter)) return false;
            }
            if (roadmapFilter !== 'all') {
                if (!enrollment?.roadmapIds.includes(roadmapFilter)) return false;
            }
            return true;
        });
    }, [users, enrollmentsByUser, batchFilter, roadmapFilter]);

    const handleToggleStatus = async (userId: string, currentStatus: boolean, userName: string) => {
        const confirmed = await confirm({
            title: currentStatus ? 'Deactivate user?' : 'Activate user?',
            message: currentStatus
                ? `${userName} will lose access until reactivated.`
                : `${userName} will regain access to the platform.`,
            confirmLabel: currentStatus ? 'Deactivate' : 'Activate',
            variant: currentStatus ? 'destructive' : 'default',
        });
        if (!confirmed) return;

        try {
            const { error } = await supabase
                .from('users')
                .update({ is_active: !currentStatus } as unknown as never)
                .eq('id', userId);

            if (error) throw error;
            setUsers(users.map(u => u.id === userId ? { ...u, is_active: !currentStatus } : u));
            setActiveMenuId(null);
            success(currentStatus ? 'User deactivated' : 'User activated');
        } catch (error) {
            console.error('Error updating status:', error);
            toastError('Failed to update status');
        }
    };

    const handleDeleteUser = async (userId: string, userName: string) => {
        const confirmed = await confirm({
            title: 'Delete user?',
            message: `Are you sure you want to delete ${userName}? This action cannot be undone.`,
            confirmLabel: 'Delete',
            variant: 'destructive',
        });
        if (!confirmed) return;

        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', userId);

            if (error) throw error;
            setUsers(users.filter(u => u.id !== userId));
            setActiveMenuId(null);
            success('User deleted');
        } catch (error) {
            console.error('Error deleting user:', error);
            toastError('Failed to delete user');
        }
    };

    const roleIcons = {
        admin: <Shield className="w-4 h-4 text-primary" />,
        mentor: <User className="w-4 h-4 text-primary" />,
        student: <GraduationCap className="w-4 h-4 text-green-600" />
    };

    const selectClass =
        'px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15';

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col lg:flex-row justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 transition-all"
                        />
                    </div>
                    <Button size="sm" onClick={() => setIsAddUserModalOpen(true)} className="shrink-0 self-start">
                        Add User
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as any)}
                        className={selectClass}
                        aria-label="Filter by role"
                    >
                        <option value="all">All Roles</option>
                        <option value="student">Student</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className={selectClass}
                        aria-label="Filter by status"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <select
                        value={roadmapFilter}
                        onChange={(e) => setRoadmapFilter(e.target.value)}
                        className={selectClass}
                        aria-label="Filter by roadmap"
                    >
                        <option value="all">All Roadmaps</option>
                        {roadmapOptions.map((r) => (
                            <option key={r.id} value={r.id}>{r.title}</option>
                        ))}
                    </select>
                    <select
                        value={batchFilter}
                        onChange={(e) => setBatchFilter(e.target.value)}
                        className={selectClass}
                        aria-label="Filter by batch"
                    >
                        <option value="all">All Batches</option>
                        {batchOptions.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full rounded-lg" />
                    ))}
                </div>
            ) : error ? (
                <div className="text-red-500 text-center py-8">Error: {error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[960px]">
                        <thead>
                            <tr className="border-b border-border text-muted-foreground">
                                <th className="py-3 px-4 font-medium">User</th>
                                <th className="py-3 px-4 font-medium">Role</th>
                                <th className="py-3 px-4 font-medium">Roadmaps</th>
                                <th className="py-3 px-4 font-medium">Batches</th>
                                <th className="py-3 px-4 font-medium">Status</th>
                                <th className="py-3 px-4 font-medium">Joined</th>
                                <th className="py-3 px-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredUsers.map((user) => {
                                const enrollment = enrollmentsByUser[user.id];
                                return (
                                    <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs text-muted-foreground">
                                                    {user.first_name?.[0]}{user.last_name?.[0]}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-foreground flex items-center gap-2">
                                                        {user.first_name} {user.last_name}
                                                        {user.role === 'student' && certifiedStudents[user.id] && (
                                                            <div className="relative group inline-flex items-center">
                                                                <span className="inline-flex items-center justify-center bg-primary/10 text-primary p-1.5 rounded-full cursor-help transition-transform hover:scale-110">
                                                                    <Award className="w-4 h-4" strokeWidth={2.5} />
                                                                </span>
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[250px] bg-foreground text-background text-xs rounded py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center">
                                                                    <p className="font-semibold mb-1">Certificate Awarded</p>
                                                                    <p className="opacity-90">Course: {certifiedStudents[user.id].batch_name}</p>
                                                                    <p className="opacity-90 mt-0.5">Date: {new Date(certifiedStudents[user.id].issued_at).toLocaleDateString()}</p>
                                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1.5 capitalize text-foreground">
                                                {roleIcons[user.role]}
                                                {user.role}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex flex-wrap gap-1 max-w-[220px]">
                                                {enrollment?.roadmaps?.length ? (
                                                    enrollment.roadmaps.map((title) => (
                                                        <Badge key={title} variant="outline" className="px-2 py-0.5 text-[11px] max-w-[200px] truncate" title={title}>
                                                            {title}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex flex-wrap gap-1 max-w-[220px]">
                                                {enrollment?.batches?.length ? (
                                                    enrollment.batches.map((name) => (
                                                        <Badge key={name} variant="muted" className="px-2 py-0.5 text-[11px] max-w-[200px] truncate" title={name}>
                                                            {name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            {user.is_active ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                    <CheckCircle className="w-3 h-3" /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                    <XCircle className="w-3 h-3" /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-muted-foreground">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-right relative action-menu-container">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenuId(activeMenuId === user.id ? null : user.id);
                                                }}
                                                className="p-1 hover:bg-muted rounded text-muted-foreground transition-colors"
                                                aria-label={`Actions for ${user.first_name} ${user.last_name}`}
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            {activeMenuId === user.id && (
                                                <div className="absolute right-8 top-0 w-48 bg-card rounded-lg border border-border py-1 z-[100] text-left">
                                                    <button
                                                        onClick={() => handleToggleStatus(
                                                            user.id,
                                                            user.is_active,
                                                            `${user.first_name} ${user.last_name}`.trim()
                                                        )}
                                                        className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
                                                    >
                                                        <Power className={`w-4 h-4 ${user.is_active ? 'text-red-500' : 'text-green-500'}`} />
                                                        {user.is_active ? 'Deactivate User' : 'Activate User'}
                                                    </button>
                                                    {user.role === 'student' && (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    setIssueCertUser(user);
                                                                    setActiveMenuId(null);
                                                                }}
                                                                className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2 border-t border-border"
                                                            >
                                                                <Award className="w-4 h-4 text-primary" />
                                                                Issue Certificate
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setManageCertUser(user);
                                                                    setActiveMenuId(null);
                                                                }}
                                                                className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
                                                            >
                                                                <FileText className="w-4 h-4 text-primary" />
                                                                Manage Certificates
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteUser(
                                                            user.id,
                                                            `${user.first_name} ${user.last_name}`.trim()
                                                        )}
                                                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 border-t border-border"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete User
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">No users found.</div>
                    )}
                </div>
            )}

            {isAddUserModalOpen && (
                <AddUserModal
                    isOpen={isAddUserModalOpen}
                    onClose={() => setIsAddUserModalOpen(false)}
                    onSuccess={() => {
                        fetchUsers();
                        setIsAddUserModalOpen(false);
                    }}
                />
            )}

            {issueCertUser && (
                <IssueCertificateModal
                    student={{
                        id: issueCertUser.id,
                        email: issueCertUser.email,
                        raw_user_meta_data: { full_name: `${issueCertUser.first_name} ${issueCertUser.last_name}`.trim() }
                    }}
                    onClose={() => setIssueCertUser(null)}
                    onSuccess={() => {
                        setIssueCertUser(null);
                        success('Certificate issued successfully!');
                    }}
                />
            )}

            {manageCertUser && (
                <ManageCertificatesModal
                    student={manageCertUser}
                    onClose={() => setManageCertUser(null)}
                />
            )}
        </div>
    );
};
