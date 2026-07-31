import React from 'react';
import type { RoadmapNodeData } from '../RoadmapNode';

interface MarkWeekCompleteButtonProps {
  node: RoadmapNodeData;
  nodeUnitLabel: string;
  isCompleted: boolean;
  isMarkingComplete: boolean;
  onMarkAsComplete: () => void;
}

export const MarkWeekCompleteButton: React.FC<MarkWeekCompleteButtonProps> = ({
  node,
  nodeUnitLabel,
  isCompleted,
  isMarkingComplete,
  onMarkAsComplete,
}) => {
  if (node.status !== 'active' && node.status !== 'completed') {
    return null;
  }

  return (
    <div className="mb-6">
      <button
        onClick={onMarkAsComplete}
        disabled={node.status === 'completed' || !isCompleted || isMarkingComplete}
        className={`w-full py-3 px-4 rounded-full font-medium flex items-center justify-center gap-2 ${
          isMarkingComplete
            ? 'bg-muted text-muted-foreground cursor-wait'
            : node.status === 'completed'
              ? 'bg-primary text-primary-foreground cursor-default'
              : isCompleted
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        {isMarkingComplete
          ? 'Processing...'
          : node.status === 'completed'
            ? `${nodeUnitLabel} Completed ✓`
            : isCompleted
              ? `Mark ${nodeUnitLabel} as Complete`
              : 'Complete all tasks first'}
      </button>
    </div>
  );
};
