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

export const GamificationStatsCard: React.FC<GamificationStatsCardProps> = ({ stats, isDarkMode }) => {
    if (!stats) return null;

    return (
        <div className={`rounded-xl p-6 border shadow-sm transition-all duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
            <div className="flex items-center gap-2 mb-4">
                <Trophy className={`w-5 h-5 ${isDarkMode ? 'text-yellow-500' : 'text-yellow-600'}`} />
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Progress</h3>
            </div>

            <div className="flex items-center justify-between gap-4">
                {/* Rank */}
                <div className={`flex items-center gap-3 p-3 rounded-lg flex-1 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}>
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-600'
                        }`}>
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Rank
                        </p>
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {stats.totalXP > 0 && stats.rank > 0 ? `#${stats.rank}` : 'Unranked'}
                        </p>
                    </div>
                </div>

                {/* XP */}
                <div className={`flex items-center gap-3 p-3 rounded-lg flex-1 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}>
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
                        }`}>
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            XP
                        </p>
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {stats.totalXP}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
