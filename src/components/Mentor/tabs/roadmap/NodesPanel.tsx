import React from 'react';
import { Edit2 } from 'lucide-react';

export interface RoadmapNodeSummary {
  id: string;
  week_number: number;
  title: string;
  description?: string;
  domain: string;
}

interface NodesPanelProps {
  nodes: RoadmapNodeSummary[];
  nodeUnitLabel: string;
  onEditNode: (node: RoadmapNodeSummary) => void;
}

export const NodesPanel: React.FC<NodesPanelProps> = ({ nodes, nodeUnitLabel, onEditNode }) => {
  if (nodes.length === 0) {
    return (
      <div className="rounded-xl p-4 border border-border bg-card text-sm text-muted-foreground">
        No {nodeUnitLabel.toLowerCase()} nodes yet. Use &quot;Add {nodeUnitLabel}&quot; to create one.
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4 border border-border bg-card transition-colors duration-200">
      <h3 className="text-sm font-semibold text-foreground mb-3">
        {nodeUnitLabel} Nodes
      </h3>
      <div className="space-y-2">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border bg-muted/30"
          >
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{node.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {nodeUnitLabel} {node.week_number} · {node.domain}
              </p>
              {node.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{node.description}</p>
              )}
            </div>
            <button
              onClick={() => onEditNode(node)}
              className="shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium border border-border bg-card hover:bg-accent text-foreground flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
