import { supabase } from '../../../lib/supabase';
import { Batch } from '../../../types/models';

export const generateBatchSlug = (batchName: string = 'batch'): string => {
    return (batchName || 'batch')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .replace(/_+/g, '_') // Replace multiple underscores with single
        .trim();
};

export const getBatchBySlug = async (slug: string): Promise<Batch | null> => {
    try {
        // First try to find by slug (if we had a slug column)
        // For now, we'll need to search by name pattern
        const { data, error } = await supabase
            .from('batches')
            .select('*')
            .ilike('name', `%${slug.replace(/_/g, ' ')}%`)
            .single();

        if (error) {
            console.error('Error fetching batch by slug:', error);
            return null;
        }

        return data;
    } catch (err) {
        console.error('Error in getBatchBySlug:', err);
        return null;
    }
};
