import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

export type LiveSession = Database['public']['Tables']['live_sessions']['Row'];

// Fetch sessions for a specific batch
export const getSessionsForBatch = async (batchId: string): Promise<LiveSession[]> => {
    const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('batch_id', batchId)
        .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
};

// Fetch upcoming sessions for a user (across all their batches)
// Note: For Phase 1, we might just query all sessions for the user's batch.
export const getUpcomingSessions = async (batchId: string): Promise<LiveSession[]> => {
    const now = new Date().toISOString();
    const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('batch_id', batchId)
        .gte('start_time', now)
        .order('start_time', { ascending: true })
        .limit(5);

    if (error) throw error;
    return data || [];
};

// Create a new session (Mentor only)
export const createSession = async (sessionData: Database['public']['Tables']['live_sessions']['Insert']) => {
    const { data, error } = await supabase
        .from('live_sessions')
        .insert(sessionData as any) // Casting as any to avoid similar TS inference issues
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Delete a session
export const deleteSession = async (sessionId: string) => {
    const { error } = await supabase
        .from('live_sessions')
        .delete()
        .eq('id', sessionId);

    if (error) throw error;
};
