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
  default:
    'bg-primary text-primary-foreground border-transparent ' +
    'hover:bg-[#17994B] ' +
    'disabled:bg-muted disabled:text-muted-foreground',

  cta:
    'bg-[#37C25C] text-white border-transparent ' +
    'hover:bg-primary ' +
    'disabled:bg-muted disabled:text-muted-foreground',

  secondary:
    'bg-accent text-accent-foreground border border-primary/30 ' +
    'hover:bg-accent/80 ' +
    'disabled:bg-muted disabled:text-muted-foreground disabled:border-transparent',

  outline:
    'bg-transparent text-[#149353] border border-[#149353] ' +
    'hover:bg-accent ' +
    'dark:text-[#37C25C] dark:border-[#37C25C] dark:hover:bg-accent ' +
    'disabled:text-muted-foreground disabled:border-border',

  ghost:
    'bg-transparent text-foreground border border-border ' +
    'hover:bg-muted hover:border-border ' +
    'disabled:text-muted-foreground disabled:border-border',

  link:
    'bg-transparent text-[#149353] border-transparent underline-offset-4 ' +
    'hover:underline ' +
    'dark:text-[#37C25C] ' +
    'disabled:text-muted-foreground',

  destructive:
    'bg-destructive text-destructive-foreground border-transparent ' +
    'hover:bg-[#B91C1C] ' +
    'disabled:bg-muted disabled:text-muted-foreground',
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
