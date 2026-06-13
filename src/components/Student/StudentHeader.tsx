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
  actions?: React.ReactNode;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  userName = 'Student',
  userRole = 'student',
  pageTitle,
  actions
}) => {
  const { toggleDarkMode, isDarkMode } = useTheme();
  return (
    <div className="border-b border-border min-h-16 sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
            <SheSTEMLogo className="flex-shrink-0 scale-90 sm:scale-100 origin-left" />
            {pageTitle && (
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-6 w-px hidden sm:block bg-border" />
                <span className="text-base sm:text-xl font-semibold text-muted-foreground truncate">
                  {pageTitle}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="hidden xs:flex flex-col items-end mr-1">
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Hello,</span>
              <span className="text-xs sm:text-sm font-semibold truncate max-w-[80px] sm:max-w-none text-foreground">{userName}</span>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-mobile-notices'))}
                className="p-1.5 sm:p-2 rounded-lg transition-colors duration-200 bg-muted text-primary hover:bg-accent border border-border"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="hidden md:flex items-center gap-3">
              {actions}
              <NotificationDropdown />
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg transition-colors duration-200 bg-muted text-muted-foreground hover:text-foreground hover:bg-accent border border-border"
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
