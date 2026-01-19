import React, { useState, useEffect } from 'react';
import { AdminHeader } from './AdminHeader';
import { useAuth } from '../../lib/useAuth';
import { Users, LayoutDashboard, Settings, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
        { icon: Users, label: 'User Management', path: '/admin/users' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    const SidebarContent = () => (
        <div className="p-4 space-y-1">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                        {item.label}
                    </Link>
                );
            })}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <AdminHeader
                userName={user?.user_metadata?.first_name || 'Admin'}
                pageTitle="Admin Dashboard"
                onMenuClick={() => setIsMobileMenuOpen(true)}
            />

            <div className="flex h-[calc(100vh-4rem)]">
                {/* Desktop Sidebar */}
                <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden lg:block overflow-y-auto">
                    <SidebarContent />
                </aside>

                {/* Mobile Sidebar Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Drawer */}
                        <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 animate-in slide-in-from-left duration-200">
                            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                                <span className="font-semibold text-gray-800 dark:text-white">Menu</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <SidebarContent />
                        </aside>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};
