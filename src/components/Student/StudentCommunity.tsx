import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Users, MessageCircle, ExternalLink, AlertCircle, Calendar, MapPin, Mail, Check } from 'lucide-react';
import { useAuth } from '../../lib/useAuth';
import { DatabaseService, Batch, User } from '../../services/database';
import { StudentHeader } from './StudentHeader';
import { useTheme } from '../../lib/ThemeContext';
import { supabase } from '../../lib/supabase';

export const StudentCommunity: React.FC = () => {
  const navigate = useNavigate();
  const { roadmapSlug } = useParams();
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [mentors, setMentors] = useState<User[]>([]);
  const [students, setStudents] = useState<(User & { profile?: any; progress?: any })[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'name' | 'progress'>('name');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Log the roadmap slug for debugging
  console.log('🔍 Community page - Roadmap slug from URL:', roadmapSlug);



  // Email copy functionality
  const copyEmailToClipboard = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setToast({ message: 'Email copied to clipboard!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error('Failed to copy email:', err);
      setToast({ message: 'Failed to copy email', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  useEffect(() => {
    const fetchCommunityData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching community data for user:', user.id);
        
        // First, get the roadmap by slug if provided
        let roadmapData = null;
        if (roadmapSlug) {
          console.log('🔍 Looking for roadmap with slug:', roadmapSlug);
          const { getRoadmapBySlug } = await import('../../services/database');
          roadmapData = await getRoadmapBySlug(roadmapSlug);
          console.log('📊 Roadmap data from slug:', roadmapData);
          
          if (!roadmapData) {
            setError(`Roadmap "${roadmapSlug}" not found. Please check the URL or contact support.`);
            setLoading(false);
            return;
          }
        }
        
        // Get the batch associated with this roadmap
        let batchData = null;
        if (roadmapData) {
          console.log('🔍 Looking for batch associated with roadmap:', roadmapData.id);
          const { data: roadmapBatch, error: batchError } = await supabase
            .from('batches')
            .select('*')
            .eq('roadmap_id', roadmapData.id)
            .eq('status', 'active')
            .single();
            
          if (roadmapBatch) {
            console.log('✅ Found roadmap-specific batch:', roadmapBatch.name);
            batchData = roadmapBatch;
          } else {
            console.log('❌ No batch found for roadmap:', roadmapData.title);
            setError(`No active batch found for the "${roadmapData.title}" roadmap. Please contact your administrator.`);
            setLoading(false);
            return;
          }
        }
        
        if (!batchData) {
          setError(`No batch found for the "${roadmapSlug}" roadmap. Please contact your administrator.`);
          setLoading(false);
          return;
        }
        
        console.log('Batch data found:', batchData);
        setBatch(batchData);
        
        // Get students in this batch
        const studentsData = await DatabaseService.getStudentsByBatch(batchData.id, user.id);
        console.log('📊 Students data fetched:', studentsData);
        console.log('🔍 Batch ID used for student fetch:', batchData.id);
        console.log('🔍 Roadmap ID from batch:', batchData.roadmap_id);
        console.log('🔍 Roadmap title:', roadmapData?.title);
        
        // Debug: Check what's in the students data
        if (studentsData && studentsData.length > 0) {
          console.log('🔍 First student details:', {
            id: studentsData[0].id,
            name: `${studentsData[0].first_name} ${studentsData[0].last_name}`,
            email: studentsData[0].email,
            role: studentsData[0].role
          });
        }
        
        setStudents(studentsData);
        
        // Get mentors for this batch
        const mentorsData = await DatabaseService.getMentors(batchData.id);
        console.log('👥 Mentors data fetched:', mentorsData);
        console.log('🔍 Batch ID used for mentor fetch:', batchData.id);
        
        setMentors(mentorsData);
        
        // Set user data (just basic info, no dashboard fallbacks)
        setUserData({
          userData: { first_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student' },
          profile: { first_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student' }
        });
        
      } catch (err) {
        console.error('Error fetching community data:', err);
        setError('Failed to load community data');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [user?.id, roadmapSlug]);

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
        <StudentHeader 
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
      // Sort by progress percentage (highest first)
      const aProgress = a.progress?.progress_percentage || 0;
      const bProgress = b.progress?.progress_percentage || 0;
      console.log('Progress comparison:', { a: a.first_name, aProgress, b: b.first_name, bProgress });
      return bProgress - aProgress;
    }
  });

  console.log('Original students:', students);
  console.log('Sorted students:', sortedStudents);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
              <StudentHeader 
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
              {batch?.name || 'Loading...'}
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
              {batch?.whatsapp_link && (
                <a 
                  href={batch.whatsapp_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span>📱</span>
                  WhatsApp
                </a>
              )}
              {batch?.discord_link && (
                <a 
                  href={batch.discord_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <span>💬</span>
                  Discord
                </a>
              )}
              {batch?.emergency_contact && (
                <a 
                  href={`tel:${batch.emergency_contact}`}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <span>🚨</span>
                  Emergency
                </a>
              )}
              {!batch?.whatsapp_link && !batch?.discord_link && !batch?.emergency_contact && (
                <div className="text-sm text-gray-500 italic px-4 py-2">
                  No community links available yet
                </div>
              )}
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
                          {/* Display profile information if available */}
                          {member.profile && (
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>{member.profile.degree} {member.profile.subject} • {member.profile.year} Year</p>
                              <p>{member.profile.institute}</p>
                            </div>
                          )}
                        </div>
                        {/* Email copy button */}
                        <button 
                          onClick={() => copyEmailToClipboard(member.email)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Copy email to clipboard"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      {member.progress ? (
                        <>
                          <p className="text-xs text-gray-600">
                            Week {member.progress.current_week}/6
                          </p>
                          <p className="text-xs text-gray-600">
                            {Math.round(member.progress.progress_percentage || 0)}% Complete
                          </p>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.round(member.progress.progress_percentage || 0)}%` }}
                            ></div>
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-gray-600">
                          Enrolled
                        </p>
                      )}
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
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};
