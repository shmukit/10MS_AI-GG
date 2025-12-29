import React from 'react';
import { Users, Edit2 } from 'lucide-react';
import { Batch } from '../../../../types/mentor';

interface BatchInfoProps {
    isDarkMode: boolean;
    selectedBatchData: Batch | undefined;
    studentCount: number;
    setEditingBatchData: (data: Batch) => void;
    setIsEditingBatch: (isEditing: boolean) => void;
}

export const BatchInfo: React.FC<BatchInfoProps> = ({
    isDarkMode,
    selectedBatchData,
    studentCount,
    setEditingBatchData,
    setIsEditingBatch
}) => {
    if (!selectedBatchData) return null;

    return (
        <div className={`rounded-xl p-6 border transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h4 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedBatchData.name}
                    </h4>
                    <div className="space-y-2">
                        <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <strong>Students:</strong> {studentCount}
                        </p>
                        <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <strong>Created:</strong> {selectedBatchData.createdDate}
                        </p>
                    </div>
                </div>
                <div className="space-y-3">
                    {selectedBatchData.whatsappLink && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-green-500" />
                                <a href={selectedBatchData.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 text-sm">
                                    WhatsApp Group
                                </a>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingBatchData(selectedBatchData);
                                    setIsEditingBatch(true);
                                }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${isDarkMode
                                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                                    }`}
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </button>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            setEditingBatchData(selectedBatchData);
                            setIsEditingBatch(true);
                        }}
                        className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${isDarkMode
                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                            }`}
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit Batch Details
                    </button>
                </div>
            </div>
        </div>
    );
};
