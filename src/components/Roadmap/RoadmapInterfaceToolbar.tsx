import React from 'react';
import { ArrowLeft, Presentation, ChevronDown } from 'lucide-react';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import type { EnabledSlideDeck } from '../../services/database';

interface RoadmapInterfaceToolbarProps {
  batchName: string;
  enabledSlides: EnabledSlideDeck[];
  onBack: () => void;
  onOpenSlides: () => void;
}

export const RoadmapInterfaceToolbar: React.FC<RoadmapInterfaceToolbarProps> = ({
  batchName,
  enabledSlides,
  onBack,
  onOpenSlides,
}) => (
  <div className="border-b border-border min-h-12 md:min-h-16 bg-card">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 md:py-4">
      <Breadcrumbs
        className="mb-2 md:mb-3"
        items={[
          { label: 'Dashboard', href: '/student/dashboard' },
          { label: 'Roadmap' },
          { label: batchName },
        ]}
      />
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 md:gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span className="font-medium text-xs md:text-base">Back to Dashboard</span>
        </button>

        {enabledSlides.length > 0 && (
          <button
            type="button"
            onClick={onOpenSlides}
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-primary text-primary-foreground text-xs md:text-sm font-medium hover:bg-primary/90"
          >
            <Presentation className="w-4 h-4" />
            View Slides
            {enabledSlides.length > 1 && <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  </div>
);
