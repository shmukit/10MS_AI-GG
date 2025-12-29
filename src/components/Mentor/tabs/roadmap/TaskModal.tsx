import React from 'react';
import { X } from 'lucide-react';


interface TaskModalProps {
    isDarkMode: boolean;
    isOpen: boolean;
    onClose: () => void;
    isFilesMode?: boolean; // If reusable for other things, but here it's specific
    taskData: any; // Using any for new task structure or RoadmapItem
    setTaskData: (data: any) => void;
    onSubmit: () => void;
    weekOptions: number[];
    title: string;
    submitLabel: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
    isDarkMode,
    isOpen,
    onClose,
    taskData,
    setTaskData,
    onSubmit,
    weekOptions,
    title,
    submitLabel
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
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
                                value={taskData.weekNumber}
                                onChange={(e) => setTaskData({ ...taskData, weekNumber: parseInt(e.target.value) })}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                required
                            >
                                <option value="">Select Week</option>
                                {weekOptions.map(week => (
                                    <option key={week} value={week}>Week {week}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Task Type
                            </label>
                            <select
                                value={taskData.taskType}
                                onChange={(e) => setTaskData({ ...taskData, taskType: e.target.value as any })}
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

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Domain
                        </label>
                        <input
                            type="text"
                            value={taskData.domain || ''}
                            onChange={(e) => setTaskData({ ...taskData, domain: e.target.value })}
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
                            value={taskData.taskName}
                            onChange={(e) => setTaskData({ ...taskData, taskName: e.target.value })}
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
                            value={taskData.taskDetails || ''}
                            onChange={(e) => setTaskData({ ...taskData, taskDetails: e.target.value })}
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
                                value={taskData.relevantLinks || ''}
                                onChange={(e) => setTaskData({ ...taskData, relevantLinks: e.target.value })}
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
                                value={taskData.deadline || ''}
                                onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Meeting Time - Only show for Attend tasks */}
                    {taskData.taskType === 'Attend' && (
                        <div className="mb-6">
                            <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Meeting Time
                            </label>
                            <input
                                type="time"
                                value={taskData.meetingTime || ''}
                                onChange={(e) => setTaskData({ ...taskData, meetingTime: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                            />
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onSubmit}
                            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            {submitLabel}
                        </button>
                        <button
                            onClick={onClose}
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
    );
};
