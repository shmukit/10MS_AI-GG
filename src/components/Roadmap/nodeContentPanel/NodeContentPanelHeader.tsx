import React from 'react';
import { X } from 'lucide-react';
import type { RoadmapNodeData } from '../RoadmapNode';

interface NodeContentPanelHeaderProps {
  node: RoadmapNodeData;
  onClose: () => void;
}

export const NodeContentPanelHeader: React.FC<NodeContentPanelHeaderProps> = ({ node, onClose }) => (
  <>
    <div className="lg:hidden flex justify-center pt-2 pb-1">
      <div className="w-8 h-1 rounded-full bg-muted"></div>
    </div>

    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border transition-colors duration-200">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {node.status === 'completed' ? (
          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
            <svg className="w-4 h-4 text-accent-foreground" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        ) : node.status === 'active' ? (
          <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-border" />
        )}
        <h2 className="text-lg sm:text-xl font-bold truncate text-foreground">{node.title}</h2>
      </div>
      <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" aria-label="Close panel">
        <X className="w-5 h-5" />
      </button>
    </div>
  </>
);
