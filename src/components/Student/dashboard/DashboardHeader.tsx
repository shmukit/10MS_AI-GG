import React from 'react';
import { RoadmapDropdown } from './RoadmapDropdown';

interface DashboardHeaderProps {
    displayName: string;
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
    enrolledBatches,
    currentBatch,
    showRoadmapDropdown,
    setShowRoadmapDropdown,
    handleBatchChange,
    selectedBatchId,
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="hidden md:flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-full flex items-center justify-center text-lg md:text-xl font-bold text-muted-foreground">
                    {displayName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold transition-colors duration-200 truncate text-foreground">
                        Hello, {displayName}
                    </h2>
                    <p className="text-xs md:text-sm transition-colors duration-200 truncate text-muted-foreground">
                        AI-Enabled Group Guidance Program
                    </p>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
                <RoadmapDropdown
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
