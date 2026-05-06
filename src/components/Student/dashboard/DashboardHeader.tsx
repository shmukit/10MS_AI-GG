import React from 'react';
import { RoadmapDropdown } from './RoadmapDropdown';

interface DashboardHeaderProps {
    displayName: string;
    isDarkMode: boolean;
    enrolledBatches: any[];
    currentBatch: any;
    showRoadmapDropdown: boolean;
    setShowRoadmapDropdown: (show: boolean) => void;
    handleBatchChange: (id: string) => void;
    selectedBatchId: string;
    gamificationStats?: {
        totalXP: number;
        rank: number;
        batchId: string;
    };
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    displayName,
    isDarkMode,
    enrolledBatches,
    currentBatch,
    showRoadmapDropdown,
    setShowRoadmapDropdown,
    handleBatchChange,
    selectedBatchId,
    gamificationStats
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="hidden md:flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-300 rounded-full flex items-center justify-center text-lg md:text-xl font-bold text-gray-600">
                    {displayName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className={`text-xl md:text-2xl font-bold transition-colors duration-200 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Hello, {displayName}
                    </h2>
                    <p className={`text-xs md:text-sm transition-colors duration-200 truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        AI-Enabled Group Guidance Program
                    </p>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
                {/* Roadmap Selection Dropdown */}
                <RoadmapDropdown
                    isDarkMode={isDarkMode}
                    enrolledBatches={enrolledBatches}
                    currentBatch={currentBatch}
                    showDropdown={showRoadmapDropdown}
                    setShowDropdown={setShowRoadmapDropdown}
                    handleBatchChange={handleBatchChange}
                    selectedBatchId={selectedBatchId}
                />
            </div>
        </div>
    );
};
