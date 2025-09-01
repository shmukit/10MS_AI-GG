import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { ProfileDropdown } from '../Profile/ProfileDropdown';
import { useTheme } from '../../lib/ThemeContext';

interface StudentHeaderProps {
  userName?: string;
  userRole?: string;
  pageTitle?: string;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({ 
  userName = 'Student',
  userRole = 'student',
  pageTitle
}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  return (
    <div className={`border-b min-h-16 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">10MS</span>
            </div>
            <h1 className={`text-lg sm:text-xl font-bold transition-colors duration-200 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              10MS SheSTEM
            </h1>
            {pageTitle && (
              <span className={`hidden sm:inline text-lg text-gray-500 transition-colors duration-200 truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                • {pageTitle}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
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
        
        {/* Show page title on mobile as a second row */}
        {pageTitle && (
          <div className="sm:hidden mt-2 pt-2 border-t border-gray-200/50">
            <span className={`text-sm text-gray-500 transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {pageTitle}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
