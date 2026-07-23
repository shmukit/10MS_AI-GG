import { DatabaseService } from '../../../services/database';

export type EnrolledBatchRef = {
  id: string;
  roadmap?: { title?: string } | null;
};

export function batchMatchesRoadmapSlug(batch: EnrolledBatchRef, roadmapSlug: string): boolean {
  if (!batch?.roadmap?.title) return false;
  return DatabaseService.generateRoadmapSlug(batch.roadmap.title) === roadmapSlug;
}

export async function resolveStudentBatchId(params: {
  databaseUserId: string;
  roadmapSlug: string;
  roadmapId: string;
  batchIdParam: string | null;
  enrolledBatches: EnrolledBatchRef[];
  fallbackBatch: EnrolledBatchRef | null;
}): Promise<string | null> {
  const { databaseUserId, roadmapSlug, roadmapId, batchIdParam, enrolledBatches, fallbackBatch } = params;

  if (batchIdParam) {
    const paramBatch = enrolledBatches.find((batch) => batch.id === batchIdParam);
    if (paramBatch && batchMatchesRoadmapSlug(paramBatch, roadmapSlug)) {
      return batchIdParam;
    }
  }

  const enrolledMatch = enrolledBatches.find(
    (batch) => batch.roadmap && batchMatchesRoadmapSlug(batch, roadmapSlug)
  );
  if (enrolledMatch?.id) return enrolledMatch.id;

  const batchForRoadmap = await DatabaseService.getStudentBatchForRoadmap(databaseUserId, roadmapId);
  if (batchForRoadmap?.id) return batchForRoadmap.id;

  return fallbackBatch?.id && batchMatchesRoadmapSlug(fallbackBatch, roadmapSlug)
    ? fallbackBatch.id
    : null;
}
