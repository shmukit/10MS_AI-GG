import React from 'react';
import { Plus, Users, RefreshCw } from 'lucide-react';
import { Batch } from '../../../../types/mentor';
import { Button } from '../../../ui/Button';

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
                    <Button variant="outline" size="sm" onClick={() => setIsAddingBatch(true)}>
                        <Plus className="w-4 h-4" />
                        New Batch
                    </Button>
                )}
                {selectedBatch && (
                    <>
                        <Button size="sm" onClick={() => setIsAddingStudent(true)}>
                            <Plus className="w-4 h-4" />
                            Add Student
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                                setIsAssigningStudents(true);
                                await loadAvailableStudents();
                            }}
                        >
                            <Users className="w-4 h-4" />
                            Assign Students
                        </Button>
                        {onSyncProgress && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onSyncProgress}
                                disabled={isSyncingProgress}
                                isLoading={isSyncingProgress}
                                title="Sync progress from completed tasks - fixes stale 0% display"
                            >
                                {!isSyncingProgress && <RefreshCw className="w-4 h-4" />}
                                {isSyncingProgress ? 'Syncing...' : 'Sync Progress'}
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
