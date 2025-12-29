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
    isDarkMode: boolean;
}

export const RoadmapTab: React.FC<RoadmapTabProps> = ({
    roadmaps,
    setRoadmaps,
    roadmapData,
    setRoadmapData,
    selectedRoadmap,
    setSelectedRoadmap,
    isDarkMode
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
        setSelectedRoadmap
    });

    return (
        <div className="space-y-6">
            {/* Roadmap Controls */}
            <RoadmapControls
                isDarkMode={isDarkMode}
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

            {/* Filters */}
            {selectedRoadmap && (
                <RoadmapFilters
                    isDarkMode={isDarkMode}
                    weekFilter={weekFilter}
                    setWeekFilter={setWeekFilter}
                    typeFilter={typeFilter}
                    setTypeFilter={setTypeFilter}
                    getWeekOptions={getWeekOptions}
                />
            )}

            {/* Tasks Table */}
            <TasksTable
                isDarkMode={isDarkMode}
                currentRoadmapTitle={getCurrentRoadmap()?.title || 'Selected Roadmap'}
                filteredTasks={getFilteredTasks()}
                setEditingTask={setEditingTask}
                setEditingTaskData={setEditingTaskData}
                handleDeleteTask={handleDeleteTask}
            />

            {/* Add Task Modal */}
            <TaskModal
                isDarkMode={isDarkMode}
                isOpen={isAddingTask}
                onClose={() => setIsAddingTask(false)}
                taskData={newTask}
                setTaskData={setNewTask}
                onSubmit={handleAddTask}
                weekOptions={getWeekOptions()}
                title="Add New Task"
                submitLabel="Add Task"
            />

            {/* Edit Task Modal */}
            <TaskModal
                isDarkMode={isDarkMode}
                isOpen={!!editingTask && !!editingTaskData}
                onClose={() => { setEditingTask(null); setEditingTaskData(null); }}
                taskData={editingTaskData || newTask} // Fallback to newTask just to satisfy type if null, though modal won't show
                setTaskData={setEditingTaskData}
                onSubmit={handleUpdateTask}
                weekOptions={getWeekOptions()}
                title="Edit Task"
                submitLabel="Update Task"
            />

            {/* Add Week Modal */}
            <AddWeekModal
                isDarkMode={isDarkMode}
                isOpen={showAddWeekModal}
                onClose={() => setShowAddWeekModal(false)}
                roadmapTitle={getCurrentRoadmap()?.title || 'Selected Roadmap'}
                currentWeeks={getCurrentRoadmap()?.total_weeks || 0}
                onAddWeek={handleAddWeek}
            />

            {/* Add Roadmap Modal */}
            <RoadmapModal
                isDarkMode={isDarkMode}
                isOpen={isAddingRoadmap}
                onClose={() => setIsAddingRoadmap(false)}
                roadmapData={newRoadmap}
                setRoadmapData={setNewRoadmap}
                onSubmit={handleAddRoadmap}
                title="Add New Roadmap"
                submitLabel="Add Roadmap"
            />

            {/* Edit Roadmap Modal */}
            <RoadmapModal
                isDarkMode={isDarkMode}
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
