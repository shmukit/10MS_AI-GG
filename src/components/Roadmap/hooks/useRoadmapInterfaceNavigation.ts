import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatabaseService, BatchEnabledResources } from '../../../services/database';
import type { RoadmapView } from './types';

interface UseRoadmapInterfaceNavigationParams {
  roadmapSlug: string | undefined;
  batchId: string | null;
  searchParams: URLSearchParams;
  enrolledBatches: any[];
  batchResources: BatchEnabledResources;
  activeView: RoadmapView;
  selectedTreeKey: string;
  setActiveView: (view: RoadmapView) => void;
  setSelectedTreeKey: (key: string) => void;
  setShowRoadmapDropdown: (show: boolean) => void;
}

export function useRoadmapInterfaceNavigation({
  roadmapSlug,
  batchId,
  searchParams,
  enrolledBatches,
  batchResources,
  activeView,
  selectedTreeKey,
  setActiveView,
  setSelectedTreeKey,
  setShowRoadmapDropdown,
}: UseRoadmapInterfaceNavigationParams) {
  const navigate = useNavigate();

  const handleBatchChange = useCallback(async (newBatchId: string) => {
    const selectedBatch = enrolledBatches.find((b) => b.id === newBatchId);
    if (selectedBatch && selectedBatch.roadmap) {
      const slug = DatabaseService.generateRoadmapSlug(selectedBatch.roadmap.title);
      navigate(`/student/roadmap/${slug}?batch_id=${newBatchId}`);
      setShowRoadmapDropdown(false);
    }
  }, [enrolledBatches, navigate, setShowRoadmapDropdown]);

  const handleViewChange = useCallback((view: RoadmapView, treeKey?: string) => {
    setActiveView(view);
    const params = new URLSearchParams(searchParams);
    if (batchId) params.set('batch_id', batchId);
    if (view === 'decision-tree') {
      params.set('view', 'decision-tree');
      const key = treeKey ?? selectedTreeKey ?? batchResources.decisionTrees[0]?.tree_key;
      if (key) {
        params.set('tree', key);
        setSelectedTreeKey(key);
      }
    } else {
      params.delete('view');
      params.delete('tree');
    }
    const query = params.toString();
    navigate(`/student/roadmap/${roadmapSlug}${query ? `?${query}` : ''}`, { replace: true });
  }, [
    batchId,
    batchResources.decisionTrees,
    navigate,
    roadmapSlug,
    searchParams,
    selectedTreeKey,
    setActiveView,
    setSelectedTreeKey,
  ]);

  return {
    activeView,
    selectedTreeKey,
    handleBatchChange,
    handleViewChange,
  };
}
