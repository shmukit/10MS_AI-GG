import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLogo } from '../Logo/AppLogo';
import { Bell } from 'lucide-react';
import { useAuthContext } from '../../lib';

/**
 * TopNavMobile — 10MS mobile dark header
 *
 * Spec from DESIGN.md §5 App Header (Dark Bar):
 * - Background: #050B14 (header-dark) — ALWAYS dark, in both light and dark app modes
 * - Logo: SheSTEM icon mark only (compact, no wordmark), 32×32px
 * - Icons: 22px, #FFFFFF Regular weight
 * - Notification badge: 8px circle #DC2626, 1.5px white border
 * - Text: #FFFFFF primary, rgba(255,255,255,0.55) secondary/muted
 */

interface TopNavMobileProps {
  title?: string;
  subtitle?: string;
}

export const TopNavMobile: React.FC<TopNavMobileProps> = ({ title, subtitle }) => {
  const navigate       = useNavigate();
  const { user }       = useAuthContext();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 lg:hidden"
      style={{
        background: '#050B14',     // header-dark — always this, regardless of app dark mode
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ height: 56, paddingLeft: 16, paddingRight: 16 }}
      >
        {/* Left — Logo (compact icon mark) */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          aria-label="Go to home"
        >
          <AppLogo surface="header-dark" layout="compact" />
        </button>

        {/* Center — Optional title/subtitle */}
        {(title || subtitle) && (
          <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
            {title && (
              <span
                className="text-sm font-semibold leading-tight"
                style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}
              >
                {title}
              </span>
            )}
            {subtitle && (
              <span
                className="text-xs"
                style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter, sans-serif' }}
              >
                {subtitle}
              </span>
            )}
          </div>
        )}

        {/* Right — Actions */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          {user && (
            <button
              className="relative flex items-center justify-center"
              style={{
                width: 40, height: 40,
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#FFFFFF',
              }}
              aria-label="Notifications"
            >
              <Bell size={22} strokeWidth={1.5} />
              {/* Notification badge — 8px, error-red, 1.5px white border */}
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 8, right: 8,
                  width: 8, height: 8,
                  background: '#DC2626',
                  borderRadius: '50%',
                  border: '1.5px solid #FFFFFF',
                }}
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
