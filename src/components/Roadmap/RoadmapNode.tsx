import React from 'react';
import { Lock, Zap, Clock, Users, Check } from 'lucide-react';
import { Badge } from '../ui/Badge';

export type NodeStatus = 'locked' | 'active' | 'completed';

export interface RoadmapNodeData {
  id: string;
  weekNumber?: number;
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
  nodeUnitLabel?: string;
}

export const RoadmapNode: React.FC<RoadmapNodeProps> = ({ node, onClick, nodeUnitLabel = 'Week' }) => {
  const prevLabel = node.weekNumber && node.weekNumber > 1
    ? `${nodeUnitLabel} ${node.weekNumber - 1}`
    : `previous ${nodeUnitLabel.toLowerCase()}`;

  const getNodeStyles = () => {
    const baseStyles =
      'group relative z-10 w-full max-w-md lg:w-80 p-6 rounded-xl border transition-all duration-300 bg-card';

    switch (node.status) {
      case 'locked':
        return `${baseStyles} border-border text-muted-foreground cursor-not-allowed bg-muted`;
      case 'active':
        return `${baseStyles} border-primary text-foreground cursor-pointer hover:shadow-hover hover:-translate-y-0.5`;
      case 'completed':
        return `${baseStyles} border-primary/30 text-foreground cursor-pointer hover:shadow-hover hover:-translate-y-0.5 bg-accent`;
      default:
        return baseStyles;
    }
  };

  const getStatusIcon = () => {
    switch (node.status) {
      case 'locked':
        return <Lock className="w-5 h-5 text-muted-foreground" aria-hidden />;
      case 'active':
        return <Zap className="w-5 h-5 text-primary" aria-hidden />;
      case 'completed':
        return (
          <div className="w-5 h-5 rounded-full flex items-center justify-center bg-primary" aria-hidden>
            <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
          </div>
        );
      default:
        return null;
    }
  };

  const completedTasks = node.tasks.filter((task) => task.completed).length;
  const totalTasks = node.tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const isLocked = node.status === 'locked';

  return (
    <div
      className={getNodeStyles()}
      onClick={!isLocked ? onClick : undefined}
      aria-disabled={isLocked}
      tabIndex={isLocked ? -1 : 0}
      role="button"
      onKeyDown={(e) => {
        if (!isLocked && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {getStatusIcon()}
          <h3 className="font-display text-h3 leading-tight truncate">{node.title}</h3>
        </div>
        {node.status === 'active' && (
          <Badge variant="default" className="shrink-0">
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-foreground" />
            </span>
            In progress
          </Badge>
        )}
        {node.status === 'completed' && (
          <Badge variant="default" className="shrink-0" aria-label="Completed">
            <Check className="w-3 h-3" strokeWidth={3} aria-hidden />
            Completed
          </Badge>
        )}
      </div>

      <p className="text-body mb-4 leading-relaxed text-muted-foreground">{node.description}</p>

      {node.completionStats && (
        <div className="mb-4 p-3 rounded-lg border bg-muted/50 border-border">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-muted-foreground" aria-hidden />
            <span className="text-body font-medium text-foreground">Class progress</span>
          </div>
          <div className="flex items-center justify-between text-caption">
            <span className="text-muted-foreground">
              {node.completionStats.completedStudents}/{node.completionStats.totalStudents} completed
            </span>
            <span className="font-medium text-foreground">
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

      {node.status === 'active' && (
        <div className="mb-4">
          <div className="flex justify-between items-center text-caption mb-2 text-muted-foreground">
            <span>Your progress</span>
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

      <div className="flex items-center justify-between text-caption text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" aria-hidden />
          <span>{node.estimatedTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{totalTasks} tasks</span>
          {!isLocked && (
            <span className="font-medium text-primary group-hover:underline">
              View details
              <span className="inline-block transition-transform group-hover:translate-x-0.5 ml-0.5" aria-hidden>
                →
              </span>
            </span>
          )}
        </div>
      </div>

      {isLocked && (
        <div
          className="absolute inset-0 z-20 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--locked-scrim)' }}
        >
          <div className="text-center p-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-muted text-foreground">
              <Lock className="w-6 h-6" aria-hidden />
            </div>
            <p className="text-body font-semibold max-w-[200px] mx-auto leading-snug text-[var(--locked-foreground)] drop-shadow-sm">
              Complete {prevLabel} to unlock
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
