import React from 'react';
import { ExternalLink } from 'lucide-react';
import { posthog } from '../../../lib/posthog';
import { isDecisionTreeResourceUrl } from '../../Playbooks/AgenticDecisionTree';
import type { RoadmapNodeData } from '../RoadmapNode';
import { TaskMarker } from './taskMarkers';

interface NodeTaskListProps {
  node: RoadmapNodeData;
  completedTasks: boolean[];
  onToggleTask: (index: number) => void;
  onOpenTaskDetail: (index: number) => void;
  onOpenDecisionTree?: () => void;
  onOpenQuiz?: (taskId: string, quizId?: string) => void;
}

export const NodeTaskList: React.FC<NodeTaskListProps> = ({
  node,
  completedTasks,
  onToggleTask,
  onOpenTaskDetail,
  onOpenDecisionTree,
  onOpenQuiz,
}) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-foreground">Tasks & Resources</h3>
      <div className="flex gap-2">
        {node.status === 'completed' && (
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">
            Completed
          </span>
        )}
        {node.status === 'locked' && (
          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border">
            🔒 Locked
          </span>
        )}
      </div>
    </div>

    <div className="space-y-3">
      {node.tasks.map((task, index) => (
        <div
          key={task.id}
          role="button"
          tabIndex={0}
          onClick={() => onOpenTaskDetail(index)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenTaskDetail(index);
            }
          }}
          className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/50 cursor-pointer hover:bg-muted/80 hover:border-primary/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleTask(index);
            }}
            disabled={node.status === 'locked' || node.status === 'completed'}
            className="flex-shrink-0"
            aria-label={completedTasks[index] ? 'Mark task incomplete' : 'Mark task complete'}
          >
            {completedTasks[index] ? (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-border" />
            )}
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <TaskMarker title={task.title} type={task.type} />
            <span className={`text-sm min-w-0 ${completedTasks[index] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.title}
            </span>
            {task.type === 'project' && !/hands-on/i.test(task.title) && (
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-primary/15 text-primary">
                Hands-on
              </span>
            )}
            {task.quizScore && (
              <span className="shrink-0 text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                {task.quizScore.score}/{task.quizScore.maxScore}
              </span>
            )}
          </div>
          {(task.quizId || task.type === 'mcq') && onOpenQuiz && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                posthog?.capture('task_started', {
                  task_id: task.id,
                  task_name: task.title,
                  task_type: 'quiz',
                  roadmap_id: node.id,
                });
                onOpenQuiz(task.id, task.quizId);
              }}
              className="shrink-0 rounded-lg border border-primary/40 bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20"
            >
              Start quiz
            </button>
          )}
          {task.url && (
            isDecisionTreeResourceUrl(task.url) && onOpenDecisionTree ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  posthog?.capture('task_started', {
                    task_id: task.id,
                    task_name: task.title,
                    task_type: task.type,
                    roadmap_id: node.id,
                  });
                  onOpenDecisionTree();
                }}
                className="p-1.5 rounded-lg border border-border hover:bg-accent shrink-0"
                title="Open decision tree"
                aria-label="Open decision tree"
              >
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </button>
            ) : (
              <a
                href={task.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  posthog?.capture('task_started', {
                    task_id: task.id,
                    task_name: task.title,
                    task_type: task.type,
                    roadmap_id: node.id,
                  });
                }}
                className="p-1.5 rounded-lg border border-border hover:bg-accent shrink-0"
                title="Open link"
                aria-label="Open external link"
              >
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            )
          )}
        </div>
      ))}
    </div>
  </div>
);
