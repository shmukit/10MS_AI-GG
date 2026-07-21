import { User } from '@supabase/supabase-js';
import {
  DatabaseService,
  Roadmap,
  RoadmapTask,
  RoadmapWeek,
  BatchEnabledResources,
} from '../../../services/database';
import { supabase } from '../../../lib/supabase';
import { posthog } from '../../../lib/posthog';
import { resolveStudentBatchId } from './resolveStudentBatchId';
import { fetchRoadmapTasksForWeeks } from './roadmapInterfaceApi';
import { EMPTY_RESOURCES, type RoadmapView } from './types';

export interface RoadmapInterfaceLoadResult {
  userName: string;
  enrolledBatches: any[];
  studentProgress: any[];
  roadmap: Roadmap;
  batchId: string | null;
  batchResources: BatchEnabledResources;
  activeView: RoadmapView;
  selectedTreeKey: string;
  weeks: RoadmapWeek[];
  tasks: RoadmapTask[];
  targetWeekNumber: number | null;
}

function resolveUserName(
  userDataQuery: { first_name?: string } | null,
  user: User | null
): string {
  if (userDataQuery?.first_name) return userDataQuery.first_name;
  if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
  if (user?.email) return user.email.split('@')[0];
  return 'Student';
}

function parseTargetWeekNumber(searchParams: URLSearchParams): number | null {
  const weekParam = searchParams.get('week');
  if (!weekParam) return null;

  const weekNum = parseInt(weekParam, 10);
  if (!isNaN(weekNum) && weekNum > 0) return weekNum;
  return null;
}

function resolveInitialView(
  viewParam: string | null,
  treeParam: string | null,
  resources: BatchEnabledResources
): { activeView: RoadmapView; selectedTreeKey: string } {
  if (viewParam === 'decision-tree' && resources.decisionTrees.length > 0) {
    const matchedTree = resources.decisionTrees.find((tree) => tree.tree_key === treeParam);
    return {
      activeView: 'decision-tree',
      selectedTreeKey: matchedTree?.tree_key ?? resources.decisionTrees[0].tree_key,
    };
  }

  return { activeView: 'sessions', selectedTreeKey: 'agentic' };
}

export async function loadRoadmapInterfaceData(params: {
  databaseUserId: string;
  roadmapSlug: string | undefined;
  searchParams: URLSearchParams;
  user: User | null;
}): Promise<{ data: RoadmapInterfaceLoadResult } | { error: string }> {
  const { databaseUserId, roadmapSlug, searchParams, user } = params;

  posthog?.capture('roadmap_view', {
    user_id: databaseUserId,
    roadmap_slug: roadmapSlug,
    viewed_at: new Date().toISOString(),
  });

  const targetWeekNumber = parseTargetWeekNumber(searchParams);
  const viewParam = searchParams.get('view');
  const treeParam = searchParams.get('tree');
  const batchIdParam = searchParams.get('batch_id');

  const [userDataQuery, batchQuery, enrolledQuery, progressQuery] = await Promise.all([
    DatabaseService.getUserById(databaseUserId),
    DatabaseService.getStudentBatch(databaseUserId),
    DatabaseService.getEnrolledBatches(databaseUserId),
    supabase.from('student_progress').select('*').eq('student_id', databaseUserId),
  ]);

  const userName = resolveUserName(userDataQuery, user);
  const enrolledBatches = enrolledQuery ?? [];
  const studentProgress = progressQuery.data || [];

  if (!roadmapSlug) {
    return { error: 'No roadmap specified in URL' };
  }

  const roadmapData = await DatabaseService.getRoadmapBySlug(roadmapSlug);
  if (!roadmapData) {
    return { error: `No roadmap found for "${roadmapSlug}". Please check the URL or contact support.` };
  }

  const batchId = await resolveStudentBatchId({
    databaseUserId,
    roadmapSlug,
    roadmapId: roadmapData.id,
    batchIdParam,
    enrolledBatches,
    fallbackBatch: batchQuery,
  });

  const batchResources = await DatabaseService.getBatchEnabledResources(batchId, roadmapData);
  const { activeView, selectedTreeKey } = resolveInitialView(viewParam, treeParam, batchResources);

  const weeksData = await DatabaseService.getRoadmapWeeks(roadmapData.id);
  const tasks = weeksData.length > 0
    ? await fetchRoadmapTasksForWeeks(weeksData.map((week) => week.id), batchId)
    : [];

  return {
    data: {
      userName,
      enrolledBatches,
      studentProgress,
      roadmap: roadmapData,
      batchId,
      batchResources: batchResources ?? EMPTY_RESOURCES,
      activeView,
      selectedTreeKey,
      weeks: weeksData,
      tasks,
      targetWeekNumber,
    },
  };
}
