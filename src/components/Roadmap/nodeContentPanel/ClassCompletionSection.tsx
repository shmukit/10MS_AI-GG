import React from 'react';
import { Trophy, Users } from 'lucide-react';
import type { StudentCompletion } from './types';

interface ClassCompletionSectionProps {
  loading: boolean;
  completions: StudentCompletion[];
}

export const ClassCompletionSection: React.FC<ClassCompletionSectionProps> = ({
  loading,
  completions,
}) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-4">
      <Users className="w-5 h-5 text-primary" />
      <h3 className="font-semibold text-foreground">Class Completion</h3>
    </div>
    {loading ? (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
      </div>
    ) : completions.length > 0 ? (
      <div>
        {(() => {
          const completedStudents = completions.filter((s) => s.completionPercentage >= 80);
          if (completedStudents.length === 0) {
            return <p className="text-center text-muted-foreground">No students completed yet.</p>;
          }
          return (
            <div className="flex flex-wrap gap-2">
              {completedStudents.map((student, i) => (
                <div key={student.studentId} className="flex items-center gap-2">
                  {i === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                  <span className="text-sm font-medium text-primary">{student.studentName}</span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    ) : (
      <p className="text-center text-muted-foreground">No completion data</p>
    )}
  </div>
);
