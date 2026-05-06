import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';

import { RoadmapItem } from '../../../../types/mentor';

interface UseRoadmapTabProps {
    roadmaps: any[];
    setRoadmaps: React.Dispatch<React.SetStateAction<any[]>>;
    roadmapData: RoadmapItem[];
    setRoadmapData: React.Dispatch<React.SetStateAction<RoadmapItem[]>>;
    selectedRoadmap: string;
    setSelectedRoadmap: (id: string) => void;
    selectedBatch?: string;
}

export const useRoadmapTab = ({
    roadmaps,
    setRoadmaps,
    roadmapData,
    setRoadmapData,
    selectedRoadmap,
    setSelectedRoadmap,
    selectedBatch
}: UseRoadmapTabProps) => {
    const [weekFilter, setWeekFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [isAddingRoadmap, setIsAddingRoadmap] = useState(false);
    const [isEditingRoadmap, setIsEditingRoadmap] = useState(false);
    const [showAddWeekModal, setShowAddWeekModal] = useState(false);
    const [editingTask, setEditingTask] = useState<string | null>(null);
    const [editingTaskData, setEditingTaskData] = useState<any>(null);
    const [editingRoadmapData, setEditingRoadmapData] = useState<any>(null);

    const [newTask, setNewTask] = useState<Omit<RoadmapItem, 'id'> & { meetingTime?: string }>({
        weekNumber: 1,
        domain: '',
        taskType: 'Watch',
        taskName: '',
        taskDetails: '',
        relevantLinks: '',
        deadline: '',
        meetingTime: ''
    });

    const [newRoadmap, setNewRoadmap] = useState({
        title: '',
        description: '',
        total_weeks: 8,
        difficulty_level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
        prerequisites: '',
        category: ''
    });

    const getCurrentRoadmap = () => {
        return roadmaps.find(r => r.id === selectedRoadmap) || roadmaps[0];
    };

    const getWeekOptions = () => {
        const current = getCurrentRoadmap();
        return current && current.total_weeks ? Array.from({ length: current.total_weeks }, (_, i) => i + 1) : [];
    };

    const getFilteredTasks = () => {
        return roadmapData.filter(task => {
            const matchesWeek = weekFilter ? task.weekNumber.toString() === weekFilter : true;
            const matchesType = typeFilter ? task.taskType === typeFilter : true;
            return matchesWeek && matchesType;
        });
    };

    const handleAddTask = async () => {
        try {
            if (!selectedRoadmap) {
                alert('Please select a roadmap first');
                return;
            }

            const { data: weekData, error: weekError } = await supabase
                .from('roadmap_weeks')
                .select('id, domain')
                .eq('roadmap_id', selectedRoadmap)
                .eq('week_number', newTask.weekNumber)
                .single() as { data: any; error: any };

            let weekId = weekData?.id;

            if (weekError || !weekData) {
                console.log(`Week ${newTask.weekNumber} not found, creating it automatically...`);
                // Create the week if it doesn't exist
                const { data: newWeek, error: createWeekError } = await supabase
                    .from('roadmap_weeks')
                    .insert([{
                        roadmap_id: selectedRoadmap,
                        week_number: newTask.weekNumber,
                        title: `Week ${newTask.weekNumber}`,
                        description: `Week ${newTask.weekNumber} Content`,
                        domain: newTask.domain || 'General'
                    }] as unknown as never)
                    .select('id')
                    .single() as { data: any; error: any };

                if (createWeekError) {
                    console.error('Error creating week:', createWeekError);
                    alert(`Failed to create Week ${newTask.weekNumber}. Please try again.`);
                    return;
                }
                weekId = newWeek.id;
            }

            const { data, error } = await (supabase.from('roadmap_tasks') as any)
                .insert([{
                    week_id: weekId,
                    task_name: newTask.taskName,
                    task_details: newTask.taskDetails,
                    task_type: newTask.taskType.toLowerCase(),
                    relevant_links: newTask.relevantLinks ? [newTask.relevantLinks] : [],
                    deadline: newTask.deadline || null,
                    meeting_time: newTask.meetingTime || null,
                    is_active: true,
                    domain: newTask.domain || 'General'
                }])
                .select()
                .single();

            if (error) throw error;

            if (data) {
                const newItem: RoadmapItem = {
                    id: data.id,
                    weekNumber: newTask.weekNumber,
                    domain: newTask.domain || 'General',
                    taskType: data.task_type,
                    taskName: data.task_name,
                    taskDetails: data.task_details,
                    relevantLinks: data.relevant_links?.[0] || '',
                    deadline: data.deadline,
                    meetingTime: data.meeting_time
                };

                setRoadmapData([...roadmapData, newItem]);
                setIsAddingTask(false);
                setNewTask({
                    weekNumber: 1,
                    domain: '',
                    taskType: 'Watch',
                    taskName: '',
                    taskDetails: '',
                    relevantLinks: '',
                    deadline: '',
                    meetingTime: ''
                });
            }
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Failed to add task');
        }
    };

    const handleUpdateTask = async () => {
        if (!editingTask || !editingTaskData) return;

        try {
            // First, get the correct week_id for the selected week number
            const { data: weekData, error: weekError } = await supabase
                .from('roadmap_weeks')
                .select('id, domain')
                .eq('roadmap_id', selectedRoadmap)
                .eq('week_number', editingTaskData.weekNumber)
                .single() as { data: any; error: any };

            let weekId = weekData?.id;

            // If the week doesn't exist, create it
            if (weekError || !weekData) {
                console.log(`Week ${editingTaskData.weekNumber} not found, creating it automatically...`);
                const { data: newWeek, error: createWeekError } = await supabase
                    .from('roadmap_weeks')
                    .insert([{
                        roadmap_id: selectedRoadmap,
                        week_number: editingTaskData.weekNumber,
                        title: `Week ${editingTaskData.weekNumber}`,
                        description: `Week ${editingTaskData.weekNumber} Content`,
                        domain: editingTaskData.domain || 'General'
                    }] as unknown as never)
                    .select('id')
                    .single() as { data: any; error: any };

                if (createWeekError) {
                    console.error('Error creating week:', createWeekError);
                    alert(`Failed to create Week ${editingTaskData.weekNumber}. Please try again.`);
                    return;
                }
                weekId = newWeek.id;
            }

            // Handle batch-specific deadline if a batch is selected
            if (selectedBatch) {
                console.log(`Saving batch-specific deadline for batch ${selectedBatch} and task ${editingTask}`);
                const { error: batchDeadlineError } = await (supabase
                    .from('batch_task_deadlines') as any)
                    .upsert({
                        batch_id: selectedBatch,
                        task_id: editingTask,
                        deadline: editingTaskData.deadline || null
                    }, {
                        onConflict: 'batch_id,task_id'
                    });

                if (batchDeadlineError) {
                    console.error('Error saving batch-specific deadline:', batchDeadlineError);
                }
            }

            // Now update the task with the correct week_id
            const { error } = await (supabase.from('roadmap_tasks') as any)
                .update({
                    week_id: weekId,
                    task_name: editingTaskData.taskName,
                    task_details: editingTaskData.taskDetails,
                    task_type: editingTaskData.taskType.toLowerCase(),
                    relevant_links: editingTaskData.relevantLinks ? [editingTaskData.relevantLinks] : [],
                    deadline: editingTaskData.deadline || null,
                    meeting_time: editingTaskData.meetingTime || null,
                    domain: editingTaskData.domain
                })
                .eq('id', editingTask)
                .select()
                .single();

            if (error) throw error;

            setRoadmapData(roadmapData.map(task =>
                task.id === editingTask ? { ...task, ...editingTaskData } : task
            ));

            setEditingTask(null);
            setEditingTaskData(null);
            alert('Task updated successfully!');
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task');
        }
    };

    const handleDeleteTask = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            const { error } = await supabase
                .from('roadmap_tasks')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setRoadmapData(roadmapData.filter(task => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task');
        }
    };

    const handleAddRoadmap = async () => {
        try {
            const { data, error } = await supabase
                .from('roadmaps')
                .insert([{
                    title: newRoadmap.title,
                    description: newRoadmap.description,
                    total_weeks: newRoadmap.total_weeks,
                    difficulty_level: newRoadmap.difficulty_level,
                    category: newRoadmap.category,
                    is_active: true
                }] as unknown as never)
                .select()
                .single() as { data: any; error: any };

            if (error) throw error;

            if (data) {
                setRoadmaps([...roadmaps, data]);
                setIsAddingRoadmap(false);
                setNewRoadmap({
                    title: '',
                    description: '',
                    total_weeks: 8,
                    difficulty_level: 'beginner',
                    prerequisites: '',
                    category: ''
                });
                setSelectedRoadmap(data.id);
            }
        } catch (error) {
            console.error('Error adding roadmap:', error);
            alert('Failed to add roadmap');
        }
    };

    const handleUpdateRoadmap = async () => {
        if (!editingRoadmapData) return;

        try {
            const { data, error } = await supabase
                .from('roadmaps')
                .update({
                    title: editingRoadmapData.title,
                    description: editingRoadmapData.description,
                    total_weeks: editingRoadmapData.total_weeks,
                    difficulty_level: editingRoadmapData.difficulty_level,
                    category: editingRoadmapData.category
                } as unknown as never)
                .eq('id', editingRoadmapData.id)
                .select()
                .single() as { data: any; error: any };

            if (error) throw error;

            setRoadmaps(roadmaps.map(r => r.id === editingRoadmapData.id ? data : r));
            setIsEditingRoadmap(false);
            setEditingRoadmapData(null);
        } catch (error) {
            console.error('Error updating roadmap:', error);
            alert('Failed to update roadmap');
        }
    };

    const handleDeleteRoadmap = async () => {
        if (!selectedRoadmap || !window.confirm('Are you sure you want to delete this roadmap? This action cannot be undone.')) return;

        try {
            const { error } = await supabase
                .from('roadmaps')
                .delete()
                .eq('id', selectedRoadmap);

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
            alert('Failed to delete roadmap');
        }
    };

    const handleAddWeek = async () => {
        const currentRoadmap = getCurrentRoadmap();
        if (!currentRoadmap) return;

        try {
            const nextWeekNumber = (currentRoadmap.total_weeks || 0) + 1;

            const { error: weekError } = await supabase
                .from('roadmap_weeks')
                .insert([{
                    roadmap_id: selectedRoadmap,
                    week_number: nextWeekNumber,
                    title: `Week ${nextWeekNumber}`,
                    description: `Week ${nextWeekNumber} content`,
                    domain: 'General'
                }] as unknown as never);

            if (weekError) throw weekError;

            const { error: roadmapError } = await supabase
                .from('roadmaps')
                .update({ total_weeks: nextWeekNumber } as unknown as never)
                .eq('id', currentRoadmap.id);

            if (roadmapError) throw roadmapError;

            const updatedRoadmap = { ...currentRoadmap, total_weeks: nextWeekNumber };
            setRoadmaps(roadmaps.map(r => r.id === currentRoadmap.id ? updatedRoadmap : r));
            setShowAddWeekModal(false);
            alert(`Week ${nextWeekNumber} added successfully!`);
        } catch (error) {
            console.error('Error adding week:', error);
            alert('Failed to add week');
        }
    };

    return {
        weekFilter, setWeekFilter,
        typeFilter, setTypeFilter,
        isAddingTask, setIsAddingTask,
        isAddingRoadmap, setIsAddingRoadmap,
        isEditingRoadmap, setIsEditingRoadmap,
        showAddWeekModal, setShowAddWeekModal,
        editingTask, setEditingTask,
        editingTaskData, setEditingTaskData,
        editingRoadmapData, setEditingRoadmapData,
        newTask, setNewTask,
        newRoadmap, setNewRoadmap,
        getCurrentRoadmap,
        getWeekOptions,
        getFilteredTasks,
        handleAddTask,
        handleUpdateTask,
        handleDeleteTask,
        handleAddRoadmap,
        handleUpdateRoadmap,
        handleDeleteRoadmap,
        handleAddWeek
    };
};
