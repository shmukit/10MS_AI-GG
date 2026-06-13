import React from 'react';
import { Plus, Users, RefreshCw } from 'lucide-react';
import { Batch } from '../../../../types/mentor';

interface BatchHeaderProps {
    selectedBatch: string;
    setSelectedBatch: (id: string) => void;
    batches: Batch[];
    setIsAddingBatch: (isAdding: boolean) => void;
    setIsAddingStudent: (isAdding: boolean) => void;
    setIsAssigningStudents: (isAssigning: boolean) => void;
    loadAvailableStudents: () => Promise<void>;
    onSyncProgress?: () => Promise<void>;
    isSyncingProgress?: boolean;
    userRole?: string | null;
}

export const BatchHeader: React.FC<BatchHeaderProps> = ({
    selectedBatch,
    setSelectedBatch,
    batches,
    setIsAddingBatch,
    setIsAddingStudent,
    setIsAssigningStudents,
    loadAvailableStudents,
    onSyncProgress,
    isSyncingProgress,
    userRole
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-foreground transition-colors duration-200">
                    Batch & Students Management
                </h3>
                <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-border bg-muted text-foreground transition-colors"
                >
                    {batches.map(batch => (
                        <option key={batch.id} value={batch.id}>{batch.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex gap-2 flex-wrap">
                {(userRole === 'admin' || userRole === 'mentor') && (
                    <button
                        onClick={() => setIsAddingBatch(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Batch
                    </button>
                )}
                {selectedBatch && (
                    <>
                        <button
                            onClick={() => setIsAddingStudent(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Student
                        </button>
                        <button
                            onClick={async () => {
                                setIsAssigningStudents(true);
                                await loadAvailableStudents();
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors"
                        >
                            <Users className="w-4 h-4" />
                            Assign Students
                        </button>
                        {onSyncProgress && (
                            <button
                                onClick={onSyncProgress}
                                disabled={isSyncingProgress}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isSyncingProgress
                                    ? 'bg-muted cursor-not-allowed text-muted-foreground'
                                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                                    }`}
                                title="Sync progress from completed tasks - fixes stale 0% display"
                            >
                                <RefreshCw className={`w-4 h-4 ${isSyncingProgress ? 'animate-spin' : ''}`} />
                                {isSyncingProgress ? 'Syncing...' : 'Sync Progress'}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
