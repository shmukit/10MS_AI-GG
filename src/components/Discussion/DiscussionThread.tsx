
import React, { useState } from 'react';
import { RoadmapDiscussion, discussionService } from '../../services/discussionService';
// import { DatabaseService } from '../../services/database';
// import { formatDistanceToNow } from 'date-fns'; // Ideally used, but avoiding new deps if not present. Using native Intl.RelativeTimeFormat or string manipulation if needed.
// Actually let's just use simple date formatting for now to match project style.

interface DiscussionThreadProps {
    discussion: RoadmapDiscussion;
    currentUserId: string;
    onRefresh: () => void;
}

export const DiscussionThread: React.FC<DiscussionThreadProps> = ({ discussion, currentUserId, onRefresh }) => {
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
        <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm">
            <div className="flex items-start gap-3">
                {/* User Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    {discussion.user?.profile_picture_url ? (
                        <img
                            src={discussion.user.profile_picture_url}
                            alt={discussion.user.first_name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                            {discussion.user?.first_name?.[0]}{discussion.user?.last_name?.[0]}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold text-gray-900">
                                {discussion.user?.first_name} {discussion.user?.last_name}
                            </h4>
                            <span className="text-xs text-gray-500">{formatDate(discussion.created_at)}</span>
                        </div>
                        {discussion.is_pinned && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Pinned</span>
                        )}
                    </div>

                    <p className="mt-2 text-gray-800 whitespace-pre-wrap">{discussion.content}</p>

                    {/* Actions */}
                    <div className="mt-3 flex gap-4 text-sm text-gray-500">
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="hover:text-blue-600 font-medium"
                        >
                            Reply
                        </button>
                        {/* Future: Like Button */}
                        {currentUserId === discussion.user_id && (
                            <button
                                onClick={async () => {
                                    if (confirm('Delete this post?')) {
                                        await discussionService.deletePost(discussion.id);
                                        onRefresh();
                                    }
                                }}
                                className="hover:text-red-600"
                            >
                                Delete
                            </button>
                        )}
                    </div>

                    {/* Reply Form */}
                    {isReplying && (
                        <form onSubmit={handleSubmitReply} className="mt-3">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                rows={2}
                            />
                            <div className="mt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsReplying(false)}
                                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Posting...' : 'Reply'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Replies would be rendered recursively here if we fetched them as a tree */}
            {/* For MVP Phase 1, we might just show flat or 1-level nested. 
          Assuming the service returns flat list to the Board, and Board handles nesting or filtering.
          Wait, the interface I defined in service implied nesting `replies?: RoadmapDiscussion[]`.
          If the parent passed replies, render them.
      */}
            {discussion.replies && discussion.replies.length > 0 && (
                <div className="mt-4 pl-12 border-l-2 border-gray-100">
                    {discussion.replies.map(reply => (
                        <DiscussionThread
                            key={reply.id}
                            discussion={reply}
                            currentUserId={currentUserId}
                            onRefresh={onRefresh}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
