import { supabase } from '../../../../../lib/supabase';
import type { NewRoadmapForm } from './types';

export async function insertRoadmap(roadmap: NewRoadmapForm) {
    return supabase
        .from('roadmaps')
        .insert([{
            title: roadmap.title,
            description: roadmap.description,
            total_weeks: roadmap.total_weeks,
            node_unit_label: roadmap.node_unit_label || 'Week',
            slides_url: roadmap.slides_url?.trim() || null,
            decision_tree_enabled: roadmap.decision_tree_enabled === true,
            difficulty_level: roadmap.difficulty_level,
            category: roadmap.category,
            is_active: true,
        }] as unknown as never)
        .select()
        .single() as { data: any; error: unknown };
}

export async function updateRoadmapInDb(roadmap: NewRoadmapForm & { id: string }) {
    return supabase
        .from('roadmaps')
        .update({
            title: roadmap.title,
            description: roadmap.description,
            total_weeks: roadmap.total_weeks,
            node_unit_label: roadmap.node_unit_label || 'Week',
            slides_url: roadmap.slides_url?.trim() || null,
            decision_tree_enabled: roadmap.decision_tree_enabled === true,
            difficulty_level: roadmap.difficulty_level,
            category: roadmap.category,
        } as unknown as never)
        .eq('id', roadmap.id)
        .select()
        .single() as { data: any; error: unknown };
}

export async function deleteRoadmapFromDb(roadmapId: string) {
    return supabase
        .from('roadmaps')
        .delete()
        .eq('id', roadmapId);
}
