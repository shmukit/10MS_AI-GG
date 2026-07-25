import React from 'react';
import { X } from 'lucide-react';
import { nodeFilterLabel } from '../../../../utils/roadmapNodeUtils';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    isFilesMode?: boolean;
    taskData: any;
    setTaskData: (data: any) => void;
    onSubmit: () => void;
    weekOptions: number[];
    title: string;
    submitLabel: string;
    nodeUnitLabel?: string;
}

const inputClass = 'w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 transition-colors duration-200 bg-muted text-foreground';

export const TaskModal: React.FC<TaskModalProps> = ({
    isOpen,
    onClose,
    taskData,
    setTaskData,
    onSubmit,
    weekOptions,
    title,
    submitLabel,
    nodeUnitLabel = 'Week',
}) => {
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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                {nodeUnitLabel} Number
                            </label>
                            <select
                                value={taskData.weekNumber}
                                onChange={(e) => setTaskData({ ...taskData, weekNumber: parseInt(e.target.value) })}
                                className={inputClass}
                                required
                            >
                                <option value="">Select {nodeUnitLabel}</option>
                                {weekOptions.map(week => (
                                    <option key={week} value={week}>{nodeFilterLabel(nodeUnitLabel, week)}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                Task Type
                            </label>
                            <select
                                value={taskData.taskType}
                                onChange={(e) => setTaskData({ ...taskData, taskType: e.target.value as any })}
                                className={inputClass}
                            >
                                <option value="Watch">Watch (optional materials)</option>
                                <option value="Read">Read</option>
                                <option value="Project">Hands-on</option>
                                <option value="Attend">Attend / discuss</option>
                                <option value="MCQ">MCQ</option>
                                <option value="Written">Written</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Domain
                        </label>
                        <input
                            type="text"
                            value={taskData.domain || ''}
                            onChange={(e) => setTaskData({ ...taskData, domain: e.target.value })}
                            className={inputClass}
                            placeholder="e.g., Python Basics, Web Development"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Task Name
                        </label>
                        <input
                            type="text"
                            value={taskData.taskName}
                            onChange={(e) => setTaskData({ ...taskData, taskName: e.target.value })}
                            className={inputClass}
                            placeholder="Enter task name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Task Details
                        </label>
                        <textarea
                            value={taskData.taskDetails || ''}
                            onChange={(e) => setTaskData({ ...taskData, taskDetails: e.target.value })}
                            rows={3}
                            className={inputClass}
                            placeholder="Enter task details"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                Relevant Links
                            </label>
                            <input
                                type="url"
                                value={taskData.relevantLinks || ''}
                                onChange={(e) => setTaskData({ ...taskData, relevantLinks: e.target.value })}
                                className={inputClass}
                                placeholder="https://example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                Deadline
                            </label>
                            <input
                                type="date"
                                value={taskData.deadline || ''}
                                onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {taskData.taskType === 'Attend' && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                                Meeting Time
                            </label>
                            <input
                                type="time"
                                value={taskData.meetingTime || ''}
                                onChange={(e) => setTaskData({ ...taskData, meetingTime: e.target.value })}
                                className={inputClass}
                            />
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onSubmit}
                            className="flex-1 py-2 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors"
                        >
                            {submitLabel}
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
        </div>
    );
};
