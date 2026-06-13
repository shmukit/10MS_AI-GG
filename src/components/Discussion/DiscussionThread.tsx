
import React, { useState } from 'react';
import { RoadmapDiscussion, discussionService } from '../../services/discussionService';
import { posthog } from '../../lib/posthog';
// import { DatabaseService } from '../../services/database';
// import { formatDistanceToNow } from 'date-fns'; // Ideally used, but avoiding new deps if not present. Using native Intl.RelativeTimeFormat or string manipulation if needed.
// Actually let's just use simple date formatting for now to match project style.

interface DiscussionThreadProps {
    discussion: RoadmapDiscussion;
    currentUserId: string;
    onRefresh: () => void;
    isDarkMode?: boolean;
}

export const DiscussionThread: React.FC<DiscussionThreadProps> = ({
    discussion,
    currentUserId,
    onRefresh,
    isDarkMode = false
}) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setIsSubmitting(true);
        try {
            await discussionService.createPost(
                discussion.entity_type,
                discussion.entity_id,
                replyContent,
                currentUserId,
                discussion.id // Parent ID
            );
            
            posthog?.capture('discussion_reply_created', {
                entity_type: discussion.entity_type,
                entity_id: discussion.entity_id,
                parent_id: discussion.id,
                content_length: replyContent.length
            });
            
            setReplyContent('');
            setIsReplying(false);
            onRefresh();
        } catch (error) {
            console.error('Failed to reply:', error);
            alert('Failed to post reply');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="border border-border rounded-lg p-4 mb-4 shadow-sm transition-colors duration-200 bg-card">
            <div className="flex items-start gap-3">
                {/* User Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 transition-colors duration-200 bg-muted">
                    {discussion.user?.profile_picture_url ? (
                        <img
                            src={discussion.user.profile_picture_url}
                            alt={discussion.user.first_name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground">
                            {discussion.user?.first_name?.[0]}{discussion.user?.last_name?.[0]}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold transition-colors duration-200 text-foreground">
                                {discussion.user?.first_name} {discussion.user?.last_name}
                            </h4>
                            <span className="text-xs transition-colors duration-200 text-muted-foreground">
                                {formatDate(discussion.created_at)}
                            </span>
                        </div>
                        {discussion.is_pinned && (
                            <span className="bg-primary/10 text-primary border border-primary/30 text-xs px-2 py-0.5 rounded-full font-medium">Pinned</span>
                        )}
                    </div>

                    <p className="mt-2 whitespace-pre-wrap transition-colors duration-200 text-foreground">
                        {discussion.content}
                    </p>

                    {/* Actions */}
                    <div className="mt-3 flex gap-4 text-sm transition-colors duration-200 text-muted-foreground">
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="hover:text-primary font-medium transition-colors"
                        >
                            Reply
                        </button>
                        {currentUserId === discussion.user_id && (
                            <button
                                onClick={async () => {
                                    if (confirm('Delete this post?')) {
                                        await discussionService.deletePost(discussion.id);
                                        onRefresh();
                                    }
                                }}
                                className="hover:text-red-400 transition-colors"
                            >
                                Delete
                            </button>
                        )}
                    </div>

                    {/* Reply Form */}
                    {isReplying && (
                        <form onSubmit={handleSubmitReply} className="mt-4">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                className="w-full p-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 text-sm transition-all bg-card text-foreground placeholder:text-muted-foreground"
                                rows={2}
                            />
                            <div className="mt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsReplying(false)}
                                    className="px-3 py-1.5 text-sm rounded transition-colors text-muted-foreground hover:bg-muted"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !replyContent.trim()}
                                    className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"
                                >
                                    {isSubmitting ? 'Posting...' : 'Reply'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {discussion.replies && discussion.replies.length > 0 && (
                <div className="mt-4 pl-4 sm:pl-8 border-l-2 border-border transition-colors duration-200">
                    {discussion.replies.map(reply => (
                        <DiscussionThread
                            key={reply.id}
                            discussion={reply}
                            currentUserId={currentUserId}
                            onRefresh={onRefresh}
                            isDarkMode={isDarkMode}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
