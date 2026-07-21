import React from 'react';
import { ArrowLeft, GitBranch, Map, Presentation, ChevronDown } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import type { BatchEnabledResources } from '../../services/database';

type RoadmapView = 'sessions' | 'decision-tree';

interface RoadmapSubheaderProps {
  batchName: string;
  nodeUnitLabel: string;
  completedNodes: number;
  totalNodes: number;
  activeView: RoadmapView;
  showDecisionTree: boolean;
  enabledTrees: BatchEnabledResources['decisionTrees'];
  selectedTreeKey: string;
  enabledSlides: BatchEnabledResources['slideDecks'];
  onBack: () => void;
  onOpenSlides: () => void;
  onViewChange: (view: RoadmapView, treeKey?: string) => void;
}

export const RoadmapSubheader: React.FC<RoadmapSubheaderProps> = ({
  batchName,
  nodeUnitLabel,
  completedNodes,
  totalNodes,
  activeView,
  showDecisionTree,
  enabledTrees,
  selectedTreeKey,
  enabledSlides,
  onBack,
  onOpenSlides,
  onViewChange,
}) => {
  const tabClass = (active: boolean) =>
    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
    }`;

  return (
    <div className="sticky top-0 z-30 border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Dashboard
        </button>

        <div className="mt-2 flex items-start justify-between gap-3">
          <h1 className="min-w-0 text-base sm:text-lg font-semibold text-foreground leading-snug truncate">
            {batchName}
          </h1>
          {enabledSlides.length > 0 && (
            <button
              type="button"
              onClick={onOpenSlides}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 sm:text-sm"
            >
              <Presentation className="w-4 h-4" />
              <span className="hidden sm:inline">Slides</span>
              {enabledSlides.length > 1 && <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
          {showDecisionTree ? (
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => onViewChange('sessions')}
                className={tabClass(activeView === 'sessions')}
              >
                <Map className="w-4 h-4" />
                {nodeUnitLabel}s
              </button>
              {enabledTrees.length === 1 ? (
                <button
                  type="button"
                  onClick={() => onViewChange('decision-tree', enabledTrees[0].tree_key)}
                  className={tabClass(activeView === 'decision-tree')}
                >
                  <GitBranch className="w-4 h-4" />
                  <span className="max-w-[12rem] truncate sm:max-w-none">{enabledTrees[0].title}</span>
                </button>
              ) : (
                enabledTrees.map((tree) => (
                  <button
                    key={tree.id}
                    type="button"
                    onClick={() => onViewChange('decision-tree', tree.tree_key)}
                    className={tabClass(
                      activeView === 'decision-tree' && selectedTreeKey === tree.tree_key
                    )}
                  >
                    <GitBranch className="w-4 h-4" />
                    <span className="max-w-[10rem] truncate">{tree.title}</span>
                  </button>
                ))
              )}
            </div>
          ) : (
            <span className="text-sm font-medium text-muted-foreground">{nodeUnitLabel}s</span>
          )}

          <ProgressBar
            completed={completedNodes}
            total={totalNodes}
            variant="compact"
            className="sm:ml-auto w-full sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
};
