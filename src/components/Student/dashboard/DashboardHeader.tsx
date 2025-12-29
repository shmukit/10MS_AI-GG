import React from 'react';
import { Map, ChevronDown } from 'lucide-react';

interface DashboardHeaderProps {
    displayName: string;
    isDarkMode: boolean;
    enrolledRoadmaps: any[];
    currentRoadmap: any;
    showRoadmapDropdown: boolean;
    setShowRoadmapDropdown: (show: boolean) => void;
    handleRoadmapChange: (id: string) => void;
    selectedRoadmapId: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    displayName,
    isDarkMode,
    enrolledRoadmaps,
    currentRoadmap,
    showRoadmapDropdown,
    setShowRoadmapDropdown,
    handleRoadmapChange,
    selectedRoadmapId
}) => {
    return (
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
                <h2 className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Hello, {displayName}
                </h2>
                <p className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>AI-Enabled Group Guidance Program</p>
            </div>

            {/* Roadmap Selection Dropdown */}
            {enrolledRoadmaps && enrolledRoadmaps.length > 1 && (
                <div className="relative roadmap-dropdown-container">
                    <button
                        onClick={() => setShowRoadmapDropdown(!showRoadmapDropdown)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md ${isDarkMode
                            ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                            }`}
                    >
                        <Map className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {currentRoadmap?.title || 'Select Roadmap'}
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showRoadmapDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Roadmap Dropdown */}
                    {showRoadmapDropdown && (
                        <div className={`absolute top-full right-0 mt-2 rounded-lg shadow-lg z-10 border min-w-48 transition-colors duration-200 ${isDarkMode
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-white border-gray-200'
                            }`}>
                            <div className="py-2">
                                {enrolledRoadmaps.map((roadmap: any) => (
                                    <button
                                        key={roadmap.id}
                                        onClick={() => handleRoadmapChange(roadmap.id)}
                                        className={`w-full text-left px-4 py-2 text-sm transition-all duration-200 ${isDarkMode
                                            ? 'hover:bg-gray-700 text-gray-300 hover:text-white hover:bg-opacity-80'
                                            : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900 hover:bg-opacity-80'
                                            } ${selectedRoadmapId === roadmap.id ? 'bg-blue-50 text-blue-700' : ''}`}
                                    >
                                        {roadmap.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
