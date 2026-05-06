import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { AddUserModal } from './AddUserModal';
import { IssueCertificateModal } from '../Certificates/IssueCertificateModal';
import { ManageCertificatesModal } from '../Certificates/ManageCertificatesModal';
import { Search, Filter, MoreVertical, Shield, User, GraduationCap, CheckCircle, XCircle, Trash2, Power, Award, FileText } from 'lucide-react';

interface UserData {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'student' | 'mentor' | 'admin';
    is_active: boolean;
    created_at: string;
}

export const UserList: React.FC = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'mentor' | 'admin'>('all');
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [issueCertUser, setIssueCertUser] = useState<UserData | null>(null);
    const [manageCertUser, setManageCertUser] = useState<UserData | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [certifiedStudents, setCertifiedStudents] = useState<Record<string, any>>({});

    // Close menu when clicking outside
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
                .select('*')
                .order('created_at', { ascending: false });

            if (roleFilter !== 'all') {
                query = query.eq('role', roleFilter);
            }

            if (searchTerm) {
                query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
            }

            const { data, error } = await query;

            if (error) throw error;
            setUsers(data || []);

            // Fetch which students have certificates with their details
            const { data: certData } = await supabase.from('student_certificates').select('student_id, certificate_type, issued_at');
            
            // Fetch batch names for students
            const { data: batchData } = await supabase.from('student_batch_assignments').select('student_id, batches(name)');
            const batchMap: Record<string, string> = {};
            if (batchData) {
                batchData.forEach((b: any) => {
                    if (b.batches?.name) batchMap[b.student_id] = b.batches.name;
                });
            }

            if (certData) {
                const certMap: Record<string, any> = {};
                certData.forEach((c: any) => {
                    certMap[c.student_id] = {
                        ...c,
                        batch_name: batchMap[c.student_id] || 'SheSTEM Mentorship Program'
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
    }, [roleFilter, searchTerm]);

    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('users')
                .update({ is_active: !currentStatus } as unknown as never)
                .eq('id', userId);

            if (error) throw error;
            setUsers(users.map(u => u.id === userId ? { ...u, is_active: !currentStatus } : u));
            setActiveMenuId(null);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', userId);

            if (error) throw error;
            setUsers(users.filter(u => u.id !== userId));
            setActiveMenuId(null);
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const roleIcons = {
        admin: <Shield className="w-4 h-4 text-purple-600" />,
        mentor: <User className="w-4 h-4 text-blue-600" />,
        student: <GraduationCap className="w-4 h-4 text-green-600" />
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as any)}
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="all">All Roles</option>
                        <option value="student">Student</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button
                        onClick={() => setIsAddUserModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        Add User
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading users...</div>
            ) : error ? (
                <div className="text-red-500 text-center py-8">Error: {error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                                <th className="py-3 px-4 font-medium">User</th>
                                <th className="py-3 px-4 font-medium">Role</th>
                                <th className="py-3 px-4 font-medium">Status</th>
                                <th className="py-3 px-4 font-medium">Joined</th>
                                <th className="py-3 px-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center font-bold text-xs text-gray-600 dark:text-gray-300">
                                                {user.first_name?.[0]}{user.last_name?.[0]}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                    {user.first_name} {user.last_name}
                                                    {user.role === 'student' && certifiedStudents[user.id] && (
                                                        <div className="relative group inline-flex items-center">
                                                            <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 p-1.5 rounded-full shadow-sm cursor-help transition-transform hover:scale-110">
                                                                <Award className="w-4 h-4" strokeWidth={2.5} />
                                                            </span>
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[250px] bg-gray-900 text-white text-xs rounded py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center shadow-lg">
                                                                <p className="font-semibold mb-1">Certificate Awarded</p>
                                                                <p className="opacity-90">Course: {certifiedStudents[user.id].batch_name}</p>
                                                                <p className="opacity-90 mt-0.5">Date: {new Date(certifiedStudents[user.id].issued_at).toLocaleDateString()}</p>
                                                                {/* Triangle pointer */}
                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-1.5 capitalize text-gray-700 dark:text-gray-300">
                                            {roleIcons[user.role]}
                                            {user.role}
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
                                    <td className="py-3 px-4 text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4 text-right relative action-menu-container">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenuId(activeMenuId === user.id ? null : user.id);
                                            }}
                                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 transition-colors"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>

                                        {activeMenuId === user.id && (
                                            <div className="absolute right-8 top-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-[100] text-left">
                                                <button
                                                    onClick={() => handleToggleStatus(user.id, user.is_active)}
                                                    className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
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
                                                            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 border-t border-gray-100 dark:border-gray-700"
                                                        >
                                                            <Award className="w-4 h-4 text-blue-500" />
                                                            Issue Certificate
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setManageCertUser(user);
                                                                setActiveMenuId(null);
                                                            }}
                                                            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                                        >
                                                            <FileText className="w-4 h-4 text-purple-500" />
                                                            Manage Certificates
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 border-t border-gray-100 dark:border-gray-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete User
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No users found.</div>
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
                        alert('Certificate issued successfully!');
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
