import React from 'react';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { RoadmapCanvas } from './RoadmapCanvas';
import { ProgressBar } from './ProgressBar';
import { roadmapData } from '../../data/roadmapData';

interface RoadmapInterfaceProps {
  onBack: () => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

export const RoadmapInterface: React.FC<RoadmapInterfaceProps> = ({ onBack, isDarkMode = false, toggleDarkMode }) => {
  const completedNodes = roadmapData.nodes.filter(node => node.status === 'completed').length;
  const totalNodes = roadmapData.nodes.length;

  return (
    <div className={`h-screen flex flex-col transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b h-16 transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">10MS</span>
              </div>
              <h1 className={`text-xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>10MS SheSTEM</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {toggleDarkMode && (
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}
              <div className="flex items-center gap-2">
                <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Amira K.</span>
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className={`border-b h-16 transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`flex items-center gap-2 transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <h1 className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Python Learning Roadmap</h1>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar completed={completedNodes} total={totalNodes} isDarkMode={isDarkMode} />

      {/* Canvas */}
      <div className="flex-1 relative">
        <RoadmapCanvas isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};