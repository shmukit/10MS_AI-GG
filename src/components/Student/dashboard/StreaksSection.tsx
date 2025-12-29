import React from 'react';

interface StreaksSectionProps {
    isDarkMode: boolean;
    streaks: any[];
}

export const StreaksSection: React.FC<StreaksSectionProps> = ({
    isDarkMode,
    streaks
}) => {
    return (
        <div className={`rounded-xl p-6 shadow-professional border transition-all duration-200 hover:shadow-professional-lg ${isDarkMode
            ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
            : 'bg-white border-gray-200 hover:border-gray-300'
            }`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Week Streaks</h3>
                <div className={`flex items-center gap-4 text-xs transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-xs font-medium">Done</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full border-2 border-blue-300 shadow-sm"></div>
                        <span className="text-xs font-medium">Current</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-sm"></div>
                        <span className="text-xs font-medium">Incomplete</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                {streaks.map((streak: any) => (
                    <div key={streak.week} className="text-center">
                        <div className={`text-xs mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Week {streak.week}
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center relative ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                            <div className={`w-3 h-3 rounded-full transition-all duration-200 ${streak.status === 'done' ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm' :
                                streak.status === 'current' ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-2 border-blue-300 shadow-sm' :
                                    'bg-gradient-to-r from-red-500 to-red-600 shadow-sm'
                                }`} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
