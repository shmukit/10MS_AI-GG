import { supabase } from '../../lib/supabase';
import { Notice } from '../../types/models';

export const getNotices = async (batchId?: string): Promise<Notice[]> => {
    try {
        let query = supabase
            .from('notices')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false });

        if (batchId) {
            query = query.eq('batch_id', batchId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching notices:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getNotices:', error);
        return [];
    }
};

export const createNotice = async (noticeData: Partial<Notice>): Promise<Notice | null> => {
    try {
        const { data, error } = await supabase
            .from('notices')
            .insert([noticeData])
            .select()
            .single();

        if (error) {
            console.error('Error creating notice:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in createNotice:', error);
        return null;
    }
};

export const getUnreadNoticeCount = async (_userId: string): Promise<number> => {
    try {
        // Placeholder for unread count logic
        // In the future, query a 'notice_reads' table
        return 0;
    } catch (error) {
        console.error('Error in getUnreadNoticeCount:', error);
        return 0;
    }
};

export const markNoticeAsRead = async (_noticeId: string, _userId: string): Promise<boolean> => {
    try {
        // This would typically update a separate read_status table
        // For now, we'll just return success
        return true;
    } catch (error) {
        console.error('Error in markNoticeAsRead:', error);
        return false;
    }
};
