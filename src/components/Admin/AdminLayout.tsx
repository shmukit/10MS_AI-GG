import React, { useState, useEffect } from 'react';
import { AdminHeader } from './AdminHeader';
import { useAuth } from '../../lib/useAuth';
import { Users, LayoutDashboard, Settings, X, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { cn } from '../../lib/utils';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const SIDEBAR_KEY = 'admin-sidebar-collapsed';

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { user, userRole } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(() => {
        try {
            return localStorage.getItem(SIDEBAR_KEY) === '1';
        } catch {
            return false;
        }
    });

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        try {
            localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0');
        } catch {
            /* ignore */
        }
    }, [collapsed]);

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
        { icon: Users, label: 'User Management', path: '/admin/users' },
        { icon: Shield, label: 'Capabilities', path: '/admin/capabilities' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    const pageTitles: Record<string, string> = {
        '/admin/dashboard': 'Overview',
        '/admin/users': 'User Management',
        '/admin/capabilities': 'Capabilities',
        '/admin/settings': 'Settings',
    };
    const pageTitle = pageTitles[location.pathname] ?? 'Admin';

    const breadcrumbItems = [
        { label: 'Admin', href: '/admin/dashboard' },
        { label: pageTitle },
    ];

    const SidebarContent = ({ compact = false }: { compact?: boolean }) => (
        <div className={cn('p-3 space-y-1', compact && 'px-2')}>
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        title={item.label}
                        className={cn(
                            'flex items-center rounded-lg text-sm font-medium transition-colors',
                            compact ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3',
                            isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-muted'
                        )}
                    >
                        <item.icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
                        {!compact && <span>{item.label}</span>}
                    </Link>
                );
            })}
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <AdminHeader
                userName={user?.user_metadata?.first_name || 'Admin'}
                userRole={userRole || 'admin'}
                pageTitle={pageTitle}
                onMenuClick={() => setIsMobileMenuOpen(true)}
            />

            <div className="flex h-[calc(100vh-4rem)]">
                {/* Desktop Sidebar */}
                <aside
                    className={cn(
                        'bg-card border-r border-border hidden lg:flex flex-col transition-all duration-200',
                        collapsed ? 'w-[72px]' : 'w-64'
                    )}
                >
                    <div className={cn('border-b border-border', collapsed ? 'p-2 px-2' : 'p-2')}>
                        <button
                            type="button"
                            onClick={() => setCollapsed((c) => !c)}
                            className={cn(
                                'rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors',
                                collapsed
                                    ? 'flex w-full items-center justify-center px-2 py-3'
                                    : 'ml-auto flex items-center justify-center p-2'
                            )}
                            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {collapsed ? (
                                <ChevronRight className="h-5 w-5" />
                            ) : (
                                <ChevronLeft className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <SidebarContent compact={collapsed} />
                    </div>
                </aside>

                {/* Mobile Sidebar Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <div
                            className="absolute inset-0 bg-black/50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <aside className="absolute left-0 top-0 bottom-0 w-64 bg-card shadow-modal border-r border-border">
                            <div className="flex items-center justify-between p-4 border-b border-border">
                                <span className="font-semibold text-foreground">Menu</span>
                                <button
                                    type="button"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-1 text-muted-foreground hover:text-foreground"
                                    aria-label="Close menu"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <SidebarContent />
                        </aside>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Breadcrumbs items={breadcrumbItems} className="mb-4" />
                    {children}
                </main>
            </div>
        </div>
    );
};
