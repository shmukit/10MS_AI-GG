import React from 'react';
import { Award, Clock } from 'lucide-react';
import type { RoadmapNodeData } from '../RoadmapNode';

interface NodeContentPanelMetaProps {
  node: RoadmapNodeData;
  completionRate: number;
}

export const NodeContentPanelMeta: React.FC<NodeContentPanelMetaProps> = ({ node, completionRate }) => (
  <>
    <div className="mb-6">
      <p className="leading-relaxed text-muted-foreground">{node.description}</p>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>{node.estimatedTime}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Award className="w-4 h-4" />
        <span>{node.tasks.length} tasks</span>
      </div>
    </div>

    {node.status === 'active' && (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-foreground">Your Progress</h3>
          <span className="text-sm text-muted-foreground">{Math.round(completionRate * 100)}% Complete</span>
        </div>
        <div className="progress-track w-full rounded-full h-2">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-500"
            style={{ width: `${completionRate * 100}%` }}
          />
        </div>
      </div>
    )}
  </>
);
