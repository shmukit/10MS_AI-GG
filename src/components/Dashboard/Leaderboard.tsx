import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import { getLeaderboard, LeaderboardEntry } from '../../services/db/gamificationService';

interface LeaderboardProps {
    batchId: string;
    isDarkMode: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ batchId, isDarkMode }) => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeframe] = useState<'weekly' | 'all-time'>('all-time'); // For future use, currently service only supports all-time effectively

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
            case 2: return <Medal className="w-5 h-5 text-gray-400 fill-gray-400" />;
            case 3: return <Medal className="w-5 h-5 text-amber-700 fill-amber-700" />;
            default: return <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>#{rank}</span>;
        }
    };

    if (loading) {
        return (
            <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-4">
                    <Trophy className={`w-5 h-5 ${isDarkMode ? 'text-yellow-500' : 'text-yellow-600'}`} />
                    <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Leaderboard</h3>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-gray-700/20"></div>
                            <div className="flex-1 h-4 rounded bg-gray-700/20"></div>
                            <div className="w-12 h-4 rounded bg-gray-700/20"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (entries.length === 0) {
        return null; // Don't show if empty
    }

    return (
        <div className="rounded-xl p-6 transition-all duration-200 bg-[var(--accent-soft)] shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Trophy className={`w-5 h-5 ${isDarkMode ? 'text-yellow-500' : 'text-yellow-600'}`} />
                    <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Leaderboard</h3>
                </div>
                {/* Timeframe toggle could go here */}
            </div>

            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                {entries.map((entry) => (
                    <div
                        key={entry.studentId}
                        className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-800/40' : 'bg-white/40'
                            }`}
                    >
                        <div className="w-8 flex justify-center">
                            {getRankIcon(entry.rank)}
                        </div>

                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                            {entry.profilePicture ? (
                                <img src={entry.profilePicture} alt={entry.studentName} className="w-full h-full object-cover" />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center text-xs font-bold ${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                                    {entry.studentName.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {entry.studentName}
                            </p>
                            {/* Progress Bar */}
                            <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                                <div
                                    className="h-full bg-[var(--primary-accent)] rounded-full"
                                    style={{ width: `${entry.progress || 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {entry.xpPoints} XP
                            </div>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {Math.round(entry.progress || 0)}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
