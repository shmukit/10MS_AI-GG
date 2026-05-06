
import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../lib/useAuth';
import { DatabaseService, Notice } from '../../services/database';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/ThemeContext';

export const NotificationDropdown: React.FC = () => {
    const { isDarkMode } = useTheme();
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
        if (tagLower === 'homework' || tagLower === 'assignment') return isDarkMode ? 'bg-blue-900/40 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-700 border-blue-200';
        if (tagLower === 'exam' || tagLower === 'urgent') return isDarkMode ? 'bg-red-900/40 text-red-300 border-red-800' : 'bg-red-50 text-red-700 border-red-200';
        if (tagLower === 'resources') return isDarkMode ? 'bg-green-900/40 text-green-300 border-green-800' : 'bg-green-50 text-green-700 border-green-200';
        if (tagLower === 'cancellation') return isDarkMode ? 'bg-orange-900/40 text-orange-300 border-orange-800' : 'bg-orange-50 text-orange-700 border-orange-200';
        return isDarkMode ? 'bg-gray-700/50 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200';
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
                    isDarkMode
                        ? "bg-gray-700/50 text-blue-400 hover:bg-gray-700"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                )}
            >
                <Bell className="w-5 h-5" />
                {notices.filter(n => !readNotices.has(n.id)).length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className={cn(
                    "absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl shadow-2xl border transition-all duration-300 z-[100] transform origin-top-right scale-100",
                    isDarkMode
                        ? "bg-gray-800 border-gray-700 shadow-black/40"
                        : "bg-white border-gray-100 shadow-gray-200/50"
                )}>
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-primary" />
                            <h3 className={cn("font-bold text-lg", isDarkMode ? "text-white" : "text-gray-900")}>Notifications</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className={cn("p-1.5 rounded-full hover:bg-muted transition-colors", isDarkMode ? "text-gray-400" : "text-gray-500")}
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
                                            isDarkMode ? "hover:border-gray-700" : "hover:border-gray-100",
                                            !readNotices.has(notice.id) && (isDarkMode ? "bg-blue-900/10" : "bg-blue-50/50")
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={cn(
                                                "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                                                notice.priority === 'urgent' ? "bg-red-500/10" :
                                                    notice.priority === 'high' ? "bg-orange-500/10" : "bg-blue-500/10"
                                            )}>
                                                {notice.priority === 'urgent'
                                                    ? <AlertCircle className="w-4 h-4 text-red-600" />
                                                    : notice.priority === 'high'
                                                        ? <AlertTriangle className="w-4 h-4 text-orange-500" />
                                                        : <Info className="w-4 h-4 text-blue-500" />
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <h4 className={cn(
                                                            "text-sm font-bold truncate group-hover:text-primary transition-colors",
                                                            isDarkMode ? "text-white" : "text-gray-900",
                                                            !readNotices.has(notice.id) && "text-blue-600 dark:text-blue-400"
                                                        )}>
                                                            {notice.title}
                                                        </h4>
                                                        {!readNotices.has(notice.id) && (
                                                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={(e) => toggleReadStatus(e, notice.id)}
                                                        className={cn(
                                                            "text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors opacity-0 group-hover:opacity-100",
                                                            readNotices.has(notice.id)
                                                                ? "text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
                                                                : "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                                                        )}
                                                    >
                                                        {readNotices.has(notice.id) ? 'Mark unread' : 'Mark read'}
                                                    </button>
                                                </div>
                                                <p className={cn(
                                                    "text-xs line-clamp-2 leading-relaxed mb-2",
                                                    isDarkMode ? "text-gray-400 font-normal" : "text-gray-600",
                                                    !readNotices.has(notice.id) && (isDarkMode ? "text-gray-300" : "text-gray-900")
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
                                                        <span className={cn("text-[10px] truncate", isDarkMode ? "text-gray-500" : "text-gray-500")}>
                                                            From: Mentor
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] text-gray-500 whitespace-nowrap">
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
                                    <p className={cn("font-bold text-gray-900", isDarkMode && "text-white")}>All caught up!</p>
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
