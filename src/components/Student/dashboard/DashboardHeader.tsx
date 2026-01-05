import React from 'react';
import { RoadmapDropdown } from './RoadmapDropdown';

interface DashboardHeaderProps {
    displayName: string;
    isDarkMode: boolean;
    enrolledRoadmaps: any[];
    currentRoadmap: any;
    showRoadmapDropdown: boolean;
    setShowRoadmapDropdown: (show: boolean) => void;
    handleRoadmapChange: (id: string) => void;
    selectedRoadmapId: string;
    gamificationStats?: {
        totalXP: number;
        rank: number;
        batchId: string;
    };
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    displayName,
    isDarkMode,
    enrolledRoadmaps,
    currentRoadmap,
    showRoadmapDropdown,
    setShowRoadmapDropdown,
    handleRoadmapChange,
    selectedRoadmapId,
    gamificationStats
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">
                    {displayName.charAt(0)}
                </div>
                <div className="flex-1">
                    <h2 className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Hello, {displayName}
                    </h2>
                    <p className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        AI-Enabled Group Guidance Program
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Roadmap Selection Dropdown */}
                <RoadmapDropdown
                    isDarkMode={isDarkMode}
                    enrolledRoadmaps={enrolledRoadmaps}
                    currentRoadmap={currentRoadmap}
                    showDropdown={showRoadmapDropdown}
                    setShowDropdown={setShowRoadmapDropdown}
                    handleRoadmapChange={handleRoadmapChange}
                    selectedRoadmapId={selectedRoadmapId}
                />
            </div>
        </div>
    );
};
