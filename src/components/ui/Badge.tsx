import React from 'react';
import { cn } from '../../lib/utils';

const variants = {
  default: 'bg-primary text-primary-foreground',
  accent: 'bg-accent text-accent-foreground border border-primary/30',
  muted: 'bg-muted text-muted-foreground',
  success: 'bg-success-subtle text-primary border border-primary/30',
  warning: 'bg-warning-subtle text-warning',
  destructive: 'bg-destructive/10 text-destructive border border-destructive/30',
  outline: 'bg-transparent text-foreground border border-border',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className,
  children,
  ...props
}) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-caption font-medium',
      variants[variant],
      className
    )}
    {...props}
  >
    {children}
  </span>
);
