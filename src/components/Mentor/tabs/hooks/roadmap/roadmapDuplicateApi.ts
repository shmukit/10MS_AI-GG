import { supabase } from '../../../../../lib/supabase';

export async function duplicateRoadmap(
  sourceRoadmapId: string,
  newTitle?: string
): Promise<{ id: string } | null> {
  const { data: source, error: sourceError } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('id', sourceRoadmapId)
    .single();

  if (sourceError || !source) {
    console.error('Error loading source roadmap:', sourceError);
    return null;
  }

  const title = newTitle?.trim() || `Copy of ${source.title}`;

  const { data: newRoadmap, error: insertError } = await supabase
    .from('roadmaps')
    .insert({
      title,
      description: source.description,
      total_weeks: source.total_weeks,
      node_unit_label: source.node_unit_label ?? 'Week',
      slides_url: source.slides_url,
      decision_tree_enabled: source.decision_tree_enabled ?? false,
      difficulty_level: source.difficulty_level,
      category: source.category,
      is_active: true,
    })
    .select('id')
    .single();

  if (insertError || !newRoadmap) {
    console.error('Error inserting duplicated roadmap:', insertError);
    return null;
  }

  const newRoadmapId = newRoadmap.id;

  const { data: weeks, error: weeksError } = await supabase
    .from('roadmap_weeks')
    .select('*')
    .eq('roadmap_id', sourceRoadmapId)
    .order('week_number');

  if (weeksError) {
    console.error('Error loading weeks for duplication:', weeksError);
    return { id: newRoadmapId };
  }

  const weekIdMap = new Map<string, string>();

  for (const week of weeks ?? []) {
    const { data: newWeek, error: weekInsertError } = await supabase
      .from('roadmap_weeks')
      .insert({
        roadmap_id: newRoadmapId,
        week_number: week.week_number,
        title: week.title,
        description: week.description,
        domain: week.domain,
      })
      .select('id')
      .single();

    if (weekInsertError || !newWeek) {
      console.error('Error duplicating week:', weekInsertError);
      continue;
    }
    weekIdMap.set(week.id, newWeek.id);
  }

  for (const [oldWeekId, newWeekId] of weekIdMap) {
    const { data: tasks, error: tasksError } = await supabase
      .from('roadmap_tasks')
      .select('*')
      .eq('week_id', oldWeekId);

    if (tasksError) {
      console.error('Error loading tasks for duplication:', tasksError);
      continue;
    }

    if (!tasks?.length) continue;

    const taskRows = tasks.map((task) => ({
      week_id: newWeekId,
      task_name: task.task_name,
      task_details: task.task_details,
      task_type: task.task_type,
      relevant_links: task.relevant_links,
      deadline: task.deadline,
      estimated_hours: task.estimated_hours,
      points: task.points,
      is_required: task.is_required,
      meeting_time: task.meeting_time,
      is_active: task.is_active ?? true,
    }));

    const { error: taskInsertError } = await supabase.from('roadmap_tasks').insert(taskRows);
    if (taskInsertError) {
      console.error('Error duplicating tasks:', taskInsertError);
    }
  }

  const [{ data: slideDecks }, { data: decisionTrees }] = await Promise.all([
    supabase.from('roadmap_slide_decks').select('*').eq('roadmap_id', sourceRoadmapId).eq('is_active', true),
    supabase.from('roadmap_decision_trees').select('*').eq('roadmap_id', sourceRoadmapId).eq('is_active', true),
  ]);

  if (slideDecks?.length) {
    const deckRows = slideDecks.map((deck) => ({
      roadmap_id: newRoadmapId,
      title: deck.title,
      slides_url: deck.slides_url,
      sort_order: deck.sort_order,
      is_default_enabled: deck.is_default_enabled,
      is_active: true,
    }));
    const { error } = await supabase.from('roadmap_slide_decks').insert(deckRows);
    if (error) console.error('Error duplicating slide decks:', error);
  }

  if (decisionTrees?.length) {
    const treeRows = decisionTrees.map((tree) => ({
      roadmap_id: newRoadmapId,
      title: tree.title,
      tree_key: tree.tree_key,
      sort_order: tree.sort_order,
      is_default_enabled: tree.is_default_enabled,
      is_active: true,
    }));
    const { error } = await supabase.from('roadmap_decision_trees').insert(treeRows);
    if (error) console.error('Error duplicating decision trees:', error);
  }

  return { id: newRoadmapId };
}
