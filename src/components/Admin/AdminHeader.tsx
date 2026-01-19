import React from 'react';
import { useAuth } from '../../lib/useAuth';
import { LogOut, User, Bell } from 'lucide-react';
import { SheSTEMLogo } from '../Logo/SheSTEMLogo';

interface AdminHeaderProps {
    userName: string;
    pageTitle: string;
    onMenuClick?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ userName, pageTitle, onMenuClick }) => {
    const { signOut } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = React.useState(false);

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {onMenuClick && (
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <div className="scale-75 sm:scale-90 origin-left">
                            <SheSTEMLogo />
                        </div>
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            Admin
                        </span>
                    </div>
                    <div className="hidden md:block h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
                    <h1 className="hidden md:block text-xl font-semibold text-gray-800 dark:text-white">
                        {pageTitle}
                    </h1>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-2 sm:gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 pl-2 sm:pl-3 pr-2 sm:pr-4 py-1.5 rounded-full transition-colors border border-gray-200 dark:border-gray-600"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden sm:flex flex-col items-start">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-none mb-1">
                                    {userName}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 leading-none">
                                    Administrator
                                </span>
                            </div>
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                    onClick={() => {/* TODO: Profile settings */ }}
                                >
                                    <User className="w-4 h-4" />
                                    Profile Settings
                                </button>
                                <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
                                <button
                                    onClick={() => signOut()}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
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
