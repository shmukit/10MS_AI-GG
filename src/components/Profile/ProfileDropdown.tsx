import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth';

interface ProfileDropdownProps {
  userName?: string;
  userRole?: string;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  userName = 'User',
  userRole = 'student'
}) => {
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
      setIsOpen(false);
      await signOut();
      setTimeout(() => navigate('/login'), 100);
    } catch {
      setTimeout(() => navigate('/login'), 100);
    }
  };

  const handleProfileClick = () => {
    navigate('/student/profile');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-muted text-muted-foreground hover:text-foreground"
      >
        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center border border-border">
          <User className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-foreground">{userName?.charAt(0).toUpperCase() + userName?.slice(1) || 'User'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-modal border border-border bg-card z-50">
          <div className="py-2">
            <div className="px-4 py-3 border-b border-border">
              <div className="font-medium text-foreground">{userName}</div>
              <div className="text-sm capitalize text-muted-foreground">{userRole}</div>
            </div>

            <div className="py-1">
              <button
                onClick={handleProfileClick}
                className="w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center gap-3 text-foreground hover:bg-muted"
              >
                <User className="w-4 h-4" />
                Profile
              </button>

              <div className="my-1 border-t border-border" />

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center gap-3 text-destructive hover:bg-destructive/10"
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
