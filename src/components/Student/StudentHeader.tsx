import React from 'react';
import { Moon, Sun, Bell } from 'lucide-react';
import { ProfileDropdown } from '../Profile/ProfileDropdown';
import { NotificationDropdown } from '../Notification/NotificationDropdown';
import { useTheme } from '../../lib/ThemeContext';
import { SheSTEMLogo } from '../Logo/SheSTEMLogo';

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
    <div className={`border-b min-h-16 transition-colors duration-200 sticky top-0 z-50 backdrop-blur-md ${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
            <SheSTEMLogo className="flex-shrink-0 scale-90 sm:scale-100 origin-left" />
            {pageTitle && (
              <div className="flex items-center gap-3 min-w-0">
                <div className={`h-6 w-px hidden sm:block ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <span className={`text-base sm:text-xl font-semibold transition-colors duration-200 truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {pageTitle}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="hidden xs:flex flex-col items-end mr-1">
              <span className={`text-[10px] sm:text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hello,</span>
              <span className={`text-xs sm:text-sm font-semibold truncate max-w-[80px] sm:max-w-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userName}</span>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-mobile-notices'))}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-200 ${isDarkMode
                  ? 'bg-gray-700 text-blue-400 hover:bg-gray-600'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="hidden md:block">
              <NotificationDropdown />
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors duration-200 ${isDarkMode
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
    </div>
  );
};
