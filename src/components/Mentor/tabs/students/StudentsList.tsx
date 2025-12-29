import React from 'react';
import { Mail, Phone, Trash2 } from 'lucide-react';
import { Student } from '../../../../types/mentor';

interface StudentsListProps {
    isDarkMode: boolean;
    students: Student[];
    handleDeleteStudent: (id: string) => void;
}

export const StudentsList: React.FC<StudentsListProps> = ({
    isDarkMode,
    students,
    handleDeleteStudent
}) => {
    return (
        <div className={`rounded-xl border transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
            <div className="p-6">
                <h4 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Students ({students.length})
                </h4>

                <div className="space-y-4">
                    {students.map((student) => (
                        <div
                            key={student.id}
                            className={`p-4 rounded-lg border transition-colors duration-200 ${isDarkMode
                                ? 'bg-gray-700 border-gray-600'
                                : 'bg-gray-50 border-gray-200'
                                }`}
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-600">
                                            {student.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <h5 className={`font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {student.name}
                                        </h5>
                                        <div className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {student.degree} {student.subject} • {student.year}
                                        </div>
                                        <div className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {student.institute}
                                        </div>
                                        <div className="flex items-center gap-4 mt-1">
                                            <a href={`mailto:${student.email}`} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                                                <Mail className="w-3 h-3" />
                                                {student.email}
                                            </a>
                                            <a href={`tel:${student.phone}`} className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700">
                                                <Phone className="w-3 h-3" />
                                                {student.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="text-center">
                                        <div className={`text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            Week {student.completedWeeks}/6
                                        </div>
                                        <div className={`text-xs transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {student.progressPercentage}% Complete
                                        </div>
                                        <div className={`w-20 h-2 rounded-full mt-1 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                            <div
                                                className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                                                style={{ width: `${student.progressPercentage}%` }}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDeleteStudent(student.id)}
                                        className="p-2 rounded hover:bg-red-100 text-red-600"
                                        title="Remove from batch"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {students.length === 0 && (
                        <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No students in this batch yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
