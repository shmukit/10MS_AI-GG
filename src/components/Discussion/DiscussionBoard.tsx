import React, { useEffect, useState } from 'react';
import { RoadmapDiscussion, discussionService } from '../../services/discussionService';
import { DiscussionThread } from './DiscussionThread';
import { DatabaseService } from '../../services/database';
import { useTheme } from '../../lib/ThemeContext';

interface DiscussionBoardProps {
    entityType: 'roadmap' | 'week' | 'task';
    entityId: string;
}

export const DiscussionBoard: React.FC<DiscussionBoardProps> = ({ entityType, entityId }) => {
    const { isDarkMode } = useTheme();
    const [discussions, setDiscussions] = useState<RoadmapDiscussion[]>([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const fetchDiscussions = async () => {
        try {
            // Fetch ALL discussions for this entity
            const allPosts = await discussionService.getAllDiscussionsForEntity(entityType, entityId);

            // Organize into tree structure
            const postMap = new Map<string, RoadmapDiscussion>();
            const roots: RoadmapDiscussion[] = [];

            // First pass: map all ID -> Post and init replies
            allPosts.forEach(post => {
                post.replies = [];
                postMap.set(post.id, post);
            });

            // Second pass: link children to parents
            allPosts.forEach(post => {
                if (post.parent_id) {
                    const parent = postMap.get(post.parent_id);
                    if (parent && parent.replies) {
                        parent.replies.push(post);
                    } else {
                        // Parent missing or not loaded (orphan? or logic error). 
                        // Ideally handle gracefully. For now, maybe just treat as root if parent strictness isn't ignored.
                        // But let's assume valid data.
                    }
                } else {
                    roots.push(post);
                }
            });

            // Sort: Pinned first, then Newest first
            roots.sort((a, b) => {
                if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });

            setDiscussions(roots);
        } catch (error) {
            console.error('Error fetching discussions:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = async () => {
        const user = await DatabaseService.getCurrentUser();
        if (user) setCurrentUserId(user.id);
    };

    useEffect(() => {
        fetchUser();
        fetchDiscussions();
    }, [entityType, entityId]);

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostContent.trim() || !currentUserId) return;

        setIsPosting(true);
        try {
            await discussionService.createPost(entityType, entityId, newPostContent, currentUserId);
            setNewPostContent('');
            fetchDiscussions(); // Refresh list
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to post');
        } finally {
            setIsPosting(false);
        }
    };

    if (loading) return <div className={`p-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading discussions...</div>;

    return (
        <div className={`rounded-xl p-6 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                <span>💬</span> Discussion Board
            </h3>

            {/* New Post Input */}
            <form onSubmit={handlePostSubmit} className="mb-8">
                <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder={`Ask a question about this ${entityType}...`}
                    className={`w-full p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all ${isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                        }`}
                    rows={3}
                />
                <div className="mt-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={isPosting || !newPostContent.trim()}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        {isPosting ? 'Posting...' : 'Post Question'}
                    </button>
                </div>
            </form>

            {/* Thread List */}
            <div className="space-y-4">
                {discussions.length === 0 ? (
                    <div className={`text-center py-10 rounded-lg border border-dashed transition-colors duration-200 ${isDarkMode
                        ? 'text-gray-400 bg-gray-700/30 border-gray-600'
                        : 'text-gray-400 bg-white border-gray-300'
                        }`}>
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
