import { useState } from 'react';
import { RoadmapItem } from '../../../../../types/mentor';
import { supabase } from '../../../../../lib/supabase';
import { deleteRoadmapFromDb, insertRoadmap, updateRoadmapInDb } from './roadmapApi';
import { duplicateRoadmap } from './roadmapDuplicateApi';
import { DEFAULT_NEW_ROADMAP, type NewRoadmapForm } from './types';
import { useToast } from '../../../../ui/ToastProvider';

interface UseRoadmapManagementParams {
    roadmaps: any[];
    setRoadmaps: React.Dispatch<React.SetStateAction<any[]>>;
    selectedRoadmap: string;
    setSelectedRoadmap: (id: string) => void;
    setRoadmapData: React.Dispatch<React.SetStateAction<RoadmapItem[]>>;
}

export function useRoadmapManagement({
    roadmaps,
    setRoadmaps,
    selectedRoadmap,
    setSelectedRoadmap,
    setRoadmapData,
}: UseRoadmapManagementParams) {
    const { error: toastError } = useToast();
    const [isAddingRoadmap, setIsAddingRoadmap] = useState(false);
    const [isEditingRoadmap, setIsEditingRoadmap] = useState(false);
    const [editingRoadmapData, setEditingRoadmapData] = useState<any>(null);
    const [newRoadmap, setNewRoadmap] = useState<NewRoadmapForm>(DEFAULT_NEW_ROADMAP);

    const handleAddRoadmap = async () => {
        try {
            const { data, error } = await insertRoadmap(newRoadmap);

            if (error) throw error;

            if (data) {
                setRoadmaps([...roadmaps, data]);
                setIsAddingRoadmap(false);
                setNewRoadmap(DEFAULT_NEW_ROADMAP);
                setSelectedRoadmap(data.id);
            }
        } catch (error) {
            console.error('Error adding roadmap:', error);
            toastError('Failed to add roadmap');
        }
    };

    const handleUpdateRoadmap = async () => {
        if (!editingRoadmapData) return;

        try {
            const { data, error } = await updateRoadmapInDb(editingRoadmapData);

            if (error) throw error;

            setRoadmaps(roadmaps.map(r => r.id === editingRoadmapData.id ? data : r));
            setIsEditingRoadmap(false);
            setEditingRoadmapData(null);
        } catch (error) {
            console.error('Error updating roadmap:', error);
            toastError('Failed to update roadmap');
        }
    };

    const handleDeleteRoadmap = async () => {
        if (!selectedRoadmap || !window.confirm('Are you sure you want to delete this roadmap? This action cannot be undone.')) {
            return;
        }

        try {
            const { error } = await deleteRoadmapFromDb(selectedRoadmap);

            if (error) throw error;

            const updatedRoadmaps = roadmaps.filter(r => r.id !== selectedRoadmap);
            setRoadmaps(updatedRoadmaps);

            if (updatedRoadmaps.length > 0) {
                setSelectedRoadmap(updatedRoadmaps[0].id);
            } else {
                setSelectedRoadmap('');
                setRoadmapData([]);
            }
        } catch (error) {
            console.error('Error deleting roadmap:', error);
            toastError('Failed to delete roadmap');
        }
    };

    const handleDuplicateRoadmap = async (sourceRoadmapId: string, newTitle?: string) => {
        try {
            const result = await duplicateRoadmap(sourceRoadmapId, newTitle);
            if (!result) {
                toastError('Failed to duplicate roadmap');
                return;
            }

            const { data, error } = await supabase
                .from('roadmaps')
                .select('*')
                .eq('id', result.id)
                .single();

            if (error || !data) throw error;

            setRoadmaps([...roadmaps, data]);
            setSelectedRoadmap(result.id);
            setRoadmapData([]);
        } catch (error) {
            console.error('Error duplicating roadmap:', error);
            toastError('Failed to duplicate roadmap');
        }
    };

    return {
        isAddingRoadmap,
        setIsAddingRoadmap,
        isEditingRoadmap,
        setIsEditingRoadmap,
        editingRoadmapData,
        setEditingRoadmapData,
        newRoadmap,
        setNewRoadmap,
        handleAddRoadmap,
        handleUpdateRoadmap,
        handleDeleteRoadmap,
        handleDuplicateRoadmap,
    };
}
