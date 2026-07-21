import React, { useState } from 'react';
import { Plus, Edit2, Copy } from 'lucide-react';
import { getNodeUnitLabel } from '../../../../utils/roadmapNodeUtils';
import { DuplicateRoadmapModal } from './DuplicateRoadmapModal';
import { Button } from '../../../ui/Button';

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
    nodeUnitLabel: string;
    onDuplicateRoadmap?: (sourceId: string, title: string) => Promise<void>;
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
    setIsAddingTask,
    nodeUnitLabel,
    onDuplicateRoadmap,
}) => {
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const currentRoadmap = getCurrentRoadmap();

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center flex-wrap">
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
                                    {roadmap.title} ({roadmap.total_weeks} {getNodeUnitLabel(roadmap).toLowerCase()}s)
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedRoadmap && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-6"
                                onClick={() => {
                                    if (currentRoadmap) {
                                        setEditingRoadmapData({
                                            ...currentRoadmap,
                                            node_unit_label: currentRoadmap.node_unit_label || 'Week',
                                            slides_url: currentRoadmap.slides_url || '',
                                            decision_tree_enabled: currentRoadmap.decision_tree_enabled === true,
                                        });
                                        setIsEditingRoadmap(true);
                                    }
                                }}
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Roadmap
                            </Button>
                            {onDuplicateRoadmap && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-6"
                                    onClick={() => setShowDuplicateModal(true)}
                                >
                                    <Copy className="w-4 h-4" />
                                    Duplicate
                                </Button>
                            )}
                        </>
                    )}
                </div>

                <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={() => setIsAddingRoadmap(true)}>
                        <Plus className="w-4 h-4" />
                        Add Roadmap
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowAddWeekModal(true)}>
                        <Plus className="w-4 h-4" />
                        Add {nodeUnitLabel}
                    </Button>
                    <Button size="sm" onClick={() => setIsAddingTask(true)}>
                        <Plus className="w-4 h-4" />
                        Add Task
                    </Button>
                </div>
            </div>

            {onDuplicateRoadmap && currentRoadmap && (
                <DuplicateRoadmapModal
                    isOpen={showDuplicateModal}
                    onClose={() => setShowDuplicateModal(false)}
                    defaultTitle={`Copy of ${currentRoadmap.title}`}
                    onSubmit={(title) => onDuplicateRoadmap(selectedRoadmap, title)}
                />
            )}
        </>
    );
};
