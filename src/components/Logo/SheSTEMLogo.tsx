import React from 'react';
import { useTheme } from '../../lib/ThemeContext';

/**
 * SheSTEMLogo — AI-GG product mark.
 *
 * Molecule geometry preserved; recolored to 10MS green palette.
 * Central atom: #111827 (10MS inverse/near-black)
 * Satellite atoms & "She" text: #1CAB55 (10MS primary green)
 * Bond lines: #6B7280 (10MS text-tertiary)
 * "STEM" text: #111827 (10MS inverse)
 *
 * Dark mode: light versions of text and atoms.
 */

interface SheSTEMLogoProps {
  className?: string;
  /** 'light' = default (for light/white surfaces). 'dark' = white text for dark surfaces. */
  surface?: 'light' | 'dark';
  /** Show text wordmark alongside the icon */
  showWordmark?: boolean;
  /** Icon size in px (default 32) */
  iconSize?: number;
}

export const SheSTEMLogo: React.FC<SheSTEMLogoProps> = ({
  className = '',
  surface,
  showWordmark = true,
  iconSize = 32,
}) => {
  const { isDarkMode } = useTheme();
  const activeSurface = surface || (isDarkMode ? 'dark' : 'light');
  const isDark = activeSurface === 'dark';

  // Original SheSTEM brand colors
  const sheTextColor    = '#8B5CF6';                         // Signature SheSTEM purple/blue
  const satelliteFill   = '#8B5CF6';                         // Signature SheSTEM purple/blue
  const centralAtomFill = isDark ? '#F9FAFB' : '#1E3A8A';   // Dark blue on light / white on dark
  const stemTextColor   = isDark ? '#F9FAFB' : '#1E3A8A';   // Dark blue on light / white on dark
  const bondStroke      = isDark ? '#9CA3AF' : '#6B7280';    // text-3 / dark text-3

  return (
    <div className={`flex items-center gap-2.5 w-fit h-fit ${className}`}>
      {/* Molecule Icon — 10MS green palette */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Bond lines — rendered first so atoms sit on top */}
        <line x1="16" y1="12" x2="16" y2="9"   stroke={bondStroke} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="13" y1="18" x2="9"  y2="21"  stroke={bondStroke} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="19" y1="18" x2="23" y2="21"  stroke={bondStroke} strokeWidth="1.5" strokeLinecap="round" />

        {/* Central atom — near-black / white on dark */}
        <circle cx="16" cy="16" r="4.5" fill={centralAtomFill} />

        {/* Satellite atoms — 10MS primary green */}
        <circle cx="16" cy="6"  r="3" fill={satelliteFill} />
        <circle cx="6"  cy="22" r="3" fill={satelliteFill} />
        <circle cx="26" cy="22" r="3" fill={satelliteFill} />
      </svg>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex items-baseline leading-none select-none">
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ color: sheTextColor, fontFamily: 'Inter, sans-serif' }}
          >
            She
          </span>
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ color: stemTextColor, fontFamily: 'Inter, sans-serif' }}
          >
            STEM
          </span>
        </div>
      )}
    </div>
  );
};
