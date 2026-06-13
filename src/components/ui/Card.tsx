import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Card — 10MS Design System compliant.
 *
 * Rules from DESIGN.md §5 Cards:
 * - Flat by default — NO box-shadow at rest. Border does the depth work.
 * - Border: 1px solid #E5E7EB (outline token)
 * - Large card: radius 16px (rounded-2xl), padding 16px mobile / 24px desktop
 * - Small card: radius 12px (rounded-xl), padding 12px
 * - Hover: shadow 0 4px 16px rgba(0,0,0,0.10) + translateY(-2px), 0.2s ease-out
 * - No nested cards — inner content areas use colored surfaces, never bordered cards
 */

// ── Card (Large) ─────────────────────────────────────────────────────────────
const Card = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({ className, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(
        // Flat-by-default — border only, no shadow
        'rounded-2xl border border-border',
        'bg-card text-card-foreground',
        // Padding: 16px mobile, 24px desktop
        'p-4 md:p-6',
        className
      )}
      // Hover: lift + shadow (earned, not ambient)
      whileHover={{
        y: -2,
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      {...props}
    />
  )
);
Card.displayName = 'Card';

// ── CardSm (Small / list item) ────────────────────────────────────────────────
const CardSm = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({ className, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(
        'rounded-xl border border-border',
        'bg-card text-card-foreground',
        'p-3',
        className
      )}
      whileHover={{
        y: -2,
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      {...props}
    />
  )
);
CardSm.displayName = 'CardSm';

// ── CardAlert (Error/warning state) ──────────────────────────────────────────
const CardAlert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-[#FECACA]',
        'bg-[#FEF2F2]',
        'p-3',
        className
      )}
      {...props}
    />
  )
);
CardAlert.displayName = 'CardAlert';

// ── Sub-components ────────────────────────────────────────────────────────────
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-1.5 pb-4', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-[15px] font-semibold leading-[1.47] text-foreground',
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-[13px] leading-[1.46] text-muted-foreground',
        className
      )}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4 border-t border-border', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardSm, CardAlert, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
