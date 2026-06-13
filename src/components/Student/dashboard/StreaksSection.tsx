import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface StreaksSectionProps {
    isDarkMode: boolean;
    streaks: any[];
}

type StreakStatus = 'done' | 'current' | 'incomplete';

function StreakCircle({ status }: { status: StreakStatus }) {
    return (
        <div
            className={cn(
                'mx-auto flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 md:h-10 md:w-10',
                status === 'done' && 'border-2 border-primary bg-primary text-primary-foreground shadow-sm',
                status === 'current' && 'border-[3px] border-primary bg-primary/15',
                status === 'incomplete' && 'border-2 border-dashed border-muted-foreground/60 bg-card'
            )}
            aria-label={`Week ${status}`}
        >
            {status === 'done' && <Check className="h-3.5 w-3.5 md:h-4 md:w-4" strokeWidth={3} />}
            {status === 'current' && <span className="h-2.5 w-2.5 rounded-full bg-primary md:h-3 md:w-3" />}
        </div>
    );
}

function LegendDot({ status }: { status: StreakStatus }) {
    if (status === 'done') {
        return (
            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-primary md:h-3.5 md:w-3.5">
                <Check className="h-2 w-2 text-primary-foreground" strokeWidth={3} />
            </div>
        );
    }
    if (status === 'current') {
        return (
            <div className="flex h-3 w-3 items-center justify-center rounded-full border-2 border-primary bg-primary/10 md:h-3.5 md:w-3.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </div>
        );
    }
    return <div className="h-3 w-3 rounded-full border-2 border-dashed border-muted-foreground/60 bg-card md:h-3.5 md:w-3.5" />;
}

export const StreaksSection: React.FC<StreaksSectionProps> = ({ streaks }) => {
    return (
        <div className="rounded-xl border border-border bg-card p-4 md:p-6 transition-all duration-200 hover:shadow-md">
            <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <h3 className="text-sm font-bold text-foreground md:text-base">Week Streaks</h3>
                <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground md:gap-4 md:text-xs">
                    {(['done', 'current', 'incomplete'] as StreakStatus[]).map((status) => (
                        <div key={status} className="flex items-center gap-1.5">
                            <LegendDot status={status} />
                            <span className="font-medium capitalize">{status === 'incomplete' ? 'Incomplete' : status === 'done' ? 'Done' : 'Current'}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between gap-1">
                {streaks.map((streak: { week: number; status: StreakStatus }) => (
                    <div key={streak.week} className="flex-1 text-center">
                        <div className="mb-1.5 truncate text-[10px] font-medium text-foreground md:mb-2 md:text-xs">
                            W{streak.week}
                        </div>
                        <StreakCircle status={streak.status} />
                    </div>
                ))}
            </div>
        </div>
    );
};
