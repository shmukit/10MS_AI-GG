import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DatabaseService } from '../../../services/database';
import { Lock } from 'lucide-react';

interface TasksSectionProps {
    isDarkMode: boolean;
    currentWeekTasks: any[];
    upcomingTasks: any[];
    currentRoadmap: any;
    enrolledRoadmaps: any[];
    currentLevel?: number;
}

export const TasksSection: React.FC<TasksSectionProps> = ({
    isDarkMode,
    currentWeekTasks,
    upcomingTasks,
    currentRoadmap,
    enrolledRoadmaps,
    currentLevel = 1
}) => {
    const navigate = useNavigate();

    const handleTaskClick = (weekNumber: number) => {
        if (weekNumber > currentLevel) {
            // Locked
            return;
        }

        if (currentRoadmap) {
            const roadmapSlug = DatabaseService.generateRoadmapSlug(currentRoadmap?.title || '');
            navigate(`/student/roadmap/${roadmapSlug}?week=${weekNumber || 1}`);
        } else if (enrolledRoadmaps?.length > 0) {
            // Fallback: use first available roadmap
            const firstRoadmap = enrolledRoadmaps[0];
            const roadmapSlug = DatabaseService.generateRoadmapSlug(firstRoadmap.title || '');
            navigate(`/student/roadmap/${roadmapSlug}?week=${weekNumber || 1}`);
        } else {
            // No roadmaps available, stay on dashboard
            console.warn('No roadmaps available for navigation');
            alert('No roadmaps available. Please contact your administrator.');
        }
    };

    return (
        <div className="space-y-6">
            {/* This Week's Tasks */}
            <div className="rounded-xl p-4 md:p-6 transition-all duration-200 bg-[var(--accent-soft)] shadow-sm hover:shadow-md">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <h3 className={`text-base md:text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Current Level Tasks (Week {currentLevel})
                    </h3>
                    <span className={`text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full border ${isDarkMode ? 'bg-[var(--primary-accent)]/20 text-white border-[var(--primary-accent)]/30' : 'bg-[var(--primary-accent)]/10 text-gray-900 border-[var(--primary-accent)]/20'}`}>
                        Active
                    </span>
                </div>

                {currentWeekTasks && currentWeekTasks.length > 0 ? (
                    <div className="space-y-4">
                        {currentWeekTasks.map((task: any) => (
                            <div
                                key={task.id}
                                onClick={() => handleTaskClick(task.week_number)}
                                className={`rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-lg transform hover:scale-[1.02] ${isDarkMode ? 'bg-gray-700/50 border border-gray-600 hover:bg-gray-700/70 hover:border-gray-500' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                                    }`}>
                                <div className="flex justify-between items-start mb-2 md:mb-3">
                                    <h4 className={`text-sm md:text-base font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {task.task_name}
                                    </h4>
                                    <span className={`text-[10px] md:text-sm px-2 md:px-3 py-0.5 md:py-1 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-orange-900/30 text-orange-300 border border-orange-700' : 'bg-orange-100 text-orange-700 border border-orange-200'
                                        }`}>
                                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Due'}
                                    </span>
                                </div>
                                {task.task_details && (
                                    <p className={`text-sm mb-4 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {task.task_details}
                                    </p>
                                )}
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs px-3 py-2 rounded-full font-medium transition-colors duration-200 ${isDarkMode ? 'bg-[var(--primary-accent)]/30 text-white border border-[var(--primary-accent)]/30' : 'bg-[var(--primary-accent)]/10 text-gray-900 border border-[var(--primary-accent)]/20'}`}>
                                        {task.task_type}
                                    </span>
                                    {task.estimated_hours && (
                                        <span className={`text-xs px-3 py-2 rounded-full font-medium transition-colors duration-200 ${isDarkMode ? 'bg-purple-900/30 text-purple-300 border border-purple-700' : 'bg-purple-100 text-purple-700 border border-purple-200'
                                            }`}>
                                            ⏱️ {task.estimated_hours}h
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className={`text-gray-400 mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            📝
                        </div>
                        <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No tasks assigned for this week
                        </p>
                    </div>
                )}
            </div>

            {/* Upcoming Tasks */}
            <div className="rounded-xl p-4 md:p-6 transition-all duration-200 bg-[var(--accent-soft)] shadow-sm hover:shadow-md">
                <div className="flex justify-between items-center mb-3 md:mb-4">
                    <h3 className={`text-base md:text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Upcoming</h3>
                    <span className={`text-xs md:text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Next Steps</span>
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
                                        ? `opacity-75 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-200'}`
                                        : `hover:shadow-lg transform hover:scale-[1.02] ${isDarkMode ? 'bg-green-900/20 border-green-800 hover:bg-green-900/30 hover:border-green-700' : 'bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300'}`
                                        }`}>

                                    {isLocked && (
                                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-[1px] rounded-lg group">
                                            <div className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                                                <Lock className="w-3 h-3" />
                                                <span>Complete Week {task.week_number - 1} first</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            {isLocked ? <Lock className="w-4 h-4 text-gray-400" /> : <span className="text-sm">📝</span>}
                                            <h4 className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} ${isLocked ? 'blur-[1px]' : ''}`}>
                                                {task.task_name}
                                            </h4>
                                        </div>
                                        <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Week {task.week_number || 'N/A'}
                                        </span>
                                    </div>

                                    {/* Task details (hidden if locked for clear delineation) */}
                                    {!isLocked && task.task_details && (
                                        <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {task.task_details}
                                        </p>
                                    )}

                                    <div className={`flex items-center gap-2 mt-2 ${isLocked ? 'opacity-50' : ''}`}>
                                        <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-[var(--primary-accent)]/30 text-white' : 'bg-[var(--primary-accent)]/10 text-gray-900'
                                            }`}>
                                            {task.task_type}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className={`text-gray-400 mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            📅
                        </div>
                        <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No upcoming tasks scheduled
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
