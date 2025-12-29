import React from 'react';
import { Plus, Edit2 } from 'lucide-react';

interface RoadmapControlsProps {
    isDarkMode: boolean;
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
    isDarkMode,
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
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                        Select Roadmap
                    </label>
                    <select
                        value={selectedRoadmap}
                        onChange={(e) => setSelectedRoadmap(e.target.value)}
                        className={`px-3 py-2 border rounded-lg transition-colors ${isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                            }`}
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
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit Roadmap
                    </button>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => setIsAddingRoadmap(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Roadmap
                </button>
                <button
                    onClick={() => setShowAddWeekModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Week
                </button>
                <button
                    onClick={() => setIsAddingTask(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Task
                </button>
            </div>
        </div>
    );
};
