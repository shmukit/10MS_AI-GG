import React from 'react';
import { X } from 'lucide-react';

interface AddWeekModalProps {
    isDarkMode: boolean;
    isOpen: boolean;
    onClose: () => void;
    roadmapTitle: string;
    currentWeeks: number;
    onAddWeek: () => void;
}

export const AddWeekModal: React.FC<AddWeekModalProps> = ({
    isDarkMode,
    isOpen,
    onClose,
    roadmapTitle,
    currentWeeks,
    onAddWeek
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`rounded-xl p-6 shadow-lg max-w-md w-full mx-4 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Add Week to {roadmapTitle}
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
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Current Weeks: {currentWeeks}
                        </label>
                        <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Adding a new week will extend this roadmap to {currentWeeks + 1} weeks.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onAddWeek}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                            Add Week
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
