import React from 'react';
import { Trophy } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  completed: number;
  total: number;
  variant?: 'full' | 'compact';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  completed,
  total,
  variant = 'full',
  className,
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2 sm:gap-3', className)}>
        <span className="shrink-0 text-xs font-medium text-muted-foreground whitespace-nowrap">
          {completed}/{total} · {percentage}%
        </span>
        <div
          className="progress-track h-1.5 flex-1 min-w-[72px] max-w-[140px] rounded-full sm:max-w-[160px]"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${completed} of ${total} sessions complete`}
        >
          <div
            className="progress-fill h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'border-b border-border bg-card p-3 md:p-4 transition-colors duration-200',
        className
      )}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-1.5 md:mb-2">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Trophy className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <h2 className="text-sm md:text-lg font-semibold text-foreground">Your Progress</h2>
          </div>
          <div className="text-[10px] md:text-sm font-medium text-muted-foreground">
            {completed}/{total} ({percentage}%)
          </div>
        </div>

        <div className="progress-track w-full rounded-full h-2 md:h-3">
          <div
            className="progress-fill h-2 md:h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {percentage === 100 && (
          <div className="mt-2 text-center text-sm text-primary font-medium">
            Congratulations! You&apos;ve completed this roadmap!
          </div>
        )}
      </div>
    </div>
  );
};
