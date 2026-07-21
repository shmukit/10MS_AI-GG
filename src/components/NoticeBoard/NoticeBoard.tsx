import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Notice } from '../../services/database';

interface Announcement {
  id: string;
  title: string;
  content: string;
  sender: string;
  date: string;
  time: string;
  isRead: boolean;
  tag: string;
}

interface NoticeBoardProps {
  notices?: Notice[];
  onMarkAsRead?: (noticeId: string) => void;
  onNoticeClick?: (notice: Notice) => void;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ 
  notices = [], 
  onMarkAsRead,
  onNoticeClick
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Convert notices to announcements format
  useEffect(() => {
    if (notices && notices.length > 0) {
      const convertedAnnouncements: Announcement[] = notices.map(notice => ({
        id: notice.id,
        title: notice.title,
        content: notice.content,
        sender: 'Mentor', // You might want to fetch the actual sender name
        date: new Date(notice.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        time: new Date(notice.created_at).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit' 
        }),
        isRead: false, // Initialize as unread
        tag: notice.tag || 'General'
      }));
      setAnnouncements(convertedAnnouncements);
    } else {
      setAnnouncements([]);
    }
  }, [notices]);

  const currentAnnouncement = announcements[currentIndex] || null;
  const unreadCount = announcements.filter(a => !a.isRead).length;

  const markAsRead = async (id: string) => {
    // Update local state immediately for better UX
    setAnnouncements(prev => 
      prev.map(announcement => 
        announcement.id === id ? { ...announcement, isRead: true } : announcement
      )
    );

    // Call the parent callback to persist the read status
    if (onMarkAsRead) {
      try {
        await onMarkAsRead(id);
      } catch (error) {
        console.error('Error marking notice as read:', error);
        // Revert local state if the API call fails
        setAnnouncements(prev => 
          prev.map(announcement => 
            announcement.id === id ? { ...announcement, isRead: false } : announcement
          )
        );
      }
    }
  };

  const nextAnnouncement = () => {
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevAnnouncement = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getTagColor = (tag: string) => {
    const tagLower = tag.toLowerCase();
    if (tagLower === 'exam' || tagLower === 'urgent') {
      return 'bg-destructive/10 text-destructive border-destructive/20';
    }
    if (tagLower === 'general') {
      return 'bg-muted text-muted-foreground border-border';
    }
    return 'bg-accent text-accent-foreground border-border';
  };

  return (
    <div className="rounded-xl p-6 border border-border transition-colors duration-200 bg-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="font-bold transition-colors duration-200 text-foreground">
            Notice Board
          </h3>
          {unreadCount > 0 && (
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          )}
        </div>
        {announcements.length > 0 && (
          <div className="text-sm transition-colors duration-200 text-muted-foreground">
            {currentIndex + 1} of {announcements.length}
          </div>
        )}
      </div>

      {/* Current Announcement */}
      {announcements.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-2">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
          </div>
          <p className="text-sm transition-colors duration-200 text-muted-foreground">
            No notices available at the moment
          </p>
        </div>
      ) : currentAnnouncement ? (
        <div 
          className="mb-4 cursor-pointer hover:opacity-90 transition-opacity duration-200"
          onClick={() => {
            if (onNoticeClick && notices.length > 0) {
              const originalNotice = notices.find(n => n.id === currentAnnouncement.id);
              if (originalNotice) {
                onNoticeClick(originalNotice);
              }
            }
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold transition-colors duration-200 text-foreground">
                  {currentAnnouncement.title}
                </h4>
                {!currentAnnouncement.isRead && (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </div>
              <p className="text-sm mb-3 leading-relaxed transition-colors duration-200 text-muted-foreground">
                {currentAnnouncement.content}
              </p>
            </div>
          </div>

        {/* Tag */}
        <div className="mb-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTagColor(currentAnnouncement.tag)}`}>
            {currentAnnouncement.tag}
          </span>
        </div>

        {/* Sender and Date */}
        <div className="flex items-center justify-between text-xs transition-colors duration-200 text-muted-foreground">
          <span>From: {currentAnnouncement.sender}</span>
          <span>{currentAnnouncement.date} • {currentAnnouncement.time}</span>
        </div>
      </div>
      ) : null}

      {/* Navigation Controls */}
      {announcements.length > 0 && (
        <div className="flex items-center justify-between">
          <button
            onClick={prevAnnouncement}
            disabled={currentIndex === 0}
            className={`p-2 rounded-lg transition-colors ${
              currentIndex === 0
                ? 'cursor-not-allowed text-muted-foreground/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <span className="text-lg font-bold">‹</span>
          </button>

          {currentAnnouncement && !currentAnnouncement.isRead && (
            <button
              onClick={() => markAsRead(currentAnnouncement.id)}
              className="text-xs px-3 py-1 rounded-full transition-colors bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Mark as Read
            </button>
          )}

          <button
            onClick={nextAnnouncement}
            disabled={currentIndex === announcements.length - 1}
            className={`p-2 rounded-lg transition-colors ${
              currentIndex === announcements.length - 1
                ? 'cursor-not-allowed text-muted-foreground/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <span className="text-lg font-bold">›</span>
          </button>
        </div>
      )}
    </div>
  );
};