import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * Button — 10MS Design System compliant.
 *
 * Rules from DESIGN.md §5 Buttons:
 * - All buttons use pill radius (999px) — no exceptions except icon-square
 * - One primary CTA maximum per view
 * - Hover: translateY(-1px) + shadow, 0.18s ease-out (no scale on buttons)
 * - Focus: green ring rgba(28,171,85,0.15)
 * - Disabled: bg #E5E7EB, text #D1D5DB, cursor not-allowed
 */

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'default' | 'cta' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'sm' | 'default' | 'lg' | 'icon-pill' | 'icon-square';
  isLoading?: boolean;
  children?: React.ReactNode;
}

// 10MS button variant styles — light + dark mode
const VARIANTS: Record<string, string> = {
  // Primary — bg #1CAB55, text white. One per view.
  default:
    'bg-[#1CAB55] text-white border-transparent ' +
    'hover:bg-[#17994B] ' +
    'dark:bg-[#1CAB55] dark:text-white dark:hover:bg-[#17994B] ' +
    'disabled:bg-[#E5E7EB] disabled:text-[#D1D5DB] dark:disabled:bg-[#2D3748] dark:disabled:text-[#4B5563]',

  // CTA — bg #37C25C. For prominent CTAs where primary reads too saturated.
  cta:
    'bg-[#37C25C] text-white border-transparent ' +
    'hover:bg-[#1CAB55] ' +
    'dark:bg-[#37C25C] dark:text-white dark:hover:bg-[#1CAB55] ' +
    'disabled:bg-[#E5E7EB] disabled:text-[#D1D5DB] dark:disabled:bg-[#2D3748] dark:disabled:text-[#4B5563]',

  // Secondary filled — bg #D0FAD0, text #086347
  secondary:
    'bg-[#D0FAD0] text-[#086347] border border-[#1CAB55] ' +
    'hover:bg-[#BBFAD0] ' +
    'dark:bg-[#0F2419] dark:text-[#1CAB55] dark:border-[#1CAB55] dark:hover:bg-[#163520] ' +
    'disabled:bg-[#E5E7EB] disabled:text-[#D1D5DB] disabled:border-transparent dark:disabled:bg-[#2D3748] dark:disabled:text-[#4B5563]',

  // Outline — transparent, green-link text, green-link border
  outline:
    'bg-transparent text-[#149353] border border-[#149353] ' +
    'hover:bg-[#EAFEF2] ' +
    'dark:text-[#37C25C] dark:border-[#37C25C] dark:hover:bg-[#0F2419] ' +
    'disabled:text-[#D1D5DB] disabled:border-[#E5E7EB] dark:disabled:text-[#4B5563] dark:disabled:border-[#2D3748]',

  // Ghost — transparent, text-secondary, subtle outline border
  ghost:
    'bg-transparent text-[#374151] border border-[#E5E7EB] ' +
    'hover:bg-[#F3F4F6] hover:border-[#D1D5DB] ' +
    'dark:text-[#D1D5DB] dark:border-[#2D3748] dark:hover:bg-[#1E2A38] dark:hover:border-[#374151] ' +
    'disabled:text-[#D1D5DB] disabled:border-[#E5E7EB] dark:disabled:text-[#4B5563] dark:disabled:border-[#2D3748]',

  // Link — text only, no background, no border
  link:
    'bg-transparent text-[#149353] border-transparent underline-offset-4 ' +
    'hover:underline ' +
    'dark:text-[#37C25C] ' +
    'disabled:text-[#D1D5DB] dark:disabled:text-[#4B5563]',

  // Destructive — error-red only for dangerous actions
  destructive:
    'bg-[#DC2626] text-white border-transparent ' +
    'hover:bg-[#B91C1C] ' +
    'dark:bg-[#DC2626] dark:text-white dark:hover:bg-[#B91C1C] ' +
    'disabled:bg-[#E5E7EB] disabled:text-[#D1D5DB] dark:disabled:bg-[#2D3748] dark:disabled:text-[#4B5563]',
};

// 10MS size specs
const SIZES: Record<string, string> = {
  sm:         'h-9 px-4 text-xs font-medium',
  default:    'h-11 px-7 text-sm font-semibold',   // 16px 28px padding
  lg:         'h-12 px-8 text-sm font-semibold',
  'icon-pill':   'h-11 w-11',                       // 44×44 pill — Phosphor icon inside
  'icon-square': 'h-11 w-11 !rounded-xl',           // 44×44 square, radius 12px override
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, children, disabled, ...props }, ref) => {
    const isDisabled = isLoading || disabled;

    return (
      <motion.button
        ref={ref}
        className={cn(
          // Base — pill radius by default, focus ring green
          'inline-flex items-center justify-center gap-2 whitespace-nowrap',
          'rounded-full',                             // 999px pill — 10MS default
          'font-inter tracking-normal',
          'transition-colors duration-150',
          // 10MS focus ring — green, not blue
          'focus-visible:outline-none',
          'focus-visible:ring-0',
          // Disabled state — pointer-events off, opacity removed (colors handle it)
          'disabled:pointer-events-none',
          VARIANTS[variant],
          SIZES[size],
          className
        )}
        style={{
          // Inline focus shadow so it's not stripped by Tailwind purge
          '--tw-ring-shadow': 'none',
        } as React.CSSProperties}
        // 10MS button hover: lift, not scale
        whileHover={!isDisabled ? { y: -1, transition: { duration: 0.18, ease: 'easeOut' } } : undefined}
        whileTap={!isDisabled ? { scale: 0.98, transition: { duration: 0.1 } } : undefined}
        disabled={isDisabled}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(28,171,85,0.15)';
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = '';
          props.onBlur?.(e);
        }}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
