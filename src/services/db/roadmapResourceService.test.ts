import { describe, expect, it } from 'vitest';
import { mergeLegacyDecisionTrees } from './roadmapResourceService';

const agenticRoadmap = {
  id: 'roadmap-agentic',
  title: 'Become a Manager of AI Agents',
  decision_tree_enabled: true,
  slides_url: null,
} as any;

describe('mergeLegacyDecisionTrees', () => {
  it('returns existing trees when catalog trees are present', () => {
    const existing = [
      {
        id: 'tree-1',
        roadmap_id: agenticRoadmap.id,
        title: 'Catalog tree',
        tree_key: 'agentic',
        sort_order: 0,
        is_default_enabled: true,
        is_active: true,
        is_enabled: true,
      },
    ];

    expect(mergeLegacyDecisionTrees(existing, agenticRoadmap)).toEqual(existing);
  });

  it('injects legacy tree when catalog is empty but decision_tree_enabled is true', () => {
    const merged = mergeLegacyDecisionTrees([], agenticRoadmap);

    expect(merged).toHaveLength(1);
    expect(merged[0].tree_key).toBe('agentic');
    expect(merged[0].is_enabled).toBe(true);
  });

  it('returns empty when catalog is empty and legacy flag is false', () => {
    const roadmap = { ...agenticRoadmap, decision_tree_enabled: false };
    expect(mergeLegacyDecisionTrees([], roadmap)).toEqual([]);
  });
});
