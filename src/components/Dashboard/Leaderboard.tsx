import React, { useState, useEffect } from 'react';
import { BarChart3, Crown } from 'lucide-react';
import { getLeaderboard, LeaderboardEntry } from '../../services/db/gamificationService';
import { EmptyState } from '../ui/EmptyState';

interface LeaderboardProps {
    batchId: string;
    isDarkMode?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ batchId }) => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeframe] = useState<'weekly' | 'all-time'>('all-time');

    useEffect(() => {
        loadLeaderboard();
    }, [batchId, timeframe]);

    const loadLeaderboard = async () => {
        if (!batchId) return;
        setLoading(true);
        const data = await getLeaderboard(batchId, timeframe);
        setEntries(data);
        setLoading(false);
    };

    const getRankDisplay = (rank: number) => {
        if (rank === 1) {
            return (
                <span className="flex items-center gap-1 text-primary font-bold text-caption">
                    <Crown className="w-4 h-4 fill-primary" aria-hidden />
                    1
                </span>
            );
        }
        return (
            <span className="text-caption font-bold text-muted-foreground w-8 text-center">
                #{rank}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-muted-foreground" aria-hidden />
                    <h3 className="font-display text-h3 text-foreground">Leaderboard</h3>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-muted" />
                            <div className="flex-1 h-4 rounded bg-muted" />
                            <div className="w-12 h-4 rounded bg-muted" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-muted-foreground" aria-hidden />
                    <h3 className="font-display text-h3 text-foreground">Leaderboard</h3>
                </div>
                <EmptyState
                    title="No rankings yet"
                    description="Complete tasks to earn XP and join the leaderboard."
                    className="border-none bg-transparent py-8"
                />
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-muted-foreground" aria-hidden />
                    <h3 className="font-display text-h3 text-foreground">Leaderboard</h3>
                </div>
            </div>

            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                {entries.map((entry) => (
                    <div
                        key={entry.studentId}
                        className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                    >
                        <div className="w-8 flex justify-center shrink-0">
                            {getRankDisplay(entry.rank)}
                        </div>

                        <div className="w-8 h-8 rounded-full overflow-hidden bg-accent flex-shrink-0">
                            {entry.profilePicture ? (
                                <img src={entry.profilePicture} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-caption font-bold text-primary">
                                    {entry.studentName.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-body font-medium truncate text-foreground">
                                {entry.studentName}
                            </p>
                            <p className="text-caption text-muted-foreground mt-0.5">Roadmap progress</p>
                            <div className="progress-track mt-1 h-1.5 w-full overflow-hidden rounded-full">
                                <div
                                    className="progress-fill h-full rounded-full"
                                    style={{ width: `${entry.progress || 0}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                            <div className="text-body font-semibold text-foreground">
                                {entry.xpPoints} XP
                            </div>
                            <div className="text-caption text-muted-foreground">
                                {Math.round(entry.progress || 0)}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
