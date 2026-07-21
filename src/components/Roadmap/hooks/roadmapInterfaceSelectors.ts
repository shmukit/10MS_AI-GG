import { generateRoadmapData } from '../../../data/roadmapData';
import { getNodeUnitLabel } from '../../../utils/roadmapNodeUtils';
import type { Roadmap, RoadmapTask, RoadmapWeek } from '../../../services/database';

export function buildNodesWithStats(
  weeks: RoadmapWeek[],
  tasks: RoadmapTask[],
  studentProgress: any[],
  batchId: string | null,
  completionStats: { [weekId: string]: any }
) {
  const roadmapData = generateRoadmapData(weeks, tasks, studentProgress, batchId || undefined);
  return roadmapData.nodes.map((node) => ({
    ...node,
    completionStats: completionStats[node.id] || undefined,
  }));
}

export function countCompletedNodes(nodesWithStats: ReturnType<typeof buildNodesWithStats>) {
  return nodesWithStats.filter((node) => {
    const completedTasks = node.tasks.filter((task) => task.completed).length;
    return completedTasks === node.tasks.length && node.tasks.length > 0;
  }).length;
}

export function resolveBatchName(
  enrolledBatches: any[],
  batchId: string | null,
  roadmapTitle: string
) {
  const currentBatch = enrolledBatches.find((b) => b.id === batchId);
  return currentBatch?.name ?? roadmapTitle;
}

export function resolveNodeUnitLabel(roadmap: Roadmap) {
  return getNodeUnitLabel(roadmap);
}
