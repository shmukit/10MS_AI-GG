import React, { useEffect, useRef } from 'react';
import { Map, ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface RoadmapDropdownProps {
    enrolledBatches: any[];
    currentBatch: any;
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
    handleBatchChange: (id: string) => void;
    selectedBatchId: string;
}

export const RoadmapDropdown: React.FC<RoadmapDropdownProps> = ({
    enrolledBatches,
    currentBatch,
    showDropdown,
    setShowDropdown,
    handleBatchChange,
    selectedBatchId
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const batches = enrolledBatches || [];
    const hasMultiple = batches.length > 1;
    const label = currentBatch?.name || currentBatch?.title || batches[0]?.name || 'Select cohort';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown, setShowDropdown]);

    // Always show current cohort context when at least one enrollment exists
    if (batches.length === 0 && !currentBatch) return null;

    // Single batch: read-only label (still visible so students know which cohort they're in)
    if (!hasMultiple) {
        return (
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2">
                <Map className="w-4 h-4 text-primary shrink-0" aria-hidden />
                <span className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-none">
                    {label}
                </span>
            </div>
        );
    }

    return (
        <div className="relative roadmap-dropdown-container w-full sm:w-auto" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-expanded={showDropdown}
                aria-haspopup="listbox"
                className="inline-flex w-full sm:w-auto items-center gap-2 rounded-full border border-border bg-card px-3 py-2 hover:bg-muted transition-colors"
            >
                <Map className="w-4 h-4 text-primary shrink-0" aria-hidden />
                <span className="text-sm font-medium text-foreground truncate max-w-[220px]">
                    {label}
                </span>
                <ChevronDown
                    className={cn(
                        'w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0',
                        showDropdown && 'rotate-180'
                    )}
                />
            </button>

            {showDropdown && (
                <div
                    role="listbox"
                    className="absolute top-full left-0 right-0 sm:left-auto sm:right-0 mt-2 rounded-xl shadow-modal z-20 border border-border bg-card min-w-56 max-h-72 overflow-y-auto"
                >
                    <div className="py-2">
                        {batches.map((batch: any) => (
                            <button
                                key={batch.id}
                                type="button"
                                role="option"
                                aria-selected={selectedBatchId === batch.id}
                                onClick={() => handleBatchChange(batch.id)}
                                className={cn(
                                    'w-full text-left px-4 py-2.5 text-sm transition-colors',
                                    selectedBatchId === batch.id
                                        ? 'bg-accent text-accent-foreground font-medium'
                                        : 'text-foreground hover:bg-muted'
                                )}
                            >
                                <span className="block truncate">{batch.name}</span>
                                {batch.roadmap?.title && (
                                    <span className="block text-xs text-muted-foreground truncate mt-0.5">
                                        {batch.roadmap.title}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
