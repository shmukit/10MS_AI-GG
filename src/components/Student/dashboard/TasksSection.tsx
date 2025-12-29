import React from 'react';
import { useNavigate } from 'react-router-dom';
import { generateRoadmapSlug } from '../../../services/database';

interface TasksSectionProps {
    isDarkMode: boolean;
    currentWeekTasks: any[];
    upcomingTasks: any[];
    currentRoadmap: any;
    enrolledRoadmaps: any[];
}

export const TasksSection: React.FC<TasksSectionProps> = ({
    isDarkMode,
    currentWeekTasks,
    upcomingTasks,
    currentRoadmap,
    enrolledRoadmaps
}) => {
    const navigate = useNavigate();

    const handleTaskClick = (weekNumber: number) => {
        if (currentRoadmap) {
            const roadmapSlug = generateRoadmapSlug(currentRoadmap?.title || '');
            navigate(`/student/roadmap/${roadmapSlug}?week=${weekNumber || 1}`);
        } else if (enrolledRoadmaps?.length > 0) {
            // Fallback: use first available roadmap
            const firstRoadmap = enrolledRoadmaps[0];
            const roadmapSlug = generateRoadmapSlug(firstRoadmap.title || '');
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
            <div className={`rounded-xl p-6 shadow-professional border transition-all duration-200 hover:shadow-professional-lg ${isDarkMode
                ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                : 'bg-white border-gray-200 hover:border-gray-300'
                }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>This Week's Tasks</h3>

                {currentWeekTasks && currentWeekTasks.length > 0 ? (
                    <div className="space-y-4">
                        {currentWeekTasks.map((task: any) => (
                            <div
                                key={task.id}
                                onClick={() => handleTaskClick(task.week_number)}
                                className={`rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-lg transform hover:scale-[1.02] ${isDarkMode ? 'bg-gray-700/50 border border-gray-600 hover:bg-gray-700/70 hover:border-gray-500' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                                    }`}>
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className={`font-semibold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {task.task_name}
                                    </h4>
                                    <span className={`text-sm px-3 py-1 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-orange-900/30 text-orange-300 border border-orange-700' : 'bg-orange-100 text-orange-700 border border-orange-200'
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
                                    <span className={`text-xs px-3 py-2 rounded-full font-medium transition-colors duration-200 ${isDarkMode ? 'bg-blue-900/30 text-blue-300 border border-blue-700' : 'bg-blue-100 text-blue-700 border border-blue-200'
                                        }`}>
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
            <div className={`rounded-xl p-6 shadow-professional border transition-all duration-200 hover:shadow-professional-lg ${isDarkMode
                ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                : 'bg-white border-gray-200 hover:border-gray-300'
                }`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Upcoming</h3>
                    <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Next week</span>
                </div>

                {upcomingTasks && upcomingTasks.length > 0 ? (
                    <div className="space-y-3">
                        {upcomingTasks.slice(0, 3).map((task: any) => (
                            <div
                                key={task.id}
                                onClick={() => handleTaskClick(task.week_number || 2)}
                                className={`rounded-lg p-4 border transition-all duration-200 cursor-pointer hover:shadow-lg transform hover:scale-[1.02] ${isDarkMode ? 'bg-green-900/20 border-green-800 hover:bg-green-900/30 hover:border-green-700' : 'bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300'
                                    }`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">📝</span>
                                        <h4 className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {task.task_name}
                                        </h4>
                                    </div>
                                    <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Week {task.week_number || 'N/A'}
                                    </span>
                                </div>
                                {task.task_details && (
                                    <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {task.task_details}
                                    </p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {task.task_type}
                                    </span>
                                    {task.deadline && (
                                        <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            Due: {new Date(task.deadline).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
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
