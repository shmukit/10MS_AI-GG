import React from 'react';
import { Lock, CheckCircle, Zap, Clock, Users } from 'lucide-react';

export type NodeStatus = 'locked' | 'active' | 'completed';

export interface RoadmapNodeData {
  id: string;
  title: string;
  description: string;
  status: NodeStatus;
  tasks: Array<{
    id: string;
    title: string;
    type: 'video' | 'exercise' | 'reading' | 'project';
    url?: string;
    completed: boolean;
  }>;
  relatedSkills: string[];
  estimatedTime: string;
  // New fields for completion statistics
  completionStats?: {
    totalStudents: number;
    completedStudents: number;
    completionPercentage: number;
  };
}

interface RoadmapNodeProps {
  node: RoadmapNodeData;
  onClick: () => void;
  isAlternate?: boolean;
  isDarkMode?: boolean;
}

export const RoadmapNode: React.FC<RoadmapNodeProps> = ({ node, onClick, isAlternate = false, isDarkMode = false }) => {
  const getNodeStyles = () => {
    const baseStyles = "w-80 p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md";
    
    switch (node.status) {
      case 'locked':
        return `${baseStyles} ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-600 text-gray-400' 
            : 'bg-gray-100 border-gray-300 text-gray-500'
        } cursor-not-allowed`;
      case 'active':
        return `${baseStyles} ${
          isDarkMode 
            ? 'bg-gray-800 border-blue-400 text-white shadow-lg hover:shadow-xl' 
            : 'bg-white border-blue-500 text-gray-900 shadow-lg hover:shadow-xl'
        }`;
      case 'completed':
        return `${baseStyles} ${
          isDarkMode 
            ? 'bg-green-900/20 border-green-400 text-green-300 shadow-md hover:shadow-lg' 
            : 'bg-green-50 border-green-500 text-green-900 shadow-md hover:shadow-lg'
        }`;
      default:
        return baseStyles;
    }
  };

  const getStatusIcon = () => {
    switch (node.status) {
      case 'locked':
        return <Lock className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />;
      case 'active':
        return <Zap className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />;
      case 'completed':
        return <CheckCircle className={`w-5 h-5 fill-current ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />;
      default:
        return null;
    }
  };

  const completedTasks = node.tasks.filter(task => task.completed).length;
  const totalTasks = node.tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div
      className={getNodeStyles()}
      onClick={node.status !== 'locked' ? onClick : undefined}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <h3 className="text-lg font-bold leading-tight">{node.title}</h3>
        </div>
        {node.status === 'active' && (
          <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-blue-900/30 text-blue-300 border border-blue-700' 
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}>
            In Progress
          </span>
        )}
        {node.status === 'completed' && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            Completed
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        {node.description}
      </p>

      {/* Completion Statistics */}
      {node.completionStats && (
        <div className="mb-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Class Progress</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {node.completionStats.completedStudents}/{node.completionStats.totalStudents} completed
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(node.completionStats.completionPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${node.completionStats.completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Progress Bar for Active Nodes */}
      {node.status === 'active' && (
        <div className="mb-4">
          <div className={`flex justify-between items-center text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <span>Your Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={`flex items-center justify-between text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{node.estimatedTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{totalTasks} tasks</span>
          {node.status !== 'locked' && (
            <span className={`font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>View Details →</span>
          )}
        </div>
      </div>

      {/* Locked State Overlay */}
      {node.status === 'locked' && (
        <div className={`absolute inset-0 bg-opacity-50 rounded-xl flex items-center justify-center ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <div className="text-center">
            <Lock className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Complete previous week to unlock</p>
          </div>
        </div>
      )}
    </div>
  );
};