import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../lib/useAuth';
import { useRoadmapInterfaceData } from './useRoadmapInterfaceData';
import { useRoadmapInterfaceNavigation } from './useRoadmapInterfaceNavigation';
import { useRoadmapSlides } from './useRoadmapSlides';
import {
  buildNodesWithStats,
  countCompletedNodes,
  resolveBatchName,
  resolveNodeUnitLabel,
} from './roadmapInterfaceSelectors';

export function useRoadmapInterface(roadmapSlug: string | undefined) {
  const [searchParams] = useSearchParams();
  const { user, databaseUserId } = useAuth();
  const [showRoadmapDropdown, setShowRoadmapDropdown] = useState(false);

  const data = useRoadmapInterfaceData({
    databaseUserId,
    roadmapSlug,
    searchParams,
    user,
  });

  const navigation = useRoadmapInterfaceNavigation({
    roadmapSlug,
    batchId: data.batchId,
    searchParams,
    enrolledBatches: data.enrolledBatches,
    batchResources: data.batchResources,
    activeView: data.activeView,
    selectedTreeKey: data.selectedTreeKey,
    setActiveView: data.setActiveView,
    setSelectedTreeKey: data.setSelectedTreeKey,
    setShowRoadmapDropdown,
  });

  const slides = useRoadmapSlides(data.batchResources.slideDecks);

  const nodesWithStats = data.roadmap
    ? buildNodesWithStats(
        data.weeks,
        data.tasks,
        data.studentProgress,
        data.batchId,
        data.completionStats
      )
    : [];

  const completedNodes = countCompletedNodes(nodesWithStats);
  const nodeUnitLabel = data.roadmap ? resolveNodeUnitLabel(data.roadmap) : 'Week';
  const enabledTrees = data.batchResources.decisionTrees;
  const showDecisionTree = enabledTrees.length > 0;
  const enabledSlides = data.batchResources.slideDecks;
  const batchName = data.roadmap
    ? resolveBatchName(data.enrolledBatches, data.batchId, data.roadmap.title)
    : '';

  return {
    ...data,
    ...navigation,
    ...slides,
    showRoadmapDropdown,
    setShowRoadmapDropdown,
    nodesWithStats,
    completedNodes,
    nodeUnitLabel,
    enabledTrees,
    showDecisionTree,
    enabledSlides,
    batchName,
  };
}
