import React, { useState } from 'react';
import { Bell, ChevronDown, ChevronUp, X } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  sender: string;
  date: string;
  time: string;
  isRead: boolean;
  tag: 'Reminder' | 'Homework' | 'Assignment' | 'Exam' | 'Cancellation' | 'Resources';
}

interface NoticeBoardProps {
  isDarkMode?: boolean;
}

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Python Assignment Due Tomorrow',
    content: 'Please submit your Python loops assignment by 11:59 PM tomorrow. Make sure to include both examples as discussed in class.',
    sender: 'Uttam Deb',
    date: 'Sep 11, 2025',
    time: '2:30 PM',
    isRead: false,
    tag: 'Assignment'
  },
  {
    id: '2',
    title: 'Weekly Quiz Reminder',
    content: 'Don\'t forget about the weekly quiz on Python fundamentals scheduled for Friday.',
    sender: 'Uttam Deb',
    date: 'Sep 10, 2025',
    time: '10:15 AM',
    isRead: true,
    tag: 'Reminder'
  },
  {
    id: '3',
    title: 'New Learning Resources Available',
    content: 'I\'ve uploaded additional Python practice exercises and video tutorials to help with your learning.',
    sender: 'Uttam Deb',
    date: 'Sep 9, 2025',
    time: '4:45 PM',
    isRead: true,
    tag: 'Resources'
  }
];

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ isDarkMode = false }) => {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentAnnouncement = announcements[currentIndex];
  const unreadCount = announcements.filter(a => !a.isRead).length;

  const markAsRead = (id: string) => {
    setAnnouncements(prev => 
      prev.map(announcement => 
        announcement.id === id ? { ...announcement, isRead: true } : announcement
      )
    );
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

      {/* Navigation Controls */}
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

        {!currentAnnouncement.isRead && (
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
    </div>
  );
};