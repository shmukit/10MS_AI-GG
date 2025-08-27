import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, MessageCircle, ExternalLink, AlertCircle, Calendar, MapPin, Mail } from 'lucide-react';
import { useAuth } from '../../lib/useAuth';
import { DatabaseService, Batch, User } from '../../services/database';
import { StudentHeader } from './StudentHeader';
import { useTheme } from '../../lib/ThemeContext';

export const StudentCommunity: React.FC = () => {
  const navigate = useNavigate();
  const { batchSlug } = useParams();
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [mentors, setMentors] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'name' | 'progress'>('name');

  useEffect(() => {
    const fetchCommunityData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching community data for user:', user.id);
        
        // Fetch user data first
        const dashboardData = await DatabaseService.getDashboardData(user.id);
        setUserData(dashboardData);
        
        const batchData = await DatabaseService.getStudentBatch(user.id);
        if (!batchData) {
          setError('You are not assigned to any batch yet. Please contact your administrator.');
          setLoading(false);
          return;
        }
        
        console.log('Batch data found:', batchData);
        setBatch(batchData);
        
        const mentorsData = await DatabaseService.getMentors(batchData.id);
        setMentors(mentorsData);
        
        // Get students in the same batch
        const studentsData = await DatabaseService.getStudentsByBatch(batchData.id);
        setStudents(studentsData);
        
      } catch (err) {
        console.error('Error fetching community data:', err);
        setError('Failed to load community data');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
        <StudentHeader 
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          userName={userData?.userData?.first_name || userData?.profile?.first_name || 'Student'}
          userRole="student"
          pageTitle="Community"
        />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading community...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
        <StudentHeader 
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          userName={userData?.userData?.first_name || userData?.profile?.first_name || 'Student'}
          userRole="student"
          pageTitle="Community"
        />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <div>
                <h3 className="text-yellow-800 font-medium">No Batch Assignment</h3>
                <p className="text-yellow-600 text-sm">
                  You haven't been assigned to a batch yet. Please contact your administrator.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sort students based on selection
  const sortedStudents = [...students].sort((a, b) => {
    console.log('Sorting students:', { sortBy, a: a.first_name, b: b.first_name });
    if (sortBy === 'name') {
      return (a.first_name || '').localeCompare(b.first_name || '');
    } else {
      // Sort by progress (for now, just by role - mentors first)
      return (a.role === 'mentor' ? 1 : 0) - (b.role === 'mentor' ? 1 : 0);
    }
  });

  console.log('Original students:', students);
  console.log('Sorted students:', sortedStudents);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <StudentHeader 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        userName={userData?.userData?.first_name || userData?.profile?.first_name || 'Student'}
        userRole="student"
        pageTitle="Community"
      />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Community</h1>
        
        {/* Batch Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {batch.name || 'Python Learning Cohort - Demo Batch'}
            </h2>
          </div>
          
          {/* Top section with students count and mentor info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Students: {students.length} members</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">👨‍🎓</span>
                <span className="text-gray-700">
                  Mentor: {mentors.length > 0 ? `${mentors[0]?.first_name} ${mentors[0]?.last_name}, Senior BI Executive` : 'Uttam Deb, Senior BI Executive'}
                </span>
              </div>
            </div>
            
            {/* Communication CTAs at top right */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                <span>📱</span>
                WhatsApp
              </button>
              <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                <span>💬</span>
                Discord
              </button>
              <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                <span>🚨</span>
                Emergency
              </button>
            </div>
          </div>
        </div>

        {/* Group Members */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Group Members</h3>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-600 hover:text-gray-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
              </button>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as 'name' | 'progress')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 border rounded-lg px-3 py-2"
              >
                <option value="name">Sort by Name</option>
                <option value="progress">Sort by Progress</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Real Group Members */}
            {sortedStudents.length > 0 ? (
              sortedStudents.map((member, index) => (
                <div key={member.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.first_name?.[0] || 'S'}{member.last_name?.[0] || ''}
                      </div>
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {member.first_name} {member.last_name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {member.role === 'mentor' ? 'Mentor' : 'Student'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {member.email}
                          </p>
                        </div>
                        {/* Email icon beside the name */}
                        <button className="p-2 text-gray-600 hover:text-gray-800">
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {member.role === 'mentor' ? 'Mentor' : 'Student'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {member.role === 'mentor' ? 'Active' : 'Enrolled'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback to sample data if no real students
              [
                {
                  name: 'Amira K.',
                  initials: 'AK',
                  details: 'BSc Computer Science • 3rd Year',
                  university: 'Dhaka University',
                  progress: 'Week 3/6',
                  completion: 75
                },
                {
                  name: 'Fatima Rahman',
                  initials: 'FR',
                  details: 'BSc Data Science • 4th Year',
                  university: 'NSU',
                  progress: 'Week 4/6',
                  completion: 85
                },
                {
                  name: 'Nadia Islam',
                  initials: 'NI',
                  details: 'BSc Computer Science • 1st Year',
                  university: 'IUT',
                  progress: 'Week 1/6',
                  completion: 40
                },
                {
                  name: 'Rashida Khan',
                  initials: 'RK',
                  details: 'BSc Information Technology • 3rd Year',
                  university: 'Dhaka University',
                  progress: 'Week 3/6',
                  completion: 70
                },
                {
                  name: 'Sarah Ahmed',
                  initials: 'SA',
                  details: 'BSc Software Engineering • 2nd Year',
                  university: 'BUET',
                  progress: 'Week 2/6',
                  completion: 60
                }
              ].map((member, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.initials}
                      </div>
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.details}</p>
                          <p className="text-xs text-gray-500">{member.university}</p>
                        </div>
                        {/* Email icon beside the name */}
                        <button className="p-2 text-gray-600 hover:text-gray-800">
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{member.progress}</p>
                      <p className="text-xs text-gray-600">{member.completion}% Complete</p>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${member.completion}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
