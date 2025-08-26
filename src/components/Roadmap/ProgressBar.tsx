import React from 'react';
import { Trophy } from 'lucide-react';

interface ProgressBarProps {
  completed: number;
  total: number;
  isDarkMode?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total, isDarkMode = false }) => {
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className={`sticky top-0 z-30 border-b p-4 transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h2 className={`text-lg font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Progress</h2>
          </div>
          <div className={`text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {completed} of {total} completed ({percentage}%)
          </div>
        </div>
        
        <div className={`w-full rounded-full h-3 transition-colors duration-200 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {percentage === 100 && (
          <div className="mt-2 text-center text-sm text-green-600 font-medium">
            🎉 Congratulations! You've completed this roadmap!
          </div>
        )}
      </div>
    </div>
  );
};