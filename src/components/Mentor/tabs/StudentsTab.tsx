import React from 'react';
import { Batch, Student } from '../../../types/mentor';
import { useStudentsTab } from './hooks/useStudentsTab';
import { BatchHeader } from './students/BatchHeader';
import { BatchInfo } from './students/BatchInfo';
import { StudentsList } from './students/StudentsList';
import { BatchModal } from './students/BatchModal';
import { StudentModal } from './students/StudentModal';
import { AssignStudentsModal } from './students/AssignStudentsModal';

interface StudentsTabProps {
    students: Student[];
    batches: Batch[];
    roadmaps: any[];
    selectedBatch: string;
    setSelectedBatch: (id: string) => void;
    isDarkMode: boolean;
    onUpdate: () => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({
    students,
    batches,
    roadmaps,
    selectedBatch,
    setSelectedBatch,
    isDarkMode,
    onUpdate
}) => {
    const {
        isAddingBatch, setIsAddingBatch,
        isEditingBatch, setIsEditingBatch,
        isAddingStudent, setIsAddingStudent,
        isAssigningStudents, setIsAssigningStudents,
        editingBatchData, setEditingBatchData,
        selectedStudents, setSelectedStudents,
        availableStudents,
        showPassword, setShowPassword,
        newBatch, setNewBatch,
        newStudent, setNewStudent,
        copyToClipboard,
        loadAvailableStudents,
        handleAddBatch,
        handleUpdateBatch,
        handleAddStudent,
        handleAssignStudents,
        handleDeleteStudent
    } = useStudentsTab({ selectedBatch, onUpdate });

    const selectedBatchData = batches.find(b => b.id === selectedBatch);
    const batchStudents = students.filter(s => s.batchId === selectedBatch);

    return (
        <div className="space-y-6">
            <BatchHeader
                isDarkMode={isDarkMode}
                selectedBatch={selectedBatch}
                setSelectedBatch={setSelectedBatch}
                batches={batches}
                setIsAddingBatch={setIsAddingBatch}
                setIsAddingStudent={setIsAddingStudent}
                setIsAssigningStudents={setIsAssigningStudents}
                loadAvailableStudents={loadAvailableStudents}
            />

            <BatchInfo
                isDarkMode={isDarkMode}
                selectedBatchData={selectedBatchData}
                studentCount={batchStudents.length}
                setEditingBatchData={setEditingBatchData}
                setIsEditingBatch={setIsEditingBatch}
            />

            <StudentsList
                isDarkMode={isDarkMode}
                students={batchStudents}
                handleDeleteStudent={handleDeleteStudent}
            />

            {/* Create Batch Modal */}
            <BatchModal
                isDarkMode={isDarkMode}
                isOpen={isAddingBatch}
                onClose={() => setIsAddingBatch(false)}
                mode="create"
                batchData={newBatch}
                setBatchData={setNewBatch}
                onSubmit={handleAddBatch}
                roadmaps={roadmaps}
            />

            {/* Edit Batch Modal */}
            {editingBatchData && (
                <BatchModal
                    isDarkMode={isDarkMode}
                    isOpen={isEditingBatch}
                    onClose={() => {
                        setIsEditingBatch(false);
                        setEditingBatchData(null);
                    }}
                    mode="edit"
                    batchData={editingBatchData}
                    setBatchData={setEditingBatchData}
                    onSubmit={handleUpdateBatch}
                />
            )}

            <StudentModal
                isDarkMode={isDarkMode}
                isOpen={isAddingStudent}
                onClose={() => setIsAddingStudent(false)}
                studentData={newStudent}
                setStudentData={setNewStudent}
                onSubmit={handleAddStudent}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                copyToClipboard={copyToClipboard}
            />

            <AssignStudentsModal
                isDarkMode={isDarkMode}
                isOpen={isAssigningStudents}
                onClose={() => {
                    setIsAssigningStudents(false);
                    setSelectedStudents([]);
                }}
                availableStudents={availableStudents}
                selectedStudents={selectedStudents}
                setSelectedStudents={setSelectedStudents}
                onSubmit={handleAssignStudents}
            />
        </div>
    );
};
