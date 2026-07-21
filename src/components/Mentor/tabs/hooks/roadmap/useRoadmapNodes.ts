import { useState, useEffect, useCallback } from 'react';
import type { EditNodeFormData } from '../../roadmap/EditNodeModal';
import type { RoadmapNodeSummary } from '../../roadmap/NodesPanel';
import {
    fetchRoadmapNodesFromDb,
    insertRoadmapWeek,
    updateRoadmapTotalWeeks,
    updateRoadmapWeekInDb,
} from './roadmapWeekApi';

interface UseRoadmapNodesParams {
    selectedRoadmap: string;
    roadmaps: any[];
    setRoadmaps: React.Dispatch<React.SetStateAction<any[]>>;
    getCurrentRoadmap: () => any;
    getNodeLabel: () => string;
}

export function useRoadmapNodes({
    selectedRoadmap,
    roadmaps,
    setRoadmaps,
    getCurrentRoadmap,
    getNodeLabel,
}: UseRoadmapNodesParams) {
    const [showAddWeekModal, setShowAddWeekModal] = useState(false);
    const [editingNode, setEditingNode] = useState<string | null>(null);
    const [editingNodeData, setEditingNodeData] = useState<EditNodeFormData | null>(null);
    const [roadmapNodes, setRoadmapNodes] = useState<RoadmapNodeSummary[]>([]);

    const refreshRoadmapNodes = useCallback(async () => {
        const { data, error } = await fetchRoadmapNodesFromDb(selectedRoadmap);

        if (error) {
            console.error('Error fetching roadmap nodes:', error);
            setRoadmapNodes([]);
            return;
        }

        setRoadmapNodes(data);
    }, [selectedRoadmap]);

    useEffect(() => {
        refreshRoadmapNodes();
    }, [refreshRoadmapNodes]);

    const handleAddWeek = async () => {
        const currentRoadmap = getCurrentRoadmap();
        if (!currentRoadmap) return;

        try {
            const nextWeekNumber = (currentRoadmap.total_weeks || 0) + 1;
            const unitLabel = getNodeLabel();

            const { error: weekError } = await insertRoadmapWeek({
                roadmapId: selectedRoadmap,
                weekNumber: nextWeekNumber,
                unitLabel,
            });

            if (weekError) throw weekError;

            const { error: roadmapError } = await updateRoadmapTotalWeeks(
                currentRoadmap.id,
                nextWeekNumber
            );

            if (roadmapError) throw roadmapError;

            const updatedRoadmap = { ...currentRoadmap, total_weeks: nextWeekNumber };
            setRoadmaps(roadmaps.map(r => r.id === currentRoadmap.id ? updatedRoadmap : r));
            setShowAddWeekModal(false);
            await refreshRoadmapNodes();
            alert(`${unitLabel} ${nextWeekNumber} added successfully!`);
        } catch (error) {
            console.error('Error adding node:', error);
            alert(`Failed to add ${getNodeLabel()}`);
        }
    };

    const handleEditNodeOpen = (node: RoadmapNodeSummary) => {
        setEditingNode(node.id);
        setEditingNodeData({
            id: node.id,
            week_number: node.week_number,
            title: node.title,
            description: node.description || '',
            domain: node.domain,
        });
    };

    const handleUpdateNode = async () => {
        if (!editingNode || !editingNodeData) return;

        try {
            const { error } = await updateRoadmapWeekInDb(editingNode, {
                title: editingNodeData.title,
                description: editingNodeData.description,
                domain: editingNodeData.domain,
            });

            if (error) throw error;

            await refreshRoadmapNodes();
            setEditingNode(null);
            setEditingNodeData(null);
            alert(`${getNodeLabel()} updated successfully!`);
        } catch (error) {
            console.error('Error updating node:', error);
            alert(`Failed to update ${getNodeLabel()}`);
        }
    };

    return {
        showAddWeekModal,
        setShowAddWeekModal,
        editingNode,
        setEditingNode,
        editingNodeData,
        setEditingNodeData,
        roadmapNodes,
        handleAddWeek,
        handleEditNodeOpen,
        handleUpdateNode,
        refreshRoadmapNodes,
    };
}
