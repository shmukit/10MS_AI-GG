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
    onUpdate: () => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({
    students,
    batches,
    roadmaps,
    selectedBatch,
    setSelectedBatch,
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
        handleDeleteStudent,
        handleSyncProgress,
        isSyncingProgress,
        userRole
    } = useStudentsTab({ selectedBatch, onUpdate });

    const selectedBatchData = batches.find(b => b.id === selectedBatch);
    const batchStudents = students.filter(s => s.batchId === selectedBatch);

    return (
        <div className="space-y-6">
            <BatchHeader
                selectedBatch={selectedBatch}
                setSelectedBatch={setSelectedBatch}
                batches={batches}
                setIsAddingBatch={setIsAddingBatch}
                setIsAddingStudent={setIsAddingStudent}
                setIsAssigningStudents={setIsAssigningStudents}
                loadAvailableStudents={loadAvailableStudents}
                onSyncProgress={handleSyncProgress}
                isSyncingProgress={isSyncingProgress}
                userRole={userRole}
            />

            <BatchInfo
                selectedBatchData={selectedBatchData}
                studentCount={batchStudents.length}
                setEditingBatchData={setEditingBatchData}
                setIsEditingBatch={setIsEditingBatch}
            />

            <StudentsList
                students={batchStudents}
                handleDeleteStudent={handleDeleteStudent}
            />

            <BatchModal
                isOpen={isAddingBatch}
                onClose={() => setIsAddingBatch(false)}
                mode="create"
                batchData={newBatch}
                setBatchData={setNewBatch}
                onSubmit={handleAddBatch}
                roadmaps={roadmaps}
            />

            {editingBatchData && (
                <BatchModal
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
