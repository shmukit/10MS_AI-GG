import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { SheSTEMLogo } from '../Logo/SheSTEMLogo';
import { useTheme } from '../../lib/ThemeContext';
import { NotificationDropdown } from '../Notification/NotificationDropdown';
import { ProfileDropdown } from '../Profile/ProfileDropdown';

interface AdminHeaderProps {
    userName: string;
    pageTitle: string;
    userRole?: string;
    onMenuClick?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
    userName,
    pageTitle,
    userRole = 'admin',
    onMenuClick,
}) => {
    const { isDarkMode, toggleDarkMode } = useTheme();

    return (
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background">
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 min-w-0">
                    {onMenuClick && (
                        <button
                            type="button"
                            onClick={onMenuClick}
                            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted lg:hidden"
                            aria-label="Open menu"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    )}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="origin-left scale-75 sm:scale-90">
                            <SheSTEMLogo />
                        </div>
                        <span className="hidden rounded border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground sm:inline-block">
                            Admin
                        </span>
                    </div>
                    <div className="mx-2 hidden h-6 w-px bg-border md:block" />
                    <h1 className="hidden text-xl font-semibold text-foreground md:block truncate">{pageTitle}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <NotificationDropdown />

                    <button
                        type="button"
                        onClick={toggleDarkMode}
                        className="rounded-lg border border-border bg-muted p-2 text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground"
                        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    {/* Same account menu as student/mentor — role-gated dashboard CTAs */}
                    <ProfileDropdown userName={userName} userRole={userRole} variant="pill" />
                </div>
            </div>
        </header>
    );
};
