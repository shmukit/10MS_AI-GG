import React from 'react';
import { Trophy } from 'lucide-react';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="sticky top-0 z-30 border-b border-border bg-card p-3 md:p-4 transition-colors duration-200">
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
