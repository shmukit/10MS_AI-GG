import React from 'react';
import { Plus, Users } from 'lucide-react';
import { Batch } from '../../../../types/mentor';

interface BatchHeaderProps {
    isDarkMode: boolean;
    selectedBatch: string;
    setSelectedBatch: (id: string) => void;
    batches: Batch[];
    setIsAddingBatch: (isAdding: boolean) => void;
    setIsAddingStudent: (isAdding: boolean) => void;
    setIsAssigningStudents: (isAssigning: boolean) => void;
    loadAvailableStudents: () => Promise<void>;
}

export const BatchHeader: React.FC<BatchHeaderProps> = ({
    isDarkMode,
    selectedBatch,
    setSelectedBatch,
    batches,
    setIsAddingBatch,
    setIsAddingStudent,
    setIsAssigningStudents,
    loadAvailableStudents
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
                <h3 className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Batch & Students Management
                </h3>
                <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        }`}
                >
                    {batches.map(batch => (
                        <option key={batch.id} value={batch.id}>{batch.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setIsAddingBatch(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Batch
                </button>
                {selectedBatch && (
                    <>
                        <button
                            onClick={() => setIsAddingStudent(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Student
                        </button>
                        <button
                            onClick={async () => {
                                setIsAssigningStudents(true);
                                await loadAvailableStudents();
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                        >
                            <Users className="w-4 h-4" />
                            Assign Students
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
