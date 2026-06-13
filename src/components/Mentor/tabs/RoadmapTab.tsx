import React from 'react';
import { RoadmapItem } from '../../../types/mentor';
import { useRoadmapTab } from './hooks/useRoadmapTab';
import { RoadmapControls } from './roadmap/RoadmapControls';
import { RoadmapFilters } from './roadmap/RoadmapFilters';
import { TasksTable } from './roadmap/TasksTable';
import { TaskModal } from './roadmap/TaskModal';
import { RoadmapModal } from './roadmap/RoadmapModal';
import { AddWeekModal } from './roadmap/AddWeekModal';

interface RoadmapTabProps {
    roadmaps: any[];
    setRoadmaps: React.Dispatch<React.SetStateAction<any[]>>;
    roadmapData: RoadmapItem[];
    setRoadmapData: React.Dispatch<React.SetStateAction<RoadmapItem[]>>;
    selectedRoadmap: string;
    setSelectedRoadmap: (id: string) => void;
    selectedBatch?: string;
}

export const RoadmapTab: React.FC<RoadmapTabProps> = ({
    roadmaps,
    setRoadmaps,
    roadmapData,
    setRoadmapData,
    selectedRoadmap,
    setSelectedRoadmap,
    selectedBatch
}) => {
    const {
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
    } = useRoadmapTab({
        roadmaps,
        setRoadmaps,
        roadmapData,
        setRoadmapData,
        selectedRoadmap,
        setSelectedRoadmap,
        selectedBatch
    });

    return (
        <div className="space-y-6">
            <RoadmapControls
                roadmaps={roadmaps}
                selectedRoadmap={selectedRoadmap}
                setSelectedRoadmap={setSelectedRoadmap}
                getCurrentRoadmap={getCurrentRoadmap}
                setEditingRoadmapData={setEditingRoadmapData}
                setIsEditingRoadmap={setIsEditingRoadmap}
                setIsAddingRoadmap={setIsAddingRoadmap}
                setShowAddWeekModal={setShowAddWeekModal}
                setIsAddingTask={setIsAddingTask}
            />

            {selectedRoadmap && (
                <RoadmapFilters
                    weekFilter={weekFilter}
                    setWeekFilter={setWeekFilter}
                    typeFilter={typeFilter}
                    setTypeFilter={setTypeFilter}
                    getWeekOptions={getWeekOptions}
                />
            )}

            <TasksTable
                currentRoadmapTitle={getCurrentRoadmap()?.title || 'Selected Roadmap'}
                filteredTasks={getFilteredTasks()}
                setEditingTask={setEditingTask}
                setEditingTaskData={setEditingTaskData}
                handleDeleteTask={handleDeleteTask}
            />

            <TaskModal
                isOpen={isAddingTask}
                onClose={() => setIsAddingTask(false)}
                taskData={newTask}
                setTaskData={setNewTask}
                onSubmit={handleAddTask}
                weekOptions={getWeekOptions()}
                title="Add New Task"
                submitLabel="Add Task"
            />

            <TaskModal
                isOpen={!!editingTask && !!editingTaskData}
                onClose={() => { setEditingTask(null); setEditingTaskData(null); }}
                taskData={editingTaskData || newTask}
                setTaskData={setEditingTaskData}
                onSubmit={handleUpdateTask}
                weekOptions={getWeekOptions()}
                title="Edit Task"
                submitLabel="Update Task"
            />

            <AddWeekModal
                isOpen={showAddWeekModal}
                onClose={() => setShowAddWeekModal(false)}
                roadmapTitle={getCurrentRoadmap()?.title || 'Selected Roadmap'}
                currentWeeks={getCurrentRoadmap()?.total_weeks || 0}
                onAddWeek={handleAddWeek}
            />

            <RoadmapModal
                isOpen={isAddingRoadmap}
                onClose={() => setIsAddingRoadmap(false)}
                roadmapData={newRoadmap}
                setRoadmapData={setNewRoadmap}
                onSubmit={handleAddRoadmap}
                title="Add New Roadmap"
                submitLabel="Add Roadmap"
            />

            <RoadmapModal
                isOpen={isEditingRoadmap && !!editingRoadmapData}
                onClose={() => {
                    setIsEditingRoadmap(false);
                    setEditingRoadmapData(null);
                }}
                roadmapData={editingRoadmapData || newRoadmap}
                setRoadmapData={setEditingRoadmapData}
                onSubmit={handleUpdateRoadmap}
                onDelete={handleDeleteRoadmap}
                title="Edit Roadmap"
                submitLabel="Update Roadmap"
                showDelete={true}
            />
        </div>
    );
};
