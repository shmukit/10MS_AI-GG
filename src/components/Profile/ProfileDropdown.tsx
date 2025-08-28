import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth';
import { useTheme } from '../../lib/ThemeContext';

interface ProfileDropdownProps {
  userName?: string;
  userRole?: string;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ 
  userName = 'User', 
  userRole = 'student' 
}) => {
  console.log('ProfileDropdown rendered with:', { userName, userRole });
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        navigate('/login');
      } else {
        console.error('Logout failed:', result.error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfileClick = () => {
    // Always navigate to student profile as it's the default user profile
    navigate('/student/profile');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${
          isDarkMode 
            ? 'hover:bg-gray-700 text-gray-300' 
            : 'hover:bg-gray-100 text-gray-600'
        }`}
      >
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">{userName?.charAt(0).toUpperCase() + userName?.slice(1) || 'User'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg border transition-colors duration-200 z-50 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="py-2">
            {/* User Info */}
            <div className={`px-4 py-3 border-b transition-colors duration-200 ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {userName}
              </div>
              <div className={`text-sm capitalize transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {userRole}
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={handleProfileClick}
                className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center gap-3 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </button>

              {/* Divider */}
              <div className={`my-1 border-t transition-colors duration-200 ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`} />

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center gap-3 ${
                  isDarkMode 
                    ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300' 
                    : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                }`}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};