import React, { useState } from 'react';
import { RoadmapNode } from './RoadmapNode';
import { ConnectionLine } from './ConnectionLine';
import { NodeContentPanel } from './NodeContentPanel';
import { RoadmapNodeData } from './RoadmapNode';

interface RoadmapCanvasProps {
  isDarkMode?: boolean;
  roadmapNodes: RoadmapNodeData[];
  onRefresh?: () => void; // Add refresh callback
  batchId?: string | null; // Add batchId prop for completion data
}

export const RoadmapCanvas: React.FC<RoadmapCanvasProps> = ({ isDarkMode = false, roadmapNodes, onRefresh, batchId }) => {
  const [selectedNode, setSelectedNode] = useState<RoadmapNodeData | null>(null);

  const handleNodeClick = (node: RoadmapNodeData) => {
    if (node.status !== 'locked') {
      setSelectedNode(node);
    }
  };

  const handleClosePanel = () => {
    setSelectedNode(null);
  };

  return (
    <div className={`flex flex-col lg:flex-row h-full transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Main Roadmap Area */}
      <div className={`transition-all duration-300 ${selectedNode ? 'w-full lg:w-2/3' : 'w-full'}`}>
        <div className="h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
            {/* Roadmap Path */}
            <div className="relative">
              {/* Main Path Line */}
              <div className={`absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full transition-colors duration-200 ${
                isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}></div>
              
              {/* Nodes */}
              <div className="space-y-8 lg:space-y-16">
                {roadmapNodes.map((node, index) => (
                  <div key={node.id} className="relative">
                    {/* Connection Point */}
                    <div className={`absolute left-1/2 transform -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 sm:border-4 z-10 transition-colors duration-200 ${
                      isDarkMode 
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
                ))}
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
          batchId={batchId}
        />
      )}
    </div>
  );
};