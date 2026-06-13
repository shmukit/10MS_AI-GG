import React, { useState, useEffect } from 'react';
import { ArrowLeft, Moon, Sun, Users, MessageCircle, Phone, Mail, Filter } from 'lucide-react';
import { DatabaseService } from '../../services/database';
import { useAuth } from '../../lib/useAuth';
import { posthog } from '../../lib/posthog';

interface Student {
  id: string;
  name: string;
  profilePhoto: string;
  institute: string;
  year: string;
  subject: string;
  degree: string;
  email: string;
  completedWeeks: number;
  progressPercentage: number;
}

interface CommunityPageProps {
  onBack: () => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Amira K.',
    profilePhoto: '',
    institute: 'Dhaka University',
    year: '3rd Year',
    subject: 'Computer Science',
    degree: 'BSc',
    email: 'amira.k@example.com',
    completedWeeks: 3,
    progressPercentage: 75
  },
  {
    id: '2',
    name: 'Sarah Ahmed',
    profilePhoto: '',
    institute: 'BUET',
    year: '2nd Year',
    subject: 'Software Engineering',
    degree: 'BSc',
    email: 'sarah.ahmed@example.com',
    completedWeeks: 2,
    progressPercentage: 60
  },
  {
    id: '3',
    name: 'Fatima Rahman',
    profilePhoto: '',
    institute: 'NSU',
    year: '4th Year',
    subject: 'Data Science',
    degree: 'BSc',
    email: 'fatima.r@example.com',
    completedWeeks: 4,
    progressPercentage: 85
  },
  {
    id: '4',
    name: 'Nadia Islam',
    profilePhoto: '',
    institute: 'IUT',
    year: '1st Year',
    subject: 'Computer Science',
    degree: 'BSc',
    email: 'nadia.islam@example.com',
    completedWeeks: 1,
    progressPercentage: 40
  },
  {
    id: '5',
    name: 'Rashida Khan',
    profilePhoto: '',
    institute: 'Dhaka University',
    year: '3rd Year',
    subject: 'Information Technology',
    degree: 'BSc',
    email: 'rashida.k@example.com',
    completedWeeks: 3,
    progressPercentage: 70
  }
];

export const CommunityPage: React.FC<CommunityPageProps> = ({ onBack, isDarkMode = false, toggleDarkMode }) => {
  const { user, databaseUserId } = useAuth();
  // const posthog = usePostHog();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'completion'>('name');

  // Fetch real student data
  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);

        // Track community view and MAU
        posthog?.capture('community_view', {
          user_id: databaseUserId,
          viewed_at: new Date().toISOString()
        });

        // Track MAU (Monthly Active User)
        posthog?.capture('$pageview', {
          page: 'community',
          user_id: databaseUserId
        });

        // Get user's batch
        if (!databaseUserId) {
          setError('User not authenticated');
          return;
        }

        const batch = await DatabaseService.getStudentBatch(databaseUserId);
        if (!batch) {
          setError('No batch found for user');
          return;
        }

        // Get students in the same batch
        const batchStudents = await DatabaseService.getStudentsByBatch(batch.id, databaseUserId);

        // Transform data to match interface
        const transformedStudents: Student[] = batchStudents.map((student: any) => ({
          id: student.id,
          name: `${student.first_name} ${student.last_name}`.trim(),
          profilePhoto: '',
          institute: student.profile?.institute || 'Unknown',
          year: student.profile?.year || 'Unknown',
          subject: student.profile?.subject || 'Unknown',
          degree: student.profile?.degree || 'Unknown',
          email: student.email,
          completedWeeks: student.progress?.completed_weeks || 0,
          progressPercentage: student.progress?.progress_percentage || 0
        }));

        setStudents(transformedStudents);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load community data');
        // Fallback to mock data
        setStudents(mockStudents);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user?.id]);

  const sortedStudents = [...students].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      // Sort by progress percentage (highest first), then by completed weeks
      const progressDiff = b.progressPercentage - a.progressPercentage;
      if (progressDiff !== 0) return progressDiff;
      return b.completedWeeks - a.completedWeeks;
    }
  });

  const handleWhatsAppClick = () => {
    posthog?.capture('whatsapp_group_clicked', {
      user_id: databaseUserId,
      group_type: 'community',
      clicked_at: new Date().toISOString()
    });
    window.open('https://chat.whatsapp.com/example-group-link', '_blank');
  };

  const handleDiscordClick = () => {
    window.open('https://discord.gg/example-server', '_blank');
  };

  const handleEmergencyContact = () => {
    posthog?.capture('student_contact_clicked', {
      user_id: databaseUserId,
      contact_type: 'phone',
      contact_number: '+8801234567890',
      contact_purpose: 'emergency',
      clicked_at: new Date().toISOString()
    });
    window.open('tel:+8801234567890', '_self');
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <div className={`border-b h-16 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">10MS</span>
              </div>
              <h1 className={`text-xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>10MS SheSTEM</h1>
            </div>

            <div className="flex items-center gap-4">
              {toggleDarkMode && (
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-colors duration-200 ${isDarkMode
                      ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}
              <div className="flex items-center gap-2">
                <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Amira K.</span>
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className={`border-b h-16 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 transition-colors ${isDarkMode
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <h1 className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Community</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Group Info Section */}
        <div className={`rounded-xl p-6 shadow-sm border mb-8 transition-colors duration-200 ${isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
          }`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Group Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Users className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h2 className={`text-xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Python Learning Cohort - Batch 15
                </h2>
              </div>

              <div className="space-y-3">
                <div className={`flex items-center gap-2 text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Users className="w-4 h-4" />
                  <span><strong>Students:</strong> {students.length} members</span>
                </div>
                <div className={`flex items-center gap-2 text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="w-4 h-4 flex items-center justify-center">👨‍🏫</span>
                  <span><strong>Mentor:</strong> Uttam Deb, Senior BI Executive</span>
                </div>
              </div>
            </div>

            {/* Right Column - Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={handleWhatsAppClick}
                  className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors ${isDarkMode
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                >
                  <MessageCircle className="w-3 h-3" />
                  WhatsApp
                </button>

                <button
                  onClick={handleDiscordClick}
                  className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors ${isDarkMode
                      ? 'bg-primary hover:bg-[#17994B] text-primary-foreground'
                      : 'bg-primary hover:bg-[#17994B] text-primary-foreground'
                    }`}
                >
                  <MessageCircle className="w-3 h-3" />
                  Discord
                </button>

                <button
                  onClick={handleEmergencyContact}
                  className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors ${isDarkMode
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                >
                  <Phone className="w-3 h-3" />
                  Emergency
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-200 ${isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
          }`}>
          {/* Header with Sort Filter */}
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Group Members
            </h3>

            <div className="flex items-center gap-2">
              <Filter className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'completion')}
                className={`px-3 py-1 rounded-lg border text-sm transition-colors ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  }`}
              >
                <option value="name">Sort by Name</option>
                <option value="completion">Sort by Progress</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Loading community...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm">!</span>
                </div>
                <div>
                  <h3 className="text-red-800 font-medium">Error Loading Community</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Students Grid */}
          {!loading && !error && (
            <div className="space-y-4">
              {sortedStudents.map((student) => (
                <div
                  key={student.id}
                  className={`p-4 rounded-lg border transition-colors duration-200 ${isDarkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-gray-50 border-gray-200'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Student Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>

                      <div className="flex-1">
                        <h4 className={`font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {student.name}
                        </h4>
                        <div className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {student.degree} {student.subject} • {student.year}
                        </div>
                        <div className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {student.institute}
                        </div>
                      </div>

                      {/* Contact */}
                      <a
                        href={`mailto:${student.email}`}
                        onClick={() => {
                          posthog?.capture('student_contact_clicked', {
                            user_id: databaseUserId,
                            contact_type: 'email',
                            student_email: student.email,
                            student_name: student.name,
                            clicked_at: new Date().toISOString()
                          });
                        }}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode
                            ? 'hover:bg-gray-600 text-gray-400'
                            : 'hover:bg-gray-200 text-gray-600'
                          }`}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Progress & Contact */}
                    <div className="flex items-center gap-4">
                      {/* Progress */}
                      <div className="text-center">
                        <div className={`text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Week {student.completedWeeks}/6
                        </div>
                        <div className={`text-xs transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {student.progressPercentage}% Complete
                        </div>
                        <div className="progress-track mt-1 h-2 w-20 rounded-full">
                          <div
                            className="progress-fill h-2 rounded-full transition-all duration-300"
                            style={{ width: `${student.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};