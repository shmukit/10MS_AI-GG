import { supabase } from '../../lib/supabase';
import type {
  BatchEnabledResources,
  BatchResourceSelection,
  EnabledDecisionTree,
  EnabledSlideDeck,
  Roadmap,
  RoadmapDecisionTree,
  RoadmapSlideDeck,
} from '../../types/models';
import { hasSlidesUrl } from '../../utils/slidesUtils';

export async function getRoadmapSlideDecks(roadmapId: string): Promise<RoadmapSlideDeck[]> {
  const { data, error } = await supabase
    .from('roadmap_slide_decks')
    .select('*')
    .eq('roadmap_id', roadmapId)
    .eq('is_active', true)
    .order('sort_order')
    .order('title');

  if (error) {
    console.error('Error fetching slide decks:', error);
    return [];
  }

  return (data ?? []) as RoadmapSlideDeck[];
}

export async function getRoadmapDecisionTrees(roadmapId: string): Promise<RoadmapDecisionTree[]> {
  const { data, error } = await supabase
    .from('roadmap_decision_trees')
    .select('*')
    .eq('roadmap_id', roadmapId)
    .eq('is_active', true)
    .order('sort_order')
    .order('title');

  if (error) {
    console.error('Error fetching decision trees:', error);
    return [];
  }

  return (data ?? []) as RoadmapDecisionTree[];
}

export async function upsertSlideDeck(
  deck: Partial<RoadmapSlideDeck> & { roadmap_id: string; title: string; slides_url: string }
): Promise<RoadmapSlideDeck | null> {
  const payload = {
    roadmap_id: deck.roadmap_id,
    title: deck.title.trim(),
    slides_url: deck.slides_url.trim(),
    sort_order: deck.sort_order ?? 0,
    is_default_enabled: deck.is_default_enabled ?? true,
    is_active: deck.is_active ?? true,
  };

  if (deck.id) {
    const { data, error } = await supabase
      .from('roadmap_slide_decks')
      .update(payload)
      .eq('id', deck.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating slide deck:', error);
      return null;
    }
    return data as RoadmapSlideDeck;
  }

  const { data, error } = await supabase
    .from('roadmap_slide_decks')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error inserting slide deck:', error);
    return null;
  }
  return data as RoadmapSlideDeck;
}

export async function deleteSlideDeck(deckId: string): Promise<boolean> {
  const { error } = await supabase
    .from('roadmap_slide_decks')
    .update({ is_active: false })
    .eq('id', deckId);

  if (error) {
    console.error('Error deleting slide deck:', error);
    return false;
  }
  return true;
}

export async function upsertDecisionTree(
  tree: Partial<RoadmapDecisionTree> & { roadmap_id: string; title: string; tree_key: string }
): Promise<RoadmapDecisionTree | null> {
  const payload = {
    roadmap_id: tree.roadmap_id,
    title: tree.title.trim(),
    tree_key: tree.tree_key.trim(),
    sort_order: tree.sort_order ?? 0,
    is_default_enabled: tree.is_default_enabled ?? true,
    is_active: tree.is_active ?? true,
  };

  if (tree.id) {
    const { data, error } = await supabase
      .from('roadmap_decision_trees')
      .update(payload)
      .eq('id', tree.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating decision tree:', error);
      return null;
    }
    return data as RoadmapDecisionTree;
  }

  const { data, error } = await supabase
    .from('roadmap_decision_trees')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Error inserting decision tree:', error);
    return null;
  }
  return data as RoadmapDecisionTree;
}

export async function deleteDecisionTree(treeId: string): Promise<boolean> {
  const { error } = await supabase
    .from('roadmap_decision_trees')
    .update({ is_active: false })
    .eq('id', treeId);

  if (error) {
    console.error('Error deleting decision tree:', error);
    return false;
  }
  return true;
}

function resolveEnabledState(
  catalogDefault: boolean,
  junctionEnabled: boolean | undefined
): boolean {
  if (junctionEnabled !== undefined) {
    return junctionEnabled;
  }
  return catalogDefault;
}

function legacyFallbackResources(roadmap: Roadmap): BatchEnabledResources {
  const slideDecks: EnabledSlideDeck[] = hasSlidesUrl(roadmap.slides_url)
    ? [{
        id: 'legacy-slides',
        roadmap_id: roadmap.id,
        title: 'Slides',
        slides_url: roadmap.slides_url!.trim(),
        sort_order: 0,
        is_default_enabled: true,
        is_active: true,
        is_enabled: true,
      }]
    : [];

  const decisionTrees: EnabledDecisionTree[] = roadmap.decision_tree_enabled
    ? [{
        id: 'legacy-tree',
        roadmap_id: roadmap.id,
        title: 'Decision tree',
        tree_key: 'agentic',
        sort_order: 0,
        is_default_enabled: true,
        is_active: true,
        is_enabled: true,
      }]
    : [];

  return { slideDecks, decisionTrees, usesLegacyFallback: true };
}

export async function getBatchEnabledResources(
  batchId: string | null | undefined,
  roadmap: Roadmap
): Promise<BatchEnabledResources> {
  const [catalogSlides, catalogTrees] = await Promise.all([
    getRoadmapSlideDecks(roadmap.id),
    getRoadmapDecisionTrees(roadmap.id),
  ]);

  if (catalogSlides.length === 0 && catalogTrees.length === 0) {
    return legacyFallbackResources(roadmap);
  }

  if (!batchId) {
    return {
      slideDecks: catalogSlides
        .filter((deck) => deck.is_default_enabled)
        .map((deck) => ({ ...deck, is_enabled: true })),
      decisionTrees: catalogTrees
        .filter((tree) => tree.is_default_enabled)
        .map((tree) => ({ ...tree, is_enabled: true })),
      usesLegacyFallback: false,
    };
  }

  const [{ data: batchSlides }, { data: batchTrees }] = await Promise.all([
    supabase.from('batch_slide_decks').select('slide_deck_id, is_enabled').eq('batch_id', batchId),
    supabase.from('batch_decision_trees').select('decision_tree_id, is_enabled').eq('batch_id', batchId),
  ]);

  const slideToggle = new Map(
    (batchSlides ?? []).map((row: { slide_deck_id: string; is_enabled: boolean }) => [
      row.slide_deck_id,
      row.is_enabled,
    ])
  );
  const treeToggle = new Map(
    (batchTrees ?? []).map((row: { decision_tree_id: string; is_enabled: boolean }) => [
      row.decision_tree_id,
      row.is_enabled,
    ])
  );

  const slideDecks = catalogSlides
    .map((deck) => ({
      ...deck,
      is_enabled: resolveEnabledState(deck.is_default_enabled, slideToggle.get(deck.id)),
    }))
    .filter((deck) => deck.is_enabled);

  const decisionTrees = catalogTrees
    .map((tree) => ({
      ...tree,
      is_enabled: resolveEnabledState(tree.is_default_enabled, treeToggle.get(tree.id)),
    }))
    .filter((tree) => tree.is_enabled);

  return { slideDecks, decisionTrees, usesLegacyFallback: false };
}

export async function getBatchResourceSelection(
  batchId: string,
  roadmapId: string
): Promise<BatchResourceSelection> {
  const [catalogSlides, catalogTrees, batchSlides, batchTrees] = await Promise.all([
    getRoadmapSlideDecks(roadmapId),
    getRoadmapDecisionTrees(roadmapId),
    supabase.from('batch_slide_decks').select('slide_deck_id, is_enabled').eq('batch_id', batchId),
    supabase.from('batch_decision_trees').select('decision_tree_id, is_enabled').eq('batch_id', batchId),
  ]);

  const slideToggle = new Map(
    (batchSlides.data ?? []).map((row: { slide_deck_id: string; is_enabled: boolean }) => [
      row.slide_deck_id,
      row.is_enabled,
    ])
  );
  const treeToggle = new Map(
    (batchTrees.data ?? []).map((row: { decision_tree_id: string; is_enabled: boolean }) => [
      row.decision_tree_id,
      row.is_enabled,
    ])
  );

  return {
    slideDecks: catalogSlides.map((deck) => ({
      id: deck.id,
      is_enabled: resolveEnabledState(deck.is_default_enabled, slideToggle.get(deck.id)),
    })),
    decisionTrees: catalogTrees.map((tree) => ({
      id: tree.id,
      is_enabled: resolveEnabledState(tree.is_default_enabled, treeToggle.get(tree.id)),
    })),
  };
}

export async function saveBatchResourceSelection(
  batchId: string,
  selection: BatchResourceSelection
): Promise<boolean> {
  const slideRows = selection.slideDecks.map((item) => ({
    batch_id: batchId,
    slide_deck_id: item.id,
    is_enabled: item.is_enabled,
  }));
  const treeRows = selection.decisionTrees.map((item) => ({
    batch_id: batchId,
    decision_tree_id: item.id,
    is_enabled: item.is_enabled,
  }));

  if (slideRows.length > 0) {
    const { error } = await supabase
      .from('batch_slide_decks')
      .upsert(slideRows, { onConflict: 'batch_id,slide_deck_id' });
    if (error) {
      console.error('Error saving batch slide decks:', error);
      return false;
    }
  }

  if (treeRows.length > 0) {
    const { error } = await supabase
      .from('batch_decision_trees')
      .upsert(treeRows, { onConflict: 'batch_id,decision_tree_id' });
    if (error) {
      console.error('Error saving batch decision trees:', error);
      return false;
    }
  }

  return true;
}

export async function seedBatchResourcesFromCatalog(batchId: string, roadmapId: string): Promise<void> {
  const [catalogSlides, catalogTrees] = await Promise.all([
    getRoadmapSlideDecks(roadmapId),
    getRoadmapDecisionTrees(roadmapId),
  ]);

  const selection: BatchResourceSelection = {
    slideDecks: catalogSlides.map((deck) => ({
      id: deck.id,
      is_enabled: deck.is_default_enabled,
    })),
    decisionTrees: catalogTrees.map((tree) => ({
      id: tree.id,
      is_enabled: tree.is_default_enabled,
    })),
  };

  if (selection.slideDecks.length > 0 || selection.decisionTrees.length > 0) {
    await saveBatchResourceSelection(batchId, selection);
  }
}
