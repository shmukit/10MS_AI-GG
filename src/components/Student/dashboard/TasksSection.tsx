import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DatabaseService } from '../../../services/database';
import { Lock } from 'lucide-react';
import { useToast } from '../../ui/ToastProvider';
import { ClampedText } from '../../ui/ClampedText';

interface TasksSectionProps {
    isDarkMode: boolean;
    currentWeekTasks: any[];
    upcomingTasks: any[];
    currentRoadmap: any;
    enrolledRoadmaps: any[];
    currentLevel?: number;
}

export const TasksSection: React.FC<TasksSectionProps> = ({
    currentWeekTasks,
    upcomingTasks,
    currentRoadmap,
    enrolledRoadmaps,
    currentLevel = 1
}) => {
    const navigate = useNavigate();
    const { info } = useToast();

    const handleTaskClick = (weekNumber: number) => {
        if (weekNumber > currentLevel) {
            return;
        }

        if (currentRoadmap) {
            const roadmapSlug = DatabaseService.generateRoadmapSlug(currentRoadmap?.title || '');
            navigate(`/student/roadmap/${roadmapSlug}?week=${weekNumber || 1}`);
        } else if (enrolledRoadmaps?.length > 0) {
            const firstRoadmap = enrolledRoadmaps[0];
            const roadmapSlug = DatabaseService.generateRoadmapSlug(firstRoadmap.title || '');
            navigate(`/student/roadmap/${roadmapSlug}?week=${weekNumber || 1}`);
        } else {
            console.warn('No roadmaps available for navigation');
            info('No roadmaps available. Please contact your administrator.');
        }
    };

    return (
        <div className="space-y-6">
            {/* This Week's Tasks */}
            <div className="rounded-xl border border-border bg-card p-4 md:p-6 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <h3 className="text-base md:text-lg font-bold transition-colors duration-200 text-foreground">
                        This week&apos;s tasks
                    </h3>
                    <span className="text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full border bg-primary/10 text-primary border-primary/20">
                        Week {currentLevel}
                    </span>
                </div>

                {currentWeekTasks && currentWeekTasks.length > 0 ? (
                    <div className="space-y-4">
                        {currentWeekTasks.map((task: any) => (
                            <div
                                key={task.id}
                                onClick={() => handleTaskClick(task.week_number)}
                                className="rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-lg transform hover:scale-[1.02] bg-muted/50 border border-border hover:bg-accent hover:border-border">
                                <div className="flex justify-between items-start gap-2 mb-2 md:mb-3">
                                    <h4 className="text-sm md:text-base font-semibold transition-colors duration-200 text-foreground min-w-0 line-clamp-2">
                                        {task.task_name}
                                    </h4>
                                    <span className="text-[10px] md:text-sm px-2 md:px-3 py-0.5 md:py-1 rounded-full transition-colors duration-200 bg-muted text-muted-foreground border border-border shrink-0">
                                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Due'}
                                    </span>
                                </div>
                                {task.task_details && (
                                    <ClampedText text={task.task_details} lines={3} className="mb-4" />
                                )}
                                <div className="flex items-center gap-3">
                                    <span className="text-xs px-3 py-2 rounded-full font-medium transition-colors duration-200 bg-primary/10 text-primary border border-primary/20">
                                        {task.task_type}
                                    </span>
                                    {task.estimated_hours && (
                                        <span className="text-xs px-3 py-2 rounded-full font-medium transition-colors duration-200 bg-muted text-muted-foreground border border-border">
                                            ⏱️ {task.estimated_hours}h
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-muted-foreground mb-2">
                            📝
                        </div>
                        <p className="text-sm transition-colors duration-200 text-muted-foreground">
                            No tasks assigned for this week
                        </p>
                    </div>
                )}
            </div>

            {/* Upcoming Tasks */}
            <div className="rounded-xl border border-border bg-card p-4 md:p-6 transition-all duration-200 hover:shadow-md">
                <div className="flex justify-between items-center mb-3 md:mb-4">
                    <h3 className="text-base md:text-lg font-bold transition-colors duration-200 text-foreground">Upcoming</h3>
                    <span className="text-xs md:text-sm transition-colors duration-200 text-muted-foreground">Next Steps</span>
                </div>

                {upcomingTasks && upcomingTasks.length > 0 ? (
                    <div className="space-y-3">
                        {upcomingTasks.slice(0, 3).map((task: any) => {
                            const isLocked = (task.week_number || 2) > currentLevel;

                            return (
                                <div
                                    key={task.id}
                                    onClick={() => handleTaskClick(task.week_number || 2)}
                                    className={`relative rounded-lg p-4 border transition-all duration-200 cursor-pointer ${isLocked
                                        ? 'opacity-75 bg-muted/50 border-border'
                                        : 'hover:shadow-lg transform hover:scale-[1.02] bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30'
                                        }`}>

                                    {isLocked && (
                                        <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Lock className="w-3 h-3 shrink-0" />
                                            <span>Complete Week {task.week_number - 1} first</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            {isLocked ? <Lock className="w-4 h-4 text-muted-foreground" /> : <span className="text-sm">📝</span>}
                                            <h4 className={`font-medium transition-colors duration-200 text-foreground ${isLocked ? 'opacity-50' : ''}`}>
                                                {task.task_name}
                                            </h4>
                                        </div>
                                        <span className="text-sm transition-colors duration-200 text-muted-foreground">
                                            Week {task.week_number || 'N/A'}
                                        </span>
                                    </div>

                                    {!isLocked && task.task_details && (
                                        <ClampedText text={task.task_details} lines={2} className="mt-1" />
                                    )}

                                    <div className={`flex items-center gap-2 mt-2 ${isLocked ? 'opacity-50' : ''}`}>
                                        <span className="text-xs px-2 py-1 rounded-full transition-colors duration-200 bg-primary/10 text-primary">
                                            {task.task_type}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-muted-foreground mb-2">
                            📅
                        </div>
                        <p className="text-sm transition-colors duration-200 text-muted-foreground">
                            No upcoming tasks scheduled
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
