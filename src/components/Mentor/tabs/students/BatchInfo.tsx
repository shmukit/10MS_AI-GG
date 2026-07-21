import React from 'react';
import { Users, Edit2 } from 'lucide-react';
import { Batch } from '../../../../types/mentor';
import { Badge } from '../../../ui/Badge';

interface BatchInfoProps {
    selectedBatchData: Batch | undefined;
    studentCount: number;
    setEditingBatchData: (data: Batch) => void;
    setIsEditingBatch: (isEditing: boolean) => void;
}

const statusLabel: Record<NonNullable<Batch['status']>, string> = {
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

const statusVariant: Record<NonNullable<Batch['status']>, 'default' | 'success' | 'muted' | 'warning'> = {
    active: 'default',
    completed: 'success',
    cancelled: 'muted',
};

export const BatchInfo: React.FC<BatchInfoProps> = ({
    selectedBatchData,
    studentCount,
    setEditingBatchData,
    setIsEditingBatch
}) => {
    if (!selectedBatchData) return null;

    const batchStatus = selectedBatchData.status || 'active';

    return (
        <div className="rounded-xl p-6 border border-border bg-card transition-colors duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <h4 className="text-lg font-semibold text-foreground transition-colors duration-200">
                            {selectedBatchData.name}
                        </h4>
                        <Badge variant={statusVariant[batchStatus]}>{statusLabel[batchStatus]}</Badge>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground transition-colors duration-200">
                            <strong>Students:</strong> {studentCount}
                        </p>
                        <p className="text-sm text-muted-foreground transition-colors duration-200">
                            <strong>Created:</strong> {selectedBatchData.createdDate}
                        </p>
                        {batchStatus === 'completed' && (
                            <p className="text-sm text-muted-foreground">
                                This cohort appears under <strong>Past Batches</strong> on the public marketing page.
                            </p>
                        )}
                    </div>
                </div>
                <div className="space-y-3">
                    {selectedBatchData.whatsappLink && (
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <a href={selectedBatchData.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 text-sm">
                                WhatsApp Group
                            </a>
                        </div>
                    )}
                    <div className="flex flex-wrap justify-end gap-2">
                        {batchStatus === 'active' && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingBatchData({ ...selectedBatchData, status: 'completed' });
                                    setIsEditingBatch(true);
                                }}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                            >
                                Mark cohort complete
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                setEditingBatchData(selectedBatchData);
                                setIsEditingBatch(true);
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors bg-muted text-foreground hover:bg-muted/80 border border-border text-sm"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit batch details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
