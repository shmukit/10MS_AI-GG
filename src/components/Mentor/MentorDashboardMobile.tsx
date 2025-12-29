import React, { useState, useEffect } from 'react';
import { ArrowLeft, Moon, Sun, Users, BookOpen, MessageSquare, Bell, Plus, Edit2, Trash2, ExternalLink, LogOut, User, Phone, Mail, Calendar, Clock, X, Eye, EyeOff, Copy, Check, Menu, ChevronDown } from 'lucide-react';
import { MentorHeader } from './MentorHeader';
import { useAuth } from '../../lib/useAuth';
import { supabase } from '../../lib/supabase';

// Mobile-optimized interfaces
interface MobileStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  institute: string;
  year: string;
  subject: string;
  degree: string;
  batchId: string;
  completedWeeks: number;
  progressPercentage: number;
}

interface MobileBatch {
  id: string;
  name: string;
  roadmapId: string;
  roadmapName: string;
  studentCount: number;
  maxStudents: number;
  whatsappLink: string;
  discordLink: string;
  emergencyContact: string;
  createdDate: string;
}

interface MobileNotice {
  id: string;
  title: string;
  content: string;
  tag: string;
  scheduledDate: string;
  scheduledTime: string;
  isPublished: boolean;
  createdAt: string;
}

interface MentorDashboardMobileProps {
  onLogout?: () => void;
  onProfile?: () => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

export const MentorDashboardMobile: React.FC<MentorDashboardMobileProps> = ({ 
  onLogout, 
  onProfile, 
  isDarkMode = false, 
  toggleDarkMode 
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'roadmap' | 'students' | 'notice'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [students, setStudents] = useState<MobileStudent[]>([]);
  const [batches, setBatches] = useState<MobileBatch[]>([]);
  const [notices, setNotices] = useState<MobileNotice[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mobile-optimized navigation
  const MobileNavigation = () => (
    <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'
    }`}>
      <div className="grid grid-cols-4 h-16">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Users },
          { id: 'roadmap', label: 'Roadmap', icon: BookOpen },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'notice', label: 'Notice', icon: Bell }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id as any);
              setIsMobileMenuOpen(false);
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
              activeTab === id
                ? isDarkMode 
                  ? 'text-blue-400 bg-gray-700' 
                  : 'text-blue-600 bg-blue-50'
                : isDarkMode 
                  ? 'text-gray-400' 
                  : 'text-gray-600'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Mobile-optimized student card
  const MobileStudentCard = ({ student }: { student: MobileStudent }) => (
    <div className={`p-4 rounded-lg border transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-700 border-gray-600' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Student Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {student.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h5 className={`font-semibold text-sm truncate transition-colors duration-200 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {student.name}
            </h5>
            <p className={`text-xs truncate transition-colors duration-200 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {student.degree} {student.subject}
            </p>
          </div>
        </div>
        <button
          onClick={() => {/* Handle delete */}}
          className="p-1 rounded hover:bg-red-100 text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Student Details */}
      <div className="space-y-2 mb-3">
        <div className={`text-xs transition-colors duration-200 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {student.institute}
        </div>
        <div className="flex items-center gap-2">
          <a href={`mailto:${student.email}`} className="flex items-center gap-1 text-xs text-blue-600">
            <Mail className="w-3 h-3" />
            <span className="truncate">{student.email}</span>
          </a>
        </div>
        {student.phone && (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <Phone className="w-3 h-3" />
            <span>{student.phone}</span>
          </div>
        )}
      </div>

      {/* Progress Section */}
      <div className="border-t pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Week {student.completedWeeks}/6
          </span>
          <span className={`text-xs transition-colors duration-200 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {student.progressPercentage}% Complete
          </span>
        </div>
        <div className={`w-full h-2 rounded-full ${
          isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
        }`}>
          <div 
            className="h-2 rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${student.progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );

  // Mobile-optimized batch selector
  const MobileBatchSelector = () => (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        Select Batch
      </label>
      <div className="relative">
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className={`w-full px-3 py-2 pr-8 border rounded-lg transition-colors ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="">Select a batch</option>
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );

  // Mobile-optimized action buttons
  const MobileActionButtons = () => (
    <div className="grid grid-cols-2 gap-2 mb-4">
      <button className="flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm">
        <Plus className="w-4 h-4" />
        Add Student
      </button>
      <button className="flex items-center justify-center gap-2 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm">
        <Plus className="w-4 h-4" />
        New Batch
      </button>
    </div>
  );

  // Mobile-optimized stats cards
  const MobileStatsCards = () => (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <div className={`p-4 rounded-lg border transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          <div>
            <p className={`text-lg font-bold transition-colors duration-200 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {students.length}
            </p>
            <p className={`text-xs transition-colors duration-200 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Students
            </p>
          </div>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg border transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-500" />
          <div>
            <p className={`text-lg font-bold transition-colors duration-200 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {batches.length}
            </p>
            <p className={`text-xs transition-colors duration-200 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Batches
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render
  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'
    }`}>
      <MentorHeader 
        userName={user?.user_metadata?.full_name || 'Mentor'}
        userRole="mentor"
        pageTitle="Dashboard"
      />

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Main Content - with bottom padding for mobile nav */}
      <div className="pb-20 lg:pb-8">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Mobile Stats */}
          <MobileStatsCards />

          {/* Mobile Batch Selector */}
          <MobileBatchSelector />

          {/* Mobile Action Buttons */}
          <MobileActionButtons />

          {/* Students List */}
          {activeTab === 'students' && (
            <div className="space-y-3">
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Students ({students.length})
              </h3>
              {students.map((student) => (
                <MobileStudentCard key={student.id} student={student} />
              ))}
            </div>
          )}

          {/* Other tabs content would go here */}
        </div>
      </div>
    </div>
  );
};
