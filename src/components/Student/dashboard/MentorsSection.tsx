import React from 'react';

interface MentorsSectionProps {
    isDarkMode: boolean;
}

export const MentorsSection: React.FC<MentorsSectionProps> = ({
    isDarkMode
}) => {
    return (
        <div className={`rounded-xl p-6 shadow-professional border transition-all duration-200 hover:shadow-professional-lg ${isDarkMode
            ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
            : 'bg-white border-gray-200 hover:border-gray-300'
            }`}>
            <h3 className={`font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mentors</h3>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div>
                            <div className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Uttam Deb</div>
                            <div className={`text-xs transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Senior BI Executive, 10 Minute School</div>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <span className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100'
                            }`}>Python</span>
                        <span className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100'
                            }`}>SQL</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
