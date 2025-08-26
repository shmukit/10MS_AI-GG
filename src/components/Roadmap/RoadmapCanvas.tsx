import React, { useState } from 'react';
import { RoadmapNode } from './RoadmapNode';
import { ConnectionLine } from './ConnectionLine';
import { NodeContentPanel } from './NodeContentPanel';
import { roadmapData } from '../../data/roadmapData';
import { RoadmapNodeData } from './RoadmapNode';

interface RoadmapCanvasProps {
  isDarkMode?: boolean;
}

export const RoadmapCanvas: React.FC<RoadmapCanvasProps> = ({ isDarkMode = false }) => {
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
    <div className={`flex h-full transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Main Roadmap Area */}
      <div className={`transition-all duration-300 ${selectedNode ? 'w-2/3' : 'w-full'}`}>
        <div className="h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-12">
            {/* Roadmap Title */}
            <div className="text-center mb-12">
              <h1 className={`text-3xl font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Python Learning Path</h1>
              <p className={`max-w-2xl mx-auto transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Master Python programming through this structured learning path. Complete each milestone to unlock the next level.
              </p>
            </div>

            {/* Roadmap Path */}
            <div className="relative">
              {/* Main Path Line */}
              <div className={`absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full transition-colors duration-200 ${
                isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}></div>
              
              {/* Nodes */}
              <div className="space-y-16">
                {roadmapData.nodes.map((node, index) => (
                  <div key={node.id} className="relative">
                    {/* Connection Point */}
                    <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 z-10 transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-600' 
                        : 'bg-white border-gray-300'
                    }`}></div>
                    
                    {/* Node */}
                    <div className={`${index % 2 === 0 ? 'pr-1/2 text-right' : 'pl-1/2 text-left'}`}>
                      <div className={`inline-block ${index % 2 === 0 ? 'mr-8' : 'ml-8'}`}>
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
        />
      )}
    </div>
  );
};