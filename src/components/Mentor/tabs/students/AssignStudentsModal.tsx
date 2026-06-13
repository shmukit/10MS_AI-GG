import React from 'react';
import { Check } from 'lucide-react';

interface AssignStudentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableStudents: any[];
    selectedStudents: string[];
    setSelectedStudents: (students: string[]) => void;
    onSubmit: () => void;
}

export const AssignStudentsModal: React.FC<AssignStudentsModalProps> = ({
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
            <div className="max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg bg-card transition-colors duration-200">
                <h3 className="text-lg font-bold mb-4 text-foreground transition-colors duration-200">
                    Assign Students to Batch
                </h3>
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Select Students
                        </label>
                        <div className="max-h-60 overflow-y-auto border border-border rounded-lg p-3 bg-muted transition-colors duration-200">
                            {availableStudents.map((student) => (
                                <div key={student.id} className={`flex items-center gap-3 p-2 rounded transition-colors duration-200 ${student.isAssigned
                                    ? 'bg-accent border border-primary/30'
                                    : 'hover:bg-accent'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        {student.isAssigned ? (
                                            <Check className="w-4 h-4 text-primary" />
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
                                        <div className="font-medium text-foreground">
                                            {student.first_name} {student.last_name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
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
                        className="flex-1 py-2 px-4 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 rounded-lg font-medium transition-colors"
                    >
                        Assign {selectedStudents.length} Students
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors bg-muted hover:bg-accent text-muted-foreground"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
