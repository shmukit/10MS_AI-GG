import { useState } from 'react';
import { RoadmapItem } from '../../../../../types/mentor';
import { findOrCreateWeek } from './roadmapWeekApi';
import {
    deleteRoadmapTaskFromDb,
    insertRoadmapTask,
    mapDbTaskToRoadmapItem,
    updateRoadmapTaskInDb,
    upsertBatchTaskDeadline,
} from './roadmapTaskApi';
import { DEFAULT_NEW_TASK, type NewTaskForm } from './types';
import { useToast } from '../../../../ui/ToastProvider';

interface UseRoadmapTasksParams {
    selectedRoadmap: string;
    selectedBatch?: string;
    roadmapData: RoadmapItem[];
    setRoadmapData: React.Dispatch<React.SetStateAction<RoadmapItem[]>>;
    getNodeLabel: () => string;
    refreshRoadmapNodes: () => Promise<void>;
}

export function useRoadmapTasks({
    selectedRoadmap,
    selectedBatch,
    roadmapData,
    setRoadmapData,
    getNodeLabel,
    refreshRoadmapNodes,
}: UseRoadmapTasksParams) {
    const { success, error: toastError } = useToast();
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [editingTask, setEditingTask] = useState<string | null>(null);
    const [editingTaskData, setEditingTaskData] = useState<any>(null);
    const [newTask, setNewTask] = useState<NewTaskForm>(DEFAULT_NEW_TASK);

    const handleAddTask = async () => {
        try {
            if (!selectedRoadmap) {
                toastError('Please select a roadmap first');
                return;
            }

            const unitLabel = getNodeLabel();
            const { weekId, created, error: weekError } = await findOrCreateWeek({
                roadmapId: selectedRoadmap,
                weekNumber: newTask.weekNumber,
                unitLabel,
                domain: newTask.domain || 'General',
            });

            if (weekError || !weekId) {
                console.error('Error creating node:', weekError);
                toastError(`Failed to create ${unitLabel} ${newTask.weekNumber}. Please try again.`);
                return;
            }

            if (created) {
                await refreshRoadmapNodes();
            }

            const { data, error } = await insertRoadmapTask(weekId, newTask);

            if (error) throw error;

            if (data) {
                const newItem = mapDbTaskToRoadmapItem(
                    data,
                    newTask.weekNumber,
                    newTask.domain || 'General'
                );

                setRoadmapData([...roadmapData, newItem]);
                setIsAddingTask(false);
                setNewTask(DEFAULT_NEW_TASK);
            }
        } catch (error) {
            console.error('Error adding task:', error);
            toastError('Failed to add task');
        }
    };

    const handleUpdateTask = async () => {
        if (!editingTask || !editingTaskData) return;

        try {
            const unitLabel = getNodeLabel();
            const { weekId, created, error: weekError } = await findOrCreateWeek({
                roadmapId: selectedRoadmap,
                weekNumber: editingTaskData.weekNumber,
                unitLabel,
                domain: editingTaskData.domain || 'General',
            });

            if (weekError || !weekId) {
                console.error('Error creating node:', weekError);
                toastError(`Failed to create ${unitLabel} ${editingTaskData.weekNumber}. Please try again.`);
                return;
            }

            if (created) {
                await refreshRoadmapNodes();
            }

            if (selectedBatch) {
                console.log(`Saving batch-specific deadline for batch ${selectedBatch} and task ${editingTask}`);
                const { error: batchDeadlineError } = await upsertBatchTaskDeadline(
                    selectedBatch,
                    editingTask,
                    editingTaskData.deadline || null
                );

                if (batchDeadlineError) {
                    console.error('Error saving batch-specific deadline:', batchDeadlineError);
                }
            }

            const { error } = await updateRoadmapTaskInDb(editingTask, weekId, editingTaskData);

            if (error) throw error;

            setRoadmapData(roadmapData.map(task =>
                task.id === editingTask ? { ...task, ...editingTaskData } : task
            ));

            setEditingTask(null);
            setEditingTaskData(null);
            success('Task updated successfully!');
        } catch (error) {
            console.error('Error updating task:', error);
            toastError('Failed to update task');
        }
    };

    const handleDeleteTask = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            const { error } = await deleteRoadmapTaskFromDb(id);

            if (error) throw error;

            setRoadmapData(roadmapData.filter(task => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
            toastError('Failed to delete task');
        }
    };

    return {
        isAddingTask,
        setIsAddingTask,
        editingTask,
        setEditingTask,
        editingTaskData,
        setEditingTaskData,
        newTask,
        setNewTask,
        handleAddTask,
        handleUpdateTask,
        handleDeleteTask,
    };
}
