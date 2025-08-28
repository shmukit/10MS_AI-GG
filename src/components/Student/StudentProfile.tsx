import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3, Mail, MapPin, Calendar, BookOpen, GraduationCap, Save, X } from 'lucide-react';
import { useAuth } from '../../lib/useAuth';
import { DatabaseService } from '../../services/database';
import { StudentHeader } from './StudentHeader';
import { useTheme } from '../../lib/ThemeContext';

export const StudentProfile: React.FC = () => {
  const navigate = useNavigate();
  const { profileSlug } = useParams();
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [profileData, setProfileData] = useState<{
    profile: any;
    userData: any;
    [key: string]: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const data = await DatabaseService.getDashboardData(user.id);
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
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.id, user?.email]);

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    
    try {
      console.log('🔄 Starting to save profile updates...');
      
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
      
      // Make API calls to update both user and profile
      console.log('📝 Profile updates to save:', { userUpdates, profileUpdates });
      
      // Update user data
      const userUpdateSuccess = await DatabaseService.updateUser(user.id, userUpdates);
      if (!userUpdateSuccess) {
        console.error('❌ Failed to update user data');
        return;
      }
      
      // Update profile data
      const profileUpdateSuccess = await DatabaseService.updateStudentProfile(user.id, profileUpdates);
      if (!profileUpdateSuccess) {
        console.error('❌ Failed to update student profile');
        return;
      }
      
      // Update local state after successful API calls
      setProfileData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          userData: { ...prev.userData, ...userUpdates },
          profile: { ...prev.profile, ...profileUpdates }
        };
      });

      setIsEditing(false);
      console.log('✅ Profile updated successfully via API');
    } catch (error) {
      console.error('❌ Error saving profile:', error);
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
    return (
      <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} p-6`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className={`text-lg transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <StudentHeader 
        userName={profileData?.userData?.first_name || profileData?.profile?.first_name || 'Student'}
        userRole="student"
        pageTitle="Profile"
      />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/student/dashboard')}
            className={`flex items-center gap-2 transition-colors duration-200 ${
              isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <h1 className={`text-3xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Profile</h1>
        </div>
        
        <div className={`rounded-lg p-8 shadow-sm transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Profile Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-colors duration-200 ${
                isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}>
                {profileData?.userData?.first_name?.[0] || profileData?.profile?.first_name?.[0] || 'S'}
              </div>
              <div>
                <h2 className={`text-3xl font-bold mb-2 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {profileData?.userData?.first_name || profileData?.profile?.first_name || 'Student'}
                </h2>
                <p className={`text-lg transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {profileData?.profile?.degree || 'BSc'} {profileData?.profile?.subject || 'Computer Science'} • {profileData?.profile?.year || '3rd'} Year
                </p>
                <p className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{profileData?.profile?.institute || 'University'}</p>
              </div>
            </div>
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  console.log('🖊️ Edit Profile button clicked!');
                  console.log('📊 Current profile data:', profileData);
                  console.log('📝 Current edit form:', editForm);
                  setIsEditing(true);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                        className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        value={editForm.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Last Name"
                      />
                    </div>
                  ) : (
                    <p className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {profileData?.userData?.first_name || 'Student'} {profileData?.userData?.last_name || ''}
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
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Degree"
                      />
                      <input
                        type="text"
                        value={editForm.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
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
                        className={`w-full px-3 py-2 border rounded-lg cursor-not-allowed transition-colors duration-200 ${
                          isDarkMode ? 'bg-gray-600 border-gray-500 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-600'
                        }`}
                        placeholder="Email"
                        disabled
                      />
                      <div className={`absolute right-2 top-2 text-xs px-2 py-1 rounded transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-500 bg-gray-100'
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
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
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
                        className={`w-full px-3 py-2 border rounded-lg cursor-not-allowed transition-colors duration-200 ${
                          isDarkMode ? 'bg-gray-600 border-gray-500 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-600'
                        }`}
                        disabled
                      />
                      <div className={`absolute right-2 top-2 text-xs px-2 py-1 rounded transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-500 bg-gray-100'
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
      </div>
    </div>
  );
};
