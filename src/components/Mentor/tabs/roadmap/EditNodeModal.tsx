import React from 'react';
import { X } from 'lucide-react';

export interface EditNodeFormData {
  id: string;
  week_number: number;
  title: string;
  description: string;
  domain: string;
}

interface EditNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: EditNodeFormData | null;
  setNodeData: (data: EditNodeFormData) => void;
  onSubmit: () => void;
  nodeUnitLabel: string;
}

const inputClass = 'w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 transition-colors duration-200 bg-muted text-foreground';

export const EditNodeModal: React.FC<EditNodeModalProps> = ({
  isOpen,
  onClose,
  nodeData,
  setNodeData,
  onSubmit,
  nodeUnitLabel,
}) => {
  if (!isOpen || !nodeData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg bg-card transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-foreground">
            Edit {nodeUnitLabel} {nodeData.week_number}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-accent text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Display Title
            </label>
            <input
              type="text"
              value={nodeData.title}
              onChange={(e) => setNodeData({ ...nodeData, title: e.target.value })}
              className={inputClass}
              placeholder={`e.g. ${nodeUnitLabel} 1: Foundations`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Description
            </label>
            <textarea
              value={nodeData.description}
              onChange={(e) => setNodeData({ ...nodeData, description: e.target.value })}
              rows={3}
              className={inputClass}
              placeholder="What participants will accomplish in this node"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Domain / Theme
            </label>
            <input
              type="text"
              value={nodeData.domain}
              onChange={(e) => setNodeData({ ...nodeData, domain: e.target.value })}
              className={inputClass}
              placeholder="e.g. AI Collaboration"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onSubmit}
            className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors bg-muted hover:bg-accent text-muted-foreground"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
