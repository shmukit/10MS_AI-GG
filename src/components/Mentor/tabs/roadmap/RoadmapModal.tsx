import React, { useState } from 'react';
import { X } from 'lucide-react';
import { NODE_LABEL_PRESETS } from '../../../../utils/roadmapNodeUtils';

interface RoadmapModalProps {
    isOpen: boolean;
    onClose: () => void;
    roadmapData: any;
    setRoadmapData: (data: any) => void;
    onSubmit: () => void;
    onDelete?: () => void;
    title: string;
    submitLabel: string;
    showDelete?: boolean;
}

const inputClass = 'w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 transition-colors duration-200 bg-muted text-foreground';

export const RoadmapModal: React.FC<RoadmapModalProps> = ({
    isOpen,
    onClose,
    roadmapData,
    setRoadmapData,
    onSubmit,
    onDelete,
    title,
    submitLabel,
    showDelete
}) => {
    const [customLabel, setCustomLabel] = useState(false);
    const nodeLabel = roadmapData.node_unit_label || 'Week';
    const isPreset = NODE_LABEL_PRESETS.includes(nodeLabel as typeof NODE_LABEL_PRESETS[number]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg bg-card transition-colors duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-foreground transition-colors duration-200">
                        {title}
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
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Roadmap Title
                        </label>
                        <input
                            type="text"
                            value={roadmapData.title}
                            onChange={(e) => setRoadmapData({ ...roadmapData, title: e.target.value })}
                            className={inputClass}
                            placeholder="e.g., Become a Manager of AI Agents"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Description
                        </label>
                        <textarea
                            value={roadmapData.description}
                            onChange={(e) => setRoadmapData({ ...roadmapData, description: e.target.value })}
                            rows={3}
                            className={inputClass}
                            placeholder="Enter roadmap description"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Node Label
                        </label>
                        {!customLabel && isPreset ? (
                            <select
                                value={nodeLabel}
                                onChange={(e) => {
                                    if (e.target.value === '__custom__') {
                                        setCustomLabel(true);
                                        return;
                                    }
                                    setRoadmapData({ ...roadmapData, node_unit_label: e.target.value });
                                }}
                                className={inputClass}
                            >
                                {NODE_LABEL_PRESETS.map((preset) => (
                                    <option key={preset} value={preset}>{preset}</option>
                                ))}
                                <option value="__custom__">Custom…</option>
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={nodeLabel}
                                onChange={(e) => setRoadmapData({ ...roadmapData, node_unit_label: e.target.value })}
                                className={inputClass}
                                placeholder="e.g. Session, Week, Month"
                            />
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            Used in student UI (e.g. &quot;Complete previous session to unlock&quot;).
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                {nodeLabel} Count
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="52"
                                value={roadmapData.total_weeks}
                                onChange={(e) => setRoadmapData({ ...roadmapData, total_weeks: parseInt(e.target.value) || 8 })}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                Difficulty Level
                            </label>
                            <select
                                value={roadmapData.difficulty_level}
                                onChange={(e) => setRoadmapData({ ...roadmapData, difficulty_level: e.target.value as any })}
                                className={inputClass}
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Category
                        </label>
                        <input
                            type="text"
                            value={roadmapData.category}
                            onChange={(e) => setRoadmapData({ ...roadmapData, category: e.target.value })}
                            className={inputClass}
                            placeholder="e.g., AI Leadership"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Slides URL (optional)
                        </label>
                        <input
                            type="url"
                            value={roadmapData.slides_url || ''}
                            onChange={(e) => setRoadmapData({ ...roadmapData, slides_url: e.target.value })}
                            className={inputClass}
                            placeholder="PDF or Google Slides publish/embed link"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Paste a public PDF link, Google Slides publish URL, or PPT link. Students see a View Slides button when set.
                        </p>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border border-border p-4 bg-muted/40">
                        <input
                            id="decision-tree-enabled"
                            type="checkbox"
                            checked={roadmapData.decision_tree_enabled === true}
                            onChange={(e) => setRoadmapData({ ...roadmapData, decision_tree_enabled: e.target.checked })}
                            className="mt-1 h-4 w-4 rounded border-border"
                        />
                        <label htmlFor="decision-tree-enabled" className="text-sm text-foreground">
                            <span className="font-medium">Enable AI agent decision tree</span>
                            <p className="text-xs text-muted-foreground mt-1">
                                Adds a Decision Tree tab on the student roadmap for this program only. Leave off for standard curricula.
                            </p>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Prerequisites
                        </label>
                        <input
                            type="text"
                            value={roadmapData.prerequisites}
                            onChange={(e) => setRoadmapData({ ...roadmapData, prerequisites: e.target.value })}
                            className={inputClass}
                            placeholder="e.g., Basic computer knowledge"
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onSubmit}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${showDelete ? 'bg-muted hover:bg-muted/80 border border-border text-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                    >
                        {submitLabel}
                    </button>

                    {showDelete && onDelete && (
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this roadmap?')) {
                                    onDelete();
                                }
                            }}
                            className="flex-1 py-2 px-4 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg font-medium transition-colors"
                        >
                            Delete Roadmap
                        </button>
                    )}

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
