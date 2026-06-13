import React from 'react';
import { Mail, Phone, Trash2 } from 'lucide-react';
import { Student } from '../../../../types/mentor';

interface StudentsListProps {
    students: Student[];
    handleDeleteStudent: (id: string) => void;
}

export const StudentsList: React.FC<StudentsListProps> = ({
    students,
    handleDeleteStudent
}) => {
    return (
        <div className="rounded-xl border border-border bg-card transition-colors duration-200">
            <div className="p-6">
                <h4 className="text-lg font-semibold mb-4 text-foreground transition-colors duration-200">
                    Students ({students.length})
                </h4>

                <div className="space-y-4">
                    {students.map((student) => (
                        <div
                            key={student.id}
                            className="p-4 rounded-lg border border-border bg-muted transition-colors duration-200"
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center border border-border">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {student.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <h5 className="font-semibold text-foreground transition-colors duration-200">
                                            {student.name}
                                        </h5>
                                        <div className="text-sm text-muted-foreground transition-colors duration-200">
                                            {student.degree} {student.subject} • {student.year}
                                        </div>
                                        <div className="text-sm text-muted-foreground transition-colors duration-200">
                                            {student.institute}
                                        </div>
                                        <div className="flex items-center gap-4 mt-1">
                                            <a href={`mailto:${student.email}`} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
                                                <Mail className="w-3 h-3" />
                                                {student.email}
                                            </a>
                                            <a href={`tel:${student.phone}`} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
                                                <Phone className="w-3 h-3" />
                                                {student.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="text-center">
                                        <div className="text-sm font-medium text-foreground transition-colors duration-200">
                                            Week {student.completedWeeks}/6
                                        </div>
                                        <div className="text-xs text-muted-foreground transition-colors duration-200">
                                            {student.progressPercentage}% Complete
                                        </div>
                                        <div className="progress-track mt-1 h-2 w-20 rounded-full">
                                            <div
                                                className="h-2 rounded-full bg-primary transition-all duration-300"
                                                style={{ width: `${student.progressPercentage}%` }}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDeleteStudent(student.id)}
                                        className="p-2 rounded hover:bg-destructive/10 text-destructive"
                                        title="Remove from batch"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {students.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No students in this batch yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
