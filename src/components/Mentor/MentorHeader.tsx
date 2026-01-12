import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { ProfileDropdown } from '../Profile/ProfileDropdown';
import { useTheme } from '../../lib/ThemeContext';
import { SheSTEMLogo } from '../Logo/SheSTEMLogo';

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
    <div className={`border-b h-16 transition-colors duration-200 sticky top-0 z-50 backdrop-blur-md ${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
            <SheSTEMLogo className="flex-shrink-0" />
            {pageTitle && (
              <div className="flex items-center gap-3 min-w-0">
                <div className={`h-6 w-px hidden sm:block ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <span className={`text-base sm:text-xl font-semibold transition-colors duration-200 truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {pageTitle}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
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
  );
};
