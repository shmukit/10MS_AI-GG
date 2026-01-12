import React, { useState } from 'react';
import { useTheme } from '../../lib/ThemeContext';
import { Button } from '../ui/Button';
import { Home, Users, Map, Menu, LogOut, Moon, Sun, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

interface MobileBottomNavProps {
    currentBatchName?: string;
    onRoadmapClick?: () => void;
    userName?: string;
    userEmail?: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
    currentBatchName,
    onRoadmapClick,
    userName = "Student",
    userEmail
}) => {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        {
            label: 'Home',
            icon: Home,
            onClick: () => navigate('/student/dashboard'),
            isActive: location.pathname === '/student/dashboard'
        },
        {
            label: 'Community',
            icon: Users,
            onClick: () => navigate('/student/community'),
            isActive: location.pathname.startsWith('/student/community')
        },
        {
            label: 'Roadmaps',
            icon: Map,
            onClick: onRoadmapClick,
            isActive: false
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
                "fixed bottom-0 left-0 right-0 z-[60] border-t md:hidden pb-safe transition-colors duration-200",
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            )}>
                <div className="flex items-center justify-around h-16">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={item.onClick}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                                item.isActive
                                    ? (isDarkMode ? "text-blue-400" : "text-blue-600")
                                    : (isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700")
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Drawer / Sheet */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={cn(
                                "fixed left-0 right-0 bottom-16 z-50 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden flex flex-col max-h-[80vh]",
                                isDarkMode ? "bg-gray-900 border-t border-x border-gray-800" : "bg-white border-t border-x border-gray-200"
                            )}
                        >
                            {/* Drawer Header */}
                            <div className={cn(
                                "p-6 border-b",
                                isDarkMode ? "border-gray-800" : "border-gray-100"
                            )}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                        {userName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className={cn("font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
                                            {userName}
                                        </h3>
                                        <p className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                                            {userEmail}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Drawer Content */}
                            <div className="flex-1 p-4 space-y-2">
                                <Button
                                    variant="ghost"
                                    className={cn("w-full justify-start", isDarkMode ? "text-gray-300" : "text-gray-700")}
                                    onClick={() => navigate('/profile')}
                                >
                                    <User className="w-4 h-4 mr-3" />
                                    Profile
                                </Button>

                                <Button
                                    variant="ghost"
                                    className={cn("w-full justify-start", isDarkMode ? "text-gray-300" : "text-gray-700")}
                                    onClick={toggleDarkMode}
                                >
                                    {isDarkMode ? <Sun className="w-4 h-4 mr-3" /> : <Moon className="w-4 h-4 mr-3" />}
                                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                                </Button>
                            </div>

                            {/* Drawer Footer */}
                            <div className={cn(
                                "p-4 border-t mt-auto",
                                isDarkMode ? "border-gray-800" : "border-gray-100"
                            )}>
                                <Button
                                    variant="destructive"
                                    className="w-full justify-start"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-4 h-4 mr-3" />
                                    Logout
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
