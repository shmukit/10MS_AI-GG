import React, { useState, memo, useEffect } from 'react';
import { RoadmapNode } from './RoadmapNode';
import { NodeContentPanel } from './NodeContentPanel';
import { RoadmapNodeData } from './RoadmapNode';

interface RoadmapCanvasProps {
  isDarkMode?: boolean;
  roadmapNodes: RoadmapNodeData[];
  onRefresh?: () => void; // Add refresh callback
  batchId?: string | null; // Add batchId prop for completion data
  targetWeekNumber?: number | null; // Add target week number for auto-opening
}

export const RoadmapCanvas: React.FC<RoadmapCanvasProps> = memo(({ isDarkMode = false, roadmapNodes, onRefresh, batchId, targetWeekNumber }) => {
  const [selectedNode, setSelectedNode] = useState<RoadmapNodeData | null>(null);

  const handleNodeClick = (node: RoadmapNodeData) => {
    if (node.status !== 'locked') {
      setSelectedNode(node);
    }
  };

  const handleClosePanel = () => {
    setSelectedNode(null);
  };

  // Auto-open target week if specified in URL
  useEffect(() => {
    if (targetWeekNumber && roadmapNodes.length > 0) {
      // Find the node with the target week number
      const targetNode = roadmapNodes.find(node => {
        // Extract week number from node title (assuming format like "Week 1: ...")
        const weekMatch = node.title.match(/Week (\d+)/i);
        if (weekMatch) {
          return parseInt(weekMatch[1], 10) === targetWeekNumber;
        }
        return false;
      });

      if (targetNode && targetNode.status !== 'locked') {
        setSelectedNode(targetNode);

        // Optional: Scroll to the target node
        setTimeout(() => {
          const nodeElement = document.getElementById(`week-${targetWeekNumber}`);
          if (nodeElement) {
            nodeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        }, 100);
      }
    }
  }, [targetWeekNumber, roadmapNodes]);

  return (
    <div className={`flex flex-col lg:flex-row h-full transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Main Roadmap Area */}
      <div className={`transition-all duration-300 ${selectedNode ? 'w-full lg:w-2/3' : 'w-full'}`}>
        <div className="h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-12 pb-32 lg:pb-12">
            {/* Roadmap Path */}
            <div className="relative">
              {/* Main Path Line */}
              <div className={`absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full transition-colors duration-200 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}></div>

              {/* Nodes */}
              <div className="space-y-8 lg:space-y-16">
                {roadmapNodes.map((node, index) => {
                  // Extract week number from node title for ID
                  const weekMatch = node.title.match(/Week (\d+)/i);
                  const weekNumber = weekMatch ? weekMatch[1] : index + 1;

                  return (
                    <div key={node.id} id={`week-${weekNumber}`} className="relative">
                      {/* Connection Point */}
                      <div className={`absolute left-1/2 transform -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 sm:border-4 z-10 transition-colors duration-200 ${isDarkMode
                          ? 'bg-gray-800 border-gray-600'
                          : 'bg-white border-gray-300'
                        }`}></div>

                      {/* Node */}
                      <div className={`${index % 2 === 0 ? 'pr-1/2 text-right' : 'pl-1/2 text-left'}`}>
                        <div className={`inline-block ${index % 2 === 0 ? 'mr-4 sm:mr-8' : 'ml-4 sm:ml-8'}`}>
                          <RoadmapNode
                            node={node}
                            onClick={() => handleNodeClick(node)}
                            isAlternate={index % 2 !== 0}
                            isDarkMode={isDarkMode}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      {selectedNode && (
        <NodeContentPanel
          node={selectedNode}
          onClose={handleClosePanel}
          isDarkMode={isDarkMode}
          onRefresh={onRefresh}
          batchId={batchId || undefined}
        />
      )}
    </div>
  );
});