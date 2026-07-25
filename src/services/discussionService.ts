import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type DiscussionRow = Database['public']['Tables']['roadmap_discussions']['Row'];

export type RoadmapDiscussion = DiscussionRow & {
  user?: {
    first_name: string;
    last_name: string;
    profile_picture_url: string | null;
  };
  replies?: RoadmapDiscussion[];
};

type UserSnippet = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  profile_picture_url: string | null;
};

async function attachUsers(rows: DiscussionRow[]): Promise<RoadmapDiscussion[]> {
  const userIds = [...new Set(rows.map((r) => r.user_id).filter((id): id is string => Boolean(id)))];
  if (userIds.length === 0) {
    return rows.map((r) => ({ ...r, replies: [] }));
  }

  const { data: users, error } = await supabase
    .from('users')
    .select('id, first_name, last_name, profile_picture_url')
    .in('id', userIds);

  if (error) {
    console.error('Error loading discussion authors:', error);
    return rows.map((r) => ({ ...r, replies: [] }));
  }

  const byId = new Map((users as UserSnippet[] | null)?.map((u) => [u.id, u]) ?? []);

  return rows.map((row) => {
    const author = row.user_id ? byId.get(row.user_id) : undefined;
    return {
      ...row,
      replies: [],
      user: author
        ? {
            first_name: author.first_name ?? '',
            last_name: author.last_name ?? '',
            profile_picture_url: author.profile_picture_url,
          }
        : undefined,
    };
  });
}

export const discussionService = {
  async getDiscussions(
    entityType: 'roadmap' | 'week' | 'task',
    entityId: string
  ): Promise<RoadmapDiscussion[]> {
    const { data, error } = await supabase
      .from('roadmap_discussions')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .is('parent_id', null)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return attachUsers((data as DiscussionRow[]) || []);
  },

  async getAllDiscussionsForEntity(
    entityType: 'roadmap' | 'week' | 'task',
    entityId: string
  ): Promise<RoadmapDiscussion[]> {
    // Avoid PostgREST embeds on user_id — FK historically pointed at auth.users
    // and caused 400 Bad Request. Load authors in a second query instead.
    const { data, error } = await supabase
      .from('roadmap_discussions')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return attachUsers((data as DiscussionRow[]) || []);
  },

  async createPost(
    entityType: 'roadmap' | 'week' | 'task',
    entityId: string,
    content: string,
    userId: string,
    parentId?: string
  ) {
    // Enforce one nest layer: replies must hang off a top-level question only.
    let resolvedParentId: string | null = parentId || null;
    if (resolvedParentId) {
      const { data: parentRaw, error: parentError } = await supabase
        .from('roadmap_discussions')
        .select('id, parent_id')
        .eq('id', resolvedParentId)
        .maybeSingle();

      if (parentError) throw parentError;
      const parent = parentRaw as { id: string; parent_id: string | null } | null;
      if (!parent) {
        throw new Error('Parent question not found.');
      }
      // If someone tried to reply to a reply, hoist to the root question.
      if (parent.parent_id) {
        resolvedParentId = parent.parent_id;
      }
    }

    const newPost: Database['public']['Tables']['roadmap_discussions']['Insert'] = {
      entity_type: entityType,
      entity_id: entityId,
      content: content.trim(),
      user_id: userId,
      parent_id: resolvedParentId,
    };

    const { data, error } = await supabase
      .from('roadmap_discussions')
      .insert(newPost as never)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async updatePost(postId: string, content: string) {
    const trimmed = content.trim();
    if (!trimmed) {
      throw new Error('Content cannot be empty.');
    }

    const { data, error } = await supabase
      .from('roadmap_discussions')
      .update({
        content: trimmed,
        updated_at: new Date().toISOString(),
      } as never)
      .eq('id', postId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async deletePost(postId: string) {
    const { error } = await supabase.from('roadmap_discussions').delete().eq('id', postId);
    if (error) throw error;
  },
};
