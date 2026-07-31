import React from 'react';
import { ConfirmationModal } from '../../ConfirmationModal/ConfirmationModal';
import { TaskDetailModal, type TaskDetailModalTask } from '../TaskDetailModal';
import type { RoadmapNodeData } from '../RoadmapNode';

interface NodeContentPanelModalsProps {
  node: RoadmapNodeData;
  nodeUnitLabel: string;
  showConfirmation: boolean;
  showTaskConfirmation: boolean;
  showTaskUncheckConfirmation: boolean;
  isMarkingComplete: boolean;
  isCompletingFromModal: boolean;
  detailTaskIndex: number;
  detailTask: TaskDetailModalTask | null;
  selectedTaskTitle?: string;
  onCloseConfirmation: () => void;
  onCloseTaskConfirmation: () => void;
  onCloseTaskUncheckConfirmation: () => void;
  onConfirmCompletion: () => void;
  onConfirmTaskCompletion: () => void;
  onConfirmTaskUncheck: () => void;
  onCloseTaskDetail: () => void;
  onCompleteFromModal: () => void;
  onPreviousTask: () => void;
  onNextTask: () => void;
  onStartQuiz?: () => void;
}

export const NodeContentPanelModals: React.FC<NodeContentPanelModalsProps> = ({
  node,
  nodeUnitLabel,
  showConfirmation,
  showTaskConfirmation,
  showTaskUncheckConfirmation,
  isMarkingComplete,
  isCompletingFromModal,
  detailTaskIndex,
  detailTask,
  selectedTaskTitle,
  onCloseConfirmation,
  onCloseTaskConfirmation,
  onCloseTaskUncheckConfirmation,
  onConfirmCompletion,
  onConfirmTaskCompletion,
  onConfirmTaskUncheck,
  onCloseTaskDetail,
  onCompleteFromModal,
  onPreviousTask,
  onNextTask,
  onStartQuiz,
}) => (
  <>
    <ConfirmationModal
      isOpen={showConfirmation}
      onClose={onCloseConfirmation}
      onConfirm={onConfirmCompletion}
      title={`Confirm ${nodeUnitLabel} Completion`}
      message={`Are you sure you have completed all tasks for "${node.title}"?`}
      isLoading={isMarkingComplete}
    />
    <ConfirmationModal
      isOpen={showTaskConfirmation}
      onClose={onCloseTaskConfirmation}
      onConfirm={onConfirmTaskCompletion}
      title="Confirm Task Completion"
      message={`Complete task "${selectedTaskTitle}"?`}
    />
    <ConfirmationModal
      isOpen={showTaskUncheckConfirmation}
      onClose={onCloseTaskUncheckConfirmation}
      onConfirm={onConfirmTaskUncheck}
      title="Confirm Task Uncheck"
      message={`Mark task "${selectedTaskTitle}" as incomplete?`}
    />
    <TaskDetailModal
      open={detailTaskIndex >= 0}
      task={detailTask}
      taskIndex={Math.max(0, detailTaskIndex)}
      taskCount={node.tasks.length}
      onClose={onCloseTaskDetail}
      onComplete={onCompleteFromModal}
      onPrevious={onPreviousTask}
      onNext={onNextTask}
      canComplete={node.status === 'active'}
      isCompleting={isCompletingFromModal}
      onStartQuiz={onStartQuiz}
    />
  </>
);
