import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Users, AlertCircle, Mail, Check } from 'lucide-react';
import { useAuth } from '../../lib/useAuth';
import { DatabaseService, Batch, User } from '../../services/database';
import { StudentHeader } from './StudentHeader';
import { useTheme } from '../../lib/ThemeContext';
import { supabase } from '../../lib/supabase';
import { RoadmapDropdown } from './dashboard/RoadmapDropdown';

export const StudentCommunity: React.FC = () => {
  const navigate = useNavigate();
  const { roadmapSlug } = useParams();
  const [searchParams] = useSearchParams();
  const batchIdParam = searchParams.get('batch_id');
  const { user, databaseUserId } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [mentors, setMentors] = useState<User[]>([]);
  const [students, setStudents] = useState<(User & { profile?: any; progress?: any })[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [enrolledBatches, setEnrolledBatches] = useState<any[]>([]);
  const [showRoadmapDropdown, setShowRoadmapDropdown] = useState(false);
  const [currentRoadmap, setCurrentRoadmap] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'name' | 'progress'>('name');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Log the roadmap slug for debugging
  console.log('🔍 Community page - Roadmap slug from URL:', roadmapSlug);

  const getUserDisplayName = () => {
    // Use userData if available, otherwise fall back to useAuth user
    return userData?.userData?.first_name ||
      userData?.profile?.first_name ||
      user?.user_metadata?.first_name ||
      user?.user_metadata?.full_name ||
      user?.email?.split('@')[0] ||
      'Student';
  };

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

        console.log('Fetching community data for user:', databaseUserId);

        // First, get the roadmap by slug if provided
        let roadmapData = null;
        if (roadmapSlug) {
          console.log('🔍 Looking for roadmap with slug:', roadmapSlug);
          // Correct usage from imported DatabaseService class
          roadmapData = await DatabaseService.getRoadmapBySlug(roadmapSlug);
          console.log('📊 Roadmap data from slug:', roadmapData);
          setCurrentRoadmap(roadmapData);

          // Also fetch all enrolled batches to populate the dropdown
          try {
            const userEnrolled = await DatabaseService.getEnrolledBatches(databaseUserId || user.id);
            setEnrolledBatches(userEnrolled);
          } catch (e) {
            console.error('Failed to fetch enrolled batches:', e);
          }

          if (!roadmapData) {
            setError(`Roadmap "${roadmapSlug}" not found. Please check the URL or contact support.`);
            setLoading(false);
            return;
          }
        }

        // Get the batch associated with this roadmap
        let batchData = null;

        // 1. If we have a specific batch_id in the URL, try that first
        if (batchIdParam) {
          console.log('🎯 using specific batch_id from URL:', batchIdParam);
          const { data: specificBatch, error: specificBatchError } = await supabase
            .from('batches')
            .select('*')
            .eq('id', batchIdParam)
            .single();

          if (specificBatch) {
            console.log('✅ Found specific batch from URL:', (specificBatch as any).name);
            batchData = specificBatch;
          } else {
            console.warn('❌ Specific batch not found:', specificBatchError);
          }
        }

        // 2. If no specific batch found yet (or no param), try to find assignment via roadmap
        if (!batchData && roadmapData) {
          console.log('🔍 Looking for assigned batch for roadmap:', roadmapData.title);
          // Use the secure method that checks for explicit assignment
          // We use databaseUserId (the public profile ID) or fallback to user.id if not ready yet
          const userIdToCheck = databaseUserId || user.id;
          const assignedBatch = await DatabaseService.getStudentBatchForRoadmap(userIdToCheck, roadmapData.id);

          if (assignedBatch) {
            console.log('✅ Found user assignment for batch:', assignedBatch.name);
            batchData = assignedBatch;
          } else {
            console.log('❌ No specific batch assignment found for roadmap:', roadmapData.title);
            // Fallback attempt: if no assignment, check if there's exactly one active batch for this roadmap
            // This maintains backward compatibility for cases where implicit assignment was relied upon
            // BUT we only do this if single() won't crash - actually we can try maybeSingle()

            console.log('⚠️ Attempting fallback to find any active batch...');
            const { data: fallbackBatch, error: fallbackError } = await supabase
              .from('batches')
              .select('*')
              .eq('roadmap_id', roadmapData.id)
              .eq('status', 'active')
              .order('start_date', { ascending: false })
              .limit(1);

            if (fallbackBatch && fallbackBatch.length > 0) {
              console.log('⚠️ Found fallback batch (implicit assignment):', (fallbackBatch[0] as any).name);
              batchData = fallbackBatch[0];
            } else {
              console.error('❌ Fallback failed:', fallbackError);
              setError(`No active batch assignment found for the "${roadmapData.title}" roadmap. Please contact your administrator.`);
              setLoading(false);
              return;
            }
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
        if (batchData) {
          const studentsData = await DatabaseService.getStudentsByBatch(batchData.id, databaseUserId || undefined);
          console.log('📊 Students data fetched:', studentsData);

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

          setMentors(mentorsData);
        }

        // Fetch real user profile for consistent display name
        const userProfile = await DatabaseService.getStudentProfile(databaseUserId || user.id);
        const userInfo = await DatabaseService.getUserById(databaseUserId || user.id);

        setUserData({
          userData: userInfo,
          profile: userProfile
        });

      } catch (err) {
        console.error('Error fetching community data:', err);
        setError('Failed to load community data');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [user?.id, roadmapSlug, batchIdParam]);

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
        <StudentHeader
          userName={getUserDisplayName()}
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
          userName={getUserDisplayName()}
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
                  {error.includes("No active batch") ? error : "You haven't been assigned to a batch yet. Please contact your administrator."}
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
    if (sortBy === 'name') {
      return (a.first_name || '').localeCompare(b.first_name || '');
    } else {
      // Sort by progress percentage (highest first)
      const aProgress = a.progress?.progress_percentage || 0;
      const bProgress = b.progress?.progress_percentage || 0;
      return bProgress - aProgress;
    }
  });


  const handleBatchChange = (batchId: string) => {
    // Find the batch
    const selectedBatch = enrolledBatches.find(b => b.id === batchId);
    if (selectedBatch && selectedBatch.roadmap) {
      setShowRoadmapDropdown(false);
      // Navigate to the community page for this roadmap
      const slug = selectedBatch.roadmap.slug || DatabaseService.generateRoadmapSlug(selectedBatch.roadmap.title);
      console.log('🔄 Switching to batch roadmap:', selectedBatch.roadmap.title, 'Slug:', slug, 'BatchId:', batchId);
      navigate(`/student/community/${slug}?batch_id=${batchId}`);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <StudentHeader
        userName={getUserDisplayName()}
        userRole="student"
        pageTitle="Community"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-32 md:pb-8">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors text-xs sm:text-base"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Duplicate title removed */}

          {/* Roadmap Dropdown */}
          {currentRoadmap && (
            <RoadmapDropdown
              isDarkMode={isDarkMode}
              enrolledBatches={enrolledBatches}
              currentBatch={batch}
              showDropdown={showRoadmapDropdown}
              setShowDropdown={setShowRoadmapDropdown}
              handleBatchChange={handleBatchChange}
              selectedBatchId={batch?.id || ''}
            />
          )}
        </div>

        {/* Batch Information */}
        <div className={`rounded-xl p-4 md:p-6 shadow-sm mb-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            <h2 className={`text-lg md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {batch?.name || 'Loading...'}
            </h2>
          </div>

          {/* Top section with students count and mentor info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="grid grid-cols-1 sm:flex sm:items-center gap-3 md:gap-6">
              <div className="flex items-center gap-2">
                <Users className={`w-4 h-4 md:w-5 md:h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Students: {students.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl">👨‍🎓</span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Mentor: {mentors.length > 0 ? `${mentors[0]?.first_name}` : 'Uttam Deb'}
                </span>
              </div>
            </div>

            {/* Communication CTAs */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              {batch?.whatsapp_link && (
                <a
                  href={batch.whatsapp_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-xs md:text-sm"
                >
                  <span>📱</span>
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              )}
              {batch?.discord_link && (
                <a
                  href={batch.discord_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-purple-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-xs md:text-sm"
                >
                  <span>💬</span>
                  <span className="hidden sm:inline">Discord</span>
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
        <div className={`rounded-lg p-6 shadow-sm mb-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Group Members</h3>
            <div className="flex items-center gap-3">
              <button className={`p-2 hover:text-gray-800 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'progress')}
                className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:text-gray-800'
                  }`}
              >
                <option value="name">Sort by Name</option>
                <option value="progress">Sort by Progress</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {/* Real Group Members */}
            {sortedStudents.length > 0 ? (
              sortedStudents.map((member, memberIndex) => (
                <div key={member.id} className={`rounded-xl p-3 md:p-4 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base">
                        {member.first_name?.[0] || 'S'}{member.last_name?.[0] || ''}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="min-w-0">
                          <h4 className={`font-semibold text-sm md:text-base truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {member.first_name} {member.last_name}
                          </h4>
                          {/* Display profile information if available */}
                          {member.profile && (
                            <div className={`text-[10px] md:text-xs space-y-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <p className="truncate">{member.profile.degree} • {member.profile.year} Year</p>
                              <p className="truncate">{member.profile.institute}</p>
                            </div>
                          )}
                        </div>
                        {/* Email copy button */}
                        <button
                          onClick={() => copyEmailToClipboard(member.email)}
                          className={`p-1.5 md:p-2 rounded-lg transition-colors flex-shrink-0 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-600' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}
                          title="Copy email to clipboard"
                        >
                          <Mail className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 sm:gap-0 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200 dark:border-gray-600">
                      {member.progress ? (
                        <>
                          <p className={`text-[10px] md:text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Week {member.progress.current_week}/6
                          </p>
                          <div className="flex flex-col sm:items-end">
                            <p className={`text-[10px] md:text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {Math.round(member.progress.progress_percentage || 0)}% Complete
                            </p>
                            <div className={`w-16 md:w-20 rounded-full h-1.5 mt-1 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{ width: `${Math.round(member.progress.progress_percentage || 0)}%` }}
                              ></div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className={`text-[10px] md:text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
        <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${toast.type === 'success'
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
