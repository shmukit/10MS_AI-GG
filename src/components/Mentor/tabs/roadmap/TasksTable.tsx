import React from 'react';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import { RoadmapItem } from '../../../../types/mentor';
import { getTaskTypeColor } from '../../../../utils/mentorUtils';

interface TasksTableProps {
    isDarkMode: boolean;
    currentRoadmapTitle: string;
    filteredTasks: RoadmapItem[];
    setEditingTask: (id: string | null) => void;
    setEditingTaskData: (data: RoadmapItem | null) => void;
    handleDeleteTask: (id: string) => void;
}

export const TasksTable: React.FC<TasksTableProps> = ({
    isDarkMode,
    currentRoadmapTitle,
    filteredTasks,
    setEditingTask,
    setEditingTaskData,
    handleDeleteTask
}) => {
    return (
        <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
            <h3 className={`text-lg font-bold mb-6 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentRoadmapTitle} - Tasks
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
                        {filteredTasks.map((task) => (
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
    );
};
