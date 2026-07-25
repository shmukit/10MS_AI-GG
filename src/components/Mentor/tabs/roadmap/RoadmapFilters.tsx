import React from 'react';
import { nodeFilterLabel } from '../../../../utils/roadmapNodeUtils';

interface RoadmapFiltersProps {
    weekFilter: string;
    setWeekFilter: (week: string) => void;
    typeFilter: string;
    setTypeFilter: (type: string) => void;
    getWeekOptions: () => number[];
    nodeUnitLabel: string;
}

export const RoadmapFilters: React.FC<RoadmapFiltersProps> = ({
    weekFilter,
    setWeekFilter,
    typeFilter,
    setTypeFilter,
    getWeekOptions,
    nodeUnitLabel,
}) => {
    return (
        <div className="rounded-xl p-4 border border-border bg-card transition-colors duration-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Filter by {nodeUnitLabel}
                        </label>
                        <select
                            value={weekFilter}
                            onChange={(e) => setWeekFilter(e.target.value)}
                            className="px-3 py-2 border border-border rounded-lg bg-muted text-foreground transition-colors"
                        >
                            <option value="">All {nodeUnitLabel}s</option>
                            {getWeekOptions().map(week => (
                                <option key={week} value={week.toString()}>
                                    {nodeFilterLabel(nodeUnitLabel, week)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Filter by Task Type
                        </label>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-3 py-2 border border-border rounded-lg bg-muted text-foreground transition-colors"
                        >
                            <option value="">All Types</option>
                            <option value="Watch">Watch</option>
                            <option value="Read">Read</option>
                            <option value="Project">Hands-on</option>
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
                        className="px-4 py-2 rounded-lg font-medium transition-colors bg-muted hover:bg-accent text-foreground border border-border"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
};
