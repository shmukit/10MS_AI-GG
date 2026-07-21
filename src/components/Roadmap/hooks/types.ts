import type { BatchEnabledResources } from '../../../services/database';

export type RoadmapView = 'sessions' | 'decision-tree';

export interface RoadmapInterfaceProps {
  onBack: () => void;
}

export const EMPTY_RESOURCES: BatchEnabledResources = {
  slideDecks: [],
  decisionTrees: [],
  usesLegacyFallback: false,
};
