import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import { getLeaderboard, LeaderboardEntry } from '../../services/db/gamificationService';

interface LeaderboardProps {
    batchId: string;
    isDarkMode: boolean;
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

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />;
            case 2: return <Medal className="w-5 h-5 text-muted-foreground fill-muted-foreground" />;
            case 3: return <Medal className="w-5 h-5 text-muted-foreground fill-muted-foreground" />;
            default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
        }
    };

    if (loading) {
        return (
            <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-bold text-foreground">Leaderboard</h3>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-muted"></div>
                            <div className="flex-1 h-4 rounded bg-muted"></div>
                            <div className="w-12 h-4 rounded bg-muted"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (entries.length === 0) {
        return null;
    }

    return (
        <div className="rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-bold text-foreground">Leaderboard</h3>
                </div>
            </div>

            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                {entries.map((entry) => (
                    <div
                        key={entry.studentId}
                        className="flex items-center gap-4 p-3 rounded-lg transition-colors bg-muted/50"
                    >
                        <div className="w-8 flex justify-center">
                            {getRankIcon(entry.rank)}
                        </div>

                        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            {entry.profilePicture ? (
                                <img src={entry.profilePicture} alt={entry.studentName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-muted text-muted-foreground">
                                    {entry.studentName.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-foreground">
                                {entry.studentName}
                            </p>
                            <div className="progress-track mt-1.5 h-1.5 w-full overflow-hidden rounded-full">
                                <div
                                    className="progress-fill h-full rounded-full"
                                    style={{ width: `${entry.progress || 0}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <div className="text-sm font-semibold text-foreground">
                                {entry.xpPoints} XP
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {Math.round(entry.progress || 0)}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
