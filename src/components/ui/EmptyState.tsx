import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border',
      'bg-muted/30 px-6 py-12 text-center',
      className
    )}
  >
    {Icon && (
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
    )}
    <h3 className="font-display text-h3 text-foreground">{title}</h3>
    {description && (
      <p className="mt-2 max-w-sm text-body text-muted-foreground">{description}</p>
    )}
    {actionLabel && onAction && (
      <Button className="mt-6" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);
