import React from 'react';
import { X } from 'lucide-react';

interface RoadmapModalProps {
    isDarkMode: boolean;
    isOpen: boolean;
    onClose: () => void;
    roadmapData: any;
    setRoadmapData: (data: any) => void;
    onSubmit: () => void;
    onDelete?: () => void; // Optional, only for edit mode
    title: string;
    submitLabel: string;
    showDelete?: boolean;
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({
    isDarkMode,
    isOpen,
    onClose,
    roadmapData,
    setRoadmapData,
    onSubmit,
    onDelete,
    title,
    submitLabel,
    showDelete
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
                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Roadmap Title
                        </label>
                        <input
                            type="text"
                            value={roadmapData.title}
                            onChange={(e) => setRoadmapData({ ...roadmapData, title: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                }`}
                            placeholder="e.g., Python Fundamentals"
                            required
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Description
                        </label>
                        <textarea
                            value={roadmapData.description}
                            onChange={(e) => setRoadmapData({ ...roadmapData, description: e.target.value })}
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
                                value={roadmapData.total_weeks}
                                onChange={(e) => setRoadmapData({ ...roadmapData, total_weeks: parseInt(e.target.value) || 8 })}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Difficulty Level
                            </label>
                            <select
                                value={roadmapData.difficulty_level}
                                onChange={(e) => setRoadmapData({ ...roadmapData, difficulty_level: e.target.value as any })}
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
                            value={roadmapData.category}
                            onChange={(e) => setRoadmapData({ ...roadmapData, category: e.target.value })}
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
                            value={roadmapData.prerequisites}
                            onChange={(e) => setRoadmapData({ ...roadmapData, prerequisites: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                }`}
                            placeholder="e.g., Basic computer knowledge"
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onSubmit}
                        className={`flex-1 py-2 px-4 text-white rounded-lg font-medium transition-colors ${showDelete ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                    >
                        {submitLabel}
                    </button>

                    {showDelete && onDelete && (
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this roadmap?')) {
                                    onDelete();
                                }
                            }}
                            className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Delete Roadmap
                        </button>
                    )}

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
    );
};
