import React, { useEffect, useRef, useState } from 'react';
import { DatabaseService } from '../../../../services/database';
import type { BatchResourceSelection } from '../../../../types/models';

interface BatchResourceTogglesProps {
  roadmapId: string;
  batchId?: string;
  selection: BatchResourceSelection;
  onChange: (selection: BatchResourceSelection) => void;
}

export const BatchResourceToggles: React.FC<BatchResourceTogglesProps> = ({
  roadmapId,
  batchId,
  selection,
  onChange,
}) => {
  const [loading, setLoading] = useState(false);
  const initializedRef = useRef(false);
  const [catalogLabels, setCatalogLabels] = useState<{
    slides: Record<string, string>;
    trees: Record<string, string>;
  }>({ slides: {}, trees: {} });

  useEffect(() => {
    initializedRef.current = false;
  }, [roadmapId, batchId]);

  useEffect(() => {
    const load = async () => {
      if (!roadmapId || initializedRef.current) return;
      setLoading(true);
      try {
        const [decks, trees] = await Promise.all([
          DatabaseService.getRoadmapSlideDecks(roadmapId),
          DatabaseService.getRoadmapDecisionTrees(roadmapId),
        ]);

        setCatalogLabels({
          slides: Object.fromEntries(decks.map((deck) => [deck.id, deck.title])),
          trees: Object.fromEntries(trees.map((tree) => [tree.id, tree.title])),
        });

        if (batchId) {
          const existing = await DatabaseService.getBatchResourceSelection(batchId, roadmapId);
          onChange(existing);
        } else {
          onChange({
            slideDecks: decks.map((deck) => ({ id: deck.id, is_enabled: deck.is_default_enabled })),
            decisionTrees: trees.map((tree) => ({ id: tree.id, is_enabled: tree.is_default_enabled })),
          });
        }

        initializedRef.current = true;
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [roadmapId, batchId, onChange]);

  if (!roadmapId) return null;

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading cohort resources…</p>;
  }

  const hasResources = selection.slideDecks.length > 0 || selection.decisionTrees.length > 0;
  if (!hasResources) {
    return (
      <p className="text-sm text-muted-foreground">
        No slide decks or decision trees on this roadmap. Add them in the Roadmaps tab resource library.
      </p>
    );
  }

  return (
    <div className="space-y-4 border border-border rounded-lg p-4 bg-muted/30">
      <div>
        <h4 className="font-medium text-foreground">Workshop resources for this cohort</h4>
        <p className="text-xs text-muted-foreground mt-1">
          Choose which slide decks and decision trees this batch can access.
        </p>
      </div>

      {selection.slideDecks.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Slide decks</p>
          {selection.slideDecks.map((item) => (
            <label key={item.id} className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={item.is_enabled}
                onChange={(e) =>
                  onChange({
                    ...selection,
                    slideDecks: selection.slideDecks.map((deck) =>
                      deck.id === item.id ? { ...deck, is_enabled: e.target.checked } : deck
                    ),
                  })
                }
              />
              {catalogLabels.slides[item.id] ?? 'Slide deck'}
            </label>
          ))}
        </div>
      )}

      {selection.decisionTrees.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Decision trees</p>
          {selection.decisionTrees.map((item) => (
            <label key={item.id} className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={item.is_enabled}
                onChange={(e) =>
                  onChange({
                    ...selection,
                    decisionTrees: selection.decisionTrees.map((tree) =>
                      tree.id === item.id ? { ...tree, is_enabled: e.target.checked } : tree
                    ),
                  })
                }
              />
              {catalogLabels.trees[item.id] ?? 'Decision tree'}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
