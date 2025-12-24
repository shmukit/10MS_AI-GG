import React from 'react';
import { Plus, Edit2, Trash2, ExternalLink, X } from 'lucide-react';
import { RoadmapItem } from '../../../types/mentor';
import { getTaskTypeColor } from '../../../utils/mentorUtils';
import { useRoadmapTab } from './hooks/useRoadmapTab';

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

            {/* Filters */}
            {selectedRoadmap && (
                <div className={`rounded-xl p-4 border transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    Filter by Week
                                </label>
                                <select
                                    value={weekFilter}
                                    onChange={(e) => setWeekFilter(e.target.value)}
                                    className={`px-3 py-2 border rounded-lg transition-colors ${isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                >
                                    <option value="">All Weeks</option>
                                    {getWeekOptions().map(week => (
                                        <option key={week} value={week.toString()}>Week {week}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    Filter by Task Type
                                </label>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className={`px-3 py-2 border rounded-lg transition-colors ${isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                >
                                    <option value="">All Types</option>
                                    <option value="Watch">Watch</option>
                                    <option value="Read">Read</option>
                                    <option value="Project">Project</option>
                                    <option value="Attend">Attend</option>
                                    <option value="MCQ">MCQ</option>
                                    <option value="Written">Written</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setWeekFilter('');
                                    setTypeFilter('');
                                }}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                <h3 className={`text-lg font-bold mb-6 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getCurrentRoadmap()?.title || 'Selected Roadmap'} - Tasks
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={`transition-colors duration-200 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <tr>
                                <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Week</th>
                                <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Domain</th>
                                <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</th>
                                <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Task Name</th>
                                <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Details</th>
                                <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Links</th>
                                <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Deadline</th>
                                <th className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getFilteredTasks().map((task) => (
                                <tr key={task.id} className={`border-t transition-colors duration-200 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'
                                    }`}>
                                    <td className={`px-4 py-3 text-sm transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Week {task.weekNumber}
                                    </td>
                                    <td className={`px-4 py-3 text-sm transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {task.domain}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskTypeColor(task.taskType, isDarkMode)}`}>
                                            {task.taskType}
                                        </span>
                                    </td>
                                    <td className={`px-4 py-3 text-sm transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {task.taskName}
                                    </td>
                                    <td className={`px-4 py-3 text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {task.taskDetails}
                                    </td>
                                    <td className="px-4 py-3">
                                        {task.relevantLinks && (
                                            <a
                                                href={task.relevantLinks}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                    </td>
                                    <td className={`px-4 py-3 text-sm transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {task.deadline}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingTask(task.id);
                                                    setEditingTaskData(task);
                                                }}
                                                className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="p-1 rounded hover:bg-red-100 text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Task Modal */}
            {isAddingTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Add New Task
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Week
                                </label>
                                <select
                                    value={newTask.weekNumber}
                                    onChange={(e) => setNewTask({ ...newTask, weekNumber: parseInt(e.target.value) })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    required
                                >
                                    <option value="">Select Week</option>
                                    {getWeekOptions().map(week => (
                                        <option key={week} value={week}>Week {week}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Task Type
                                </label>
                                <select
                                    value={newTask.taskType}
                                    onChange={(e) => setNewTask({ ...newTask, taskType: e.target.value as any })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                >
                                    <option value="Watch">Watch</option>
                                    <option value="Read">Read</option>
                                    <option value="Project">Project</option>
                                    <option value="Attend">Attend</option>
                                    <option value="MCQ">MCQ</option>
                                    <option value="Written">Written</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Domain
                                </label>
                                <input
                                    type="text"
                                    value={newTask.domain}
                                    onChange={(e) => setNewTask({ ...newTask, domain: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Task Name
                                </label>
                                <input
                                    type="text"
                                    value={newTask.taskName}
                                    onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Task Details
                            </label>
                            <textarea
                                value={newTask.taskDetails}
                                onChange={(e) => setNewTask({ ...newTask, taskDetails: e.target.value })}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Relevant Links
                                </label>
                                <input
                                    type="url"
                                    value={newTask.relevantLinks}
                                    onChange={(e) => setNewTask({ ...newTask, relevantLinks: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Deadline
                                </label>
                                <input
                                    type="date"
                                    value={newTask.deadline}
                                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Meeting Time - Only show for Attend tasks */}
                        {newTask.taskType === 'Attend' && (
                            <div className="mb-6">
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Meeting Time
                                </label>
                                <input
                                    type="time"
                                    value={newTask.meetingTime}
                                    onChange={(e) => setNewTask({ ...newTask, meetingTime: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={handleAddTask}
                                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Add Task
                            </button>
                            <button
                                onClick={() => setIsAddingTask(false)}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${isDarkMode
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Week Modal */}
            {showAddWeekModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`rounded-xl p-6 shadow-lg max-w-md w-full mx-4 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                        }`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Add Week to {getCurrentRoadmap()?.title || 'Selected Roadmap'}
                            </h3>
                            <button
                                onClick={() => setShowAddWeekModal(false)}
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                                    }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    Current Weeks: {getCurrentRoadmap()?.total_weeks || 0}
                                </label>
                                <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Adding a new week will extend this roadmap to {(getCurrentRoadmap()?.total_weeks || 0) + 1} weeks.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddWeek}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                                >
                                    Add Week
                                </button>
                                <button
                                    onClick={() => setShowAddWeekModal(false)}
                                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${isDarkMode
                                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                        }`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Task Modal */}
            {editingTask && editingTaskData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className={`text-xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Edit Task
                            </h3>
                            <button
                                onClick={() => { setEditingTask(null); setEditingTaskData(null); }}
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                                    }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Week Number
                                    </label>
                                    <select
                                        value={editingTaskData.weekNumber}
                                        onChange={(e) => setEditingTaskData({ ...editingTaskData, weekNumber: parseInt(e.target.value) })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    >
                                        {getWeekOptions().map(week => (
                                            <option key={week} value={week}>Week {week}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Task Type
                                    </label>
                                    <select
                                        value={editingTaskData.taskType}
                                        onChange={(e) => setEditingTaskData({ ...editingTaskData, taskType: e.target.value as any })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    >
                                        <option value="Watch">Watch</option>
                                        <option value="Read">Read</option>
                                        <option value="Project">Project</option>
                                        <option value="Attend">Attend</option>
                                        <option value="MCQ">MCQ</option>
                                        <option value="Written">Written</option>
                                    </select>
                                </div>
                            </div>

                            {/* Note: In edit modal, domain, taskName etc should update editingTaskData */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Domain
                                </label>
                                <input
                                    type="text"
                                    value={editingTaskData.domain || ''}
                                    onChange={(e) => setEditingTaskData({ ...editingTaskData, domain: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    placeholder="e.g., Python Basics, Web Development"
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Task Name
                                </label>
                                <input
                                    type="text"
                                    value={editingTaskData.taskName}
                                    onChange={(e) => setEditingTaskData({ ...editingTaskData, taskName: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    placeholder="Enter task name"
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Task Details
                                </label>
                                <textarea
                                    value={editingTaskData.taskDetails || ''}
                                    onChange={(e) => setEditingTaskData({ ...editingTaskData, taskDetails: e.target.value })}
                                    rows={3}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    placeholder="Enter task details"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Relevant Links
                                    </label>
                                    <input
                                        type="url"
                                        value={editingTaskData.relevantLinks || ''}
                                        onChange={(e) => setEditingTaskData({ ...editingTaskData, relevantLinks: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                        placeholder="https://example.com"
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Deadline
                                    </label>
                                    <input
                                        type="date"
                                        value={editingTaskData.deadline || ''}
                                        onChange={(e) => setEditingTaskData({ ...editingTaskData, deadline: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Meeting Time for Attend Tasks */}
                            {editingTaskData.taskType === 'Attend' && (
                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Meeting Time
                                    </label>
                                    <input
                                        type="time"
                                        value={editingTaskData.meetingTime || ''}
                                        onChange={(e) => setEditingTaskData({ ...editingTaskData, meetingTime: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleUpdateTask}
                                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Update Task
                            </button>
                            <button
                                onClick={() => { setEditingTask(null); setEditingTaskData(null); }}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${isDarkMode
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Roadmap Modal */}
            {/* ... (Same as before) ... */}
            {isAddingRoadmap && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className={`text-xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Add New Roadmap
                            </h3>
                            <button
                                onClick={() => setIsAddingRoadmap(false)}
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                                    }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Roadmap Title
                                </label>
                                <input
                                    type="text"
                                    value={newRoadmap.title}
                                    onChange={(e) => setNewRoadmap({ ...newRoadmap, title: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    placeholder="e.g., Python Fundamentals"
                                    required
                                />
                            </div>

                            {/* ... Other fields same as previous implementation ... */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Description
                                </label>
                                <textarea
                                    value={newRoadmap.description}
                                    onChange={(e) => setNewRoadmap({ ...newRoadmap, description: e.target.value })}
                                    rows={3}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    placeholder="Enter roadmap description"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Week Count
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="52"
                                        value={newRoadmap.total_weeks}
                                        onChange={(e) => setNewRoadmap({ ...newRoadmap, total_weeks: parseInt(e.target.value) || 8 })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Difficulty Level
                                    </label>
                                    <select
                                        value={newRoadmap.difficulty_level}
                                        onChange={(e) => setNewRoadmap({ ...newRoadmap, difficulty_level: e.target.value as any })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Category
                                </label>
                                <input
                                    type="text"
                                    value={newRoadmap.category}
                                    onChange={(e) => setNewRoadmap({ ...newRoadmap, category: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    placeholder="e.g., Programming, Data Science, Web Development"
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Prerequisites
                                </label>
                                <input
                                    type="text"
                                    value={newRoadmap.prerequisites}
                                    onChange={(e) => setNewRoadmap({ ...newRoadmap, prerequisites: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    placeholder="e.g., Basic computer knowledge"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleAddRoadmap}
                                className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Add Roadmap
                            </button>
                            <button
                                onClick={() => setIsAddingRoadmap(false)}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${isDarkMode
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Roadmap Modal */}
            {/* ... (Same as before) ... */}
            {isEditingRoadmap && editingRoadmapData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className={`text-xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Edit Roadmap
                            </h3>
                            <button
                                onClick={() => {
                                    setIsEditingRoadmap(false);
                                    setEditingRoadmapData(null);
                                }}
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                                    }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Roadmap Title
                                </label>
                                <input
                                    type="text"
                                    value={editingRoadmapData.title}
                                    onChange={(e) => setEditingRoadmapData({ ...editingRoadmapData, title: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Description
                                </label>
                                <textarea
                                    value={editingRoadmapData.description}
                                    onChange={(e) => setEditingRoadmapData({ ...editingRoadmapData, description: e.target.value })}
                                    rows={3}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Week Count
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="52"
                                        value={editingRoadmapData.total_weeks}
                                        onChange={(e) => setEditingRoadmapData({ ...editingRoadmapData, total_weeks: parseInt(e.target.value) || 8 })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Difficulty Level
                                    </label>
                                    <select
                                        value={editingRoadmapData.difficulty_level}
                                        onChange={(e) => setEditingRoadmapData({ ...editingRoadmapData, difficulty_level: e.target.value as any })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Category
                                </label>
                                <input
                                    type="text"
                                    value={editingRoadmapData.category}
                                    onChange={(e) => setEditingRoadmapData({ ...editingRoadmapData, category: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleUpdateRoadmap}
                                    className="flex-1 py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Update Roadmap
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this roadmap?')) {
                                            handleDeleteRoadmap();
                                        }
                                    }}
                                    className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Delete Roadmap
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditingRoadmap(false);
                                        setEditingRoadmapData(null);
                                    }}
                                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${isDarkMode
                                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                        }`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
