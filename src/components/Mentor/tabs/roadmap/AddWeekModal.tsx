import React from 'react';
import { X } from 'lucide-react';

interface AddWeekModalProps {
    isOpen: boolean;
    onClose: () => void;
    roadmapTitle: string;
    currentWeeks: number;
    onAddWeek: () => void;
}

export const AddWeekModal: React.FC<AddWeekModalProps> = ({
    isOpen,
    onClose,
    roadmapTitle,
    currentWeeks,
    onAddWeek
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="rounded-xl p-6 shadow-lg max-w-md w-full mx-4 border border-border bg-card transition-colors duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground transition-colors duration-200">
                        Add Week to {roadmapTitle}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg transition-colors hover:bg-accent text-muted-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Current Weeks: {currentWeeks}
                        </label>
                        <p className="text-sm text-muted-foreground transition-colors duration-200">
                            Adding a new week will extend this roadmap to {currentWeeks + 1} weeks.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onAddWeek}
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                            Add Week
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
