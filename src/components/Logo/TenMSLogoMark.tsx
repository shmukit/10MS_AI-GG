import React from 'react';

/**
 * TenMSLogoMark — 10 Minute School official icon mark (square format).
 *
 * Always inlined SVG per 10MS rules. Never <img>, never recolored.
 *
 * Variants:
 *  - 'color'     → Black body + Red accent. Light surfaces (desktop nav, light topbar).
 *  - 'white-red' → White body + Red accent. header-dark (#050B14) surfaces.
 *  - 'white'     → Pure white. On primary green (#1CAB55) surfaces only.
 *  - 'black'     → Pure black. Print, embossing, single-color.
 */

type TenMSVariant = 'color' | 'white-red' | 'white' | 'black';

interface TenMSLogoMarkProps {
  variant?: TenMSVariant;
  size?: number;
  className?: string;
}

const BODY_COLOR: Record<TenMSVariant, string> = {
  'color':     '#111827',
  'white-red': '#F9FAFB',
  'white':     '#F9FAFB',
  'black':     '#111827',
};

const ACCENT_COLOR: Record<TenMSVariant, string> = {
  'color':     '#EB2026',
  'white-red': '#EB2026',
  'white':     '#F9FAFB',  // pure white — accent stroke disappears (on green bg only)
  'black':     '#111827',
};

export const TenMSLogoMark: React.FC<TenMSLogoMarkProps> = ({
  variant = 'color',
  size = 32,
  className = '',
}) => {
  const body   = BODY_COLOR[variant];
  const accent = ACCENT_COLOR[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="10 Minute School"
      role="img"
    >
      {/* Red accent diagonal stroke — the 10MS signature mark */}
      <path
        d="M109.506 89.9736L144.049 55.4252C140.272 36.9801 125.604 22.501 107.02 20.1759C106.669 20.1314 106.313 20.0925 105.963 20.0591V37.1859C114.012 38.5487 120.686 43.7552 124.58 50.9196L97.5244 77.9698L109.506 89.9736Z"
        fill={accent}
      />
      {/* "1" vertical stroke */}
      <path
        d="M47.3513 139.963H30.3635V37.0244H15V20.0366H47.3513V139.963Z"
        fill={body}
      />
      {/* "0" loop body */}
      <path
        d="M127.917 83.5935L127.845 94.8853V94.9409C127.845 110.388 116.086 122.953 101.635 122.953C87.1834 122.953 75.4355 110.399 75.4244 94.9688L75.6302 64.9037V64.848C75.6302 51.1199 84.9529 39.4499 97.4962 37.2193V20.0758L96.3837 20.2037C74.8514 23.0295 58.6313 42.2088 58.6146 64.8202L58.4199 94.8853V94.9409C58.4199 119.755 77.7995 139.941 101.618 139.941C125.436 139.941 144.799 119.772 144.81 94.9688L145 66.4945L127.917 83.5935Z"
        fill={body}
      />
    </svg>
  );
};
