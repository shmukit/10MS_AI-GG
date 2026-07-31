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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0 overflow-visible">
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-muted rounded-full flex items-center justify-center text-sm md:text-xl font-bold text-muted-foreground shrink-0">
                    {displayName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                    <h2
                        className="text-base md:text-2xl font-bold transition-colors duration-200 truncate text-foreground"
                        title={`Hello, ${displayName}`}
                    >
                        Hello, {displayName}
                    </h2>
                    <p className="text-xs md:text-sm transition-colors duration-200 truncate text-muted-foreground">
                        AI-Enabled Group Guidance Program
                    </p>
                </div>
            </div>

            {/* Cohort/batch switcher — must not be squeezed by long names */}
            <div className="flex items-center gap-3 w-full md:w-auto md:max-w-xs shrink-0 overflow-visible">
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
