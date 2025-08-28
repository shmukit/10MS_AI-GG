import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { ProfileDropdown } from '../Profile/ProfileDropdown';
import { useTheme } from '../../lib/ThemeContext';

interface MentorHeaderProps {
  userName?: string;
  userRole?: string;
  pageTitle?: string;
}

export const MentorHeader: React.FC<MentorHeaderProps> = ({ 
  userName = 'Mentor',
  userRole = 'mentor',
  pageTitle
}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  return (
    <div className={`border-b h-16 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">10MS</span>
            </div>
            <h1 className={`text-xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>10MS SheSTEM</h1>
            {pageTitle && (
              <span className={`text-lg text-gray-500 transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                • {pageTitle}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
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
            <ProfileDropdown 
              userName={userName}
              userRole={userRole}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
