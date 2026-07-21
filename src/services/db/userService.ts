import { supabase } from '../../lib/supabase';
import { USER_PUBLIC_COLUMNS } from '../../lib/userColumns';
import { User } from '../../types/models';

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('users')
            .select(USER_PUBLIC_COLUMNS)
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
            .select(USER_PUBLIC_COLUMNS)
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
            .select(USER_PUBLIC_COLUMNS)
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

const USER_SELF_UPDATE_FIELDS = [
    'first_name',
    'last_name',
    'profile_picture_url',
    'phone',
] as const satisfies readonly (keyof User)[];

export const updateUser = async (userId: string, updates: Partial<User>): Promise<boolean> => {
    try {
        const safeUpdates = Object.fromEntries(
            Object.entries(updates).filter(([key]) =>
                USER_SELF_UPDATE_FIELDS.includes(key as (typeof USER_SELF_UPDATE_FIELDS)[number])
            )
        ) as Partial<User>;

        console.log('Updating user data for user:', userId, 'Updates:', safeUpdates);

        if (Object.keys(safeUpdates).length === 0) {
            console.warn('updateUser called with no permitted fields');
            return true;
        }

        const { error } = await supabase
            .from('users')
            .update(safeUpdates as unknown as never)
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
