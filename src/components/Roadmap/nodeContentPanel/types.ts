import type { RoadmapNodeData } from '../RoadmapNode';

export interface NodeContentPanelProps {
  node: RoadmapNodeData;
  onClose: () => void;
  onRefresh?: () => void;
  batchId?: string;
  nodeUnitLabel?: string;
  onOpenDecisionTree?: () => void;
  onOpenQuiz?: (taskId: string, quizId?: string) => void;
}

export interface StudentCompletion {
  studentId: string;
  studentName: string;
  completedTasks: number;
  totalTasks: number;
  completionPercentage: number;
  completedTaskNames: string[];
  lastCompletedAt?: string;
}
