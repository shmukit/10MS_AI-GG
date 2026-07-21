import { DatabaseService } from '../../../services/database';

export async function resolveStudentBatchId(params: {
  databaseUserId: string;
  roadmapSlug: string;
  roadmapId: string;
  batchIdParam: string | null;
  enrolledBatches: any[];
  fallbackBatch: { id?: string } | null;
}): Promise<string | null> {
  const { databaseUserId, roadmapSlug, roadmapId, batchIdParam, enrolledBatches, fallbackBatch } = params;

  if (batchIdParam) return batchIdParam;

  const batchForRoadmap = await DatabaseService.getStudentBatchForRoadmap(databaseUserId, roadmapId);
  if (batchForRoadmap?.id) return batchForRoadmap.id;

  const enrolledMatch = enrolledBatches.find(
    (batch) =>
      batch.roadmap &&
      DatabaseService.generateRoadmapSlug(batch.roadmap.title) === roadmapSlug
  );
  if (enrolledMatch?.id) return enrolledMatch.id;

  return fallbackBatch?.id ?? null;
}
