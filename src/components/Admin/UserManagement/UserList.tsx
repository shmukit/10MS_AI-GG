import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { AddUserModal } from './AddUserModal';
import { Search, Filter, MoreVertical, Shield, User, GraduationCap, CheckCircle, XCircle } from 'lucide-react';

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

    const handleRoleChange = async (userId: string, newRole: string) => {
        // Placeholder for role update logic
        console.log('Update role', userId, newRole);
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
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {user.first_name} {user.last_name}
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
                                    <td className="py-3 px-4 text-right">
                                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
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
        </div>
    );
};
