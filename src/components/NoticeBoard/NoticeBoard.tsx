import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, ChevronUp, X } from 'lucide-react';
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
  isDarkMode?: boolean;
  notices?: Notice[];
  onMarkAsRead?: (noticeId: string) => void;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ 
  isDarkMode = false, 
  notices = [], 
  onMarkAsRead 
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
    const colors = {
      'Reminder': isDarkMode ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700' : 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Homework': isDarkMode ? 'bg-blue-900/30 text-blue-300 border-blue-700' : 'bg-blue-50 text-blue-700 border-blue-200',
      'Assignment': isDarkMode ? 'bg-purple-900/30 text-purple-300 border-purple-700' : 'bg-purple-50 text-purple-700 border-purple-200',
      'Exam': isDarkMode ? 'bg-red-900/30 text-red-300 border-red-700' : 'bg-red-50 text-red-700 border-red-200',
      'Cancellation': isDarkMode ? 'bg-orange-900/30 text-orange-300 border-orange-700' : 'bg-orange-50 text-orange-700 border-orange-200',
      'Resources': isDarkMode ? 'bg-green-900/30 text-green-300 border-green-700' : 'bg-green-50 text-green-700 border-green-200'
    };
    return colors[tag as keyof typeof colors] || colors.Reminder;
  };

  return (
    <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className={`font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Notice Board
          </h3>
          {unreadCount > 0 && (
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          )}
        </div>
        <div className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {currentIndex + 1} of {announcements.length}
        </div>
      </div>

      {/* Current Announcement */}
      {announcements.length === 0 ? (
        <div className="text-center py-8">
          <div className={`text-gray-400 mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
          </div>
          <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No notices available at the moment
          </p>
        </div>
      ) : currentAnnouncement ? (
        <div className="mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentAnnouncement.title}
                </h4>
                {!currentAnnouncement.isRead && (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </div>
              <p className={`text-sm mb-3 leading-relaxed transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
        <div className={`flex items-center justify-between text-xs transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
                ? `cursor-not-allowed ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`
                : `${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
            }`}
          >
            <span className="text-lg font-bold">‹</span>
          </button>

          {currentAnnouncement && !currentAnnouncement.isRead && (
            <button
              onClick={() => markAsRead(currentAnnouncement.id)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                isDarkMode 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Mark as Read
            </button>
          )}

          <button
            onClick={nextAnnouncement}
            disabled={currentIndex === announcements.length - 1}
            className={`p-2 rounded-lg transition-colors ${
              currentIndex === announcements.length - 1
                ? `cursor-not-allowed ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`
                : `${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
            }`}
          >
            <span className="text-lg font-bold">›</span>
          </button>
        </div>
      )}
    </div>
  );
};