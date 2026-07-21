import React from 'react';
import { GitBranch, Map } from 'lucide-react';
import type { EnabledDecisionTree } from '../../types/models';
import type { RoadmapView } from './hooks/types';

interface RoadmapViewTabsProps {
  activeView: RoadmapView;
  nodeUnitLabel: string;
  enabledTrees: EnabledDecisionTree[];
  selectedTreeKey: string;
  onViewChange: (view: RoadmapView, treeKey?: string) => void;
}

export const RoadmapViewTabs: React.FC<RoadmapViewTabsProps> = ({
  activeView,
  nodeUnitLabel,
  enabledTrees,
  selectedTreeKey,
  onViewChange,
}) => (
  <div className="border-b border-border bg-card">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-wrap gap-1 py-2">
        <button
          onClick={() => onViewChange('sessions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'sessions'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          }`}
        >
          <Map className="w-4 h-4" />
          {nodeUnitLabel}s
        </button>
        {enabledTrees.length === 1 ? (
          <button
            onClick={() => onViewChange('decision-tree', enabledTrees[0].tree_key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'decision-tree'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            {enabledTrees[0].title}
          </button>
        ) : (
          enabledTrees.map((tree) => (
            <button
              key={tree.id}
              onClick={() => onViewChange('decision-tree', tree.tree_key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'decision-tree' && selectedTreeKey === tree.tree_key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              {tree.title}
            </button>
          ))
        )}
      </div>
    </div>
  </div>
);
