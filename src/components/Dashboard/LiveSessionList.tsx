
import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Loader } from 'lucide-react';
import { LiveSession, getUpcomingSessions } from '../../services/liveSessionService';
import { LiveSessionCard } from './LiveSessionCard';

interface LiveSessionListProps {
    batchId: string;
    isMentor?: boolean;
    refreshTrigger?: number;
    currentLevel?: number;
    /** @deprecated Theme is driven by CSS tokens; prop is ignored */
    isDarkMode?: boolean;
}

export const LiveSessionList: React.FC<LiveSessionListProps> = ({
    batchId,
    isMentor = false,
    refreshTrigger,
    currentLevel,
}) => {
    const [sessions, setSessions] = useState<LiveSession[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        if (!batchId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await getUpcomingSessions(batchId);
            setSessions(data);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [batchId, refreshTrigger]);

    if (loading) {
        return (
            <div className="flex justify-center p-8 text-primary">
                <Loader className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-bold text-foreground">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    Upcoming Sessions
                </h3>
            </div>

            {sessions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 py-8 text-center">
                    <p className="text-sm text-muted-foreground">No upcoming sessions scheduled.</p>
                    {isMentor && (
                        <p className="mt-1 text-xs text-muted-foreground">
                            Click &quot;Schedule Class&quot; to add one.
                        </p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sessions.map(session => (
                        <LiveSessionCard
                            key={session.id}
                            session={session}
                            isMentor={isMentor}
                            onDelete={fetchSessions}
                            currentLevel={currentLevel}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
