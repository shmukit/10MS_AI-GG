import React from 'react';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import { RoadmapItem } from '../../../../types/mentor';
import { formatTaskTypeLabel, getTaskTypeColor } from '../../../../utils/mentorUtils';
import { ClampedText } from '../../../ui/ClampedText';

interface TasksTableProps {
    currentRoadmapTitle: string;
    filteredTasks: RoadmapItem[];
    setEditingTask: (id: string | null) => void;
    setEditingTaskData: (data: RoadmapItem | null) => void;
    handleDeleteTask: (id: string) => void;
}

export const TasksTable: React.FC<TasksTableProps> = ({
    currentRoadmapTitle,
    filteredTasks,
    setEditingTask,
    setEditingTaskData,
    handleDeleteTask
}) => {
    return (
        <div className="rounded-xl p-6 shadow-sm border border-border bg-card transition-colors duration-200">
            <h3 className="text-lg font-bold mb-6 text-foreground transition-colors duration-200">
                {currentRoadmapTitle} - Tasks
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted transition-colors duration-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors duration-200">Session</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors duration-200">Domain</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors duration-200">Type</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors duration-200 min-w-[10rem]">Task Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors duration-200 min-w-[14rem] max-w-md">Details</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors duration-200">Links</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors duration-200">Deadline</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors duration-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map((task) => (
                            <tr key={task.id} className="border-t border-border transition-colors duration-200">
                                <td className="px-4 py-3 text-sm text-foreground transition-colors duration-200">
                                    Session {task.weekNumber}
                                </td>
                                <td className="px-4 py-3 text-sm text-foreground transition-colors duration-200">
                                    {task.domain}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskTypeColor(task.taskType)}`}>
                                        {formatTaskTypeLabel(task.taskType)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-foreground transition-colors duration-200 max-w-[16rem]">
                                    <span className="line-clamp-2" title={task.taskName}>{task.taskName}</span>
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground transition-colors duration-200 max-w-md align-top">
                                    {task.taskDetails ? (
                                        <ClampedText text={task.taskDetails} lines={3} />
                                    ) : (
                                        <span className="text-muted-foreground/60">—</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {task.relevantLinks && (
                                        <a
                                            href={task.relevantLinks}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:text-primary/80"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm text-foreground transition-colors duration-200">
                                    {task.deadline}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingTask(task.id);
                                                setEditingTaskData(task);
                                            }}
                                            className="p-1 rounded transition-colors hover:bg-accent text-muted-foreground"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="p-1 rounded hover:bg-destructive/10 text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
