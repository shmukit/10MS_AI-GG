import { supabase } from '../../../../../lib/supabase';
import { defaultNodeTitle } from '../../../../../utils/roadmapNodeUtils';
import type { RoadmapNodeSummary } from '../../roadmap/NodesPanel';

export async function fetchRoadmapNodesFromDb(roadmapId: string) {
    if (!roadmapId) {
        return { data: [] as RoadmapNodeSummary[], error: null };
    }

    const { data, error } = await supabase
        .from('roadmap_weeks')
        .select('id, week_number, title, description, domain')
        .eq('roadmap_id', roadmapId)
        .order('week_number') as { data: RoadmapNodeSummary[] | null; error: unknown };

    return { data: data || [], error };
}

export async function findOrCreateWeek(params: {
    roadmapId: string;
    weekNumber: number;
    unitLabel: string;
    domain?: string;
}) {
    const { roadmapId, weekNumber, unitLabel, domain = 'General' } = params;

    const { data: weekData, error: weekError } = await supabase
        .from('roadmap_weeks')
        .select('id, domain')
        .eq('roadmap_id', roadmapId)
        .eq('week_number', weekNumber)
        .single() as { data: { id: string; domain: string } | null; error: unknown };

    if (!weekError && weekData) {
        return { weekId: weekData.id, created: false, error: null };
    }

    console.log(`${unitLabel} ${weekNumber} not found, creating it automatically...`);

    const { data: newWeek, error: createWeekError } = await supabase
        .from('roadmap_weeks')
        .insert([{
            roadmap_id: roadmapId,
            week_number: weekNumber,
            title: defaultNodeTitle(unitLabel, weekNumber),
            description: `${defaultNodeTitle(unitLabel, weekNumber)} content`,
            domain,
        }] as unknown as never)
        .select('id')
        .single() as { data: { id: string } | null; error: unknown };

    if (createWeekError || !newWeek) {
        return { weekId: null, created: false, error: createWeekError };
    }

    return { weekId: newWeek.id, created: true, error: null };
}

export async function insertRoadmapWeek(params: {
    roadmapId: string;
    weekNumber: number;
    unitLabel: string;
    domain?: string;
}) {
    const { roadmapId, weekNumber, unitLabel, domain = 'General' } = params;

    return supabase
        .from('roadmap_weeks')
        .insert([{
            roadmap_id: roadmapId,
            week_number: weekNumber,
            title: defaultNodeTitle(unitLabel, weekNumber),
            description: `${defaultNodeTitle(unitLabel, weekNumber)} content`,
            domain,
        }] as unknown as never);
}

export async function updateRoadmapWeekInDb(
    nodeId: string,
    updates: { title: string; description: string; domain: string }
) {
    return supabase
        .from('roadmap_weeks')
        .update(updates as unknown as never)
        .eq('id', nodeId);
}

export async function updateRoadmapTotalWeeks(roadmapId: string, totalWeeks: number) {
    return supabase
        .from('roadmaps')
        .update({ total_weeks: totalWeeks } as unknown as never)
        .eq('id', roadmapId);
}
