import React from 'react';
import { Lock, Zap, Clock, Users } from 'lucide-react';

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

export const RoadmapNode: React.FC<RoadmapNodeProps> = ({ node, onClick }) => {
  const getNodeStyles = () => {
    const baseStyles = "relative z-10 w-full max-w-md lg:w-80 p-6 rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-lg bg-card";

    switch (node.status) {
      case 'locked':
        return `${baseStyles} border-border text-muted-foreground cursor-not-allowed bg-muted`;
      case 'active':
        return `${baseStyles} border-primary text-foreground shadow-md hover:shadow-xl`;
      case 'completed':
        return `${baseStyles} border-primary/30 text-foreground shadow-md hover:shadow-lg bg-accent`;
      default:
        return baseStyles;
    }
  };

  const getStatusIcon = () => {
    switch (node.status) {
      case 'locked':
        return <Lock className="w-5 h-5 text-muted-foreground" />;
      case 'active':
        return <Zap className="w-5 h-5 text-primary" />;
      case 'completed':
        return (
          <div className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 bg-primary">
            <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
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
          <span className="text-xs px-3 py-1 rounded-full font-medium transition-colors duration-200 bg-primary text-primary-foreground">
            🔄 In Progress
          </span>
        )}
        {node.status === 'completed' && (
          <span className="text-xs px-3 py-1 rounded-full font-medium transition-colors duration-200 bg-primary text-primary-foreground">
            ✓ Completed
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm mb-4 leading-relaxed transition-colors duration-200 text-muted-foreground">
        {node.description}
      </p>

      {/* Completion Statistics */}
      {node.completionStats && (
        <div className="mb-4 p-3 rounded-lg border transition-colors duration-200 bg-muted/50 border-border">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Class Progress</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {node.completionStats.completedStudents}/{node.completionStats.totalStudents} completed
            </span>
            <span className="text-sm font-medium text-foreground">
              {Math.round(node.completionStats.completionPercentage)}%
            </span>
          </div>
          <div className="progress-track w-full rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${node.completionStats.completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Progress Bar for Active Nodes */}
      {node.status === 'active' && (
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs mb-2 text-muted-foreground">
            <span>Your Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="progress-track w-full rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500 bg-primary"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{node.estimatedTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{totalTasks} tasks</span>
          {node.status !== 'locked' && (
            <span className="font-medium transition-colors duration-200">
              View Details <span className="inline-block transform transition-transform group-hover:translate-x-1">→</span>
            </span>
          )}
        </div>
      </div>

      {/* Locked State Overlay */}
      {node.status === 'locked' && (
        <div className="absolute inset-0 z-20 rounded-xl flex items-center justify-center backdrop-blur-[2px] bg-background/80">
          <div className="text-center p-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
              <Lock className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold max-w-[180px] mx-auto leading-tight text-muted-foreground">
              Complete previous week to unlock
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
