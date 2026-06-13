import React from 'react';
import { Users, Edit2 } from 'lucide-react';
import { Batch } from '../../../../types/mentor';

interface BatchInfoProps {
    selectedBatchData: Batch | undefined;
    studentCount: number;
    setEditingBatchData: (data: Batch) => void;
    setIsEditingBatch: (isEditing: boolean) => void;
}

export const BatchInfo: React.FC<BatchInfoProps> = ({
    selectedBatchData,
    studentCount,
    setEditingBatchData,
    setIsEditingBatch
}) => {
    if (!selectedBatchData) return null;

    return (
        <div className="rounded-xl p-6 border border-border bg-card transition-colors duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-lg font-semibold mb-4 text-foreground transition-colors duration-200">
                        {selectedBatchData.name}
                    </h4>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground transition-colors duration-200">
                            <strong>Students:</strong> {studentCount}
                        </p>
                        <p className="text-sm text-muted-foreground transition-colors duration-200">
                            <strong>Created:</strong> {selectedBatchData.createdDate}
                        </p>
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
                    <div className="flex justify-end">
                        <button
                            onClick={() => {
                                setEditingBatchData(selectedBatchData);
                                setIsEditingBatch(true);
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors bg-muted text-foreground hover:bg-muted/80 border border-border"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit Batch Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
