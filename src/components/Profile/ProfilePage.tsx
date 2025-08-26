import React, { useState } from 'react';
import { ArrowLeft, Moon, Sun, Edit2, Save, X, Camera } from 'lucide-react';

interface ProfilePageProps {
  onBack: () => void;
  userRole: 'student' | 'mentor';
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ 
  onBack, 
  userRole, 
  isDarkMode = false, 
  toggleDarkMode 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(
    userRole === 'student' 
      ? {
          name: 'Amira K.',
          degree: 'BSc Computer Science',
          year: '3rd Year',
          institute: 'Dhaka University',
          email: 'amira.k@example.com',
          profilePicture: ''
        }
      : {
          name: 'Uttam Deb',
          role: 'Senior BI Executive',
          organization: '10 Minute School',
          email: 'uttam.deb@10minuteschool.com',
          profilePicture: ''
        }
  );

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('Profile updated:', profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <div className={`border-b transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
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
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}
              <div className="flex items-center gap-2">
                <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {userRole === 'student' ? 'Amira K.' : 'Uttam Deb'}
                </span>
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className={`border-b p-4 transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <h1 className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Profile</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className={`rounded-xl p-8 shadow-sm border transition-colors duration-200 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  {profileData.profilePicture ? (
                    <img src={profileData.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-gray-600">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div>
                <h2 className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {profileData.name}
                </h2>
                <p className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {userRole === 'student' 
                    ? `${profileData.degree} • ${profileData.year}`
                    : `${profileData.role} • ${profileData.organization}`
                  }
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              ) : (
                <p className={`py-2 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {profileData.name}
                </p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              ) : (
                <p className={`py-2 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {profileData.email}
                </p>
              )}
            </div>

            {userRole === 'student' ? (
              <>
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Degree
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.degree}
                      onChange={(e) => handleInputChange('degree', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  ) : (
                    <p className={`py-2 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {profileData.degree}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Year of Study
                  </label>
                  {isEditing ? (
                    <select
                      value={profileData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="5th Year">5th Year</option>
                    </select>
                  ) : (
                    <p className={`py-2 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {profileData.year}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Academic Institute
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.institute}
                      onChange={(e) => handleInputChange('institute', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  ) : (
                    <p className={`py-2 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {profileData.institute}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Role
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  ) : (
                    <p className={`py-2 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {profileData.role}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Organization
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  ) : (
                    <p className={`py-2 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {profileData.organization}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};