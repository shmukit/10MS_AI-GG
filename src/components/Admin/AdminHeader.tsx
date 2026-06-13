import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth';
import { LogOut, Settings, Moon, Sun } from 'lucide-react';
import { SheSTEMLogo } from '../Logo/SheSTEMLogo';
import { useTheme } from '../../lib/ThemeContext';
import { NotificationDropdown } from '../Notification/NotificationDropdown';

interface AdminHeaderProps {
    userName: string;
    pageTitle: string;
    onMenuClick?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ userName, pageTitle, onMenuClick }) => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };

        if (showProfileMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showProfileMenu]);

    const goToSettings = () => {
        setShowProfileMenu(false);
        navigate('/admin/settings');
    };

    return (
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background">
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    {onMenuClick && (
                        <button
                            onClick={onMenuClick}
                            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted lg:hidden"
                            aria-label="Open menu"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <div className="origin-left scale-75 sm:scale-90">
                            <SheSTEMLogo />
                        </div>
                        <span className="hidden rounded border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground sm:inline-block">
                            Admin
                        </span>
                    </div>
                    <div className="mx-2 hidden h-6 w-px bg-border md:block" />
                    <h1 className="hidden text-xl font-semibold text-foreground md:block">{pageTitle}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <NotificationDropdown />

                    <button
                        onClick={toggleDarkMode}
                        className="rounded-lg border border-border bg-muted p-2 text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground"
                        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-2 rounded-full border border-border py-1.5 pl-2 pr-2 transition-colors hover:bg-muted sm:gap-3 sm:pl-3 sm:pr-4"
                            aria-expanded={showProfileMenu}
                            aria-haspopup="menu"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-sm font-bold text-foreground">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden flex-col items-start sm:flex">
                                <span className="mb-1 text-sm font-medium leading-none text-foreground">{userName}</span>
                                <span className="text-xs leading-none text-muted-foreground">Administrator</span>
                            </div>
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card py-1 shadow-modal">
                                <button
                                    type="button"
                                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-foreground hover:bg-muted"
                                    onClick={goToSettings}
                                >
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </button>
                                <div className="my-1 h-px bg-border" />
                                <button
                                    type="button"
                                    onClick={() => signOut()}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
