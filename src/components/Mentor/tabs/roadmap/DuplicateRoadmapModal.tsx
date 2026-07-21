import React, { useState } from 'react';
import { Copy, X } from 'lucide-react';

interface DuplicateRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTitle: string;
  onSubmit: (title: string) => Promise<void>;
}

export const DuplicateRoadmapModal: React.FC<DuplicateRoadmapModalProps> = ({
  isOpen,
  onClose,
  defaultTitle,
  onSubmit,
}) => {
  const [title, setTitle] = useState(defaultTitle);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(title.trim());
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4 p-6 rounded-xl shadow-lg bg-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Copy className="w-5 h-5" />
            Duplicate Roadmap
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Copies sessions, tasks, slide decks, and decision trees. Batch deadlines and student progress are not copied.
        </p>

        <label className="block text-sm font-medium mb-2 text-muted-foreground">New roadmap title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-foreground mb-6"
        />

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting || !title.trim()}
            className="flex-1 py-2 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Duplicating…' : 'Duplicate'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-lg font-medium bg-muted hover:bg-accent text-muted-foreground"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
