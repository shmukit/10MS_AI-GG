import React from 'react';
import type { EnabledSlideDeck } from '../../services/database';

interface RoadmapSlidePickerModalProps {
  slideDecks: EnabledSlideDeck[];
  onSelect: (deck: EnabledSlideDeck) => void;
  onClose: () => void;
}

export const RoadmapSlidePickerModal: React.FC<RoadmapSlidePickerModalProps> = ({
  slideDecks,
  onSelect,
  onClose,
}) => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full shadow-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4">Choose a slide deck</h3>
      <div className="space-y-2">
        {slideDecks.map((deck) => (
          <button
            key={deck.id}
            onClick={() => onSelect(deck)}
            className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-accent text-sm"
          >
            {deck.title}
          </button>
        ))}
      </div>
      <button
        onClick={onClose}
        className="mt-4 w-full py-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent"
      >
        Cancel
      </button>
    </div>
  </div>
);
