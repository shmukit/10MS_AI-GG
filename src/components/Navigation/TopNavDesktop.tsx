import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../lib';
import { useTheme } from '../../lib/ThemeContext';
import { AppLogo } from '../Logo/AppLogo';
import { Bell, Sun, Moon } from 'lucide-react';

/**
 * TopNavDesktop — 10MS desktop top navigation bar (≥1280px)
 *
 * Spec from DESIGN.md §5 Desktop Navigation:
 * - Height: 64px
 * - Background: #FFFFFF (surface) / dark mode: #161D27
 * - 1px bottom border #E5E7EB, shadow 0 1px 3px rgba(0,0,0,0.08)
 * - Logo: AppLogo full co-brand lockup, left-aligned, 40px left padding
 * - Nav tabs: up to 5. Active = #149353 text + 2px bottom border #1CAB55
 * - Actions: dark toggle, notification bell, avatar 34px
 * - Max content width: 1200px
 */

interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface TopNavDesktopProps {
  navItems: NavItem[];
}

export const TopNavDesktop: React.FC<TopNavDesktopProps> = ({ navItems }) => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user }   = useAuthContext();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 hidden lg:block"
      style={{
        height: 64,
        background: isDarkMode ? '#161D27' : '#FFFFFF',
        borderBottom: `1px solid ${isDarkMode ? '#2D3748' : '#E5E7EB'}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <div
        className="h-full mx-auto flex items-center justify-between"
        style={{ maxWidth: 1200, paddingLeft: 40, paddingRight: 40 }}
      >
        {/* Left — Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center focus-visible:outline-none"
          style={{ flexShrink: 0 }}
          onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(28,171,85,0.15)'; }}
          onBlur={(e)  => { e.currentTarget.style.boxShadow = ''; }}
          aria-label="Go to home"
        >
          <AppLogo layout="full" />
        </button>

        {/* Center — Primary nav tabs */}
        <div className="flex items-stretch h-full mx-8 gap-1">
          {navItems.slice(0, 5).map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex items-center px-4 text-sm font-medium transition-colors duration-150"
                style={{
                  color: active
                    ? '#149353'
                    : isDarkMode ? '#9CA3AF' : '#6B7280',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = isDarkMode ? '#1E2A38' : '#F3F4F6';
                    e.currentTarget.style.color = isDarkMode ? '#D1D5DB' : '#374151';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = isDarkMode ? '#9CA3AF' : '#6B7280';
                  }
                }}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
                {/* Active underline — 2px bottom border, flush to nav bottom */}
                {active && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: '#1CAB55',
                      borderRadius: '2px 2px 0 0',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center rounded-full transition-colors duration-150"
            style={{
              width: 36, height: 36,
              background: isDarkMode ? '#1E2A38' : '#F3F4F6',
              color: isDarkMode ? '#9CA3AF' : '#6B7280',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = isDarkMode ? '#2D3748' : '#E5E7EB'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = isDarkMode ? '#1E2A38' : '#F3F4F6'; }}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Notification bell */}
          {user && (
            <button
              className="relative flex items-center justify-center rounded-full transition-colors duration-150"
              style={{
                width: 36, height: 36,
                background: 'transparent',
                color: isDarkMode ? '#9CA3AF' : '#6B7280',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = isDarkMode ? '#1E2A38' : '#F3F4F6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              aria-label="Notifications"
            >
              <Bell size={18} />
              {/* Notification badge — error-red, 8px */}
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 6, right: 6,
                  width: 8, height: 8,
                  background: '#DC2626',
                  borderRadius: '50%',
                  border: '1.5px solid',
                  borderColor: isDarkMode ? '#161D27' : '#FFFFFF',
                }}
              />
            </button>
          )}

          {/* Avatar */}
          {user && (
            <button
              onClick={() => navigate('/student/profile')}
              className="rounded-full overflow-hidden flex-shrink-0 transition-all duration-150"
              style={{
                width: 34, height: 34,
                border: `2px solid ${isDarkMode ? '#2D3748' : '#E5E7EB'}`,
                cursor: 'pointer',
                background: '#D0FAD0',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#1CAB55'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(28,171,85,0.15)'; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = isDarkMode ? '#2D3748' : '#E5E7EB'; e.currentTarget.style.boxShadow = ''; }}
              aria-label="Go to profile"
            >
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Your avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="flex items-center justify-center w-full h-full text-xs font-semibold"
                  style={{ color: '#086347', fontFamily: 'Inter, sans-serif' }}
                >
                  {(user.email ?? 'U')[0].toUpperCase()}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
