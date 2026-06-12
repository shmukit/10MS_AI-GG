import React from 'react';
import { SheSTEMLogo } from './SheSTEMLogo';
import { TenMSLogoMark } from './TenMSLogoMark';
import { TenMSFullLogo } from './TenMSFullLogo';
import { useTheme } from '../../lib/ThemeContext';

/**
 * AppLogo — AI-GG Co-brand Lockup
 *
 * Composes the SheSTEM product mark with the 10MS endorser mark.
 *
 * Surfaces:
 *  - 'light'       → SheSTEM light + 10MS color mark (desktop nav, marketing)
 *  - 'header-dark' → SheSTEM dark + 10MS white-red mark (mobile #050B14 header)
 *  - 'green'       → SheSTEM dark + 10MS white mark (on #1CAB55 surfaces)
 *
 * Layouts:
 *  - 'full'    → SheSTEM wordmark + 10MS endorser (desktop nav, marketing)
 *  - 'compact' → SheSTEM icon mark only, no wordmark, no endorser (mobile header)
 *  - 'icon'    → SheSTEM icon + 10MS mark side by side, no wordmarks
 */

type AppLogoSurface = 'light' | 'header-dark' | 'green';
type AppLogoLayout  = 'full' | 'compact' | 'icon';

interface AppLogoProps {
  surface?: AppLogoSurface;
  layout?: AppLogoLayout;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  surface,
  layout   = 'full',
  className = '',
}) => {
  const { isDarkMode } = useTheme();
  
  // Smart default surface based on current theme mode
  const activeSurface = surface || (isDarkMode ? 'header-dark' : 'light');
  const isDarkSurface = activeSurface === 'header-dark' || activeSurface === 'green';

  // 10MS mark variant per surface
  const tenmsVariant =
    activeSurface === 'header-dark' ? 'white-red' :
    activeSurface === 'green'       ? 'white'     :
    'color';

  // SheSTEM surface mode
  const sheSurface = isDarkSurface ? 'dark' : 'light';

  // Separator color
  const sepColor = isDarkSurface
    ? 'rgba(255,255,255,0.20)'
    : '#E5E7EB'; // 10MS outline token

  if (layout === 'compact') {
    // Mobile header: icon mark only, no wordmark
    return (
      <div className={`flex items-center ${className}`}>
        <SheSTEMLogo
          surface={sheSurface}
          showWordmark={false}
          iconSize={32}
        />
      </div>
    );
  }

  if (layout === 'icon') {
    // Icon marks side by side
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <SheSTEMLogo surface={sheSurface} showWordmark={false} iconSize={28} />
        <span style={{ width: 1, height: 20, background: sepColor, display: 'inline-block' }} />
        <TenMSLogoMark variant={tenmsVariant} size={24} />
      </div>
    );
  }

  // Full co-brand lockup (default)
  // Layout: [SheSTEM molecule + wordmark]  |  [10MS mark] 10 Minute School
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Product identity */}
      <SheSTEMLogo
        surface={sheSurface}
        showWordmark={true}
        iconSize={28}
      />

      {/* Vertical separator */}
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: 1,
          height: 22,
          background: sepColor,
          flexShrink: 0,
        }}
      />

      {/* 10MS endorser — using official inlined logo vector instead of text */}
      <TenMSFullLogo variant={tenmsVariant} height={20} className="flex-shrink-0" />
    </div>
  );
};
