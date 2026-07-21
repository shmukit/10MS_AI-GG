import React, { useState } from 'react';
import { useTheme } from '../../lib/ThemeContext';
import { Button } from '../ui/Button';
import { Home, Users, Map, Menu, LogOut, Moon, Sun, User, Layers, Bell, Shield, GraduationCap, LayoutDashboard, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useAuthContext } from '../../lib';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAccessibleDashboards } from '../../lib/roleAccess';

export const MobileBottomNav: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isBatchesOpen, setIsBatchesOpen] = useState(false);
    const { user, signOut, databaseUserId, userRole, accessibleRoles } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    // State for batches and roadmap
    const [enrolledBatches, setEnrolledBatches] = useState<any[]>([]);
    const [currentBatch, setCurrentBatch] = useState<any>(null);
    const [roadmapSlug, setRoadmapSlug] = useState<string | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [notices, setNotices] = useState<any[]>([]);
    const [isNoticesOpen, setIsNoticesOpen] = useState(false);

    // Prefer DB user id when available (auth uid can differ)
    const userId = databaseUserId || user?.id;

    // Get user details safely
    const userName = user?.user_metadata?.first_name || "Student";
    const userEmail = user?.email || "";

    // Load data proactively on mount
    React.useEffect(() => {
        if (userId) {
            setIsLoadingData(true);
            import('../../services/database').then(async ({ DatabaseService }) => {
                try {
                    const data = await DatabaseService.getDashboardData(userId, {
                        alternateUserIds: [databaseUserId, user?.id],
                    });
                    if (data?.enrolledBatches) {
                        setEnrolledBatches(data.enrolledBatches);
                    }
                    if (data?.batch) {
                        setCurrentBatch(data.batch);
                        if (data.roadmap) {
                            setRoadmapSlug(DatabaseService.generateRoadmapSlug(data.roadmap.title));
                        }
                    }
                    if (data?.notices) {
                        setNotices(data.notices);
                    }
                } catch (e) {
                    console.error("Failed to load navigation data", e);
                } finally {
                    setIsLoadingData(false);
                }
            });
        }
    }, [userId]);

    React.useEffect(() => {
        const handleToggleNotices = () => setIsNoticesOpen(prev => !prev);
        window.addEventListener('toggle-mobile-notices', handleToggleNotices);
        return () => window.removeEventListener('toggle-mobile-notices', handleToggleNotices);
    }, []);

    const handleBatchSwitch = async (batchId: string) => {
        setIsBatchesOpen(false);

        // Prefer staying in / navigating to the selected cohort's roadmap when multi-batch
        if (userId) {
            import('../../services/database').then(async ({ DatabaseService }) => {
                const data = await DatabaseService.getDashboardData(userId, { batchId });
                if (data?.batch) {
                    setCurrentBatch(data.batch);
                    if (data.roadmap) {
                        const slug = DatabaseService.generateRoadmapSlug(data.roadmap.title);
                        setRoadmapSlug(slug);
                        navigate(`/student/roadmap/${slug}`);
                        return;
                    }
                }
                navigate(`/student/dashboard?batchId=${batchId}`);
            });
        } else {
            navigate(`/student/dashboard?batchId=${batchId}`);
        }
    };

    const navItems = [
        {
            label: 'Home',
            icon: Home,
            onClick: () => navigate('/student/dashboard'),
            isActive: location.pathname === '/student/dashboard'
        },
        {
            label: 'Roadmap',
            icon: Map,
            onClick: () => {
                // Multiple cohorts: open picker so students choose which roadmap
                if (enrolledBatches.length > 1) {
                    setIsBatchesOpen(true);
                    return;
                }
                if (roadmapSlug) {
                    navigate(`/student/roadmap/${roadmapSlug}`);
                } else if (!isLoadingData) {
                    navigate('/student/dashboard');
                }
            },
            isActive: location.pathname.startsWith('/student/roadmap')
        },
        {
            label: 'Programs',
            icon: Layers,
            onClick: () => setIsBatchesOpen(!isBatchesOpen),
            isActive: isBatchesOpen
        },
        {
            label: 'Community',
            icon: Users,
            onClick: () => {
                if (roadmapSlug) {
                    navigate(`/student/community/${roadmapSlug}${currentBatch?.id ? `?batch_id=${currentBatch.id}` : ''}`);
                } else if (!isLoadingData) {
                    navigate('/student/dashboard');
                }
            },
            isActive: location.pathname.startsWith('/student/community')
        },
        {
            label: 'Menu',
            icon: Menu,
            onClick: () => setIsMenuOpen(!isMenuOpen),
            isActive: isMenuOpen
        }
    ];

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <>
            {/* Bottom Navigation Bar */}
            <div className={cn(
                "fixed bottom-0 left-0 right-0 z-[60] border-t md:hidden pb-safe transition-colors duration-200 bg-background border-border"
            )}>
                <div className="flex items-center justify-around h-16 px-2">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={item.onClick}
                            aria-current={item.isActive ? 'page' : undefined}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors focus:outline-none min-w-[60px]",
                                item.isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Drawer / Sheet */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 z-[65] bg-black/50 backdrop-blur-sm md:hidden"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={cn(
                                "fixed left-0 right-0 bottom-0 z-[70] rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden flex flex-col bg-background border-t border-x border-border"
                            )}
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                                        {userName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{userName}</h3>
                                        <p className="text-xs text-muted-foreground">{userEmail}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsMenuOpen(false)}
                                    aria-label="Close menu"
                                    className="p-2 -mr-2 text-muted-foreground focus:outline-none"
                                >
                                    <X className="w-6 h-6" strokeWidth={2} />
                                </button>
                            </div>
                            <div className="p-4 space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground px-4 uppercase tracking-wider mb-2">Account</h4>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-foreground"
                                    onClick={() => {
                                        navigate('/student/profile');
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    <User className="w-4 h-4 mr-3" />
                                    Profile
                                </Button>
                                <h4 className="text-sm font-medium text-muted-foreground px-4 uppercase tracking-wider mb-2 mt-4">Dashboards</h4>
                                {getAccessibleDashboards(userRole, {
                                    accessibleRoles,
                                    email: user?.email,
                                }).map((d) => {
                                    const Icon =
                                        d.role === 'admin'
                                            ? Shield
                                            : d.role === 'mentor'
                                              ? GraduationCap
                                              : LayoutDashboard;
                                    return (
                                        <Button
                                            key={d.path}
                                            variant="ghost"
                                            className="w-full justify-start text-foreground"
                                            onClick={() => {
                                                navigate(d.path);
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            <Icon className="w-4 h-4 mr-3" />
                                            {d.label}
                                        </Button>
                                    );
                                })}
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-foreground"
                                    onClick={toggleDarkMode}
                                >
                                    {isDarkMode ? <Sun className="w-4 h-4 mr-3" /> : <Moon className="w-4 h-4 mr-3" />}
                                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                                </Button>
                            </div>
                            <div className="p-4 border-t mt-auto border-border bg-background pb-safe">
                                <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                                    <LogOut className="w-4 h-4 mr-3" />
                                    Logout
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Notices Drawer */}
            <AnimatePresence>
                {isNoticesOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsNoticesOpen(false)}
                            className="fixed inset-0 z-[65] bg-black/50 backdrop-blur-sm md:hidden"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={cn(
                                "fixed left-0 right-0 bottom-0 z-[70] rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden flex flex-col max-h-[85vh] bg-background border-t border-x border-border"
                            )}
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-primary" />
                                    <h3 className="font-semibold text-lg text-foreground">Notifications</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsNoticesOpen(false)}
                                    aria-label="Close notifications"
                                    className="p-2 -mr-2 text-muted-foreground hover:text-foreground focus:outline-none"
                                >
                                    <X className="w-6 h-6" strokeWidth={2} />
                                </button>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto">
                                {notices.length > 0 ? (
                                    <div className="space-y-3">
                                        {notices.map((notice, idx) => (
                                            <div key={notice.id || idx} className={cn(
                                                "p-4 rounded-xl border transition-colors",
                                                "p-4 rounded-xl border transition-colors bg-muted/50 border-border"
                                            )}>
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h4 className="font-semibold text-foreground leading-tight">{notice.title}</h4>
                                                    {notice.priority === 'high' && (
                                                        <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md font-bold uppercase">High</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{notice.content}</p>
                                                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                                    <span>{notice.tag || 'General'}</span>
                                                    <span>{new Date(notice.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                        <Bell className="w-12 h-12 mb-4 opacity-20" />
                                        <p>No new notifications</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-border pb-safe">
                                <Button className="w-full" onClick={() => setIsNoticesOpen(false)}>Close</Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Batches Drawer / Sheet */}
            <AnimatePresence>
                {isBatchesOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsBatchesOpen(false)}
                            className="fixed inset-0 z-[65] bg-black/50 backdrop-blur-sm md:hidden"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={cn(
                                "fixed left-0 right-0 bottom-0 z-[70] rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden flex flex-col max-h-[85vh] bg-background border-t border-x border-border"
                            )}
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <h3 className="font-semibold text-lg text-foreground">Your cohorts</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsBatchesOpen(false)}
                                    aria-label="Close cohorts"
                                    className="p-2 -mr-2 text-muted-foreground hover:text-foreground focus:outline-none"
                                >
                                    <X className="w-6 h-6" strokeWidth={2} />
                                </button>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto">
                                {(() => {
                                    const displayBatches = [...enrolledBatches];
                                    if (currentBatch && !displayBatches.some(b => b.id === currentBatch.id)) {
                                        displayBatches.unshift(currentBatch);
                                    }

                                    if (displayBatches.length > 0) {
                                        return (
                                            <div className="space-y-1">
                                                {displayBatches.map(batch => {
                                                    if (!batch) return null;
                                                    const isActive = currentBatch?.id === batch.id;
                                                    return (
                                                        <button
                                                            key={batch.id}
                                                            onClick={() => handleBatchSwitch(batch.id)}
                                                            className={cn(
                                                                "w-full flex items-center px-4 py-4 text-sm rounded-xl transition-colors mb-2 border",
                                                                isActive
                                                                    ? "bg-primary/5 border-primary text-primary font-semibold shadow-sm"
                                                                    : "border-border text-foreground hover:bg-muted"
                                                            )}
                                                        >
                                                            <span className="truncate">{batch.name}</span>
                                                            {isActive && <span className="ml-auto text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase tracking-tighter">Active</span>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                            <Layers className="w-12 h-12 mb-4 opacity-20" />
                                            <p>{isLoadingData ? "Loading batches..." : "No batches found"}</p>
                                        </div>
                                    );
                                })()}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
