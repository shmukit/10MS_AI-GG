import React from 'react';
import { BatchResourceToggles } from './BatchResourceToggles';
import type { BatchResourceSelection } from '../../../../types/models';

const inputClass = 'w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 transition-colors duration-200 bg-muted text-foreground';

interface BatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    batchData: any;
    setBatchData: (data: any) => void;
    onSubmit: () => void;
    roadmaps?: any[];
    resourceSelection?: BatchResourceSelection;
    onResourceSelectionChange?: (selection: BatchResourceSelection) => void;
}

export const BatchModal: React.FC<BatchModalProps> = ({
    isOpen,
    onClose,
    mode,
    batchData,
    setBatchData,
    onSubmit,
    roadmaps,
    resourceSelection,
    onResourceSelectionChange,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="max-w-md w-full mx-4 p-6 rounded-xl shadow-lg bg-card transition-colors duration-200">
                <h3 className="text-lg font-bold mb-4 text-foreground transition-colors duration-200">
                    {mode === 'create' ? 'Create New Batch' : `Edit Batch: ${batchData.name}`}
                </h3>

                <div className="space-y-4 mb-6">
                    {mode === 'create' ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                    Batch Name
                                </label>
                                <input
                                    type="text"
                                    value={batchData.name}
                                    onChange={(e) => setBatchData({ ...batchData, name: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                    Assign Roadmap
                                </label>
                                <select
                                    value={batchData.roadmapId}
                                    onChange={(e) => {
                                        const selectedRoadmap = roadmaps?.find(r => r.id === e.target.value);
                                        setBatchData({
                                            ...batchData,
                                            roadmapId: e.target.value,
                                            roadmapName: selectedRoadmap?.name || ''
                                        });
                                    }}
                                    className={inputClass}
                                    required
                                >
                                    <option value="">Select Roadmap</option>
                                    {roadmaps?.map(roadmap => (
                                        <option key={roadmap.id} value={roadmap.id}>
                                            {roadmap.title} ({roadmap.total_weeks} weeks)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={batchData.startDate || ''}
                                    onChange={(e) => setBatchData({ ...batchData, startDate: e.target.value })}
                                    className={inputClass}
                                    placeholder="Select start date"
                                />
                            </div>

                            {batchData.roadmapId && resourceSelection && onResourceSelectionChange && (
                                <BatchResourceToggles
                                    roadmapId={batchData.roadmapId}
                                    selection={resourceSelection}
                                    onChange={onResourceSelectionChange}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            {batchData.roadmapId && resourceSelection && onResourceSelectionChange && (
                                <BatchResourceToggles
                                    roadmapId={batchData.roadmapId}
                                    batchId={batchData.id}
                                    selection={resourceSelection}
                                    onChange={onResourceSelectionChange}
                                />
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                    WhatsApp Group Link
                                </label>
                                <input
                                    type="url"
                                    value={batchData.whatsappLink}
                                    onChange={(e) => setBatchData({ ...batchData, whatsappLink: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                    Discord Server Link
                                </label>
                                <input
                                    type="url"
                                    value={batchData.discordLink}
                                    onChange={(e) => setBatchData({ ...batchData, discordLink: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                    Emergency Contact
                                </label>
                                <input
                                    type="tel"
                                    value={batchData.emergencyContact}
                                    onChange={(e) => setBatchData({ ...batchData, emergencyContact: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                    Cohort status
                                </label>
                                <select
                                    value={batchData.status || 'active'}
                                    onChange={(e) =>
                                        setBatchData({
                                            ...batchData,
                                            status: e.target.value as 'active' | 'completed' | 'cancelled',
                                        })
                                    }
                                    className={inputClass}
                                >
                                    <option value="active">Active (shown as Ongoing on marketing page)</option>
                                    <option value="completed">Completed (moves to Past Batches)</option>
                                    <option value="cancelled">Cancelled (moves to Past Batches)</option>
                                </select>
                                <p className="mt-1.5 text-xs text-muted-foreground">
                                    Updating status changes how this cohort appears on the public homepage.
                                </p>
                            </div>
                        </>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onSubmit}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${mode === 'create' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-foreground hover:bg-muted/80 border border-border'}`}
                        >
                            {mode === 'create' ? 'Create Batch' : 'Update Batch'}
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
        </div>
    );
};
