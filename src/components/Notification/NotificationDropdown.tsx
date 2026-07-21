
import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../lib/useAuth';
import { DatabaseService, Notice } from '../../services/database';
import { cn } from '../../lib/utils';

type NoticeWithAuthor = Notice & {
    author?: { first_name?: string; last_name?: string };
    author_name?: string;
};

const getNoticeAuthor = (notice: NoticeWithAuthor): string | null => {
    if (notice.author_name?.trim()) return notice.author_name.trim();
    if (notice.author?.first_name) {
        return `${notice.author.first_name} ${notice.author.last_name || ''}`.trim();
    }
    return null;
};

export const NotificationDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { databaseUserId } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const [readNotices, setReadNotices] = useState<Set<string>>(new Set());

    const toggleReadStatus = (e: React.MouseEvent, noticeId: string) => {
        e.stopPropagation();
        setReadNotices(prev => {
            const newSet = new Set(prev);
            if (newSet.has(noticeId)) {
                newSet.delete(noticeId);
            } else {
                newSet.add(noticeId);
            }
            return newSet;
        });
    };

    const markAllAsRead = () => {
        setReadNotices(new Set(notices.map(n => n.id)));
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        };
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        return `${date.toLocaleDateString('en-US', options)} • ${date.toLocaleTimeString('en-US', timeOptions)}`;
    };

    const getTagStyles = (tag: string) => {
        const tagLower = tag.toLowerCase();
        if (tagLower === 'exam' || tagLower === 'urgent') {
            return 'bg-destructive/10 text-destructive border-destructive/20';
        }
        return 'bg-muted text-muted-foreground border-border';
    };

    const fetchNotices = async () => {
        if (!databaseUserId) return;
        setLoading(true);
        try {
            const data = await DatabaseService.getDashboardData(databaseUserId);
            if (data?.notices) {
                setNotices(data.notices);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && notices.length === 0) {
            fetchNotices();
        }
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "p-2 rounded-lg transition-all duration-200 relative group",
                    "bg-muted text-primary hover:bg-muted/80"
                )}
                aria-label="Open notifications"
            >
                <Bell className="w-5 h-5" />
                {notices.filter(n => !readNotices.has(n.id)).length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className={cn(
                    "absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl shadow-2xl border border-border transition-all duration-300 z-[100] transform origin-top-right scale-100",
                    "bg-card shadow-black/40"
                )}>
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-primary" />
                            <h3 className="font-bold text-lg text-foreground">Notifications</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-muted">
                        {loading && notices.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                <p className="text-sm text-muted-foreground">Loading notices...</p>
                            </div>
                        ) : notices.length > 0 ? (
                            <div className="space-y-1">
                                {notices.map((notice) => (
                                    <div
                                        key={notice.id}
                                        className={cn(
                                            "p-4 rounded-xl transition-all duration-200 hover:bg-muted/50 cursor-pointer group border border-transparent relative",
                                            "hover:border-border",
                                            !readNotices.has(notice.id) && "bg-primary/5"
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={cn(
                                                "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                                                notice.priority === 'urgent' ? "bg-red-500/10" :
                                                    notice.priority === 'high' ? "bg-muted" : "bg-muted"
                                            )}>
                                                {notice.priority === 'urgent'
                                                    ? <AlertCircle className="w-4 h-4 text-red-600" />
                                                    : notice.priority === 'high'
                                                        ? <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                                                        : <Info className="w-4 h-4 text-primary" />
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <h4 className={cn(
                                                            "text-sm font-bold truncate group-hover:text-primary transition-colors text-foreground",
                                                            !readNotices.has(notice.id) && "text-primary"
                                                        )}>
                                                            {notice.title}
                                                        </h4>
                                                        {!readNotices.has(notice.id) && (
                                                            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={(e) => toggleReadStatus(e, notice.id)}
                                                        className={cn(
                                                            "text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors shrink-0",
                                                            readNotices.has(notice.id)
                                                                ? "text-muted-foreground bg-muted"
                                                                : "text-primary bg-primary/10"
                                                        )}
                                                    >
                                                        {readNotices.has(notice.id) ? 'Mark unread' : 'Mark read'}
                                                    </button>
                                                </div>
                                                <p className={cn(
                                                    "text-xs line-clamp-2 leading-relaxed mb-2 text-muted-foreground",
                                                    !readNotices.has(notice.id) && "text-foreground"
                                                )}>
                                                    {notice.content}
                                                </p>

                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors",
                                                            getTagStyles(notice.tag || 'General')
                                                        )}>
                                                            {notice.tag || 'General'}
                                                        </span>
                                                        {getNoticeAuthor(notice as NoticeWithAuthor) && (
                                                            <span className="text-[10px] truncate text-muted-foreground">
                                                                From: {getNoticeAuthor(notice as NoticeWithAuthor)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                        {formatDate(notice.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 space-y-4">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                    <Bell className="w-8 h-8 text-muted-foreground/30" />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-foreground">All caught up!</p>
                                    <p className="text-xs text-muted-foreground mt-1">No new notifications at the moment.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t border-border bg-muted/20">
                        <button
                            onClick={markAllAsRead}
                            className="w-full py-2 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-all"
                        >
                            Mark all as read
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
