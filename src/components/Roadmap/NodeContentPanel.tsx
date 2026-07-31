import React from 'react';
import { DiscussionBoard } from '../Discussion/DiscussionBoard';
import { useNodeContentPanel } from './nodeContentPanel/useNodeContentPanel';
import { NodeContentPanelHeader } from './nodeContentPanel/NodeContentPanelHeader';
import { NodeContentPanelMeta } from './nodeContentPanel/NodeContentPanelMeta';
import { NodeTaskList } from './nodeContentPanel/NodeTaskList';
import { ClassCompletionSection } from './nodeContentPanel/ClassCompletionSection';
import { MarkWeekCompleteButton } from './nodeContentPanel/MarkWeekCompleteButton';
import { NodeContentPanelModals } from './nodeContentPanel/NodeContentPanelModals';
import type { NodeContentPanelProps } from './nodeContentPanel/types';

export type { NodeContentPanelProps } from './nodeContentPanel/types';

export const NodeContentPanel: React.FC<NodeContentPanelProps> = ({
  node,
  onClose,
  onRefresh,
  batchId,
  nodeUnitLabel = 'Week',
  onOpenDecisionTree,
  onOpenQuiz,
}) => {
  const panel = useNodeContentPanel({ node, onRefresh, batchId });

  return (
    <>
      <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>

      <div className="
        fixed lg:relative 
        inset-x-0 bottom-0 lg:inset-auto lg:bottom-auto
        w-full lg:w-1/3 
        max-h-[80vh] lg:max-h-none lg:h-full
        border-t lg:border-l lg:border-t-0 
        flex flex-col 
        transition-all duration-300 ease-in-out
        z-50 lg:z-auto
        rounded-t-xl lg:rounded-none
        bg-card border-border
      ">
        <NodeContentPanelHeader node={node} onClose={onClose} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <NodeContentPanelMeta node={node} completionRate={panel.completionRate} />

          <NodeTaskList
            node={node}
            completedTasks={panel.completedTasks}
            onToggleTask={panel.toggleTaskCompletion}
            onOpenTaskDetail={panel.openTaskDetail}
            onOpenDecisionTree={onOpenDecisionTree}
            onOpenQuiz={onOpenQuiz}
          />

          {batchId && (
            <ClassCompletionSection
              loading={panel.loadingCompletions}
              completions={panel.studentCompletions}
            />
          )}

          <MarkWeekCompleteButton
            node={node}
            nodeUnitLabel={nodeUnitLabel}
            isCompleted={panel.isCompleted}
            isMarkingComplete={panel.isMarkingComplete}
            onMarkAsComplete={panel.handleMarkAsComplete}
          />

          <div className="mb-6">
            <DiscussionBoard entityType="week" entityId={node.id} />
          </div>
        </div>
      </div>

      <NodeContentPanelModals
        node={node}
        nodeUnitLabel={nodeUnitLabel}
        showConfirmation={panel.showConfirmation}
        showTaskConfirmation={panel.showTaskConfirmation}
        showTaskUncheckConfirmation={panel.showTaskUncheckConfirmation}
        isMarkingComplete={panel.isMarkingComplete}
        isCompletingFromModal={panel.isCompletingFromModal}
        detailTaskIndex={panel.detailTaskIndex}
        detailTask={panel.detailTask}
        selectedTaskTitle={panel.getSelectedTask()?.title}
        onCloseConfirmation={() => !panel.isMarkingComplete && panel.setShowConfirmation(false)}
        onCloseTaskConfirmation={() => panel.setShowTaskConfirmation(false)}
        onCloseTaskUncheckConfirmation={() => panel.setShowTaskUncheckConfirmation(false)}
        onConfirmCompletion={panel.handleConfirmCompletion}
        onConfirmTaskCompletion={panel.handleConfirmTaskCompletion}
        onConfirmTaskUncheck={panel.handleConfirmTaskUncheck}
        onCloseTaskDetail={panel.closeTaskDetail}
        onCompleteFromModal={panel.handleCompleteFromModal}
        onPreviousTask={() => panel.setDetailTaskIndex((i) => Math.max(0, i - 1))}
        onNextTask={() => panel.setDetailTaskIndex((i) => Math.min(node.tasks.length - 1, i + 1))}
        onStartQuiz={
          onOpenQuiz && panel.detailTask
            ? () => onOpenQuiz(panel.detailTask!.id, panel.detailTask!.quizId)
            : undefined
        }
      />
    </>
  );
};
