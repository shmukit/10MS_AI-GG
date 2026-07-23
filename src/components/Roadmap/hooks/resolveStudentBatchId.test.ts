import { describe, expect, it, vi, beforeEach } from 'vitest';
import { batchMatchesRoadmapSlug, resolveStudentBatchId } from './resolveStudentBatchId';

vi.mock('../../../services/database', () => ({
  DatabaseService: {
    generateRoadmapSlug: (title: string) =>
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .replace(/_+/g, '_')
        .trim(),
    getStudentBatchForRoadmap: vi.fn(),
  },
}));

import { DatabaseService } from '../../../services/database';

const agenticBatch = {
  id: 'batch-agentic',
  name: 'Workshop Cohort',
  roadmap: { id: 'roadmap-agentic', title: 'Become a Manager of AI Agents' },
};

const pythonBatch = {
  id: 'batch-python',
  name: 'Python Learning Cohort - Batch 15',
  roadmap: { id: 'roadmap-python', title: 'Python Learning Cohort' },
};

describe('batchMatchesRoadmapSlug', () => {
  it('matches when roadmap slug equals generated title slug', () => {
    expect(batchMatchesRoadmapSlug(agenticBatch, 'become_a_manager_of_ai_agents')).toBe(true);
    expect(batchMatchesRoadmapSlug(pythonBatch, 'python_learning_cohort')).toBe(true);
  });

  it('returns false when slug does not match', () => {
    expect(batchMatchesRoadmapSlug(agenticBatch, 'python_learning_cohort')).toBe(false);
  });
});

describe('resolveStudentBatchId', () => {
  beforeEach(() => {
    vi.mocked(DatabaseService.getStudentBatchForRoadmap).mockReset();
  });

  it('rejects batch_id param when batch roadmap slug mismatches URL slug', async () => {
    vi.mocked(DatabaseService.getStudentBatchForRoadmap).mockResolvedValue(null);

    const result = await resolveStudentBatchId({
      databaseUserId: 'user-1',
      roadmapSlug: 'become_a_manager_of_ai_agents',
      roadmapId: 'roadmap-agentic',
      batchIdParam: pythonBatch.id,
      enrolledBatches: [agenticBatch, pythonBatch],
      fallbackBatch: pythonBatch,
    });

    expect(result).toBe(agenticBatch.id);
  });

  it('accepts batch_id param when batch roadmap slug matches URL slug', async () => {
    const result = await resolveStudentBatchId({
      databaseUserId: 'user-1',
      roadmapSlug: 'become_a_manager_of_ai_agents',
      roadmapId: 'roadmap-agentic',
      batchIdParam: agenticBatch.id,
      enrolledBatches: [agenticBatch, pythonBatch],
      fallbackBatch: pythonBatch,
    });

    expect(result).toBe(agenticBatch.id);
  });

  it('does not fall back to unrelated batch when slug has no match', async () => {
    vi.mocked(DatabaseService.getStudentBatchForRoadmap).mockResolvedValue(null);

    const result = await resolveStudentBatchId({
      databaseUserId: 'user-1',
      roadmapSlug: 'become_a_manager_of_ai_agents',
      roadmapId: 'roadmap-agentic',
      batchIdParam: null,
      enrolledBatches: [pythonBatch],
      fallbackBatch: pythonBatch,
    });

    expect(result).toBeNull();
  });
});
