import React, { useEffect, useRef } from 'react';
import { Map, ChevronDown } from 'lucide-react';
import { Button } from '../../ui/Button';
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

    if (!enrolledBatches || enrolledBatches.length <= 1) return null;

    return (
        <div className="relative roadmap-dropdown-container" ref={dropdownRef}>
            <Button
                variant="ghost"
                onClick={() => setShowDropdown(!showDropdown)}
                className="gap-2 border border-border bg-card hover:bg-muted"
            >
                <Map className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                    {currentBatch?.name || currentBatch?.title || 'Select Batch'}
                </span>
                <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform duration-200', showDropdown && 'rotate-180')} />
            </Button>

            {showDropdown && (
                <div className="absolute top-full right-0 mt-2 rounded-xl shadow-modal z-10 border border-border bg-card min-w-48">
                    <div className="py-2">
                        {enrolledBatches.map((batch: any) => (
                            <Button
                                key={batch.id}
                                variant="ghost"
                                onClick={() => handleBatchChange(batch.id)}
                                className={cn(
                                    'w-full justify-start font-normal',
                                    selectedBatchId === batch.id && 'bg-accent text-accent-foreground'
                                )}
                            >
                                {batch.name}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
