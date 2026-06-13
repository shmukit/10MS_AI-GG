import React from 'react';
import { Trophy, Zap } from 'lucide-react';

interface GamificationStatsCardProps {
    stats?: {
        totalXP: number;
        rank: number;
        batchId?: string;
    };
    isDarkMode: boolean;
}

export const GamificationStatsCard: React.FC<GamificationStatsCardProps> = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-bold text-foreground">Your Progress</h3>
            </div>

            <div className="flex items-center justify-between gap-4">
                {/* Rank */}
                <div className="flex items-center gap-3 p-3 rounded-lg flex-1 bg-muted/50">
                    <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">
                            Rank
                        </p>
                        <p className="text-lg font-bold text-foreground">
                            {stats.totalXP > 0 && stats.rank > 0 ? `#${stats.rank}` : 'Unranked'}
                        </p>
                    </div>
                </div>

                {/* XP */}
                <div className="flex items-center gap-3 p-3 rounded-lg flex-1 bg-muted/50">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">
                            XP
                        </p>
                        <p className="text-lg font-bold text-foreground">
                            {stats.totalXP}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
