import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown, LayoutDashboard, Shield, GraduationCap } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../lib';
import { getAccessibleDashboards, roleDisplayLabel } from '../../lib/roleAccess';
import { cn } from '../../lib/utils';

interface ProfileDropdownProps {
  userName?: string;
  userRole?: string;
  /** Compact student-style trigger vs admin pill trigger */
  variant?: 'default' | 'pill';
}

const iconForPath = (path: string) => {
  if (path.startsWith('/admin')) return Shield;
  if (path.startsWith('/mentor')) return GraduationCap;
  return LayoutDashboard;
};

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  userName = 'User',
  userRole = 'student',
  variant = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Must use AuthContext — a bare useAuth() creates a separate state and can miss roles
  const { signOut, userRole: authRole, accessibleRoles, user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const role = authRole || userRole || 'student';
  const dashboards = getAccessibleDashboards(role, {
    accessibleRoles,
    email: user?.email,
  });
  const displayRoleLabel = roleDisplayLabel(role, accessibleRoles);

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

  const go = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const displayName = userName?.charAt(0).toUpperCase() + userName?.slice(1) || 'User';

  return (
    <div className="relative" ref={dropdownRef}>
      {variant === 'pill' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label="Account menu"
          className="flex items-center gap-2 rounded-full border border-border py-1.5 pl-2 pr-2 transition-colors hover:bg-muted sm:gap-3 sm:pl-3 sm:pr-4"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-sm font-bold text-foreground">
            {displayName.charAt(0)}
          </div>
          <div className="hidden flex-col items-start sm:flex">
            <span className="mb-1 text-sm font-medium leading-none text-foreground">{displayName}</span>
            <span className="text-xs leading-none text-muted-foreground">{displayRoleLabel}</span>
          </div>
          <ChevronDown className={cn('hidden h-4 w-4 text-muted-foreground sm:block', isOpen && 'rotate-180')} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label="Account menu"
          className="flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 hover:bg-muted text-muted-foreground hover:text-foreground"
        >
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center border border-border">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-foreground">{displayName}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-modal border border-border bg-card z-50">
          <div className="py-2">
            <div className="px-4 py-3 border-b border-border">
              <div className="font-medium text-foreground">{userName}</div>
              <div className="text-sm capitalize text-muted-foreground">{displayRoleLabel}</div>
              {user?.email && (
                <div className="text-xs text-muted-foreground mt-1 truncate" title={user.email}>
                  {user.email}
                </div>
              )}
            </div>

            <div className="py-1">
              <button
                type="button"
                onClick={() => go('/student/profile')}
                className="w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center gap-3 text-foreground hover:bg-muted"
              >
                <User className="w-4 h-4" />
                Profile
              </button>

              {dashboards.length > 0 && (
                <>
                  <div className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Dashboards
                  </div>
                  {dashboards.map((d) => {
                    const Icon = iconForPath(d.path);
                    const isCurrent = location.pathname.startsWith(
                      d.path.replace(/\/dashboard$/, '')
                    );
                    return (
                      <button
                        key={d.path}
                        type="button"
                        onClick={() => go(d.path)}
                        className={cn(
                          'w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center gap-3',
                          isCurrent
                            ? 'bg-accent text-accent-foreground font-medium'
                            : 'text-foreground hover:bg-muted'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {d.label}
                      </button>
                    );
                  })}
                </>
              )}

              <div className="my-1 border-t border-border" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center gap-3 text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
