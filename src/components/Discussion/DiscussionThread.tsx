import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { RoadmapDiscussion, discussionService } from '../../services/discussionService';
import { posthog } from '../../lib/posthog';

interface DiscussionThreadProps {
  discussion: RoadmapDiscussion;
  currentUserId: string;
  onRefresh: () => void;
  isDarkMode?: boolean;
}

function AuthorAvatar({ discussion }: { discussion: RoadmapDiscussion }) {
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-muted">
      {discussion.user?.profile_picture_url ? (
        <img
          src={discussion.user.profile_picture_url}
          alt={discussion.user.first_name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground">
          {discussion.user?.first_name?.[0]}
          {discussion.user?.last_name?.[0]}
        </div>
      )}
    </div>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Single-level reply row — no further Reply button / nesting. */
function ReplyRow({
  reply,
  currentUserId,
  onRefresh,
}: {
  reply: RoadmapDiscussion;
  currentUserId: string;
  onRefresh: () => void;
}) {
  const isOwner = Boolean(currentUserId) && currentUserId === reply.user_id;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim() || editContent.trim() === reply.content) {
      setIsEditing(false);
      setEditContent(reply.content);
      return;
    }

    setIsSaving(true);
    try {
      await discussionService.updatePost(reply.id, editContent);
      posthog?.capture('discussion_reply_edited', {
        entity_type: reply.entity_type,
        entity_id: reply.entity_id,
        reply_id: reply.id,
        parent_id: reply.parent_id,
        content_length: editContent.trim().length,
      });
      setIsEditing(false);
      onRefresh();
    } catch (error) {
      console.error('Failed to edit reply:', error);
      window.alert(
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message: string }).message)
          : 'Failed to save reply'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this reply?')) return;
    try {
      await discussionService.deletePost(reply.id);
      posthog?.capture('discussion_reply_deleted', {
        entity_type: reply.entity_type,
        entity_id: reply.entity_id,
        reply_id: reply.id,
        parent_id: reply.parent_id,
      });
      onRefresh();
    } catch (error) {
      console.error('Failed to delete reply:', error);
      window.alert(
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message: string }).message)
          : 'Failed to delete reply'
      );
    }
  };

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-muted">
        {reply.user?.profile_picture_url ? (
          <img
            src={reply.user.profile_picture_url}
            alt={reply.user.first_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">
            {reply.user?.first_name?.[0]}
            {reply.user?.last_name?.[0]}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h5 className="text-sm font-semibold text-foreground">
              {reply.user?.first_name} {reply.user?.last_name}
            </h5>
            <span className="text-xs text-muted-foreground">{formatDate(reply.created_at)}</span>
          </div>
          {isOwner && !isEditing && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setEditContent(reply.content);
                  setIsEditing(true);
                }}
                className="text-xs font-medium px-2 py-1 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs font-medium px-2 py-1 rounded-md border border-border text-muted-foreground hover:text-red-500 hover:border-red-300/60 hover:bg-red-500/5 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2.5 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 text-sm bg-card text-foreground"
              rows={3}
              autoFocus
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(reply.content);
                }}
                className="px-3 py-1.5 text-xs rounded text-muted-foreground hover:bg-muted"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !editContent.trim()}
                className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium"
              >
                {isSaving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        ) : (
          <p className="mt-1.5 text-sm whitespace-pre-wrap text-foreground">{reply.content}</p>
        )}
      </div>
    </div>
  );
}

export const DiscussionThread: React.FC<DiscussionThreadProps> = ({
  discussion,
  currentUserId,
  onRefresh,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const replies = discussion.replies ?? [];
  const replyCount = replies.length;
  const canCollapse = replyCount > 0;

  const toggleCollapsed = () => {
    if (!canCollapse) return;
    setCollapsed((prev) => {
      const next = !prev;
      posthog?.capture(next ? 'discussion_thread_collapsed' : 'discussion_thread_expanded', {
        entity_type: discussion.entity_type,
        entity_id: discussion.entity_id,
        thread_id: discussion.id,
        reply_count: replyCount,
      });
      return next;
    });
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    if (!currentUserId) {
      window.alert('You must be signed in to reply.');
      return;
    }

    setIsSubmitting(true);
    try {
      await discussionService.createPost(
        discussion.entity_type,
        discussion.entity_id,
        replyContent,
        currentUserId,
        discussion.id
      );

      posthog?.capture('discussion_reply_created', {
        entity_type: discussion.entity_type,
        entity_id: discussion.entity_id,
        parent_id: discussion.id,
        content_length: replyContent.length,
      });

      setReplyContent('');
      setIsReplying(false);
      setCollapsed(false);
      onRefresh();
    } catch (error) {
      console.error('Failed to reply:', error);
      window.alert(
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message: string }).message)
          : 'Failed to post reply'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-border rounded-lg p-4 mb-4 shadow-sm bg-card">
      <div className="flex items-start gap-3">
        {/* Collapse control (Reddit-style) */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          {canCollapse ? (
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-expanded={!collapsed}
              aria-label={collapsed ? `Expand ${replyCount} replies` : `Collapse ${replyCount} replies`}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          ) : (
            <div className="w-6 h-6" aria-hidden />
          )}
          <AuthorAvatar discussion={discussion} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Clicking the root header toggles collapse when there are replies */}
          <button
            type="button"
            onClick={canCollapse ? toggleCollapsed : undefined}
            disabled={!canCollapse}
            className={`w-full text-left ${canCollapse ? 'cursor-pointer rounded-md -mx-1 px-1 hover:bg-muted/40' : 'cursor-default'}`}
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <h4 className="font-semibold text-foreground">
                  {discussion.user?.first_name} {discussion.user?.last_name}
                </h4>
                <span className="text-xs text-muted-foreground">{formatDate(discussion.created_at)}</span>
              </div>
              {discussion.is_pinned && (
                <span className="bg-primary/10 text-primary border border-primary/30 text-xs px-2 py-0.5 rounded-full font-medium">
                  Pinned
                </span>
              )}
            </div>

            <p className="mt-2 whitespace-pre-wrap text-foreground">{discussion.content}</p>

            {collapsed && canCollapse && (
              <p className="mt-2 text-xs font-medium text-primary">
                [{replyCount} {replyCount === 1 ? 'reply' : 'replies'} hidden — click to expand]
              </p>
            )}
          </button>

          <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
            <button
              type="button"
              onClick={() => setIsReplying(!isReplying)}
              className="hover:text-primary font-medium transition-colors"
            >
              {replyCount > 0 ? `Reply (${replyCount})` : 'Reply'}
            </button>
            {canCollapse && (
              <button
                type="button"
                onClick={toggleCollapsed}
                className="hover:text-primary font-medium transition-colors"
              >
                {collapsed ? 'Expand' : 'Collapse'}
              </button>
            )}
            {currentUserId === discussion.user_id && (
              <button
                type="button"
                onClick={async () => {
                  if (confirm('Delete this question and its replies?')) {
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

          {!collapsed && isReplying && (
            <form onSubmit={handleSubmitReply} className="mt-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply to this question…"
                className="w-full p-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 text-sm bg-card text-foreground placeholder:text-muted-foreground"
                rows={2}
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="px-3 py-1.5 text-sm rounded text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !replyContent.trim()}
                  className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium"
                >
                  {isSubmitting ? 'Posting...' : 'Reply'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Flat reply list — one nest layer; click the rail to collapse (Reddit-style) */}
      {!collapsed && replyCount > 0 && (
        <div className="mt-4 ml-2 sm:ml-4 flex gap-0">
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={`Collapse ${replyCount} replies`}
            title="Collapse replies"
            className="group relative w-5 sm:w-6 shrink-0 self-stretch rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <span
              aria-hidden
              className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 rounded-full bg-border group-hover:bg-primary/60 transition-colors"
            />
          </button>
          <div className="flex-1 min-w-0 divide-y divide-border">
            {replies.map((reply) => (
              <ReplyRow
                key={reply.id}
                reply={reply}
                currentUserId={currentUserId}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
