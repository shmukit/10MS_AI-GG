import { supabase } from '../../lib/supabase';
import { User } from '../../types/models';

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching user:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in getCurrentUser:', error);
        return null;
    }
};

export const getUserRole = async (userId: string): Promise<string | null> => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user role:', error);
            return null;
        }

        return (data as any).role;
    } catch (error) {
        console.error('Error in getUserRole:', error);
        return null;
    }
};

export const getUserById = async (userId: string): Promise<User | null> => {
    try {
        console.log('🔍 getUserById called with userId:', userId);
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('❌ Error fetching user from database:', error);
            console.log('📝 Error details - code:', error.code, 'message:', error.message);
            return null;
        }

        console.log('✅ User data found:', data);
        return data;
    } catch (error) {
        console.error('❌ Exception in getUserById:', error);
        return null;
    }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        console.log('🔍 getUserByEmail called with email:', email);
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            console.error('❌ Error fetching user by email:', error);
            console.log('📝 Error details - code:', error.code, 'message:', error.message);
            return null;
        }

        console.log('✅ User data found by email:', data);
        return data;
    } catch (error) {
        console.error('❌ Exception in getUserByEmail:', error);
        return null;
    }
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<boolean> => {
    try {
        console.log('Updating user data for user:', userId, 'Updates:', updates);

        const { error } = await supabase
            .from('users')
            .update(updates as unknown as never)
            .eq('id', userId);

        if (error) {
            console.error('Error updating user data:', error);
            return false;
        }

        console.log('User data updated successfully');
        return true;
    } catch (error) {
        console.error('Error in updateUser:', error);
        return false;
    }
};
