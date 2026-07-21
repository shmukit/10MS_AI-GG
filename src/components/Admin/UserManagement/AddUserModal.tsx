import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { X, Eye, EyeOff } from 'lucide-react';
import { Input } from '../../ui/Input';
import { useToast } from '../../ui/ToastProvider';
import { Button } from '../../ui/Button';

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
    const { success } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
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
                const { error: updateError } = await supabase
                    .from('users')
                    .update({ role: formData.role } as unknown as never)
                    .eq('id', existingUser.id);

                if (updateError) throw updateError;

                success(`User role updated to ${formData.role} successfully!`);
            } else {
                const { error: authError } = await supabase.rpc('create_new_user', {
                    p_email: formData.email,
                    p_password: formData.password,
                    p_first_name: formData.firstName,
                    p_last_name: formData.lastName,
                    p_role: formData.role
                } as any);

                if (authError) throw authError;
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
            <div className="bg-card rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Add New User</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
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
                        <div className={`p-3 text-sm rounded-lg border ${existingUser.role === formData.role ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-primary/10 text-primary border-primary/30'}`}>
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
                        <Input
                            label="First Name"
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            disabled={!!existingUser}
                        />
                        <Input
                            label="Last Name"
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            disabled={!!existingUser}
                        />
                    </div>

                    <Input
                        label="Email Address"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onBlur={() => checkEmail(formData.email)}
                    />

                    {!existingUser && (
                        <div className="space-y-1.5">
                            <label htmlFor="temporary-password" className="text-overline uppercase text-muted-foreground">
                                Temporary Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="temporary-password"
                                    type={showPassword ? 'text' : 'password'}
                                    required={!existingUser}
                                    minLength={6}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15"
                        >
                            <option value="mentor">Mentor</option>
                            <option value="admin">Admin</option>
                            <option value="student">Student</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={loading || (existingUser ? existingUser.role === formData.role : false)}
                            isLoading={loading}
                        >
                            {existingUser ? 'Update Role' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
