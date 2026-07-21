import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Presentation, GitBranch, ChevronDown } from 'lucide-react';
import { DatabaseService } from '../../../../services/database';
import type { RoadmapDecisionTree, RoadmapSlideDeck } from '../../../../types/models';
import { DECISION_TREE_KEYS } from '../../../../data/decisionTreeRegistry';

interface RoadmapResourcesPanelProps {
  roadmapId: string;
}

const inputClass =
  'w-full px-3 py-2 border border-border rounded-lg bg-muted text-foreground text-sm';

export const RoadmapResourcesPanel: React.FC<RoadmapResourcesPanelProps> = ({ roadmapId }) => {
  const [slideDecks, setSlideDecks] = useState<RoadmapSlideDeck[]>([]);
  const [decisionTrees, setDecisionTrees] = useState<RoadmapDecisionTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const loadResources = async () => {
    if (!roadmapId) return;
    setLoading(true);
    const [decks, trees] = await Promise.all([
      DatabaseService.getRoadmapSlideDecks(roadmapId),
      DatabaseService.getRoadmapDecisionTrees(roadmapId),
    ]);
    setSlideDecks(decks);
    setDecisionTrees(trees);
    setLoading(false);
  };

  useEffect(() => {
    loadResources();
  }, [roadmapId]);

  const addSlideDeck = async () => {
    const created = await DatabaseService.upsertSlideDeck({
      roadmap_id: roadmapId,
      title: `Slide deck ${slideDecks.length + 1}`,
      slides_url: 'https://',
      sort_order: slideDecks.length,
      is_default_enabled: true,
    });
    if (created) await loadResources();
  };

  const addDecisionTree = async () => {
    const created = await DatabaseService.upsertDecisionTree({
      roadmap_id: roadmapId,
      title: 'AI agent decision tree',
      tree_key: 'agentic',
      sort_order: decisionTrees.length,
      is_default_enabled: true,
    });
    if (created) await loadResources();
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        Loading resource library…
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div>
          <h3 className="text-lg font-semibold text-foreground">Resource library</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Attach slide decks and decision trees here. Enable per cohort in Batch settings.
          </p>
        </div>
        <span className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}
          />
        </span>
      </button>

      {collapsed ? null : (
        <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <Presentation className="w-4 h-4" />
            Slide decks
          </h4>
          <button
            onClick={addSlideDeck}
            className="text-sm px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add deck
          </button>
        </div>

        {slideDecks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No slide decks yet.</p>
        ) : (
          slideDecks.map((deck) => (
            <div key={deck.id} className="grid gap-2 md:grid-cols-[1fr_2fr_auto_auto] items-center border border-border rounded-lg p-3">
              <input
                className={inputClass}
                value={deck.title}
                onChange={(e) =>
                  setSlideDecks((prev) =>
                    prev.map((item) => (item.id === deck.id ? { ...item, title: e.target.value } : item))
                  )
                }
                placeholder="Deck title"
              />
              <input
                className={inputClass}
                value={deck.slides_url}
                onChange={(e) =>
                  setSlideDecks((prev) =>
                    prev.map((item) => (item.id === deck.id ? { ...item, slides_url: e.target.value } : item))
                  )
                }
                placeholder="Slides URL"
              />
              <label className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={deck.is_default_enabled}
                  onChange={(e) =>
                    setSlideDecks((prev) =>
                      prev.map((item) =>
                        item.id === deck.id ? { ...item, is_default_enabled: e.target.checked } : item
                      )
                    )
                  }
                />
                Default on
              </label>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await DatabaseService.upsertSlideDeck(deck);
                    await loadResources();
                  }}
                  className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-accent"
                >
                  Save
                </button>
                <button
                  onClick={async () => {
                    await DatabaseService.deleteSlideDeck(deck.id);
                    await loadResources();
                  }}
                  className="p-2 rounded-lg text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Decision trees
          </h4>
          <button
            onClick={addDecisionTree}
            className="text-sm px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add tree
          </button>
        </div>

        {decisionTrees.length === 0 ? (
          <p className="text-sm text-muted-foreground">No decision trees yet.</p>
        ) : (
          decisionTrees.map((tree) => (
            <div key={tree.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto_auto] items-center border border-border rounded-lg p-3">
              <input
                className={inputClass}
                value={tree.title}
                onChange={(e) =>
                  setDecisionTrees((prev) =>
                    prev.map((item) => (item.id === tree.id ? { ...item, title: e.target.value } : item))
                  )
                }
                placeholder="Tree title"
              />
              <select
                className={inputClass}
                value={tree.tree_key}
                onChange={(e) =>
                  setDecisionTrees((prev) =>
                    prev.map((item) => (item.id === tree.id ? { ...item, tree_key: e.target.value } : item))
                  )
                }
              >
                {DECISION_TREE_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={tree.is_default_enabled}
                  onChange={(e) =>
                    setDecisionTrees((prev) =>
                      prev.map((item) =>
                        item.id === tree.id ? { ...item, is_default_enabled: e.target.checked } : item
                      )
                    )
                  }
                />
                Default on
              </label>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await DatabaseService.upsertDecisionTree(tree);
                    await loadResources();
                  }}
                  className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-accent"
                >
                  Save
                </button>
                <button
                  onClick={async () => {
                    await DatabaseService.deleteDecisionTree(tree.id);
                    await loadResources();
                  }}
                  className="p-2 rounded-lg text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
        </>
      )}
    </div>
  );
};
