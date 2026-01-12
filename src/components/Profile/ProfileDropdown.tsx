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
  const { isDarkMode, colorTheme, setColorTheme } = useTheme();
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
      console.log('🔄 ProfileDropdown: Starting logout...');
      setIsOpen(false); // Close dropdown immediately

      const result = await signOut();
      console.log('📊 ProfileDropdown: Logout result:', result);

      // Small delay to ensure auth state has time to update
      setTimeout(() => {
        console.log('🔄 ProfileDropdown: Redirecting to login page...');
        navigate('/login');
      }, 100);

    } catch (error) {
      console.error('❌ ProfileDropdown: Logout exception:', error);
      // Even if there's an exception, redirect to login page
      setTimeout(() => {
        console.log('🔄 ProfileDropdown: Redirecting to login after exception...');
        navigate('/login');
      }, 100);
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
        className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${isDarkMode
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
        <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg border transition-colors duration-200 z-50 ${isDarkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
          }`}>
          <div className="py-2">
            {/* User Info */}
            <div className={`px-4 py-3 border-b transition-colors duration-200 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
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
                className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center gap-3 ${isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                <User className="w-4 h-4" />
                Profile
              </button>

              {/* Theme Selection */}
              <div className={`px-4 py-2 mt-1 border-t transition-colors duration-200 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                <div className={`text-[10px] uppercase tracking-wider font-bold mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                  Color Theme
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'default', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', label: 'Default' },
                    { id: 'cherryblossoms', gradient: 'linear-gradient(135deg, #FBD3E9 0%, #BB377D 100%)', label: 'Cherry' },
                    { id: 'shroomhaze', gradient: 'linear-gradient(135deg, #5C258D 0%, #4389A2 100%)', label: 'Shroom' },
                    { id: 'flare', gradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)', label: 'Flare' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setColorTheme(t.id as any)}
                      className={`w-7 h-7 rounded-full border-2 transition-all duration-300 relative ${colorTheme === t.id
                        ? 'border-blue-500 scale-110 shadow-md ring-2 ring-blue-500/20'
                        : isDarkMode ? 'border-gray-700 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      style={{ background: t.gradient }}
                      title={t.label}
                    >
                      {colorTheme === t.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className={`my-1 border-t transition-colors duration-200 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`} />

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center gap-3 ${isDarkMode
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