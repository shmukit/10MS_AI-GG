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
  const { toggleDarkMode, isDarkMode } = useTheme();

  return (
    <div className="border-b border-border h-16 sticky top-0 z-50 bg-background">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
            <SheSTEMLogo className="flex-shrink-0" />
            {pageTitle && (
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-6 w-px hidden sm:block bg-border" />
                <span className="text-base sm:text-xl font-semibold text-muted-foreground truncate">
                  {pageTitle}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0 min-w-0">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg transition-colors duration-200 bg-muted text-muted-foreground hover:text-foreground hover:bg-accent border border-border shrink-0"
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
