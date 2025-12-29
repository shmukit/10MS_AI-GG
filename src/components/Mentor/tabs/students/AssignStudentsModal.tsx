import React from 'react';
import { Check } from 'lucide-react';

interface AssignStudentsModalProps {
    isDarkMode: boolean;
    isOpen: boolean;
    onClose: () => void;
    availableStudents: any[];
    selectedStudents: string[];
    setSelectedStudents: (students: string[]) => void;
    onSubmit: () => void;
}

export const AssignStudentsModal: React.FC<AssignStudentsModalProps> = ({
    isDarkMode,
    isOpen,
    onClose,
    availableStudents,
    selectedStudents,
    setSelectedStudents,
    onSubmit
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Assign Students to Batch
                </h3>
                <div className="space-y-4 mb-6">
                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Select Students
                        </label>
                        <div className={`max-h-60 overflow-y-auto border rounded-lg p-3 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                            }`}>
                            {availableStudents.map((student) => (
                                <div key={student.id} className={`flex items-center gap-3 p-2 rounded transition-colors duration-200 ${student.isAssigned
                                    ? (isDarkMode ? 'bg-green-900/20 border border-green-600/30' : 'bg-green-50 border border-green-200')
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        {student.isAssigned ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.includes(student.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedStudents([...selectedStudents, student.id]);
                                                    else setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {student.first_name} {student.last_name}
                                        </div>
                                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {student.email}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onSubmit}
                        disabled={selectedStudents.length === 0}
                        className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-medium transition-colors"
                    >
                        Assign {selectedStudents.length} Students
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
    );
};
