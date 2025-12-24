import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

export type RoadmapDiscussion = Database['public']['Tables']['roadmap_discussions']['Row'] & {
    user?: {
        first_name: string;
        last_name: string;
        profile_picture_url: string | null;
    };
    replies?: RoadmapDiscussion[];
};

export const discussionService = {
    async getDiscussions(entityType: 'roadmap' | 'week' | 'task', entityId: string): Promise<RoadmapDiscussion[]> {
        // Fetch discussions with user details
        const { data, error } = await supabase
            .from('roadmap_discussions')
            .select(`
        *,
        user:user_id (
          first_name,
          last_name,
          profile_picture_url
        )
      `)
            .eq('entity_type', entityType)
            .eq('entity_id', entityId)
            .is('parent_id', null) // Only fetch top-level comments first
            .order('is_pinned', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) throw error;

        // TODO: Ideally we'd fetch replies recursively or in a separate query if needed.
        // For now, let's fetch replies for these threads.
        // simpler approach: fetch ALL for entity, then tree-build in JS.

        return data as RoadmapDiscussion[];
    },

    async getAllDiscussionsForEntity(entityType: 'roadmap' | 'week' | 'task', entityId: string): Promise<RoadmapDiscussion[]> {
        const { data, error } = await supabase
            .from('roadmap_discussions')
            .select(`
        *,
        user:user_id (
          first_name,
          last_name,
          profile_picture_url
        )
      `)
            .eq('entity_type', entityType)
            .eq('entity_id', entityId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data as RoadmapDiscussion[];
    },

    async createPost(
        entityType: 'roadmap' | 'week' | 'task',
        entityId: string,
        content: string,
        userId: string,
        parentId?: string
    ) {
        const newPost: Database['public']['Tables']['roadmap_discussions']['Insert'] = {
            entity_type: entityType,
            entity_id: entityId,
            content,
            user_id: userId,
            parent_id: parentId || null
        };

        const { data, error } = await supabase
            .from('roadmap_discussions')
            .insert(newPost as any)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deletePost(postId: string) {
        const { error } = await supabase
            .from('roadmap_discussions')
            .delete()
            .eq('id', postId);

        if (error) throw error;
    }
};
