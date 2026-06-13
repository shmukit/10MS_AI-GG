import React, { useState, useEffect } from 'react';
import { AdminHeader } from './AdminHeader';
import { useAuth } from '../../lib/useAuth';
import { Users, LayoutDashboard, Settings, X, Shield } from 'lucide-react';
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
        { icon: Shield, label: 'Capabilities', path: '/admin/capabilities' },
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
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                        {item.label}
                    </Link>
                );
            })}
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <AdminHeader
                userName={user?.user_metadata?.first_name || 'Admin'}
                pageTitle="Admin Dashboard"
                onMenuClick={() => setIsMobileMenuOpen(true)}
            />

            <div className="flex h-[calc(100vh-4rem)]">
                {/* Desktop Sidebar */}
                <aside className="w-64 bg-card border-r border-border hidden lg:block overflow-y-auto">
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
                        <aside className="absolute left-0 top-0 bottom-0 w-64 bg-card shadow-xl border-r border-border animate-in slide-in-from-left duration-200">
                            <div className="flex items-center justify-between p-4 border-b border-border">
                                <span className="font-semibold text-foreground">Menu</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-1 text-muted-foreground hover:text-foreground"
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
