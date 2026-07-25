import React, { useEffect, useState } from 'react';
import { RoadmapDiscussion, discussionService } from '../../services/discussionService';
import { DiscussionThread } from './DiscussionThread';
import { DatabaseService } from '../../services/database';
import { useTheme } from '../../lib/ThemeContext';
import { posthog } from '../../lib/posthog';
import { useToast } from '../ui/ToastProvider';

interface DiscussionBoardProps {
    entityType: 'roadmap' | 'week' | 'task';
    entityId: string;
}

export const DiscussionBoard: React.FC<DiscussionBoardProps> = ({ entityType, entityId }) => {
    const { isDarkMode } = useTheme();
    const { error: toastError } = useToast();
    const [discussions, setDiscussions] = useState<RoadmapDiscussion[]>([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const fetchDiscussions = async () => {
        try {
            const allPosts = await discussionService.getAllDiscussionsForEntity(entityType, entityId);

            // One nest layer only: root questions + flat replies under each root.
            // If older data nested reply→reply, hoist onto the top-level ancestor.
            const postMap = new Map<string, RoadmapDiscussion>();
            const roots: RoadmapDiscussion[] = [];

            allPosts.forEach((post) => {
                post.replies = [];
                postMap.set(post.id, post);
            });

            const resolveRootId = (post: RoadmapDiscussion): string | null => {
                let parentId = post.parent_id;
                let guard = 0;
                while (parentId && guard < 20) {
                    const parent = postMap.get(parentId);
                    if (!parent) return parentId;
                    if (!parent.parent_id) return parent.id;
                    parentId = parent.parent_id;
                    guard += 1;
                }
                return null;
            };

            allPosts.forEach((post) => {
                if (!post.parent_id) {
                    roots.push(post);
                    return;
                }
                const rootId = resolveRootId(post);
                const root = rootId ? postMap.get(rootId) : undefined;
                if (root?.replies) {
                    root.replies.push(post);
                } else {
                    // Orphan reply — show as its own question rather than drop it
                    roots.push(post);
                }
            });

            roots.forEach((root) => {
                root.replies?.sort(
                    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                );
            });

            roots.sort((a, b) => {
                if (Boolean(a.is_pinned) !== Boolean(b.is_pinned)) return a.is_pinned ? -1 : 1;
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });

            setDiscussions(roots);
        } catch (error) {
            console.error('Error fetching discussions:', error);
            toastError('Could not load discussions. Please refresh and try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = async () => {
        const user = await DatabaseService.getCurrentUser();
        if (user) setCurrentUserId(user.id);
    };

    useEffect(() => {
        setLoading(true);
        fetchUser();
        fetchDiscussions();

        posthog?.capture('discussion_board_viewed', {
            entity_type: entityType,
            entity_id: entityId,
        });
    }, [entityType, entityId]);

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;

        if (!currentUserId) {
            toastError('You must be signed in to post a question.');
            return;
        }

        setIsPosting(true);
        try {
            await discussionService.createPost(entityType, entityId, newPostContent, currentUserId);

            posthog?.capture('discussion_post_created', {
                entity_type: entityType,
                entity_id: entityId,
                content_length: newPostContent.length,
            });

            setNewPostContent('');
            await fetchDiscussions();
        } catch (error: unknown) {
            console.error('Error creating post:', error);
            const message =
                error && typeof error === 'object' && 'message' in error
                    ? String((error as { message: string }).message)
                    : 'Failed to post question';
            toastError(message);
        } finally {
            setIsPosting(false);
        }
    };

    if (loading) return <div className="p-4 text-center text-muted-foreground">Loading discussions...</div>;

    return (
        <div className="rounded-xl p-6 transition-colors duration-200 bg-card">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 transition-colors duration-200 text-foreground">
                <span>💬</span> Discussion Board
            </h3>

            {/* New Post Input */}
            <form onSubmit={handlePostSubmit} className="mb-8">
                <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder={`Ask a question about this ${entityType}...`}
                    className="w-full p-4 border border-border rounded-lg shadow-sm focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 resize-none transition-all bg-card text-foreground placeholder:text-muted-foreground"
                    rows={3}
                />
                <div className="mt-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={isPosting || !newPostContent.trim() || !currentUserId}
                        className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        {isPosting ? 'Posting...' : !currentUserId ? 'Sign in to post' : 'Post Question'}
                    </button>
                </div>
            </form>

            {/* Thread List */}
            <div className="space-y-4">
                {discussions.length === 0 ? (
                    <div className="text-center py-10 rounded-lg border border-dashed border-border transition-colors duration-200 text-muted-foreground bg-card">
                        <p>No discussions yet. Be the first to ask!</p>
                    </div>
                ) : (
                    discussions.map(thread => (
                        <DiscussionThread
                            key={thread.id}
                            discussion={thread}
                            currentUserId={currentUserId || ''}
                            onRefresh={fetchDiscussions}
                            isDarkMode={isDarkMode}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
