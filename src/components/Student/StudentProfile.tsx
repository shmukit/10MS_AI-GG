import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3, Mail, MapPin, Calendar, BookOpen, GraduationCap, Save, X } from 'lucide-react';
import { useAuth } from '../../lib/useAuth';
import { DatabaseService } from '../../services/database';
import { supabase } from '../../lib/supabase';
import { StudentHeader } from './StudentHeader';
import { CertificateCard } from './Certificates/CertificateCard';
import { useTheme } from '../../lib/ThemeContext';

// Add skeleton loading component at the top
const ProfileSkeleton = () => (
  <div className="animate-pulse">
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const StudentProfile: React.FC = () => {
  const navigate = useNavigate();
  const { profileSlug } = useParams();
  const { user, databaseUserId } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [profileData, setProfileData] = useState<{
    profile: any;
    userData: any;
    [key: string]: any;
  } | null>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editForm, setEditForm] = useState<{
    first_name: string;
    last_name: string;
    degree: string;
    subject: string;
    year: string;
    institute: string;
  }>({
    first_name: '',
    last_name: '',
    degree: '',
    subject: '',
    year: '',
    institute: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id || !databaseUserId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 Profile: Auth user object:', user);
        console.log('🆔 Profile: User ID:', user?.id);
        console.log('📧 Profile: User email:', user?.email);
        console.log('📋 Profile: User metadata:', user?.user_metadata);
        
        const data = await DatabaseService.getDashboardData(databaseUserId);
        console.log('📊 Profile: Dashboard data received:', data);
        setProfileData(data);
        // Initialize edit form with current data
        setEditForm({
          first_name: data?.userData?.first_name || '',
          last_name: data?.userData?.last_name || '',
          degree: data?.profile?.degree || '',
          subject: data?.profile?.subject || '',
          year: data?.profile?.year || '',
          institute: data?.profile?.institute || ''
        });
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }
      
      // Fetch Certificates safely in its own block
      try {
        const { data: certData, error: certError } = await supabase
          .from('student_certificates')
          .select('*')
          .eq('student_id', databaseUserId)
          .order('issued_at', { ascending: false });
        
        if (!certError && certData) {
          setCertificates(certData);
        }
      } catch (err) {
        console.error('Error fetching certificates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.id, user?.email, databaseUserId]);

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      console.log('🔄 Starting to save profile updates...');
      console.log('👤 User ID being used:', databaseUserId);
      console.log('📧 User email:', user.email);

      // Update user data
      const userUpdates = {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        email: user?.email || '' // Email is read-only, so we don't update it here
      };

      // Update profile data
      const profileUpdates = {
        degree: editForm.degree,
        subject: editForm.subject,
        year: editForm.year,
        institute: editForm.institute,
        enrollment_date: profileData?.profile?.enrollment_date || '' // Enrollment date is read-only, so we don't update it here
      };

      console.log('📝 Profile updates to save:', { userUpdates, profileUpdates });

      // Update user data
      console.log('🔄 Updating user data...');
      if (!databaseUserId) return;
      const userUpdateSuccess = await DatabaseService.updateUser(databaseUserId, userUpdates);
      if (!userUpdateSuccess) {
        console.error('❌ Failed to update user data');
        setSaveError('Failed to update user information. Please try again.');
        return;
      }
      console.log('✅ User data updated successfully');

      // Update profile data
      console.log('🔄 Updating student profile...');
      if (!databaseUserId) return;
      const profileUpdateSuccess = await DatabaseService.updateStudentProfile(databaseUserId, profileUpdates);
      if (!profileUpdateSuccess) {
        console.error('❌ Failed to update student profile');
        setSaveError('Failed to update profile information. Please try again.');
        return;
      }
      console.log('✅ Student profile updated successfully');

      // Refresh profile data from server to ensure we have the latest data
      console.log('🔄 Refreshing profile data from server...');
      if (!databaseUserId) return;
      const refreshedData = await DatabaseService.getDashboardData(databaseUserId);
      setProfileData(refreshedData);

      // Update edit form with refreshed data
      setEditForm({
        first_name: refreshedData?.userData?.first_name || '',
        last_name: refreshedData?.userData?.last_name || '',
        degree: refreshedData?.profile?.degree || '',
        subject: refreshedData?.profile?.subject || '',
        year: refreshedData?.profile?.year || '',
        institute: refreshedData?.profile?.institute || ''
      });

      setIsEditing(false);
      setSaveSuccess(true);
      console.log('✅ Profile updated successfully via API and data refreshed');

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      setSaveError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original data
    setEditForm({
      first_name: profileData?.userData?.first_name || '',
      last_name: profileData?.userData?.last_name || '',
      degree: profileData?.profile?.degree || '',
      subject: profileData?.profile?.subject || '',
      year: profileData?.profile?.year || '',
      institute: profileData?.profile?.institute || ''
    });
    setIsEditing(false);
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <StudentHeader
        userName={
          profileData?.userData?.first_name ||
          profileData?.profile?.first_name ||
          user?.user_metadata?.first_name ||
          user?.user_metadata?.full_name ||
          user?.email?.split('@')[0] ||
          'Student'
        }
        userRole="student"
        pageTitle="Profile"
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/student/dashboard')}
            className={`flex items-center gap-2 transition-colors duration-200 text-[var(--primary-accent)] hover:opacity-80`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          {/* Duplicate title removed */}
        </div>

        <div className={`rounded-lg p-8 shadow-sm transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
          {/* Success/Error Messages */}
          {saveSuccess && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              ✅ Profile updated successfully!
            </div>
          )}
          {saveError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              ❌ {saveError}
            </div>
          )}

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8">
            <div className="flex items-center gap-4 md:gap-6">
              <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold transition-colors duration-200 flex-shrink-0 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}>
                {
                  profileData?.userData?.first_name?.[0] ||
                  profileData?.profile?.first_name?.[0] ||
                  user?.user_metadata?.first_name?.[0] ||
                  user?.user_metadata?.full_name?.[0] ||
                  user?.email?.[0] ||
                  'S'
                }
              </div>
              <div className="min-w-0">
                <h2 className={`text-xl md:text-3xl font-bold mb-1 md:mb-2 transition-colors duration-200 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {
                    profileData?.userData?.first_name ||
                    profileData?.profile?.first_name ||
                    user?.user_metadata?.first_name ||
                    user?.user_metadata?.full_name ||
                    user?.email?.split('@')[0] ||
                    'Student'
                  }
                </h2>
                <p className={`text-sm md:text-lg transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {profileData?.profile?.degree || 'BSc'} {profileData?.profile?.subject || 'CS'} • {profileData?.profile?.year || '3rd'} Year
                </p>
                <p className={`text-xs md:text-base transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>{profileData?.profile?.institute || 'University'}</p>
              </div>
            </div>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-green-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      Save
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-gray-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setSaveError(null);
                  setSaveSuccess(false);
                  setIsEditing(true);
                }}
                className="flex items-center gap-2 bg-[var(--primary-accent)] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <BookOpen className={`w-5 h-5 transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <div className="flex-1">
                  <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Full Name</p>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editForm.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)] transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        value={editForm.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)] transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        placeholder="Last Name"
                      />
                    </div>
                  ) : (
                    <p className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {
                        profileData?.userData?.first_name ||
                        user?.user_metadata?.first_name ||
                        user?.user_metadata?.full_name?.split(' ')[0] ||
                        user?.email?.split('@')[0] ||
                        'Student'
                      } {
                        profileData?.userData?.last_name ||
                        user?.user_metadata?.last_name ||
                        user?.user_metadata?.full_name?.split(' ').slice(1).join(' ') ||
                        ''
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Degree</p>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editForm.degree}
                        onChange={(e) => handleInputChange('degree', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]"
                        placeholder="Degree"
                      />
                      <input
                        type="text"
                        value={editForm.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]"
                        placeholder="Subject"
                      />
                    </div>
                  ) : (
                    <p className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {profileData?.profile?.degree || 'BSc'} {profileData?.profile?.subject || 'Computer Science'}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Academic Institute</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.institute}
                      onChange={(e) => handleInputChange('institute', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)] transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      placeholder="Institute"
                    />
                  ) : (
                    <p className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{profileData?.profile?.institute || 'University'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Email Address</p>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type="email"
                        value={user?.email || ''}
                        className={`w-full px-3 py-2 border rounded-lg cursor-not-allowed transition-colors duration-200 ${isDarkMode ? 'bg-gray-600 border-gray-500 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-600'
                          }`}
                        placeholder="Email"
                        disabled
                      />
                      <div className={`absolute right-2 top-2 text-xs px-2 py-1 rounded transition-colors duration-200 ${isDarkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-500 bg-gray-100'
                        }`}>
                        Read-only
                      </div>
                    </div>
                  ) : (
                    <p className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.email || 'email@example.com'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Year of Study</p>
                  {isEditing ? (
                    <select
                      value={editForm.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)] transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    >
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                      <option value="4th">4th Year</option>
                      <option value="5th">5th Year</option>
                    </select>
                  ) : (
                    <p className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{profileData?.profile?.year || '3rd'} Year</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Enrollment Date</p>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type="date"
                        value={profileData?.profile?.enrollment_date ? new Date(profileData.profile.enrollment_date).toISOString().split('T')[0] : ''}
                        className={`w-full px-3 py-2 border rounded-lg cursor-not-allowed transition-colors duration-200 ${isDarkMode ? 'bg-gray-600 border-gray-500 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-600'
                          }`}
                        disabled
                      />
                      <div className={`absolute right-2 top-2 text-xs px-2 py-1 rounded transition-colors duration-200 ${isDarkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-500 bg-gray-100'
                        }`}>
                        Read-only
                      </div>
                    </div>
                  ) : (
                    <p className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {profileData?.profile?.enrollment_date ?
                        new Date(profileData.profile.enrollment_date).toLocaleDateString() :
                        'Not specified'
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        {certificates.length > 0 && (
          <div className={`mt-8 rounded-lg p-8 shadow-sm transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-xl font-bold mb-6 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              My Certificates & Achievements
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {certificates.map(cert => (
                <CertificateCard key={cert.id} certificate={cert} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
