
import React from 'react';
import { Video, Calendar, Clock, Users, Trash2 } from 'lucide-react';
import { LiveSession, deleteSession } from '../../services/liveSessionService';

interface LiveSessionCardProps {
    session: LiveSession;
    isMentor?: boolean; // If true, show mentor controls (edit/delete)
    onDelete?: () => void;
    currentLevel?: number;
    isDarkMode?: boolean;
}

export const LiveSessionCard: React.FC<LiveSessionCardProps> = ({ session, isMentor, onDelete, currentLevel, isDarkMode }) => {

    const getRecommendationStatus = () => {
        if (!currentLevel || !session.target_audience) return null;

        try {
            const audience = typeof session.target_audience === 'string'
                ? JSON.parse(session.target_audience)
                : session.target_audience;

            // Check if object has min_level / max_level
            if (audience.min_level) {
                if (currentLevel >= audience.min_level && (!audience.max_level || currentLevel <= audience.max_level)) {
                    return 'recommended';
                }
                if (currentLevel < audience.min_level) {
                    return 'advanced';
                }
            }
            // Fallback for simple array "modules": [1, 2]
            if (audience.modules && Array.isArray(audience.modules)) {
                if (audience.modules.includes(currentLevel)) return 'recommended';
                if (Math.min(...audience.modules) > currentLevel) return 'advanced';
            }
        } catch (e) {
            return null;
        }
        return null;
    };

    const recommendation = getRecommendationStatus();


    const startTime = new Date(session.start_time);
    const now = new Date();
    const isLive = now >= startTime && now <= new Date(startTime.getTime() + session.duration_minutes * 60000);
    const isPast = now > new Date(startTime.getTime() + session.duration_minutes * 60000);

    const handleDelete = async () => {
        if (confirm('Are you sure you want to cancel this session?')) {
            try {
                await deleteSession(session.id);
                if (onDelete) onDelete();
            } catch (error) {
                console.error('Failed to delete session', error);
                alert('Failed to delete session');
            }
        }
    };

    return (
        <div className={`border rounded-xl p-4 flex flex-col gap-3 transition-all ${isLive
            ? (isDarkMode
                ? 'bg-[var(--accent-soft)] border-[var(--primary-accent)] shadow-lg ring-1 ring-[var(--primary-accent)]/50'
                : 'bg-[var(--accent-soft)] border-[var(--primary-accent)] shadow-md ring-1 ring-[var(--primary-accent)]/30')
            : (isDarkMode
                ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/70 hover:border-gray-500'
                : 'bg-white border-gray-100 hover:shadow-sm')
            }`}>
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        {session.session_type === 'clinic' && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isDarkMode ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-50 text-indigo-600'
                                }`}>Clinic</span>
                        )}
                        {session.session_type === 'anchor' && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isDarkMode ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-50 text-purple-600'
                                }`}>Anchor</span>
                        )}
                        {session.session_type === 'workshop' && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isDarkMode ? 'bg-orange-900/40 text-orange-300' : 'bg-orange-50 text-orange-600'
                                }`}>Workshop</span>
                        )}

                        {isLive && (
                            <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse ${isDarkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-50 text-red-600'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-red-400' : 'bg-red-600'}`}></span> LIVE
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{session.title}</h4>
                        {recommendation === 'recommended' && (
                            <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${isDarkMode
                                ? 'text-emerald-300 bg-emerald-900/30 border-emerald-800/50'
                                : 'text-emerald-600 bg-emerald-50 border-emerald-100'
                                }`}>
                                Recommended
                            </span>
                        )}
                        {recommendation === 'advanced' && (
                            <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full flex items-center gap-1 ${isDarkMode
                                ? 'text-amber-300 bg-amber-900/30 border-amber-800/50'
                                : 'text-amber-600 bg-amber-50 border-amber-100'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-amber-400' : 'bg-amber-500'}`}></span>
                                Advanced
                            </span>
                        )}
                    </div>
                </div>
                {isMentor && (
                    <button
                        onClick={handleDelete}
                        className={`transition-colors rounded p-1 ${isDarkMode ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/20' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                            }`}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Details */}
            <div className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span>{startTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span>
                        {startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        {' - '}
                        {new Date(startTime.getTime() + session.duration_minutes * 60000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                </div>
                {session.target_audience && (Array.isArray(session.target_audience) ? session.target_audience : []).length > 0 && !(Array.isArray(session.target_audience) && session.target_audience.includes('all')) && (
                    <div className="flex items-center gap-2">
                        <Users className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className="truncate max-w-[200px]">For: {(session.target_audience as string[]).join(', ')}</span>
                    </div>
                )}
            </div>

            {/* Footer / Join Button */}
            <div className="mt-auto pt-2">
                {!isPast ? (
                    <a
                        href={session.meeting_link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 w-full py-2 rounded-lg font-medium transition-all ${isLive
                            ? 'bg-[var(--primary-accent)] text-white hover:bg-[var(--accent-hover)] shadow-md'
                            : (isDarkMode
                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                            }`}
                    >
                        <Video className="w-4 h-4" />
                        {isLive ? 'Join Now' : 'Join Link'}
                    </a>
                ) : (
                    <button
                        disabled
                        className={`w-full py-2 rounded-lg text-sm cursor-not-allowed ${isDarkMode ? 'bg-gray-800 text-gray-600' : 'bg-gray-50 text-gray-400'
                            }`}
                    >
                        Ended
                    </button>
                )}
            </div>
        </div>
    );
};
