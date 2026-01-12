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
        <div className="rounded-xl p-4 md:p-6 transition-all duration-200 bg-[var(--accent-soft)] border-[var(--primary-accent)]/10 shadow-sm hover:shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h3 className={`text-sm md:text-base font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Week Streaks</h3>
                <div className={`flex items-center flex-wrap gap-3 md:gap-4 text-[10px] md:text-xs transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                            <svg className="w-1.5 h-1.5 md:w-2 md:h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="font-medium">Done</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[var(--primary-gradient)] rounded-full border border-[var(--primary-accent)]/30 shadow-sm"></div>
                        <span className="font-medium">Current</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-sm"></div>
                        <span className="font-medium">Incomplete</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center gap-1">
                {streaks.map((streak: any) => (
                    <div key={streak.week} className="text-center flex-1">
                        <div className={`text-[10px] md:text-xs mb-1.5 md:mb-2 transition-colors duration-200 truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            W{streak.week}
                        </div>
                        <div className={`w-7 h-7 md:w-10 md:h-10 mx-auto rounded-full flex items-center justify-center relative ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                            <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-200 ${streak.status === 'done' ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm' :
                                streak.status === 'current' ? 'bg-[var(--primary-gradient)] border border-[var(--primary-accent)]/30 shadow-sm' :
                                    'bg-gradient-to-r from-red-500 to-red-600 shadow-sm'
                                }`} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
