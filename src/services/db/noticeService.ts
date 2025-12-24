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
