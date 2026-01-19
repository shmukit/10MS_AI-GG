import React from 'react';

interface RoadmapFiltersProps {
    isDarkMode: boolean;
    weekFilter: string;
    setWeekFilter: (week: string) => void;
    typeFilter: string;
    setTypeFilter: (type: string) => void;
    getWeekOptions: () => number[];
}

export const RoadmapFilters: React.FC<RoadmapFiltersProps> = ({
    isDarkMode,
    weekFilter,
    setWeekFilter,
    typeFilter,
    setTypeFilter,
    getWeekOptions
}) => {
    return (
        <div className={`rounded-xl p-4 border transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Filter by Week
                        </label>
                        <select
                            value={weekFilter}
                            onChange={(e) => setWeekFilter(e.target.value)}
                            className={`px-3 py-2 border rounded-lg transition-colors ${isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                }`}
                        >
                            <option value="">All Weeks</option>
                            {getWeekOptions().map(week => (
                                <option key={week} value={week.toString()}>Week {week}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Filter by Task Type
                        </label>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className={`px-3 py-2 border rounded-lg transition-colors ${isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                }`}
                        >
                            <option value="">All Types</option>
                            <option value="Watch">Watch</option>
                            <option value="Read">Read</option>
                            <option value="Project">Project</option>
                            <option value="Attend">Attend</option>
                            <option value="MCQ">MCQ</option>
                            <option value="Written">Written</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={() => {
                            setWeekFilter('');
                            setTypeFilter('');
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode
                            ? 'bg-white hover:bg-gray-100 !text-black border-none'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                        style={isDarkMode ? { backgroundColor: '#ffffff', color: '#000000' } : {}}
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
};
