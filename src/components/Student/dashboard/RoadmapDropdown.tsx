import React, { useEffect, useRef } from 'react';
import { Map, ChevronDown } from 'lucide-react';

interface RoadmapDropdownProps {
    isDarkMode: boolean;
    enrolledBatches: any[];
    currentBatch: any;
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
    handleBatchChange: (id: string) => void;
    selectedBatchId: string;
}

export const RoadmapDropdown: React.FC<RoadmapDropdownProps> = ({
    isDarkMode,
    enrolledBatches,
    currentBatch,
    showDropdown,
    setShowDropdown,
    handleBatchChange,
    selectedBatchId
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close dropdown
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
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md ${isDarkMode
                    ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
            >
                <Map className="w-4 h-4" />
                <span className="text-sm font-medium">
                    {currentBatch?.name || 'Select Batch'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Roadmap Dropdown */}
            {showDropdown && (
                <div className={`absolute top-full right-0 mt-2 rounded-lg shadow-lg z-10 border min-w-48 transition-colors duration-200 ${isDarkMode
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                    }`}>
                    <div className="py-2">
                        {enrolledBatches.map((batch: any) => (
                            <button
                                key={batch.id}
                                onClick={() => handleBatchChange(batch.id)}
                                className={`w-full text-left px-4 py-2 text-sm transition-all duration-200 ${isDarkMode
                                    ? 'hover:bg-gray-700 text-gray-300 hover:text-white hover:bg-opacity-80'
                                    : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900 hover:bg-opacity-80'
                                    } ${selectedBatchId === batch.id ? (isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-700') : ''}`}
                            >
                                {batch.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
