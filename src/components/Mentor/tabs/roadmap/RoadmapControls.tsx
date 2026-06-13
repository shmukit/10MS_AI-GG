import React from 'react';
import { Plus, Edit2 } from 'lucide-react';

interface RoadmapControlsProps {
    roadmaps: any[];
    selectedRoadmap: string;
    setSelectedRoadmap: (id: string) => void;
    getCurrentRoadmap: () => any;
    setEditingRoadmapData: (data: any) => void;
    setIsEditingRoadmap: (isEditing: boolean) => void;
    setIsAddingRoadmap: (isAdding: boolean) => void;
    setShowAddWeekModal: (show: boolean) => void;
    setIsAddingTask: (isAdding: boolean) => void;
}

export const RoadmapControls: React.FC<RoadmapControlsProps> = ({
    roadmaps,
    selectedRoadmap,
    setSelectedRoadmap,
    getCurrentRoadmap,
    setEditingRoadmapData,
    setIsEditingRoadmap,
    setIsAddingRoadmap,
    setShowAddWeekModal,
    setIsAddingTask
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4 items-center">
                <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                        Select Roadmap
                    </label>
                    <select
                        value={selectedRoadmap}
                        onChange={(e) => setSelectedRoadmap(e.target.value)}
                        className="px-3 py-2 border border-border rounded-lg bg-muted text-foreground transition-colors"
                    >
                        {roadmaps.map((roadmap: any) => (
                            <option key={roadmap.id} value={roadmap.id}>
                                {roadmap.title} ({roadmap.total_weeks} weeks)
                            </option>
                        ))}
                    </select>
                </div>

                {/* Edit Roadmap Button */}
                {selectedRoadmap && (
                    <button
                        onClick={() => {
                            const currentRoadmap = getCurrentRoadmap();
                            if (currentRoadmap) {
                                setEditingRoadmapData(currentRoadmap);
                                setIsEditingRoadmap(true);
                            }
                        }}
                        className="bg-muted text-foreground hover:bg-muted/80 border border-border px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit Roadmap
                    </button>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => setIsAddingRoadmap(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Roadmap
                </button>
                <button
                    onClick={() => setShowAddWeekModal(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Week
                </button>
                <button
                    onClick={() => setIsAddingTask(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Task
                </button>
            </div>
        </div>
    );
};
