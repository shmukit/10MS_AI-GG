
import React from 'react';
import { Video, Calendar, Clock, Users, Trash2 } from 'lucide-react';
import { LiveSession, deleteSession } from '../../services/liveSessionService';

interface LiveSessionCardProps {
    session: LiveSession;
    isMentor?: boolean;
    onDelete?: () => void;
    currentLevel?: number;
}

export const LiveSessionCard: React.FC<LiveSessionCardProps> = ({ session, isMentor, onDelete, currentLevel }) => {

    const getRecommendationStatus = () => {
        if (!currentLevel || !session.target_audience) return null;

        try {
            const audience = typeof session.target_audience === 'string'
                ? JSON.parse(session.target_audience)
                : session.target_audience;

            if (audience.min_level) {
                if (currentLevel >= audience.min_level && (!audience.max_level || currentLevel <= audience.max_level)) {
                    return 'recommended';
                }
                if (currentLevel < audience.min_level) {
                    return 'advanced';
                }
            }
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
            ? 'bg-card border-primary ring-1 ring-primary/30 shadow-md'
            : 'bg-card border-border hover:bg-accent'
            }`}>
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        {session.session_type === 'clinic' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-muted text-muted-foreground">Clinic</span>
                        )}
                        {session.session_type === 'anchor' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-muted text-muted-foreground">Anchor</span>
                        )}
                        {session.session_type === 'workshop' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-muted text-muted-foreground">Workshop</span>
                        )}

                        {isLive && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse bg-destructive/10 text-destructive">
                                <span className="w-1.5 h-1.5 rounded-full bg-destructive"></span> LIVE
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-bold text-foreground">{session.title}</h4>
                        {recommendation === 'recommended' && (
                            <span className="text-[10px] font-bold border px-2 py-0.5 rounded-full text-primary bg-primary/10 border-primary/20">
                                Recommended
                            </span>
                        )}
                        {recommendation === 'advanced' && (
                            <span className="text-[10px] font-bold border px-2 py-0.5 rounded-full flex items-center gap-1 text-muted-foreground bg-muted border-border">
                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
                                Advanced
                            </span>
                        )}
                    </div>
                </div>
                {isMentor && (
                    <button
                        onClick={handleDelete}
                        className="transition-colors rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{startTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>
                        {startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        {' - '}
                        {new Date(startTime.getTime() + session.duration_minutes * 60000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                </div>
                {session.target_audience && (Array.isArray(session.target_audience) ? session.target_audience : []).length > 0 && !(Array.isArray(session.target_audience) && session.target_audience.includes('all')) && (
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
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
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
                            : 'bg-muted text-foreground hover:bg-accent'
                            }`}
                    >
                        <Video className="w-4 h-4" />
                        {isLive ? 'Join Now' : 'Join Link'}
                    </a>
                ) : (
                    <button
                        disabled
                        className="w-full py-2 rounded-lg text-sm cursor-not-allowed bg-muted text-muted-foreground"
                    >
                        Ended
                    </button>
                )}
            </div>
        </div>
    );
};
