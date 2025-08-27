import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3, Mail, MapPin, Calendar, BookOpen, GraduationCap } from 'lucide-react';
import { useAuth } from '../../lib/useAuth';
import { DatabaseService } from '../../services/database';
import { StudentHeader } from './StudentHeader';
import { useTheme } from '../../lib/ThemeContext';

export const StudentProfile: React.FC = () => {
  const navigate = useNavigate();
  const { profileSlug } = useParams();
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const data = await DatabaseService.getDashboardData(user.id);
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <StudentHeader 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        userName={profileData?.userData?.first_name || profileData?.profile?.first_name || 'Student'}
        userRole="student"
        pageTitle="Profile"
      />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        </div>
        
        <div className="bg-white rounded-lg p-8 shadow-sm">
          {/* Profile Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profileData?.userData?.first_name?.[0] || profileData?.profile?.first_name?.[0] || 'S'}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {profileData?.userData?.first_name || profileData?.profile?.first_name || 'Student'}
                </h2>
                <p className="text-lg text-gray-600">
                  {profileData?.profile?.degree || 'BSc'} {profileData?.profile?.subject || 'Computer Science'} • {profileData?.profile?.year || '3rd'} Year
                </p>
                <p className="text-gray-500">{profileData?.profile?.institute || 'University'}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">
                    {profileData?.userData?.first_name || 'Student'} {profileData?.userData?.last_name || ''}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Degree</p>
                  <p className="font-medium text-gray-900">
                    {profileData?.profile?.degree || 'BSc'} {profileData?.profile?.subject || 'Computer Science'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Academic Institute</p>
                  <p className="font-medium text-gray-900">{profileData?.profile?.institute || 'University'}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-900">{profileData?.userData?.email || user?.email || 'email@example.com'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Year of Study</p>
                  <p className="font-medium text-gray-900">{profileData?.profile?.year || '3rd'} Year</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Enrollment Date</p>
                  <p className="font-medium text-gray-900">
                    {profileData?.profile?.enrollment_date ? 
                      new Date(profileData.profile.enrollment_date).toLocaleDateString() : 
                      'Not specified'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
