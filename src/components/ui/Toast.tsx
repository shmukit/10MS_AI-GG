import React, { useEffect } from 'react';
import { AlertCircle, Check, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onDismiss?: () => void;
  duration?: number;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onDismiss,
  duration = 3000,
  className,
}) => {
  useEffect(() => {
    if (!onDismiss || duration <= 0) return;
    const timer = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timer);
  }, [onDismiss, duration]);

  const Icon = type === 'success' ? Check : type === 'error' ? AlertCircle : Info;
  const liveRole = type === 'error' ? 'alert' : 'status';

  return (
    <div
      role={liveRole}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={cn(
        'fixed z-[110] flex items-start gap-3 rounded-xl border px-4 py-3 shadow-modal',
        'bottom-20 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:max-w-sm',
        'bg-card text-card-foreground border-border',
        type === 'success' && 'border-primary/30 bg-accent text-accent-foreground',
        type === 'error' && 'border-destructive/30 bg-destructive/10 text-destructive',
        className
      )}
    >
      <Icon
        className={cn(
          'mt-0.5 h-5 w-5 shrink-0',
          type === 'success' && 'text-primary',
          type === 'error' && 'text-destructive',
          type === 'info' && 'text-muted-foreground'
        )}
      />
      <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
