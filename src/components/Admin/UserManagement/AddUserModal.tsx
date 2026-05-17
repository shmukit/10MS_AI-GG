import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { X, Loader2 } from 'lucide-react';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface ExistingUser {
    id: string;
    role: 'student' | 'mentor' | 'admin';
    first_name: string;
    last_name: string;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [existingUser, setExistingUser] = useState<ExistingUser | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        role: 'mentor' as 'mentor' | 'admin',
        password: ''
    });

    const checkEmail = async (email: string) => {
        if (!email || !email.includes('@')) return;

        try {
            const { data } = await supabase
                .from('users')
                .select('id, role, first_name, last_name')
                .eq('email', email)
                .single();

            const user = data as unknown as ExistingUser;

            if (user) {
                setExistingUser(user);
                if (user.role === formData.role) {
                    setError(`User already exists as a ${user.role}.`);
                } else {
                    setError(null);
                }
            } else {
                setExistingUser(null);
                setError(null);
            }
        } catch {
            // User not found is good
            setExistingUser(null);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (existingUser) {
                // Update existing user role
                const { error: updateError } = await supabase
                    .from('users')
                    .update({ role: formData.role } as unknown as never)
                    .eq('id', existingUser.id);

                if (updateError) throw updateError;

                alert(`User role updated to ${formData.role} successfully!`);
            } else {
                // Create new user
                // Create new user via Secure RPC (Prevents session hijacking & 500 errors)
                const { error: authError } = await supabase.rpc('create_new_user', {
                    p_email: formData.email,
                    p_password: formData.password,
                    p_first_name: formData.firstName,
                    p_last_name: formData.lastName,
                    p_role: formData.role
                } as any);

                if (authError) throw authError;

                // Explicitly check/insert if trigger doesn't fire immediately (safety net)
                // For now, trusting the trigger or auth flow.
            }

            onSuccess();
        } catch (err: any) {
            console.error('Error creating/updating user:', err);
            setError(err.message || 'Failed to process request');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Add New User</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900/50">
                            {error}
                        </div>
                    )}

                    {existingUser && (
                        <div className={`p-3 text-sm rounded-lg border ${existingUser.role === formData.role ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                            User exists: <strong>{existingUser.first_name} {existingUser.last_name}</strong>
                            <br />
                            Current Role: <span className="capitalize font-bold">{existingUser.role}</span>
                            {existingUser.role !== formData.role && (
                                <div className="mt-1 text-xs">
                                    Clicking "Update Role" will change their role to <strong>{formData.role}</strong>.
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                            <input
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                                disabled={!!existingUser}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                            <input
                                type="text"
                                required
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                                disabled={!!existingUser}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            onBlur={() => checkEmail(formData.email)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {!existingUser && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Temporary Password</label>
                            <input
                                type="text"
                                required={!existingUser}
                                minLength={6}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="mentor">Mentor</option>
                            <option value="admin">Admin</option>
                            <option value="student">Student</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium border border-gray-200 dark:border-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || (existingUser ? existingUser.role === formData.role : false)}
                            className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 ${existingUser && existingUser.role === formData.role ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {existingUser ? 'Update Role' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
