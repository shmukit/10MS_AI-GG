import React, { useState, memo, useEffect } from 'react';
import { RoadmapNode } from './RoadmapNode';
import { NodeContentPanel } from './NodeContentPanel';
import { RoadmapNodeData } from './RoadmapNode';

interface RoadmapCanvasProps {
  roadmapNodes: RoadmapNodeData[];
  onRefresh?: () => void;
  batchId?: string | null;
  targetWeekNumber?: number | null;
  nodeUnitLabel?: string;
  onOpenDecisionTree?: () => void;
}

export const RoadmapCanvas: React.FC<RoadmapCanvasProps> = memo(({ roadmapNodes, onRefresh, batchId, targetWeekNumber, nodeUnitLabel = 'Week', onOpenDecisionTree }) => {
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
      const targetNode = roadmapNodes.find(node =>
        node.weekNumber === targetWeekNumber ||
        (node.weekNumber == null && roadmapNodes.indexOf(node) + 1 === targetWeekNumber)
      );

      if (targetNode && targetNode.status !== 'locked') {
        setSelectedNode(targetNode);

        // Optional: Scroll to the target node
        setTimeout(() => {
          const nodeElement = document.getElementById(`roadmap-node-${targetWeekNumber}`);
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
    <div className="flex flex-col lg:flex-row h-full transition-colors duration-200 bg-background">
      {/* Main Roadmap Area */}
      <div className={`transition-all duration-300 ${selectedNode ? 'w-full lg:w-2/3' : 'w-full'}`}>
        <div className="h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-12 pb-32 lg:pb-12">
            {/* Roadmap Path */}
            <div className="relative">
              {/* Timeline spine — always behind cards */}
              <div
                className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-0.5 -translate-x-1/2 bg-border"
                aria-hidden="true"
              />

              {/* Nodes */}
              <div className="relative z-10 space-y-8 lg:space-y-16">
                {roadmapNodes.map((node, index) => {
                  const nodeNumber = node.weekNumber ?? index + 1;
                  const isEven = index % 2 === 0;

                  return (
                    <div key={node.id} id={`roadmap-node-${nodeNumber}`} className="relative z-10">
                      {/* Connection dot — desktop alternating layout only */}
                      <div className="hidden lg:block absolute left-1/2 top-6 z-20 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-border bg-card sm:top-8 sm:h-4 sm:w-4 sm:border-4" />

                      {/* Card — full width on mobile; alternating halves on lg+ */}
                      <div
                        className={
                          isEven
                            ? 'flex justify-center lg:block lg:pr-[50%] lg:text-right'
                            : 'flex justify-center lg:block lg:pl-[50%] lg:text-left'
                        }
                      >
                        <div
                          className={
                            isEven
                              ? 'relative z-10 w-full max-w-md lg:mr-8 lg:inline-block lg:w-80'
                              : 'relative z-10 w-full max-w-md lg:ml-8 lg:inline-block lg:w-80'
                          }
                        >
                          <RoadmapNode
                            node={node}
                            onClick={() => handleNodeClick(node)}
                            isAlternate={!isEven}
                            nodeUnitLabel={nodeUnitLabel}
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
          onRefresh={onRefresh}
          batchId={batchId || undefined}
          nodeUnitLabel={nodeUnitLabel}
          onOpenDecisionTree={onOpenDecisionTree}
        />
      )}
    </div>
  );
});