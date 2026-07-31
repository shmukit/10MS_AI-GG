import React from 'react';
import { RoadmapItem } from '../../../types/mentor';
import { useRoadmapTab } from './hooks/useRoadmapTab';
import { RoadmapControls } from './roadmap/RoadmapControls';
import { RoadmapFilters } from './roadmap/RoadmapFilters';
import { TasksTable } from './roadmap/TasksTable';
import { TaskModal } from './roadmap/TaskModal';
import { RoadmapModal } from './roadmap/RoadmapModal';
import { AddWeekModal } from './roadmap/AddWeekModal';
import { EditNodeModal } from './roadmap/EditNodeModal';
import { NodesPanel } from './roadmap/NodesPanel';
import { RoadmapResourcesPanel } from './roadmap/RoadmapResourcesPanel';
import { DEFAULT_QUIZ_TASK } from './roadmap/QuizTaskSettings';

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
        editingNode, setEditingNode,
        editingNodeData, setEditingNodeData,
        roadmapNodes,
        getNodeLabel,
        handleEditNodeOpen,
        handleUpdateNode,
        editingTask, setEditingTask,
        editingTaskData, setEditingTaskData,
        editingRoadmapData, setEditingRoadmapData,
        newTask, setNewTask,
        newTaskQuiz, setNewTaskQuiz,
        editingTaskQuiz, setEditingTaskQuiz,
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
        handleDuplicateRoadmap,
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

    const nodeUnitLabel = getNodeLabel();

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
                nodeUnitLabel={nodeUnitLabel}
                onDuplicateRoadmap={handleDuplicateRoadmap}
            />

            {selectedRoadmap && <RoadmapResourcesPanel roadmapId={selectedRoadmap} />}

            {selectedRoadmap && (
                <NodesPanel
                    nodes={roadmapNodes}
                    nodeUnitLabel={nodeUnitLabel}
                    onEditNode={handleEditNodeOpen}
                />
            )}

            {selectedRoadmap && (
                <RoadmapFilters
                    weekFilter={weekFilter}
                    setWeekFilter={setWeekFilter}
                    typeFilter={typeFilter}
                    setTypeFilter={setTypeFilter}
                    getWeekOptions={getWeekOptions}
                    nodeUnitLabel={nodeUnitLabel}
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
                nodeUnitLabel={nodeUnitLabel}
                roadmapId={selectedRoadmap}
                batchId={selectedBatch}
                quizData={newTaskQuiz}
                setQuizData={setNewTaskQuiz}
            />

            <TaskModal
                isOpen={!!editingTask && !!editingTaskData}
                onClose={() => { setEditingTask(null); setEditingTaskData(null); setEditingTaskQuiz(DEFAULT_QUIZ_TASK); }}
                taskData={editingTaskData || newTask}
                setTaskData={setEditingTaskData}
                onSubmit={handleUpdateTask}
                weekOptions={getWeekOptions()}
                title="Edit Task"
                submitLabel="Update Task"
                nodeUnitLabel={nodeUnitLabel}
                roadmapId={selectedRoadmap}
                batchId={selectedBatch}
                editingTaskId={editingTask || undefined}
                quizData={editingTaskQuiz}
                setQuizData={setEditingTaskQuiz}
            />

            <AddWeekModal
                isOpen={showAddWeekModal}
                onClose={() => setShowAddWeekModal(false)}
                roadmapTitle={getCurrentRoadmap()?.title || 'Selected Roadmap'}
                currentWeeks={getCurrentRoadmap()?.total_weeks || 0}
                onAddWeek={handleAddWeek}
                nodeUnitLabel={nodeUnitLabel}
            />

            <EditNodeModal
                isOpen={!!editingNode && !!editingNodeData}
                onClose={() => { setEditingNode(null); setEditingNodeData(null); }}
                nodeData={editingNodeData}
                setNodeData={setEditingNodeData}
                onSubmit={handleUpdateNode}
                nodeUnitLabel={nodeUnitLabel}
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
