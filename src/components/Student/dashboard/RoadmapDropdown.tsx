import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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

function getBatchLabel(batch: any): { primary: string; secondary?: string } {
    const roadmapTitle = batch?.roadmap?.title || batch?.title;
    const batchName = batch?.name;
    if (roadmapTitle && batchName && roadmapTitle !== batchName) {
        return { primary: roadmapTitle, secondary: batchName };
    }
    return { primary: batchName || roadmapTitle || 'Select cohort' };
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
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [menuStyle, setMenuStyle] = useState<{
        top: number;
        left: number;
        minWidth: number;
        maxWidth: number;
    } | null>(null);
    const batches = enrolledBatches || [];
    const hasMultiple = batches.length > 1;
    const { primary, secondary } = getBatchLabel(currentBatch || batches[0]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                dropdownRef.current?.contains(target) ||
                (event.target as Element).closest('[data-roadmap-dropdown-menu]')
            ) {
                return;
            }
            setShowDropdown(false);
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown, setShowDropdown]);

    useEffect(() => {
        if (!showDropdown || !buttonRef.current) {
            setMenuStyle(null);
            return;
        }

        const updatePosition = () => {
            const rect = buttonRef.current!.getBoundingClientRect();
            // fixed + block without an explicit width stretches to the viewport;
            // pin width to the trigger and clamp so the menu stays under the button.
            const minWidth = Math.max(Math.round(rect.width), 224);
            const maxWidth = Math.min(320, Math.max(16, window.innerWidth - 16));
            const width = Math.min(minWidth, maxWidth);
            let left = rect.left;
            if (left + width > window.innerWidth - 8) {
                left = Math.max(8, window.innerWidth - 8 - width);
            }
            if (left < 8) left = 8;
            setMenuStyle({
                top: rect.bottom + 8,
                left,
                minWidth: width,
                maxWidth,
            });
        };

        updatePosition();
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [showDropdown]);

    if (batches.length === 0 && !currentBatch) return null;

    const labelContent = (
        <span className="min-w-0 text-left">
            <span className="block text-sm font-medium text-foreground truncate max-w-[220px] sm:max-w-[280px]">
                {primary}
            </span>
            {secondary && (
                <span className="block text-xs text-muted-foreground truncate max-w-[220px] sm:max-w-[280px]">
                    {secondary}
                </span>
            )}
        </span>
    );

    if (!hasMultiple) {
        return (
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2">
                <Map className="w-4 h-4 text-primary shrink-0" aria-hidden />
                {labelContent}
            </div>
        );
    }

    const menuPortal =
        showDropdown && menuStyle
            ? createPortal(
                  <div
                      data-roadmap-dropdown-menu
                      role="listbox"
                      className="fixed z-[100] w-max rounded-xl shadow-modal border border-border bg-card max-h-72 overflow-y-auto py-2"
                      style={{
                          top: menuStyle.top,
                          left: menuStyle.left,
                          width: menuStyle.minWidth,
                          minWidth: menuStyle.minWidth,
                          maxWidth: menuStyle.maxWidth,
                      }}
                  >
                      {batches.map((batch: any) => {
                          const item = getBatchLabel(batch);
                          return (
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
                                  <span className="block truncate">{item.primary}</span>
                                  {item.secondary && (
                                      <span className="block text-xs text-muted-foreground truncate mt-0.5">
                                          {item.secondary}
                                      </span>
                                  )}
                              </button>
                          );
                      })}
                  </div>,
                  document.body
              )
            : null;

    return (
        <div className="relative roadmap-dropdown-container w-full sm:w-auto" ref={dropdownRef}>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-expanded={showDropdown}
                aria-haspopup="listbox"
                className="inline-flex w-full sm:w-auto items-center gap-2 rounded-full border border-border bg-card px-3 py-2 hover:bg-muted transition-colors"
            >
                <Map className="w-4 h-4 text-primary shrink-0" aria-hidden />
                {labelContent}
                <ChevronDown
                    className={cn(
                        'w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0',
                        showDropdown && 'rotate-180'
                    )}
                />
            </button>
            {menuPortal}
        </div>
    );
};
