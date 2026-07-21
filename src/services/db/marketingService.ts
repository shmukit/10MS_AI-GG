import { supabase } from '../../lib/supabase';
import { USER_PUBLIC_COLUMNS } from '../../lib/userColumns';
import { Roadmap, User, Batch } from '../../types/models';

export interface RoadmapMarketingData extends Roadmap {
    batches: (Batch & {
        mentors: User[];
    })[];
}

export interface MarketingPageData {
    roadmaps: RoadmapMarketingData[];
    mentors: (User & {
        roadmaps: Roadmap[];
    })[];
    stats: {
        activeBatches: number;
        activeLearners: number;
        avgCompletionRate: number;
    };
}

const EMPTY: MarketingPageData = {
    roadmaps: [],
    mentors: [],
    stats: { activeBatches: 0, activeLearners: 0, avgCompletionRate: 0 },
};

/** Prefer SECURITY DEFINER RPC — works for anon visitors on the public marketing page. */
async function fetchMarketingViaRpc(): Promise<MarketingPageData | null> {
    const { data, error } = await supabase.rpc('get_public_marketing_data');
    if (error) {
        console.warn('get_public_marketing_data RPC unavailable:', error.message);
        return null;
    }
    if (!data || typeof data !== 'object') return null;
    const payload = data as MarketingPageData;
    const roadmaps = payload.roadmaps || [];
    const activeBatchesFromRoadmaps = roadmaps.reduce(
        (count, roadmap) =>
            count + (roadmap.batches?.filter((batch) => batch.status === 'active').length ?? 0),
        0
    );
    return {
        roadmaps,
        mentors: payload.mentors || [],
        stats: {
            activeBatches: payload.stats?.activeBatches ?? activeBatchesFromRoadmaps,
            activeLearners: payload.stats?.activeLearners ?? 0,
            avgCompletionRate: payload.stats?.avgCompletionRate ?? 0,
        },
    };
}

/** Legacy direct queries — only works for authenticated sessions under current RLS. */
async function fetchMarketingDirect(): Promise<MarketingPageData> {
    const { data: roadmapsData, error: roadmapsError } = await supabase
        .from('roadmaps')
        .select('*');

    if (roadmapsError) throw roadmapsError;
    const roadmaps = (roadmapsData || []) as Roadmap[];

    const roadmapIds = roadmaps.map((r) => r.id);
    let batches: Batch[] = [];
    if (roadmapIds.length > 0) {
        const { data: batchesData, error: batchesError } = await supabase
            .from('batches')
            .select('*')
            .in('roadmap_id', roadmapIds);
        if (batchesError) throw batchesError;
        batches = (batchesData || []) as Batch[];
    }

    const { data: batchMentorsData, error: batchMentorsError } = await supabase
        .from('batch_mentors')
        .select('batch_id, mentor_id');

    if (batchMentorsError) {
        console.warn('batch_mentors fetch warning:', batchMentorsError.message);
    }
    const batchMentors = (batchMentorsData || []) as { batch_id: string; mentor_id: string }[];

    const { data: mentorsData, error: mentorsError } = await supabase
        .from('users')
        .select(`${USER_PUBLIC_COLUMNS}, mentor_profiles(*)`)
        .in('role', ['mentor', 'admin']);

    if (mentorsError) throw mentorsError;
    const mentors = (mentorsData || []) as User[];

    const roadmapMarketingData: RoadmapMarketingData[] = roadmaps.map((roadmap) => {
        const roadmapBatches = batches.filter((b) => b.roadmap_id === roadmap.id);
        return {
            ...roadmap,
            batches: roadmapBatches.map((batch) => {
                const mentorIds = batchMentors
                    .filter((bm) => bm.batch_id === batch.id)
                    .map((bm) => bm.mentor_id);
                return {
                    ...batch,
                    mentors: mentors.filter((m) => mentorIds.includes(m.id)),
                };
            }),
        };
    });

    const mentorMarketingData = mentors
        .map((mentor) => {
            const mentorBatchIds = batchMentors
                .filter((bm) => bm.mentor_id === mentor.id)
                .map((bm) => bm.batch_id);
            const mentorRoadmapIds = batches
                .filter((b) => mentorBatchIds.includes(b.id))
                .map((b) => b.roadmap_id);
            return {
                ...mentor,
                roadmaps: roadmaps.filter((r) => mentorRoadmapIds.includes(r.id)),
            };
        })
        .filter((m) => m.roadmaps.length > 0 || (m as any).mentor_profiles?.length > 0);

    const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('student_batch_assignments')
        .select('student_id, progress_percentage, completed_weeks, users!inner(role)');

    if (assignmentsError) {
        console.warn('Could not fetch learner stats:', assignmentsError.message);
    }

    type AssignmentRow = {
        student_id: string;
        progress_percentage?: number | null;
        completed_weeks?: number | null;
        users?: { role?: string } | { role?: string }[];
    };

    const assignments = (assignmentsData || []) as AssignmentRow[];
    const activeByStudent = new Map<string, number>();

    for (const row of assignments) {
        const role = Array.isArray(row.users) ? row.users[0]?.role : row.users?.role;
        if (role === 'admin') continue;
        if ((row.completed_weeks ?? 0) < 1) continue;

        const progress = Number(row.progress_percentage) || 0;
        const currentBest = activeByStudent.get(row.student_id) ?? 0;
        if (progress > currentBest) {
            activeByStudent.set(row.student_id, progress);
        }
    }

    const uniqueLearners = activeByStudent.size;
    const progressValues = [...activeByStudent.values()];
    const avgCompletionRate =
        progressValues.length > 0
            ? Math.round(
                  progressValues.reduce((sum, p) => sum + p, 0) / progressValues.length
              )
            : 0;

    const activeBatchCount = batches.filter((b) => b.status === 'active').length;

    return {
        roadmaps: roadmapMarketingData,
        mentors: mentorMarketingData,
        stats: {
            activeBatches: activeBatchCount,
            activeLearners: uniqueLearners,
            avgCompletionRate,
        },
    };
}

export const getMarketingData = async (): Promise<MarketingPageData> => {
    try {
        const fromRpc = await fetchMarketingViaRpc();
        if (fromRpc) return fromRpc;

        return await fetchMarketingDirect();
    } catch (error) {
        console.error('Error fetching marketing data:', error);
        return EMPTY;
    }
};
